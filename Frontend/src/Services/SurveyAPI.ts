import { CurrentQuestionResponseDto } from "../DataModel/dto/CurrentQuestionResponseDto";
import HttpClient from "./HttpClient";
import { AnswerSurveyDto } from "../DataModel/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../DataModel/dto/AnswerSurveyResponseDto";
import { AxiosResponse } from "axios";
import { TrusteeLoginDto } from "../DataModel/dto/TrusteeLoginDto";
import { TrusteeLoginResponseDto } from "../DataModel/dto/TrusteeLoginResponseDto";
import { UploadSurveyFileResponseDto } from "../DataModel/dto/UploadSurveyFileResponseDto";
import { CreateReportResponseDto } from "../DataModel/dto/CreateReportResponseDto";
import { SurveyResponseDto } from "../DataModel/dto/SurveyResponseDto";
import { TrusteeDto } from "../DataModel/dto/TrusteeDto";
import { CloseSurveyResponseDto } from "../../../Backend/src/routers/dto/CloseSurveyResponseDto";
import { CloseSurveyDto } from "../../../Backend/src/routers/dto/CloseSurveyDto";
import { LegalDisclaimerResponseDtoResponseDto } from "../DataModel/dto/LegalDisclaimerResponseDto";
import { SurveyProgressResponseDto } from "../../../Backend/src/routers/dto/SurveyProgressResponseDto";
import { SurveyProgressDto } from "../../../Backend/src/routers/dto/SurveyProgressDto";
import { GetReportDto } from "../DataModel/dto/GetReportDto";

// s. https://levelup.gitconnected.com/enhance-your-http-request-with-axios-and-typescript-f52a6c6c2c8e
export default class SurveyApi extends HttpClient {
  private static classInstance?: SurveyApi;

  private constructor() {
    super(process.env.REACT_APP_BACKEND!);
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new SurveyApi();
    }

    return this.classInstance;
  }

  public getCurrentQuestion = async (
    surveyID: string,
    uniqueSurveyID: string
  ): Promise<AxiosResponse<CurrentQuestionResponseDto>> =>
    await this.instance.get<CurrentQuestionResponseDto>(
      `/Survey/data/${surveyID}/${uniqueSurveyID}`
    );

  public submitAnswer = async (
    surveyID: string,
    uniqueSurveyID: string,
    answer: AnswerSurveyDto
  ): Promise<AxiosResponse<AnswerSurveyResponseDto>> =>
    await this.instance.post<AnswerSurveyResponseDto>(
      `/Survey/${surveyID}/${uniqueSurveyID}`,
      answer
    );

  public uploadSurveyFile = async (
    file: File,
    login: string,
    password: string
  ): Promise<UploadSurveyFileResponseDto> => {
    const data = new FormData();
    data.append("file", file);
    data.append("login", login);
    data.append("password", password);

    return await this.instance.post("/Survey/upload", data);
  };

  public trusteeLogin = async (
    data: TrusteeLoginDto
  ): Promise<AxiosResponse<TrusteeLoginResponseDto>> =>
    await this.instance.post<TrusteeLoginResponseDto>("/trustee/login/", data);

  public getReports = async (
    login: string,
    password: string,
    surveyId: number
  ): Promise<CreateReportResponseDto> => {
    const getReportDto: GetReportDto = {
      login,
      password,
      surveyId,
    };

    return await this.instance.post("/Survey/get-reports", getReportDto);
  };
  public getSurveyProgress = async (
    login: string,
    password: string,
    surveyId: number
  ): Promise<SurveyProgressResponseDto> => {
    const surveyProgressDto: SurveyProgressDto = {
      login,
      password,
      surveyId,
    };

    return await this.instance.post("/Survey/get-progress", surveyProgressDto);
  };

  public getSurveys = async (
    login: string,
    password: string
  ): Promise<SurveyResponseDto> => {
    const createReportDto: TrusteeDto = {
      login,
      password,
    };
    return await this.instance.post<SurveyResponseDto>(
      "/Survey/get-surveys",
      createReportDto
    );
  };

  public closeSurvey = async (
    login: string,
    password: string,
    surveyId: number
  ): Promise<CloseSurveyResponseDto> => {
    const closeSurveyDto: CloseSurveyDto = {
      login,
      password,
      surveyId,
    };
    return await this.instance.post<SurveyResponseDto>(
      "/Survey/close-survey",
      closeSurveyDto
    );
  };

  // eslint-disable-next-line
  public getLegalDisclaimer = async (surveyId: string) => {
    return await this.instance.get<LegalDisclaimerResponseDtoResponseDto>(
      `/survey/disclaimer/${surveyId}`
    );
  };

  // eslint-disable-next-line
  public acceptLegalDisclaimer = async (participantId: string) => {
    return await this.instance.post(
      `/survey/accept-disclaimer/${participantId}`
    );
  };
}
