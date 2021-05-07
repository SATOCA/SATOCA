import { Answer } from "../../entities/Answer";

export interface AnswerSurveyDto {
  itemId: number;
  answers: Answer[];
}
