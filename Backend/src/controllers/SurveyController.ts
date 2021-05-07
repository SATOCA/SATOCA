import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";

class SurveyController {
  getCurrentSurvey(surveyId: number, uniqueId: number) {
    let returnValue: CurrentQuestionResponseDto = {
      error: null,
      item: null,
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

export = new SurveyController();
