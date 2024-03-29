import { getConnection } from "typeorm";
import { Survey } from "../entities/Survey";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { Question } from "../entities/Question";
import { QuestionDto } from "../routers/dto/QuestionDto";
import { QuestionResponseDto } from "../routers/dto/QuestionResponseDto";
import { Answer } from "../entities/Answer";
import { Participant } from "../entities/Participant";

export class QuestionController {
  async getNextQuestion(participant: Participant, surveyid: number) {
    const remainingQuestions = await getConnection()
        .getRepository(Question)
        .createQueryBuilder("question")
        .leftJoinAndSelect("question.finishedQuestions", "finishedQuestion")
        .leftJoinAndSelect("question.survey", "survey")
        .leftJoinAndSelect("finishedQuestion.participant", "participant")
        .leftJoinAndSelect("question.choices", "choices")
        .where("question.surveyId = :surveyId", { surveyId: surveyid })
        .getMany();

    let questionPool = [];
    for (const q of remainingQuestions) {
      let answered = false;

      q.finishedQuestions?.forEach((f) => {
        if (f.participant.id === participant.id) {
          answered = true;
        }
      });

      if (!answered) {
        questionPool.push(q);
      }
    }

    let bestElement: Question;
    let bestScore = 0,
        score;
    for (const q of questionPool) {
      if (
          (score = await this.calculateItemInformationValue(
              q.slope,
              participant.scoring - q.difficulty,
              1 / q.choices.length
          )) > bestScore
      ) {
        bestElement = q;
        bestScore = score;
      }
    }
    if (bestElement === undefined) {
      participant.finished = true;
    }
    return bestElement;
  }

  async calculateItemInformationValue(
    a: number, //slope
    //k: number, // = 1
    x: number, //Scoring - Difficulty
    c: number //guessing parameter
  ): Promise<number> {
    /* 2PL-Model
   return (
      (a * ((k - 1) * Math.exp(a * x) + k) * Math.exp(a * k * x)) /
      Math.pow(Math.exp(a * x) + 1, 2)
    );*/
    return -(a * (c - 1) * Math.exp(a * x)) / Math.pow(Math.exp(a * x) + 1, 2); //3PL-Model, k=1
  }

  async postQuestion(surveyId: number, body: QuestionDto) {
    const survey = await getConnection()
      .getRepository(Survey)
      .findOne(surveyId);
    //! \todo check if survey is valid

    const choices: Answer[] = await Promise.all(
      body.choices.map(
        async (item): Promise<Answer> => {
          let obj = new Answer();
          obj.text = item.text;
          await getConnection().getRepository(Answer).save(obj);
          return obj;
        }
      )
    );

    let obj = new Question();
    obj.text = body.text;
    obj.multiResponse = body.multiResponse;
    obj.choices = choices;
    obj.survey = survey;

    let result: ErrorDto = {
      message: "",
      hasError: false,
    };

    getConnection()
      .getRepository(Question)
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
}
