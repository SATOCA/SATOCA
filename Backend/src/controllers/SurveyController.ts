import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { getConnection, getManager } from "typeorm";
import { Question } from "../entities/Question";
import { SurveyProgress } from "../entities/SurveyProgress";

export class SurveyController {
  async getCurrentSurvey(surveyId: number, uniqueId: string) {

    const progress = await getConnection()
      .getRepository(SurveyProgress)
      .createQueryBuilder("progess")
      .innerJoinAndSelect("progess.participant", "participant")
      .where("participant.uuid = :uuid", { uuid: uniqueId })
      .take(1)
      .getOne();

    const query = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .innerJoinAndSelect("question.survey", "survey")
      .where("survey.id = :id", { id: surveyId })
      // 
      .take(1)
      .getOne();

    const result = new Question;
    result.id = query.id;
    result.text = query.text;
    result.multiResponse = query.multiResponse;
    result.choices = query.choices;

    const returnValue: CurrentQuestionResponseDto = {
      error: null,
      item: result,
    };
    return returnValue;
  }

  postCurrentSurvey(body: AnswerSurveyDto, surveyId: number, uniqueId: number) {
    let returnValue: AnswerSurveyResponseDto = {
      error: null,
    };
    return returnValue;
  }
}
