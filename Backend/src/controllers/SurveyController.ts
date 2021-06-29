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

export class SurveyController {
  async getSurveys() {
    const query = await getConnection().getRepository(Survey).find();

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: query ? false : true,
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
  ) {
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
    readXlsxFile(filePath, { sheet: 'Survey' }).then((rows) => {
      rows.forEach((row) => console.log(row[0]));
    });

    readXlsxFile(filePath, { sheet: 'Options' }).then((rows) => {
      rows.forEach((row) => console.log(row[0]));
    });

    // save to database

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };
    return result;
  }
}
