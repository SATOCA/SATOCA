import { ErrorDto } from "./ErrorDto";
import { Survey } from "../../entities/Survey";


export interface SurveyResponseDto {
  error: ErrorDto;
  surveys: Survey[];
}
