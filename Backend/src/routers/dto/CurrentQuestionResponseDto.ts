import { ErrorDto } from "./ErrorDto";
import { Question } from "../../entities/Question";

export interface CurrentQuestionResponseDto {
  error: ErrorDto;
  item: Question | null;
  finished: boolean;
  ability: number;
}
