import { ErrorDto } from "./ErrorDto";
import { Question } from "../../entities/Question";


export interface QuestionResponseDto {
  error: ErrorDto;
  questions: Question[];
}
