import {ErrorDto} from "../DataModel/dto/ErrorDto";
import axios, {AxiosPromise, AxiosResponse} from "axios";
import {CurrentQuestionResponseDto} from "../DataModel/dto/CurrentQuestionResponseDto";
import {Question} from "../DataModel/Item";

type surveyIdTuple = {
  surveyId: string;
  uniqueSurveyId: string;
};

export default function validateSurveyId(
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
export async function getCurrentQuestion(
    surveyID: string,
    uniqueSurveyID: string
): Promise<AxiosResponse<CurrentQuestionResponseDto>> {

  let question:Question | ErrorDto;

  let url = "https://83faa2e4-c29e-47ba-870b-abb1027fbf12.mock.pstmn.io/api/Survey/"+surveyID+"/"+uniqueSurveyID;
  return await axios.get<CurrentQuestionResponseDto>(url);
//       .then(response=>{
//     console.log("success");
//
//     let data = response.data;
//
//     if(data.item !== null)
//       question = data.item;
//     else
//       question = {
//         hasError: true,
//         message: "not found"
//       }
//   })
// return question;
}