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
  const finishedMessage = screen.getByText(/Front Page/i);
  expect(finishedMessage).toBeInTheDocument();
});
