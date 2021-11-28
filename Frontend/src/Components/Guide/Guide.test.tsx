import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Guide from "./Guide";

test("smoke test guide", () => {
  render(
    <MemoryRouter>
      <Guide />
    </MemoryRouter>
  );
  const centerButton = screen.getByText("How to");
  expect(centerButton).toBeInTheDocument();
});
