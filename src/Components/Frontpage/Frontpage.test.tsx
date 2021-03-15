import React from "react";
import { render, screen } from "@testing-library/react";
import Frontpage from "./Frontpage";

test("render application name", () => {
    render(<Frontpage />);
    const finishedMessage = screen.getByText(/Front Page/i);
    expect(finishedMessage).toBeInTheDocument();
});
