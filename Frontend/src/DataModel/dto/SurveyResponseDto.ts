import { ErrorDto } from "./ErrorDto";

export interface SurveyResponseDto {
  surveys: SurveyInfo[];
  error: ErrorDto;
}

export interface SurveyInfo {
  id: number;
  title: string;
  itemSeverityBoundary: number;
  privacyBudget: number;
}
