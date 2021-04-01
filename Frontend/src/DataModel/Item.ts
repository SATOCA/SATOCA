import { Question } from "./Question";
import { Answer } from "./Answer";

export interface Item {
  question: Question;
  answerOptions: Answer[];
  isMultiResponse: boolean;
}
