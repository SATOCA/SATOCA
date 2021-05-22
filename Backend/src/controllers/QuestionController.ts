import { getConnection, getManager } from "typeorm";
import { Survey } from "../entities/Survey";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { Question } from "../entities/Question";
import { QuestionDto } from "../routers/dto/QuestionDto";
import { QuestionResponseDto } from "../routers/dto/QuestionResponseDto";

export class QuestionController {

  async getQuestions(surveyId: number) {
    const query = await getConnection().getRepository(Question).find({ where: { survey: surveyId } });

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: query ? false : true,
    };
    const result: QuestionResponseDto = {
      error: err,
      questions: query,
    };
    return result;
  }

  async postQuestion(surveyId: number, body: QuestionDto) {

    const survey = await getConnection().getRepository(Survey).findOne(surveyId);
    //! \todo check if survey is valid

    let obj = new Question();
    obj.text = body.text;
    obj.multiResponse = body.multiResponse;
    //! \todo obj.choices = 
    obj.survey = survey;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    getConnection().getRepository(Question)
      .save(obj)
      .then(() => { result.hasError = false; })
      .catch(e => {
        result.hasError = true;
        result.message = e;
      });

    return result;
  }
}

