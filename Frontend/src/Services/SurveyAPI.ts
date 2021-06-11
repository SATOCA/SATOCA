import { CurrentQuestionResponseDto } from "../DataModel/dto/CurrentQuestionResponseDto";
import HttpClient from "./HttpClient";
import { AnswerSurveyDto } from "../DataModel/dto/AnswerSurveyDto";
import { AnswerSurveyResponseDto } from "../DataModel/dto/AnswerSurveyResponseDto";
import { AxiosResponse } from "axios";

type surveyIdTuple = {
  surveyId: string;
  uniqueSurveyId: string;
};

export function validateSurveyId(
  surveyId: string,
  uniqueSurveyId: string
): boolean {
  const validIds: surveyIdTuple[] = [
    { surveyId: "init-survey", uniqueSurveyId: "42-3-4" },
    { surveyId: "init-survey", uniqueSurveyId: "äasdökfökg" },
    { surveyId: "init-survey", uniqueSurveyId: "3456789-astÄ" },
    { surveyId: "test-survey", uniqueSurveyId: "79685421" },
    { surveyId: "test-survey", uniqueSurveyId: "123545" },
    { surveyId: "test-survey", uniqueSurveyId: "42" },
    { surveyId: "surveyfoo", uniqueSurveyId: "bar" },
    { surveyId: "surveyfoo", uniqueSurveyId: "foobar" },
  ];

  return validIds.some(
    (tuple) =>
      tuple.surveyId === surveyId && tuple.uniqueSurveyId === uniqueSurveyId
  );
}

// s. https://levelup.gitconnected.com/enhance-your-http-request-with-axios-and-typescript-f52a6c6c2c8e
export default class SurveyApi extends HttpClient {
  private static classInstance?: SurveyApi;

  private constructor() {
    super("http://localhost:5000/api");
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

  public uploadSurveyFile = async (file: File): Promise<AxiosResponse> => {
    const data = new FormData();
    data.append("file", file);

    await this.instance.post("/Survey", data);
  };
}
