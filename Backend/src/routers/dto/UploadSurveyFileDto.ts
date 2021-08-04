import {TrusteeDto} from "./TrusteeDto";

export interface UploadSurveyFileDto extends TrusteeDto{
    login: string;
    pwd: string;
}
