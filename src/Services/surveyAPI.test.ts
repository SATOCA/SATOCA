import { validateSurveyId } from "./surveyAPI";

test("valid Survey ID", () => {
  const result = validateSurveyId("init-survey", "äasdökfökg");

  expect(result).toBe(true);
});

test("wrong Survey ID", () => {
  const result = validateSurveyId("wrong", "äasdökfökg");

  expect(result).toBe(false);
});

test("wrong unique Survey ID", () => {
  const result = validateSurveyId("init-survey", "wrong");

  expect(result).toBe(false);
});
