import { render } from "@testing-library/react";
import { SurveyComponent } from "./SurveyComponent";

test("render a SurveyComponent", () => {
    const handler = jest.fn();
    const { getByLabelText, getByRole } = render(<SurveyComponent id={2} />);

    const head = getByRole("header");
    expect(head).toHaveTextContent("Survey with id: 2");

    const finishedState = getByRole("finished");
    expect(finishedState).toHaveTextContent("no");

    const question = getByRole("question");
    expect(question).toBeInTheDocument();
});
