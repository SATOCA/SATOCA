import { ErrorDto } from "./ErrorDto";

export interface SurveyProgressResponseDto {
  progress: SurveyProgress;
  error: ErrorDto;
}
interface SurveyProgress {
  finished: number;
  total: number;
}
