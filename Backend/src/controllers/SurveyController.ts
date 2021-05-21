import { AnswerSurveyDto } from "../routers/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../routers/dto/AnswerSurveyResponseDto";
import { CurrentQuestionResponseDto } from "../routers/dto/CurrentQuestionResponseDto";
import { getConnection } from "typeorm";
import { Question } from "../entities/Question";
import { FinishedQuestion } from "../entities/FinishedQuestion";
import { Participant } from "../entities/Participant";

class SurveyController {
  async getCurrentSurvey(surveyId: number, uniqueId: number) {

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

export = new SurveyController();
