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
      finished: query.finished
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
    const progressQuery = await getConnection()
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
      .where("question.id = :id", { id: progressQuery.currentQuestion.id })
      .getOne();

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    // add to FinishedQuestion table
    let finishedQuestionRepository = getConnection().getRepository(
      FinishedQuestion
    );

    const count = await finishedQuestionRepository.count({
      where: { question: question },
    });

    if (count > 0) {
      result.hasError = true;
      result.message =
        "The question with the id: " + question.id + " was already answered";
    } else {
      // if question was not already answered

      let finishedQuestion = new FinishedQuestion();
      finishedQuestion.id = body.itemId;
      finishedQuestion.question = question;
      finishedQuestion.givenAnswers = body.answers;

      await finishedQuestionRepository
        .save(finishedQuestion)
        .then(() => {
          result.hasError = false;
        })
        .catch((e) => {
          result.hasError = true;
          result.message = e;
        });

      // update Participant
      const participantController = new ParticipantController();

      if (!result.hasError) {
        // make sure that an error of finishedQuestionRepository is not be overwritten by result of updateParticipant
        let updateParticipantReturn = await participantController.updateParticipant(
          surveyId,
          uniqueId
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
        message: "",
      },
    };

    //check User rights
    const trusteeController = new TrusteeController();
    let trusteeLogin = await trusteeController.loginTrustee(body);

    //todo reinsert
    // if (!trusteeLogin.success) {
    //   let result: ErrorDto = {
    //     message: "Login unsuccessful",
    //     hasError: true,
    //   };
    //   return result;
    // }

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

    let links: string[] = await pController.createSurveyLinks(survey.id);

    let error: ErrorDto = {
      message: "no Error",
      hasError: false,
    };

    result = {
      links: links,
      error: error,
    };

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

    if (targetRow == undefined) {
      let error: ErrorDto = {
        message: "Survey-title in options not found",
        hasError: true,
      };

      return error;
    }

    if (targetRow[1] === "") {
      let error: ErrorDto = {
        message: "Survey-title can't be empty",
        hasError: true,
      };

      return error;
    }

    const survey = new Survey();

    survey.title = targetRow[1];

    let error: ErrorDto;

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

  private async extractXLSXQuestion(row, survey: Survey): Promise<ErrorDto> {
    let error: ErrorDto = {
      hasError: false,
      message: "",
    };

    let correctAnswerIndexes: string[] = row.solutions.toString().split(";");

    let question = new Question();
    question.text = row.question;
    question.multiResponse = correctAnswerIndexes.length > 1;
    question.survey = survey;

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

    answers.forEach((element, index) => {
      let answer = new Answer();
      answer.text = element;
      answer.correct = correctAnswerIndexes.includes(index.toString(10));
      answer.question = question;

      answersRepository.save(answer).catch((e) => {
        error = {
          message: error.message + "\n Error at answer (" + index + "): " + e,
          hasError: true,
        };
      });
    });

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
    // Nested object.
    // 'Answers' here is not a real Excel file column name,
    // it can be any string — it's just for code readability.
    Answers: {
      prop: "answers",
      type: {
        A1: {
          prop: "answer1",
          type: String,
          required: true,
        },
        A2: {
          prop: "answer2",
          type: String,
        },
        A3: {
          prop: "answer3",
          type: String,
        },
        A4: {
          prop: "answer4",
          type: String,
        },
        A5: {
          prop: "answer5",
          type: String,
        },
      },
    },
    Solution: {
      prop: "solutions",
      type: String,
      required: true,
    },
  };
}
