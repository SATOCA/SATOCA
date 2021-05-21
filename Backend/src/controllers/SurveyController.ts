import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { getConnection } from "typeorm";
import { Question } from "../entities/Question";
<<<<<<< HEAD
import { FinishedQuestion } from "../entities/FinishedQuestion";
import { Participant } from "../entities/Participant";
=======
import { SurveyProgress } from "../entities/SurveyProgress";
import { ErrorDto } from "../routers/dto/ErrorDto";
>>>>>>> e32aecc43e98b24b168ea8d0683477257ac9be45

export class SurveyController {
  async getCurrentSurvey(surveyId: number, uniqueId: string) {

    const progress = await getConnection()
      .getRepository(SurveyProgress)
      .createQueryBuilder("progess")
      .leftJoinAndSelect('progess.currentQuestion', 'currentQuestion')
      .innerJoinAndSelect("progess.participant", "participant")
      .where("participant.uuid = :uuid", { uuid: uniqueId })
      .take(1)
      .getOne();

    const err: ErrorDto = {
      message: progress ? "" : "todo: error message",
      hasError: progress ? false : true,
    };

    const result: CurrentQuestionResponseDto = {
      error: err,
      item: progress.currentQuestion,
    };
    return result;
  }

  async postCurrentSurvey(body: AnswerSurveyDto, surveyId: number, uniqueId: number) {

    const progressQuery = await getConnection()
        .getRepository(Participant)
        .createQueryBuilder("participant")
        .innerJoinAndSelect("participant.survey", "survey")
        .innerJoinAndSelect("participant.currentQuestion", "currentQuestion")
        .where("survey.Id = :surveyId", { surveyId })
        .andWhere("participant.uuid = :uniqueId", { uniqueId })
        .getOneOrFail();


    let finishedQuestionRepository = getConnection().getRepository(FinishedQuestion);
    let finishedQuestion = new FinishedQuestion();
    finishedQuestion.id = body.itemId;
    finishedQuestion.question = progressQuery.currentQuestion;
    finishedQuestion.givenAnswers = body.answers;
    await finishedQuestionRepository.save(finishedQuestion);
    console.log("submitted item: ", finishedQuestionRepository);

    // update Participant
    let participantRepository = getConnection().getRepository(Participant);
    // todo: replace answered currentQuestion with the next/following question
    let progress = new Participant();
    progress.currentQuestion = progressQuery.currentQuestion;
    await participantRepository.save(progress);

    let returnValue: AnswerSurveyResponseDto = {
      error: null,
    };
    return returnValue;
  }
}
