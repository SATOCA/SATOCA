import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

test("render application name", () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const appName = getByText(
    /Secure Adaptive Testing for Organizational Capability Assessment/i
  );
  expect(appName).toBeInTheDocument();
});

test("render application with route /init-survey/42-3-4", () => {
  const { getByText, getByTestId } = render(
    <MemoryRouter initialEntries={["/init-survey/42-3-4"]}>
      <App />
    </MemoryRouter>
  );

  const appName = getByText(
    /Secure Adaptive Testing for Organizational Capability Assessment/i
  );
  expect(appName).toBeInTheDocument();
});
