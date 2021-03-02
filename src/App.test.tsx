import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

test("render application name", () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const appName = getByText(
    /Secure Adaptive Testing for Organized Capability Assessment/i
  );
  expect(appName).toBeInTheDocument();
});

test("render application with route /42/3", () => {
  const { getByText, getByTestId } = render(
    <MemoryRouter initialEntries={["/42/3"]}>
      <App />
    </MemoryRouter>
  );

  const appName = getByText(
    /Secure Adaptive Testing for Organized Capability Assessment/i
  );
  expect(appName).toBeInTheDocument();

  const surveyId = getByTestId("header");
  expect(surveyId).toBeInTheDocument();
  expect(surveyId).toHaveTextContent("Survey with id: 42");

  const uniqueSurveyId = getByTestId("header2");
  expect(uniqueSurveyId).toBeInTheDocument();
  expect(uniqueSurveyId).toHaveTextContent("Unique Survey with id: 3");
});
