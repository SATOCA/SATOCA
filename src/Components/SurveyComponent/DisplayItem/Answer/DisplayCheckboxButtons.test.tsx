import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DisplayCheckboxButtons from "./DisplayCheckboxButtons";
import { getSurveyFromMock } from "../../../../Services/SurveyDataService";

const survey = getSurveyFromMock();
const handleChange = jest.fn();

test("render a checkboxButton", () => {
  const { getByTestId } = render(
    <DisplayCheckboxButtons
      item={survey.items[1]}
      onSelectionChange={handleChange}
      cSelected={[]}
    />
  );

  const checkboxes = getByTestId("checkOptions");
  expect(checkboxes).toBeInTheDocument();
});

test("checkboxes handle change", () => {
  const { getByTestId } = render(
    <DisplayCheckboxButtons
      item={survey.items[1]}
      onSelectionChange={handleChange}
      cSelected={[]}
    />
  );

  const checkbox = getByTestId("5") as HTMLInputElement; // possible stings (answer IDs of item[1]) => 4,5,6,7,8,9
  expect(checkbox).not.toBeChecked();
  fireEvent.click(checkbox);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

test("checkboxes checked", () => {
  const { getByTestId } = render(
    <DisplayCheckboxButtons
      item={survey.items[1]}
      onSelectionChange={handleChange}
      cSelected={[5, 8, 7]} // possible stings (answer IDs of item[1]) => 4,5,6,7,8,9
    />
  );
  const checkbox4 = getByTestId("4") as HTMLInputElement;
  const checkbox5 = getByTestId("5") as HTMLInputElement;
  const checkbox8 = getByTestId("8") as HTMLInputElement;
  const checkbox9 = getByTestId("9") as HTMLInputElement;
  expect(checkbox4).not.toBeChecked();
  expect(checkbox5).toBeChecked();
  expect(checkbox8).toBeChecked();
  expect(checkbox9).not.toBeChecked();
});
