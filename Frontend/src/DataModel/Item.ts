import { Answer } from "./Answer";

export interface Question {
  id: number;

  text: string;

  multiResponse: boolean;

  choices: Answer[];
}
