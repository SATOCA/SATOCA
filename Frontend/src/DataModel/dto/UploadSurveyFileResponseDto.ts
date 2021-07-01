import {ErrorDto} from "./ErrorDto";

export interface UploadSurveyFileResponseDto {
    links: Array<string>;
    error: ErrorDto;
}