import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("render application name", () => {
  render(<App />);
  const appName = screen.getByText(
    /Secure Adaptive Testing for Organized Capability Assessment/i
  );
  expect(appName).toBeInTheDocument();
});
