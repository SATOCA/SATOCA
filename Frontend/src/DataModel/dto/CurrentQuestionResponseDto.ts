import { ErrorDto } from "./ErrorDto";
import { Question } from "../Item";

export interface CurrentQuestionResponseDto {
  error: ErrorDto | null;
  item: Question | null;
  finished: boolean;
}
