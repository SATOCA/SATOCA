import { Survey } from "../DataModel/Survey";

class SurveyDataService {
  getSurveyFromMock(): Survey {
    return {
      items: [
        {
          question: { text: "Why would a hacker use a proxy server?" },
          answerOptions: [
            {
              id: 0,
              text: "To create a stronger connection with the target.",
            },
            {
              id: 1,
              text: "To create a ghost server on the network.",
            },
            {
              id: 2,
              text: "To obtain a remote access connection.",
            },
            {
              //correct
              id: 3,
              text: "To hide malicious activity on the network.",
            },
          ],
          isMultiResponse: false,
        },
        {
          question: {
            text:
              "Which of the following integers are multiples of both 2 and 3?",
          },
          answerOptions: [
            { id: 4, text: "8" },
            { id: 5, text: "9" },
            { id: 6, text: "12" }, //correct
            { id: 7, text: "18" }, //correct
            { id: 8, text: "21" },
            { id: 9, text: "36" }, //correct
          ],
          isMultiResponse: true,
        },
        {
          question: {
            text:
              "Each employee of a certain company is in either Department X or Department Y, and there are more than twice as many employees in Department X as in Department Y. The average (arithmetic mean) salary is $25,000 for the employees in Department X and $35,000 for the employees in Department Y. Which of the following amounts could be the average salary for all of the employees of the company?",
          },
          answerOptions: [
            { id: 10, text: "$28.000" }, //correct
            { id: 11, text: "$30.000" },
            { id: 12, text: "$25.000" },
            { id: 13, text: "$40.000" },
          ],
          isMultiResponse: false,
        },
      ],
    };
  }
}

// allows simpler access to the data and easyer usage in initialization code
export function getSurveyFromMock()
{
  const surveyDataService = new SurveyDataService();
  return surveyDataService.getSurveyFromMock();
}

export { SurveyDataService };
