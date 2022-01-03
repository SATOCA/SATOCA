import { CurrentQuestionResponseDto } from "../DataModel/dto/CurrentQuestionResponseDto";
import HttpClient from "./HttpClient";
import { AnswerSurveyDto } from "../DataModel/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../DataModel/dto/AnswerSurveyResponseDto";
import { AxiosResponse } from "axios";
import { TrusteeLoginDto } from "../DataModel/dto/TrusteeLoginDto";
import { TrusteeLoginResponseDto } from "../DataModel/dto/TrusteeLoginResponseDto";
import { UploadSurveyFileResponseDto } from "../DataModel/dto/UploadSurveyFileResponseDto";
import { CreateReportResponseDto } from "../DataModel/dto/CreateReportResponseDto";
import { CreateReportDto } from "../DataModel/dto/CreateReportDto";
import { SurveyResponseDto } from "../DataModel/dto/SurveyResponseDto";
import { TrusteeDto } from "../DataModel/dto/TrusteeDto";

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
      `/Survey/${surveyID}/${uniqueSurveyID}`
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

  public createReport = async (
    login: string,
    password: string,
    surveyId: number,
    privacyBudget: number
  ): Promise<CreateReportResponseDto[]> => {
    const createReportDto: CreateReportDto = {
      login,
      password,
      surveyId,
      privacyBudget,
    };

    return await this.instance.post("/Survey/create-report", createReportDto);
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
}
