import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Helppage from "./Helppage";

test("smoke test frontpage", () => {
  render(
    <MemoryRouter>
      <Helppage />
    </MemoryRouter>
  );
  const header = screen.getByText("About Differential privacy");
  expect(header).toBeInTheDocument();  
});
