import { render } from "@testing-library/react";
import React from "react";
import SurveyComponent from "./SurveyComponent";
import { MemoryRouter } from "react-router-dom";

test("render a SurveyComponent", () => {
  const { getByTestId } = render(
    <MemoryRouter>
      <SurveyComponent surveyId="init-survey" uniqueSurveyId="42-3-4" />
    </MemoryRouter>
  );

  const item = getByTestId("item");
  expect(item).toBeInTheDocument();
});
