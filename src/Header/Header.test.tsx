import { render } from "@testing-library/react";
import { Header } from "./Header";

test("render a SurveyComponent", () => {
  const { getByTestId } = render(<Header />);

  const head = getByTestId("navbar");
  expect(head).toBeInTheDocument();

  const question = getByTestId("navbarBrand");
  expect(question).toHaveTextContent(
    "Secure Adaptive Testing for Organized Capability Assessment"
  );
});
