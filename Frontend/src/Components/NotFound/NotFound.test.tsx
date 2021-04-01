import React from "react";
import { render } from "@testing-library/react";
import NotFound from "./NotFound";

test("render application name", () => {
  const { getByText } = render(<NotFound />);
  const notFoundMessage = getByText(/404/i);
  expect(notFoundMessage).toBeInTheDocument();
});
