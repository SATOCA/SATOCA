import { Brackets, getConnection } from "typeorm";
import { Survey } from "../entities/Survey";
import { ErrorDto } from "../routers/dto/ErrorDto";
import { Question } from "../entities/Question";
import { QuestionDto } from "../routers/dto/QuestionDto";
import { QuestionResponseDto } from "../routers/dto/QuestionResponseDto";
import { Answer } from "../entities/Answer";
import { Participant } from "../entities/Participant";

export class QuestionController {
  async getQuestions(surveyId: number) {
    const query = await getConnection()
      .getRepository(Question)
      .find({ where: { survey: surveyId } });

    const err: ErrorDto = {
      message: query ? "" : "todo: error message",
      hasError: !query,
    };
    const result: QuestionResponseDto = {
      error: err,
      questions: query,
    };
    return result;
  }
  async getNextQuestion(participant: Participant, surveyid: number) {
    const remainingQuestions = await getConnection()
      .getRepository(Question)
      .createQueryBuilder("question")
      .leftJoinAndSelect("question.finishedQuestions", "finishedQuestion")
      .leftJoinAndSelect("question.survey", "survey")
      .leftJoinAndSelect("question.choices", "choices")
      .leftJoinAndSelect("finishedQuestion.participant", "participant")
      .where("question.surveyId = :surveyId", { surveyId: surveyid })
      .andWhere(
        new Brackets((sqb) => {
          sqb
            .where("finishedQuestion.id IS NULL")
            .orWhere("finishedQuestion.participant.id <> :partId", {
              partId: participant.id,
            });
        })
      )
      .getMany();

    let bestElement: Question;
    let bestScore = 0,
      score;
    for (const q of remainingQuestions) {
      score = await this.calculateItemInformationValue(
        q.slope,
        1,
        participant.scoring - q.difficulty
      );

      if (score > bestScore) {
        bestElement = q;
        bestScore = score;
      }
    }
    return bestElement;
  }

  async calculateItemInformationValue(
    a: number, //slope
    k: number, // = 1
    x: number //Scoring - Difficulty
  ): Promise<number> {
    return (
      (a * ((k - 1) * Math.exp(a * x) + k) * Math.exp(a * k * x)) /
      Math.pow(Math.exp(a * x) + 1, 2)
    );
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
