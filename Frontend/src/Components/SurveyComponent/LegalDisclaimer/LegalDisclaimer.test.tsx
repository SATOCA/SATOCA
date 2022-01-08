import React from "react";
import { render, screen } from "@testing-library/react";
import LegalDisclaimer from "./LegalDisclaimer";

test("renders without crashing", () => {
  render(<LegalDisclaimer surveyId={"1"}  participantId={"1"} />);
  const checkBoxLabel = screen.getByText(/Accept legal disclaimer/i);
  expect(checkBoxLabel).toBeInTheDocument();

  const startButton = screen.getByText(/Start Survey/i);
  expect(startButton).toBeInTheDocument();
});
