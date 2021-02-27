import { render } from "@testing-library/react";
import React from "react";
import { SurveyComponent } from "./SurveyComponent";

test("render a SurveyComponent", () => {
  const { getByTestId } = render(
    <SurveyComponent surveyId="3" uniqueSurveyId="4" />
  );

  const head = getByTestId("header");
  expect(head).toHaveTextContent("Survey with id: 3");

  const head2 = getByTestId("header2");
  expect(head2).toHaveTextContent("Unique Survey with id: 4");

  const question = getByTestId("question");
  expect(question).toBeInTheDocument();
});
