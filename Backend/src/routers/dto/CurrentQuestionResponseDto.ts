import { ErrorDto } from "./ErrorDto";
import { Question } from "../../entities/Question";

export interface CurrentQuestionResponseDto {
  error: ErrorDto | null;
  item: Question | null;
}
