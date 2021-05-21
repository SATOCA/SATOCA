import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { getConnection } from "typeorm";
import { FinishedQuestion } from "../entities/FinishedQuestion";
import { Participant } from "../entities/Participant";
import { ErrorDto } from "../routers/dto/ErrorDto";

export class SurveyController {
  async getCurrentSurvey(surveyId: number, uniqueId: string) {

    const progress = await getConnection()
      .getRepository(Participant)
      .createQueryBuilder("progress")
      .leftJoinAndSelect("progress.currentQuestion", "currentQuestion")
      .innerJoinAndSelect("progress.participant", "participant")
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
