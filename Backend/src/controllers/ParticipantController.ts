import { getConnection } from "typeorm";
import { Survey } from "../entities/Survey";
import { Participant } from "../entities/Participant";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { ParticipantResponseDto } from "../routers/dto/ParticipantResponseDto";
import { v4 as uuidv4 } from "uuid";
import { Question } from "../entities/Question";

export class ParticipantController {
  //todo export user links
  async addParticipants(surveyId: number, numberOfParticipants: number) {
    // todo errorhandling

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    let postParticipantResult = await this.postParticipant(
      surveyId,
      numberOfParticipants
    );
    if (postParticipantResult.hasError) {
      result = postParticipantResult;
    }

    return result;
  }

  async getParticipants(surveyId: number): Promise<ParticipantResponseDto> {
    const query = await getConnection()
      .getRepository(Participant)
      .find({ where: { survey: surveyId } });

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: !query,
    };
    return {
      error: err,
      participants: query,
    };
  }

  async postParticipant(surveyId: number, numParticipants: number) {
    const survey = await getConnection()
      .getRepository(Survey)
      .findOne(surveyId);
    //! \todo handle error case
    const question = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.choices", "choices")
      .innerJoinAndSelect("question.survey", "survey")
      .where("survey.id = :id", { id: surveyId })
      .take(1)
      .getOne();

    console.log(question);
    //! \todo handle error case
    // -> take all available questions and let the adaptation logic decide which is the first question

    let obj: Participant[] = [];
    for (let i = 0; i < numParticipants; i++) {
      obj.push(new Participant());
      obj[i].uuid = uuidv4();
      obj[i].survey = survey;
      obj[i].finished = false;
      obj[i].currentQuestion = question;
    }
    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    await getConnection()
      .getRepository(Participant)
      .save(obj)
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });

    return result;
  }

  async updateParticipant(surveyId: number, uniqueId: string, ability: number) {
    const progressQuery = await getConnection()
      .getRepository(Participant)
      .createQueryBuilder("participant")
      .innerJoinAndSelect("participant.survey", "survey")
      .innerJoinAndSelect("participant.currentQuestion", "currentQuestion")
      .where("survey.Id = :surveyId", { surveyId: surveyId })
      .andWhere("participant.uuid = :uuid", { uuid: uniqueId })
      .getOneOrFail();

    let participantRepository = getConnection().getRepository(Participant);
    let progress = await participantRepository.findOne({
      id: progressQuery.id,
    });

    // todo: replace answered currentQuestion with the next/following question -> get from adaption logic
    /*
    nextQuestion = getNextQuestion();

     if(nextQuestion == null) {
       progress.finished = true;
     }

    progress.currentQuestion = nextQuestion;
    */

    // TODO: rename
    progress.scoring = ability;
    progress.finished = true;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    await participantRepository
      .save(progress)
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });

    return result;
  }

  async createSurveyLinks(surveyId: number): Promise<string[]> {
    let participants = (await this.getParticipants(surveyId)).participants;
    let links: string[] = [];
    participants.forEach((participant) => {
      links.push("/" + surveyId + "/" + participant.uuid + "/");
    });
    return links;
  }

  async resetParticipant(uniqueId: string) {
    let participantRepository = getConnection().getRepository(Participant);
    let participant = await participantRepository.findOne({ uuid: uniqueId });

    participant.finished = false;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    await participantRepository
      .save(participant)
      .then(() => {
        result.hasError = false;
      })
      .catch((e) => {
        result.hasError = true;
        result.message = e;
      });

    return result;
  }
}
