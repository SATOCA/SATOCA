import { getConnection, getManager } from "typeorm";
import { Survey } from "../entities/Survey";
import { Participant } from "../entities/Participant";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { ParticipantResponseDto } from "../routers/dto/ParticipantResponseDto"
import { v4 as uuidv4 } from "uuid";
import { SurveyProgress } from "../entities/SurveyProgress";
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

    const obj = new Participant();
    obj.uuid = uuidv4();
    obj.survey = survey;

    const question = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .innerJoinAndSelect("question.survey", "survey")
      .where("survey.id = :id", { id: surveyId })
      // 
      .take(1)
      .getOne();

    const progress = new SurveyProgress();
    progress.participant = obj;
    progress.finished = false;
    progress.currentQuestion = question;

    //! \todo handle error case
    const result: ErrorDto = {
      message: "",
      hasError: false,
    };

    getConnection().getRepository(Participant)
      .save(obj)
      .then(() => { result.hasError = false; })
      .catch(e => {
        result.hasError = false;
        result.message = e;
      });

    if (result.hasError === true)
      return result;

    getConnection().getRepository(SurveyProgress).save(progress)
      .then(() => { result.hasError = false; })
      .catch(e => {
        result.hasError = false;
        result.message = e;
      });

    return result;
  }
}

