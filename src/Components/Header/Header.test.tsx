import { render } from "@testing-library/react";
import { Header } from "./Header";
import { BrowserRouter } from "react-router-dom";

test("render a SurveyComponent", () => {
  const { getByTestId } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

  const head = getByTestId("navbar");
  expect(head).toBeInTheDocument();

  const question = getByTestId("navbarBrand");
  expect(question).toHaveTextContent(
    "Secure Adaptive Testing for Organized Capability Assessment"
  );
});