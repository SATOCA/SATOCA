import { getConnection, getManager } from "typeorm";
import { Survey } from "../entities/Survey";
import { Participant } from "../entities/Participant";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { ParticipantResponseDto } from "../routers/dto/ParticipantResponseDto"
import { v4 as uuidv4 } from "uuid";
import { Question } from "../entities/Question";

export class ParticipantController {

  async getParticipants(surveyId: number) {

    const query = await getConnection().getRepository(Participant).find({ where: { survey: surveyId } });

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: query ? false : true,
    };
    const result: ParticipantResponseDto = {
      error: err,
      participants: query,
    };
    return result;
  }

  async postParticipant(surveyId: number) {

    const survey = await getConnection().getRepository(Survey).findOne(surveyId);
    //! \todo handle error case
    const question = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.choices", "choises")
      .innerJoinAndSelect("question.survey", "survey")
      .where("survey.id = :id", { id: surveyId })
      .take(1)
      .getOne();

    console.log(question)
    //! \todo handle error case
    // -> take all available questions and let the adaptation logic decide which is the first question

    let obj = new Participant();
    obj.uuid = uuidv4();
    obj.survey = survey;
    obj.finished = false;
    obj.currentQuestion = question;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    getConnection().getRepository(Participant)
      .save(obj)
      .then(() => { result.hasError = false; })
      .catch(e => {
        result.hasError = true;
        result.message = e;
      });

    return result;
  }
}

