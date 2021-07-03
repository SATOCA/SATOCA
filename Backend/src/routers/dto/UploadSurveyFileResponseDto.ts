import { ErrorDto } from "./ErrorDto";

export interface UploadSurveyFileResponseDto {
  links: string[];
  error: ErrorDto;
}
