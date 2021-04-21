import { SubmitAnswerService } from "./SubmitAnswerService";
import { getSurveyFromMock } from "./SurveyDataService";

const survey = getSurveyFromMock();
const submittedOptions: Array<number> = [9, 6, 7];

test("submitted answer is saved", () => {
  SubmitAnswerService.saveSubmittedAnswer(survey.items[1], submittedOptions);

  expect(localStorage).toHaveLength(1);
  expect(localStorage.getItem(localStorage.key(0) as string)).toContain(
    submittedOptions
  );
});

test("saved answer is logged to console", () => {
  const consoleLogSpy = jest.spyOn(console, "log");
  SubmitAnswerService.showSavedAnswers();

  expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  expect(consoleLogSpy).toHaveBeenCalledWith(
    "Saved all: ",
    survey.items[1].question.text,
    submittedOptions.toString()
  );
});
