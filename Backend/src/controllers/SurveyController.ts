import { getConnection } from "typeorm";
import fileUpload from "express-fileupload";
import readXlsxFile from "read-excel-file/node";
import { newArrayView, privatize } from "differential-privacy";
import { ParticipantController } from "./ParticipantController";
import { TrusteeController } from "./TrusteeController";
import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { SurveyResponseDto } from "../routers/dto/SurveyResponseDto";
import { UploadSurveyFileDto } from "../routers/dto/UploadSurveyFileDto";
import { FinishedQuestion } from "../entities/FinishedQuestion";
import { Participant } from "../entities/Participant";
import { Survey } from "../entities/Survey";
import { Question } from "../entities/Question";
import { Answer } from "../entities/Answer";
import { UploadSurveyFileResponseDto } from "../routers/dto/UploadSurveyFileResponseDto";
import { CreateReportDto } from "../routers/dto/CreateReportDto";
import { CreateReportResponseDto } from "../routers/dto/CreateReportResponseDto";
import { CloseSurveyDto } from "../routers/dto/CloseSurveyDto";
import { CloseSurveyResponseDto } from "../routers/dto/CloseSurveyResponseDto";
import { TrusteeDto } from "../routers/dto/TrusteeDto";
import { LegalDisclaimerResponseDtoResponseDto } from "../routers/dto/LegalDisclaimerResponseDto";
import { SurveyProgressResponseDto } from "../routers/dto/SurveyProgressResponseDto";
import { SurveyProgressDto } from "../routers/dto/SurveyProgressDto";

function normal(mean: number, stdDev: number): Array<[number, number]> {
  function f(x) {
    return (
      (1 / (Math.sqrt(2 * Math.PI) * stdDev)) *
      Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2)))
    );
  }

  let result = [];
  for (let i = -5; i <= 5; i += 0.2) {
    result.push([i, f(i)]);
  }
  return result;
}

const likelihoodFunction = normal(0, 1);

/**
 * Calculates the probability that someone with a given ability level 'theta' will answer correctly an item.
 * Uses the 3 parameters logistic model (a, b, c).
 *
 * @param a slope
 * @param b difficulty
 * @param c guessing rate
 * @param theta ability
 */
export function itemResponseFunction(
  a: number,
  b: number,
  c: number,
  theta: number
): number {
  //  return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  return c + (1 - c) / (1 + Math.exp(a * (theta - b)));
}

export type Zeta = { a: number; b: number; c: number };

// Estimate ability using the EAP method.
// Reference: "Marginal Maximum Likelihood estimation of item parameters: application of
// an EM algorithm" Bock & Aitkin 1981 --- equation 14.
export function estimateAbilityEAP(answers: Array<0 | 1>, zeta: Array<Zeta>) {
  function likelihood(theta) {
    return zeta.reduce((total, currentValue, currentIndex) => {
      const irf = itemResponseFunction(
        currentValue.a,
        currentValue.b,
        currentValue.c,
        theta
      );
      return answers[currentIndex] === 1 ? total * irf : total * (1 - irf);
    }, 1);
  }

  let num = 0;
  let nf = 0;
  for (let i = 0; i < likelihoodFunction.length; i++) {
    let theta = likelihoodFunction[i][0];
    let probability = likelihoodFunction[i][1];
    let like = likelihood(theta);
    num += theta * like * probability;
    nf += like * probability;
  }
  return num / nf;
}

export class SurveyController {
  async getSurveys(): Promise<SurveyResponseDto> {
    const query = await getConnection().getRepository(Survey).find();

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: !query,
    };
    return {
      error: err,
      surveys: query,
    };
  }

  async getAllSurveys(trusteeDto: TrusteeDto): Promise<SurveyResponseDto> {
    //check User rights
    let loginResult = await SurveyController.checkTrusteeLogin(trusteeDto);

    if (loginResult.hasError) {
      return {
        surveys: [],
        error: loginResult,
      };
    }

    return await this.getSurveys();
  }

  async getLegalDisclaimer(surveyId: number) {
    const query = await getConnection()
      .getRepository(Survey)
      .createQueryBuilder("survey")
      .where("survey.id = :id", { id: surveyId })
      .take(1)
      .getOne();

    const err: ErrorDto = {
      message: "",
      hasError: false,
    };
    const result: LegalDisclaimerResponseDtoResponseDto = {
      error: err,
      legalDisclaimer: query.legalDisclaimer,
    };
    return result;
  }

  async acceptLegalDisclaimer(participantId: string) {
    let participant = await getConnection()
      .getRepository(Participant)
      .createQueryBuilder("participant")
      .where("participant.uuid = :uuid", { uuid: participantId })
      .take(1)
      .getOne();

    participant.legalDisclaimerAccepted = true;

    await getConnection().getRepository(Participant).save(participant);
  }

  //! \todo surveyId is not needed -> remove
  async getCurrentSurvey(surveyId: number, uniqueId: string) {
    const targetParticipant = await getConnection()
      .getRepository(Participant)
      .createQueryBuilder("participant")
      .leftJoinAndSelect("participant.survey", "survey")
      .leftJoinAndSelect("participant.currentQuestion", "currentQuestion")
      .where("participant.uuid = :uuid", { uuid: uniqueId })
      .take(1)
      .getOne();
    //! \todo handle error case

    if (targetParticipant.survey.isClosed) {
      const err: ErrorDto = {
        hasError: true,
        message: "Survey is already closed!",
      };
      return {
        error: err,
        item: undefined,
        finished: targetParticipant.finished,
        ability: 0,
      };
    }

    if (targetParticipant.finished) {
      const err: ErrorDto = {
        message: "",
        hasError: false,
      };
      const result: CurrentQuestionResponseDto = {
        error: err,
        item: undefined,
        finished: targetParticipant.finished,
        ability: targetParticipant.scoring,
        legalDisclaimerAccepted: targetParticipant.legalDisclaimerAccepted,
      };

      return result;
    }

    const question = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.choices", "choices")
      .where("question.id = :id", { id: targetParticipant.currentQuestion.id })
      .getOne();
    //! \todo handle error case

    const err: ErrorDto = {
      message: "",
      hasError: false,
    };
    const result: CurrentQuestionResponseDto = {
      error: err,
      item: question,
      finished: targetParticipant.finished,
      ability: targetParticipant.scoring,
      legalDisclaimerAccepted: targetParticipant.legalDisclaimerAccepted,
    };
    return result;
  }

  async postCurrentSurvey(
    body: AnswerSurveyDto,
    surveyId: number,
    uniqueId: string
  ) {
    const participant = await getConnection()
      .getRepository(Participant)
      .createQueryBuilder("participant")
      .innerJoinAndSelect("participant.survey", "survey")
      .innerJoinAndSelect("participant.currentQuestion", "currentQuestion")
      .where("survey.Id = :surveyId", { surveyId: surveyId })
      .andWhere("participant.uuid = :uuid", { uuid: uniqueId })
      .getOneOrFail();

    const question = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.choices", "choices")
      .where("question.id = :id", { id: body.itemId })
      .getOne();

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    if (participant.survey.isClosed) {
      result = {
        hasError: true,
        message: "Survey is already closed!",
      };
      return result;
    }

    if (body.itemId != participant.currentQuestion.id) {
      return SurveyController.buildErrorResponseItem(
        "The question that was submitted '" +
          question.text +
          "' is not the active one!"
      );
    }

    let finishedQuestionRepository = await getConnection().getRepository(
      FinishedQuestion
    );

    const count = await finishedQuestionRepository.count({
      where: { question: question, participant: participant },
    });

    if (count > 0) {
      return SurveyController.buildErrorResponseItem(
        "The question '" +
          question.text +
          "' was already answered. If that wasn't you, please consider contacting the trustee."
      );
    }

    // if question was not already answered
    let finishedQuestion = new FinishedQuestion();
    //finishedQuestion.id = body.itemId;
    finishedQuestion.question = question;
    finishedQuestion.givenAnswers = body.answers;
    finishedQuestion.participant = participant;

    await finishedQuestionRepository
      .save(finishedQuestion)
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });

    // retrieve all finished questions
    const finishedQuestions = await finishedQuestionRepository
      .createQueryBuilder("finishedquestion")
      .leftJoinAndSelect("finishedquestion.question", "question")
      .leftJoinAndSelect("question.choices", "choices")
      .leftJoinAndSelect("finishedquestion.givenAnswers", "givenAnswers")
      .leftJoinAndSelect("finishedquestion.participant", "participant")
      .where("participant.uuid = :uuid", { uuid: uniqueId })
      .getMany();

    const zeta = finishedQuestions.map((fq) => {
      const currentZeta: Zeta = {
        a: fq.question.slope,
        b: fq.question.difficulty,
        c: 1 / fq.question.choices.length,
      };
      return currentZeta;
    });
    const responseVector = finishedQuestions.map((fq) => {
      // only one anwers is submitted, therefore select the first one
      return fq.givenAnswers[0].correct ? 1 : 0;
    });
    const ability = estimateAbilityEAP(responseVector, zeta);

    // update Participant
    const participantController = new ParticipantController();

    if (!result.hasError) {
      // make sure that an error of finishedQuestionRepository is not be overwritten by result of updateParticipant
      let updateParticipantReturn = await participantController.updateParticipant(
        surveyId,
        uniqueId,
        ability
      );

      if (updateParticipantReturn.hasError) {
        result.hasError = true;
        result.message = updateParticipantReturn.message;
      }
    }

    let returnValue: AnswerSurveyResponseDto = {
      error: result,
    };
    return returnValue;
  }

  private static buildErrorResponseItem(errorMessage: string) {
    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    result.hasError = true;
    result.message = errorMessage;

    let returnValue: AnswerSurveyResponseDto = {
      error: result,
    };
    return returnValue;
  }

  // Excel Upload

  async createSurveyFromFile(
    file: fileUpload.UploadedFile,
    body: UploadSurveyFileDto
  ): Promise<UploadSurveyFileResponseDto> {
    let result: UploadSurveyFileResponseDto = {
      links: [],
      error: {
        hasError: false,
        message: "no Error",
      },
    };

    //check User rights
    let loginResult = await SurveyController.checkTrusteeLogin(body);

    if (loginResult.hasError) {
      result.error = loginResult;
      return result;
    }

    let filePath = process.env.UPLOAD_DIRECTORY + file.name;
    await file.mv(filePath);

    // file extract
    const optionsRows = await readXlsxFile(filePath, { sheet: "Options" });
    const survey = await this.createNewSurveyFromXLSXOptions(optionsRows);

    if ("hasError" in survey) {
      result.error = survey;
      return result;
    }

    const { rows, errors } = await readXlsxFile(filePath, {
      sheet: "Survey",
      schema: this.fileSchema,
    });
    let surveyRows = rows as surveyFormat[];
    if (errors.length > 0) {
      let errorString = this.formatReadExcelFileErrors(errors);
      result.error = {
        hasError: true,
        message: errorString,
      };
      return result;
    }

    if (!SurveyController.hasStartSetElements(surveyRows)) {
      result.error = {
        hasError: true,
        message: "No question was marked as starting question!",
      };
      return result;
    }

    for (const row of surveyRows) {
      let error = await this.extractXLSXQuestion(row, survey);
      if (error.hasError) {
        result.error = {
          hasError: true,
          message: result.error.message + "\n" + error.message,
        };
      }
    }

    if (result.error.hasError) {
      return result;
    }

    let numParticipants = this.extractXLSXOptions<number>(
      "Number participants",
      optionsRows
    );
    let pController = new ParticipantController();

    await pController.addParticipants(survey.id, numParticipants);

    result.links = await pController.createSurveyLinks(survey.id);

    return result;
  }

  private static async checkTrusteeLogin(body: TrusteeDto): Promise<ErrorDto> {
    const trusteeController = new TrusteeController();
    let trusteeLogin = await trusteeController.loginTrustee(body);
    console.log(trusteeLogin);

    let error: ErrorDto;

    if (!trusteeLogin.success) {
      error = {
        message: "Invalid credentials",
        hasError: true,
      };
    } else {
      error = {
        hasError: false,
        message: "no Error",
      };
    }
    return error;
  }

  private formatReadExcelFileErrors(errors): string {
    let errorInfo: string;

    // `errors` list items have shape: `{ row, column, error, value }`.
    errors.forEach((error) => {
      let errorString = `Error in Row ${error.row} and Column ${error.column}. (Value: ${error.value}) -> ${error.error}`;

      errorInfo += errorString + "\n";
    });

    return errorInfo;
  }

  private async createNewSurveyFromXLSXOptions(
    rows
  ): Promise<Survey | ErrorDto> {
    let targetRow = rows.filter((row) => row[0] == "Title")[0];
    let error: ErrorDto = {
      message: "no Error",
      hasError: false,
    };
    if (targetRow == undefined) {
      error = {
        message: "Survey-title in options not found",
        hasError: true,
      };

      return error;
    }

    if (targetRow[1] === "") {
      error = {
        message: "Survey-title can't be empty",
        hasError: true,
      };

      return error;
    }

    let minimalInformationGain = this.extractXLSXOptions<number>(
      "Item severity boundary",
      rows
    );
    if (minimalInformationGain === undefined) {
      error = {
        message: "Cannot find 'Item severity boundary' option in survey",
        hasError: true,
      };
      return error;
    }

    let privacyBudget = this.extractXLSXOptions<number>("Privacy Budget", rows);
    if (privacyBudget === undefined) {
      error = {
        message: "Cannot find 'Privacy Budget' option in survey",
        hasError: true,
      };
      return error;
    }

    let legalDisclaimer = this.extractXLSXOptions<string>(
      "Legal Disclaimer",
      rows
    );
    if (legalDisclaimer === undefined) {
      error = {
        message: "Cannot find 'Legal Disclaimer' option in survey",
        hasError: true,
      };
      return error;
    }

    const survey = new Survey();

    survey.title = targetRow[1];
    survey.itemSeverityBoundary = minimalInformationGain;
    survey.privacyBudget = privacyBudget;
    survey.legalDisclaimer = legalDisclaimer;

    await getConnection()
      .getRepository(Survey)
      .save(survey)
      .catch((e) => {
        error = {
          message: e,
          hasError: true,
        };
      });

    if (error.hasError) return error;

    return survey;
  }

  private static hasStartSetElements(rows: surveyFormat[]) {
    return rows.some(
      (row) => row.startSet && row.startSet.toString().toUpperCase() == "X"
    );
  }

  private async extractXLSXQuestion(
    row: surveyFormat,
    survey: Survey
  ): Promise<ErrorDto> {
    let error: ErrorDto = {
      hasError: false,
      message: "",
    };

    let correctAnswerIndexes: string[] = row.solutions.toString().split(";");

    let partOfStartSet: boolean = row.startSet
      ? row.startSet.toString().toUpperCase() == "X"
      : false;

    let question = new Question();
    question.text = row.question.toString();
    question.multiResponse = correctAnswerIndexes.length > 1;
    question.survey = survey;
    question.startSet = partOfStartSet;

    if (isNaN(row.difficulty)) {
      error = {
        hasError: true,
        message: `difficulty of question with id ${row.id} is not a valid number!`,
      };
      return error;
    }

    if (isNaN(row.slope)) {
      error = {
        hasError: true,
        message: `slope of question with id ${row.id} is not a valid number!`,
      };
      return error;
    }

    question.difficulty = row.difficulty;
    question.slope = row.slope;

    await getConnection()
      .getRepository(Question)
      .save(question)
      .catch((e) => {
        error = {
          message: e,
          hasError: true,
        };
      });

    if (error.hasError) {
      return error;
    }

    let answers = [
      row.answers.answer1,
      row.answers.answer2,
      row.answers.answer3,
      row.answers.answer4,
      row.answers.answer5,
    ];

    const answersRepository = await getConnection().getRepository(Answer);

    for (let i = 0; i < answers.length; i++) {
      const element = answers[i];

      if (element === undefined) continue;

      let answer = new Answer();
      answer.text = element.toString();
      answer.correct = correctAnswerIndexes.includes(i.toString(10));
      answer.question = question;

      answersRepository.save(answer).catch((e) => {
        error = {
          message: error.message + "\n Error at answer (" + i + "): " + e,
          hasError: true,
        };
      });
    }

    return error;
  }

  private extractXLSXOptions<Type>(option: string, rows): Type | undefined {
    let result: Type | undefined = undefined;
    rows.forEach((row) => {
      if (option === row[0]) {
        result = row[1];
      }
    });
    return result;
  }

  // | ID | Question | A1 | A2 | A3 | A4 | A5 | Solution |
  private fileSchema = {
    ID: {
      // JSON object property name.
      prop: "id",
      type: Number,
      required: true,
    },
    Question: {
      prop: "question",
      type: String,
      required: true,
    },
    Solution: {
      prop: "solutions",
      type: String,
      required: true,
    },
    StartSet: {
      prop: "startSet",
      type: String,
    },
    Difficulty: {
      prop: "difficulty",
      required: true,
    },
    Slope: {
      prop: "slope",
      required: true,
    },
    // Nested object.
    // 'Answers' here is not a real Excel file column name,
    // it can be any string — it's just for code readability.
    Answers: {
      prop: "answers",
      type: {
        A1: {
          prop: "answer1",
          required: true,
        },
        A2: {
          prop: "answer2",
          required: true,
        },
        A3: {
          prop: "answer3",
        },
        A4: {
          prop: "answer4",
        },
        A5: {
          prop: "answer5",
        },
      },
    },
  };

  // end Excel Upload

  static async updateSurveyPrivacyBudget(
    surveyId: number,
    newPrivacyBudget: number
  ) {
    const SurveyRepository = await getConnection().getRepository(Survey);

    let survey = await SurveyRepository.find({ where: { id: surveyId } });
    survey[0].privacyBudget = newPrivacyBudget;
    let result: ErrorDto = {
      message: "",
      hasError: false,
    };
    await SurveyRepository.save(survey[0])
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });
  }
  async createReport(body: CreateReportDto): Promise<CreateReportResponseDto> {
    let cost = 1;
    let minBuckets = 4;
    let cutToZero = true; // if true, privatize returns zero when output is negative, else absolute value
    let result: CreateReportResponseDto = {
      report: {
        histogramData: [
          {
            bucketName: "-",
            participantNumber: 0,
          },
        ],
      },
      error: {
        hasError: false,
        message: "no Error",
      },
    };

    //check User rights
    let loginResult = await SurveyController.checkTrusteeLogin(body);

    if (loginResult.hasError) {
      result.error = loginResult;
      return result;
    }
    let resultPrivate = result;

    if (body.privacyBudget < cost) {
      resultPrivate.error = {
        message: "Not enough budget left on this survey!",
        hasError: true,
      };
      return resultPrivate;
    } else {
      let pController = new ParticipantController();
      let participants = await pController.getParticipants(body.surveyId);

      const dataset = newArrayView(participants.participants);

      let [min, max, a, b] = [participants.participants[0].scoring, 0, 0, 0];

      participants.participants.forEach((d) => {
        if (d.finished) {
          if (d.scoring < min) {
            min = Math.floor(d.scoring);
          } else if (d.scoring > max) {
            max = Math.round(d.scoring);
          }
        }
      });

      let width = 1;
      while ((max - min) / width < minBuckets) {
        width = width / 2;
      }
      a = min;
      b = a + width;

      const bucketFunc = (view) => {
        let bucketSize = 0;
        let total = 0;

        view.forEach((p) => {
          if (a <= p.scoring && p.scoring < b) {
            bucketSize += 1;
          }
          total += 1;
        });
        return (bucketSize * 100) / total;
      };

      const options = {
        maxEpsilon: cost,
        newShadowIterator: dataset.newShadowIterator,
      };
      let tempPrBucketSize: number[] = [];
      let tempPrHistogram: CreateReportResponseDto = {
        report: { histogramData: [] },
        error: { hasError: false, message: "no Error" },
      };

      for (let i = 0; i < max - min; i += width) {
        const getPrivateBucket = privatize(bucketFunc, options);
        let value = (await getPrivateBucket(dataset)).result;
        if (value < 0) {
          tempPrBucketSize.push(cutToZero ? 0 : Math.abs(value));
        } else {
          tempPrBucketSize.push(value);
        }
        tempPrHistogram.report.histogramData.push({
          bucketName: a + ".." + b,
          participantNumber: tempPrBucketSize[tempPrBucketSize.length - 1],
        });
        a += width;
        b += width;
      }
      resultPrivate = tempPrHistogram;
    }
    await SurveyController.updateSurveyPrivacyBudget(
      body.surveyId,
      body.privacyBudget - cost
    );
    return resultPrivate;
  }

  async getProgress(
    body: SurveyProgressDto
  ): Promise<SurveyProgressResponseDto> {
    let result: SurveyProgressResponseDto = {
      progress: 0,
      error: {
        hasError: false,
        message: "no Error",
      },
    };
    //check User rights
    let loginResult = await SurveyController.checkTrusteeLogin(body);

    if (loginResult.hasError) {
      result.error = loginResult;
      return result;
    }
    let pController = new ParticipantController();
    let participants = await pController.getParticipants(body.surveyId);
    let finished = 0;
    await participants.participants.forEach((p) => {
      if (p.finished) {
        finished += 1;
      }
    });
    result.progress = (finished * 100) / participants.participants.length ?? 0;
    return result;
  }

  async closeSurvey(body: CloseSurveyDto): Promise<CloseSurveyResponseDto> {
    let result: CloseSurveyResponseDto = {
      error: {
        hasError: false,
        message: "no Error",
      },
    };

    //check User rights
    let loginResult = await SurveyController.checkTrusteeLogin(body);

    if (loginResult.hasError) {
      result.error = loginResult;
      return result;
    }

    const surveyRepository = await getConnection().getRepository(Survey);

    const targetSurvey = await surveyRepository
      .createQueryBuilder("survey")
      .where("survey.id = :id", { id: body.surveyId })
      .getOne();

    if (targetSurvey.isClosed) {
      result.error = {
        hasError: true,
        message: "Survey already closed!",
      };
      return result;
    }

    targetSurvey.isClosed = true;

    surveyRepository.save(targetSurvey).catch((e) => {
      result.error = {
        message: e.message,
        hasError: true,
      };
    });

    return result;
  }
}

type surveyFormat = {
  id: number;
  question: string;
  solutions: string;
  startSet: string;
  difficulty: number;
  slope: number;
  answers: {
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    answer5: string;
  };
};
