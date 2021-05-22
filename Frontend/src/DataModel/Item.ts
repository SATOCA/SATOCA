import { Answer } from "./Answer";

export interface Question {
  text: string;

  multiResponse: boolean;

  choices: Answer[];
}
