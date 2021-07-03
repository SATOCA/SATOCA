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
    const survey = this.createNewSurveyFromXLSXOptions(optionsRows);

    // todo survey undefined!!!

    await readXlsxFile(filePath, {
      sheet: "Survey",
      schema: this.fileSchema,
    }).then(({ rows, errors }) => {
      rows.forEach((row) => this.extractXLSXQuestion(row, survey));
    });

    let numParticipants = this.extractXLSXOptions(optionsRows);
    let pController = new ParticipantController();

    await pController.addParticipants(survey.id, numParticipants);

    let links: string[] = await pController.createSurveyLinks(survey.id);

    let error: ErrorDto = {
      message: "no Error",
      hasError: false,
    };

    let result: UploadSurveyFileResponseDto = {
      links: links,
      error: error,
    };

    return result;
  }

  private createNewSurveyFromXLSXOptions(rows): Survey | undefined {
    let targetRow = rows.filter((row) => row[0] == "Title")[0];

    if (targetRow == undefined) return undefined;

    const survey = new Survey();
    //todo title cannot be empty!!!
    survey.title = targetRow[1];

    getConnection()
      .getRepository(Survey)
      .save(survey)
      .catch((e) => {
        // todo Error-Management
      });

    return survey;
  }

  private async extractXLSXQuestion(row, survey: Survey) {
    let correctAnswerIndexes: string[] = row.solutions.toString().split(";");

    let question = new Question();
    question.text = row.question;
    question.multiResponse = correctAnswerIndexes.length > 1;
    question.survey = survey;

    await getConnection()
      .getRepository(Question)
      .save(question)
      .catch((e) => {
        //todo errorhandling
      });

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
        //todo errorhandling
      });
    });
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

type fileSchema = {
  id: number;
  question: string;
  answers: {
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    answer5: string;
  };
  solutions: string;
};
