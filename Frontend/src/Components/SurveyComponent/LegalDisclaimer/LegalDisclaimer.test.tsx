import React from "react";
import { render, screen } from "@testing-library/react";
import LegalDisclaimer from "./LegalDisclaimer";

test("renders without crashing", () => {
  render(<LegalDisclaimer surveyId={"1"}/>);
  const finishedMessage = screen.getByText(/Legal Disclamer/i);
  expect(finishedMessage).toBeInTheDocument();
});
