import React from "react";
import { render, screen } from "@testing-library/react";
import SurveyFinished from "./SurveyFinished";

test("render application name", () => {
  render(<SurveyFinished />);
  const finishedMessage = screen.getByText("Survey Finished");
  expect(finishedMessage).toBeInTheDocument();
});
