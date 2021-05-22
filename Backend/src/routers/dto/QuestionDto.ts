import { Answer } from "../../entities/Answer";

export interface QuestionDto {
  text: string;
  multiResponse: boolean;
  choices: Answer[];
}
