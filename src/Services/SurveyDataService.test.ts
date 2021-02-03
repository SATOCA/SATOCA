import { SurveyDataService } from "./SurveyDataService";

test("Survey is returned", () => {
  let surveyDataService = new SurveyDataService();

  const serviceData = surveyDataService.getSurveyFromMock();

  expect(serviceData.items.length).toBe(3);
  expect(serviceData.items[0].answerOptions.length).toBe(4);
  expect(serviceData.items[1].answerOptions.length).toBe(6);
  expect(serviceData.items[2].answerOptions.length).toBe(4);
});
