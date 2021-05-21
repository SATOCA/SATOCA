import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { getConnection, getManager } from "typeorm";
import { Question } from "../entities/Question";
import { SurveyProgress } from "../entities/SurveyProgress";
import { ErrorDto } from "../routers/dto/ErrorDto";

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

  postCurrentSurvey(body: AnswerSurveyDto, surveyId: number, uniqueId: number) {
    let returnValue: AnswerSurveyResponseDto = {
      error: null,
    };
    return returnValue;
  }
}
