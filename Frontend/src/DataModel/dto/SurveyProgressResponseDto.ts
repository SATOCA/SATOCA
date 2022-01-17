import { ErrorDto } from "./ErrorDto";

export interface SurveyProgressResponseDto {
  progress: SurveyProgress;
  error: ErrorDto;
}
export interface SurveyProgress {
  finished: number;
  total: number;
}
