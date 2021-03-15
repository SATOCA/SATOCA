import { render } from "@testing-library/react";
import React from "react";
import { SurveyComponent } from "./SurveyComponent";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

test("render a SurveyComponent", () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <SurveyComponent surveyId="init-survey" uniqueSurveyId="42-3-4" />
    </MemoryRouter>
  );

  const head = getByTestId("header");
  expect(head).toHaveTextContent("Survey with id: init-survey");

  const head2 = getByTestId("header2");
  expect(head2).toHaveTextContent("Unique Survey with id: 42-3-4");

  const question = getByTestId("question");
  expect(question).toBeInTheDocument();
});
