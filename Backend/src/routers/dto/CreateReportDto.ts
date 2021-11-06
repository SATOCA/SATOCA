import { TrusteeDto } from "./TrusteeDto";

export interface CreateReportDto extends TrusteeDto {
  surveyId: number;
  privacyBudget: number;
}
