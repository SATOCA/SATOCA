import { getConnection } from "typeorm";
import fileUpload from "express-fileupload";
import readXlsxFile from "read-excel-file/node";

import { ParticipantController } from "./ParticipantController";
import { TrusteeController } from "./TrusteeController";

import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { SurveyDto } from "../routers/dto/SurveyDto";
import { SurveyResponseDto } from "../routers/dto/SurveyResponseDto";
import { UploadSurveyFileDto } from "../routers/dto/UploadSurveyFileDto";
import { FinishedQuestion } from "../entities/FinishedQuestion";
import { Participant } from "../entities/Participant";
import { Survey } from "../entities/Survey";
import { Question } from "../entities/Question";
import { Answer } from "../entities/Answer";
import { UploadSurveyFileResponseDto } from "../routers/dto/UploadSurveyFileResponseDto";

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

// Calculates the probability that someone with a given ability level 'theta' will answer correctly an item.
// Uses the 3 parameters logistic model (a, b, c).
export function itemResponseFunction(
  a: number,
  b: number,
  c: number,
  theta: number
) {
  return c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
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
  async getSurveys() {
    const query = await getConnection().getRepository(Survey).find();

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: !query,
    };
    const result: SurveyResponseDto = {
      error: err,
      surveys: query,
    };
    return result;
  }

  //! \todo surveyId is not needed -> remove
  async getCurrentSurvey(surveyId: number, uniqueId: string) {
    const query = await getConnection()
      .getRepository(Participant)
      .createQueryBuilder("participant")
      .leftJoinAndSelect("participant.currentQuestion", "currentQuestion")
      .where("participant.uuid = :uuid", { uuid: uniqueId })
      .take(1)
      .getOne();
    //! \todo handle error case

    const question = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.choices", "choices")
      .where("question.id = :id", { id: query.currentQuestion.id })
      .getOne();
    //! \todo handle error case

    const err: ErrorDto = {
      message: "",
      hasError: false,
    };
    const result: CurrentQuestionResponseDto = {
      error: err,
      item: question,
      finished: query.finished,
      ability: query.scoring,
    };
    return result;
  }

  async addSurvey(body: SurveyDto) {
    const obj = new Survey();
    //! \todo title cannot be empty
    obj.title = body.title;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    getConnection()
      .getRepository(Survey)
      .save(obj)
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });

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
      .where("question.id = :id", { id: participant.currentQuestion.id })
      .getOne();

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    let finishedQuestionRepository = await getConnection().getRepository(
      FinishedQuestion
    );

    const count = await finishedQuestionRepository.count({
      where: { question: question, participant: participant },
    });

    if (count > 0) {
      result.hasError = true;
      result.message =
        "The question with the id: " + question.id + " was already answered";
    } else {
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
      const finishedQuestions =
        /*await getConnection()
        .getRepository(FinishedQuestion)*/
        await finishedQuestionRepository
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
    }

    let returnValue: AnswerSurveyResponseDto = {
      error: result,
    };
    return returnValue;
  }

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
    const trusteeController = new TrusteeController();
    let trusteeLogin = await trusteeController.loginTrustee(body);
    console.log(trusteeLogin);

    if (!trusteeLogin.success) {
      result.error = {
        message: "Invalid credentials",
        hasError: true,
      };
      return result;
    }

    let filePath = "./uploads/" + file.name;
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

    if (errors.length > 0) {
      let errorString = this.formatReadExcelFileErrors(errors);
      result.error = {
        hasError: true,
        message: errorString,
      };
      return result;
    }

    if (!SurveyController.hasStartSetElements(rows)) {
      result.error = {
        hasError: true,
        message: "No question was marked as starting question!",
      };
      return result;
    }

    for (const row of rows) {
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

    let numParticipants = this.extractXLSXOptions(optionsRows);
    let pController = new ParticipantController();

    await pController.addParticipants(survey.id, numParticipants);

    result.links = await pController.createSurveyLinks(survey.id);

    return result;
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

    const survey = new Survey();

    survey.title = targetRow[1];

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
    return rows.some(row => row.startSet && row.startSet.toString().toUpperCase() == "X");
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

  private extractXLSXOptions(rows): number | undefined {
    let result: number | undefined = undefined;
    rows.forEach((row) => {
      if ("Number participants" === row[0]) {
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
