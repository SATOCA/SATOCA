import { render } from "@testing-library/react";
import { SurveyComponent } from "./SurveyComponent";

test("render a SurveyComponent", () => {
  const { getByTestId, getByRole } = render(<SurveyComponent id={2} />);

  const head = getByTestId("header");
  expect(head).toHaveTextContent("Survey with id: 2");

  const question = getByTestId("question");
  expect(question).toBeInTheDocument();
});
