import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { getSurveyFromMock } from "../../../Services/SurveyDataService";
import { DisplayItem } from "./DisplayItem";

const survey = getSurveyFromMock();
const handleSubmit = jest.fn();

test("render an item", () => {
  const { getByTestId } = render(
    <DisplayItem item={survey.items[0]} onAnswerSubmit={handleSubmit} />
  );

  const question = getByTestId("question");
  const answer = getByTestId("answer");
  const submitBtn = getByTestId("submitButton");
  expect(question).toBeInTheDocument();
  expect(answer).toBeInTheDocument();
  expect(submitBtn).toBeInTheDocument();
});

test("choose correct button type (radio)", () => {
  const { getByTestId } = render(
    <DisplayItem item={survey.items[0]} onAnswerSubmit={handleSubmit} />
  );

  const radio = getByTestId("radio");
  expect(radio).toBeInTheDocument();
});

test("choose correct button type (checkbox)", () => {
  const { getByTestId } = render(
    <DisplayItem item={survey.items[1]} onAnswerSubmit={handleSubmit} />
  );

  const checkbox = getByTestId("checkbox");
  expect(checkbox).toBeInTheDocument();
});

test("handle option change (radio)", () => {
  const { getByTestId } = render(
    <DisplayItem item={survey.items[0]} onAnswerSubmit={handleSubmit} />
  );

  const spyConsoleLogAnswerChange = jest.spyOn(console, "log");
  const radio2 = getByTestId("2") as HTMLInputElement;
  const radio3 = getByTestId("3") as HTMLInputElement;
  fireEvent.click(radio2);
  expect(
    spyConsoleLogAnswerChange
  ).toHaveBeenCalledWith("You changed your answer to: ", [2]);
  fireEvent.click(radio3);
  expect(
    spyConsoleLogAnswerChange
  ).toHaveBeenCalledWith("You changed your answer to: ", [3]);
  expect(spyConsoleLogAnswerChange).toHaveBeenCalledTimes(2);
});

test("handle option change (checkbox)", () => {
  const { getByTestId } = render(
    <DisplayItem item={survey.items[1]} onAnswerSubmit={handleSubmit} />
  );

  const spyConsoleLogAnswerChange = jest.spyOn(console, "log");
  const checkbox5 = getByTestId("5") as HTMLInputElement;
  const checkbox7 = getByTestId("7") as HTMLInputElement;
  const checkbox8 = getByTestId("8") as HTMLInputElement;
  fireEvent.click(checkbox5);
  expect(
    spyConsoleLogAnswerChange
  ).toHaveBeenCalledWith("You changed your answer to: ", [5]);
  fireEvent.click(checkbox5);
  expect(spyConsoleLogAnswerChange).toHaveBeenCalledWith(
    "You changed your answer to: ",
    []
  );
  fireEvent.click(checkbox7);
  expect(
    spyConsoleLogAnswerChange
  ).toHaveBeenCalledWith("You changed your answer to: ", [7]);
  fireEvent.click(checkbox8);
  expect(
    spyConsoleLogAnswerChange
  ).toHaveBeenCalledWith("You changed your answer to: ", [7, 8]);
  expect(spyConsoleLogAnswerChange).toHaveBeenCalledTimes(4);
});

test("handle form submit", () => {
  const { getByTestId } = render(
    <DisplayItem item={survey.items[1]} onAnswerSubmit={handleSubmit} />
  );

  const checkbox4 = getByTestId("4") as HTMLInputElement;
  const submitBtn = getByTestId("submitButton");
  const consoleLogSpy = jest.spyOn(console, "log");

  expect(submitBtn).toBeDisabled();
  fireEvent.click(checkbox4); // select answer to enable submitBtn
  expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  expect(submitBtn).toBeEnabled();
  fireEvent.click(submitBtn);
  expect(handleSubmit).toHaveBeenCalledTimes(1);
  expect(consoleLogSpy).toHaveBeenCalledTimes(2); // 1. select answer, 2. submit answer
  expect(consoleLogSpy).toHaveBeenCalledWith("You have submitted: ", [4]);
});
