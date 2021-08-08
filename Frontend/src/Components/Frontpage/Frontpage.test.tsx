import React from "react";
import { render, screen } from "@testing-library/react";
import Frontpage from "./Frontpage";
import { MemoryRouter } from "react-router-dom";

test("smoke test frontpage", () => {
  render(
    <MemoryRouter>
      <Frontpage />
    </MemoryRouter>
  );
  const centerButton = screen.getByText(/Trustee Login/i);
  expect(centerButton).toBeInTheDocument();
});
