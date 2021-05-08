import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { Survey } from "../entities/Survey"
import { getConnection } from "typeorm";
class SurveyController 
{
  async getCurrentSurvey(surveyId: number, uniqueId: number) 
  {
    const surveys = await getConnection()
        .getRepository(Survey)
        .createQueryBuilder("survey")
        .where("survey.id = :id", { id: surveyId })
        .getOne();

    console.log("selected survey: ", surveys);
    
    let returnValue: CurrentQuestionResponseDto = {
      error: null,
      item: null,
    };
    return returnValue;
  }

  postCurrentSurvey(body: AnswerSurveyDto, surveyId: number, uniqueId: number)
  {
    let returnValue: AnswerSurveyResponseDto = {
      error: null,
    };

    return returnValue;
  }
}

export = new SurveyController();
