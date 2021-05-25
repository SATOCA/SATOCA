import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { getConnection } from "typeorm";
import { FinishedQuestion } from "../entities/FinishedQuestion";
import { Participant } from "../entities/Participant";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { Survey } from "../entities/Survey";
import { SurveyDto } from "../routers/dto/SurveyDto";
import { SurveyResponseDto } from "../routers/dto/SurveyResponseDto";
import { Question } from "../entities/Question";
import {ParticipantController} from "./ParticipantController";

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

  async addSurvey(body: SurveyDto) {
    const obj = new Survey();
    //! \todo title cannot be empty
    obj.title = body.title;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    getConnection().getRepository(Survey)
      .save(obj)
      .then(() => { result.hasError = false; })
      .catch(e => {
        result.hasError = true;
        result.message = e;
      });

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
      .getOne()
    //! \todo handle error case

    const err: ErrorDto = {
      message: "",
      hasError: false,
    };
    const result: CurrentQuestionResponseDto = {
      error: err,
      item: question
    };
    return result;
  }

  async postCurrentSurvey(body: AnswerSurveyDto, surveyId: number, uniqueId: number) { // todo: uniqueId has to be string

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
        .getOne()

    // update FinishedQuestion
    let finishedQuestionRepository = getConnection().getRepository(FinishedQuestion);

    let finishedQuestion = new FinishedQuestion();
    finishedQuestion.id = body.itemId;
    finishedQuestion.question = question;
    finishedQuestion.givenAnswers = body.answers;

    let finishedQuestionResult: ErrorDto = {
      message: "",
      hasError: false,
    };

    await finishedQuestionRepository
        .save(finishedQuestion)
        .then(() => { finishedQuestionResult.hasError = false; })
        .catch(e => {
          finishedQuestionResult.hasError = true;
          finishedQuestionResult.message = e;
        });

    // update Participant
    let participantRepository = getConnection().getRepository(Participant);

    let progress = await participantRepository.findOne({ id: progressQuery.id });
    // todo: replace answered currentQuestion with the next/following question -> get from adaption logic
    /*
    nextQuestion = getNextQuestion();

     if(nextQuestion == null) {
       progress.finished = true;
     }

    progress.currentQuestion = nextQuestion;


    let progressResult: ErrorDto = {
      message: "",
      hasError: false,
    };

    await participantRepository
        .save(progress)
        .then(() => { progressResult.hasError = false; })
        .catch(e => {
          progressResult.hasError = true;
          progressResult.message = e;
        });
    */
    
    let returnValue: AnswerSurveyResponseDto = {
      error: finishedQuestionResult,
    };
    return returnValue;
  }
}
