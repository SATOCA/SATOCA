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

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: query ? false : true,
    };

    const result: CurrentQuestionResponseDto = {
      error: err,
      item: query.currentQuestion
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
      .andWhere("participant.uuid = :uniqueId", { uuid: uniqueId })
      .getOneOrFail();


    let finishedQuestionRepository = getConnection().getRepository(FinishedQuestion);
    let finishedQuestion = new FinishedQuestion();
    finishedQuestion.id = body.itemId;
    // todo: finishedQuestion.question = progressQuery.currentQuestion;
    finishedQuestion.givenAnswers = body.answers;
    await finishedQuestionRepository.save(finishedQuestion);
    console.log("submitted item: ", finishedQuestionRepository);

    // update Participant
    let participantRepository = getConnection().getRepository(Participant);
    // todo: replace answered currentQuestion with the next/following question
    let progress = new Participant();
    // progress.currentQuestion = progressQuery.currentQuestion;
    await participantRepository.save(progress);

    let returnValue: AnswerSurveyResponseDto = {
      error: null,
    };
    return returnValue;
  }
}
