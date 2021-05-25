import { SurveyDataService, getSurveyFromMock } from "./SurveyDataService";

test("Survey is returned", () => {
  const serviceData = SurveyDataService.getSurveyFromMock();

  expect(serviceData.items.length).toBe(3);
  expect(serviceData.items[0].choices.length).toBe(4);
  expect(serviceData.items[1].choices.length).toBe(6);
  expect(serviceData.items[2].choices.length).toBe(4);
});

test("test access to mockdata via wrapper function", () => {
  const survey = getSurveyFromMock();

  expect(survey.items.length).toBe(3);
  expect(survey.items[0].choices.length).toBe(4);
  expect(survey.items[1].choices.length).toBe(6);
  expect(survey.items[2].choices.length).toBe(4);
});
