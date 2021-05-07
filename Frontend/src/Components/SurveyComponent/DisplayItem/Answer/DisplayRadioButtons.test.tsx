import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DisplayRadioButtons from "./DisplayRadioButtons";
import { getSurveyFromMock } from "../../../../Services/SurveyDataService";

const survey = getSurveyFromMock();
const handleChange = jest.fn();

test("render a radioButton", () => {
  const { getByTestId } = render(
    <DisplayRadioButtons
      item={survey.items[0]}
      onSelectionChange={handleChange}
      rSelected={[]}
    />
  );

  const radios = getByTestId("radioOptions");
  expect(radios).toBeInTheDocument();
});

test("radios handle change", () => {
  const { getByTestId } = render(
    <DisplayRadioButtons
      item={survey.items[0]}
      onSelectionChange={handleChange}
      rSelected={[]}
    />
  );

  const radio = getByTestId("3") as HTMLInputElement; // possible stings (answer IDs of item[0]) => 0,1,2,3
  expect(radio).not.toBeChecked();
  fireEvent.click(radio);
  expect(handleChange).toHaveBeenCalledTimes(1);
});

test("radios checked", () => {
  const { getByTestId } = render(
    <DisplayRadioButtons
      item={survey.items[0]}
      onSelectionChange={handleChange}
      rSelected={[3]} // possible stings (answer IDs of item[0]) => 0,1,2,3
    />
  );
  const radio0 = getByTestId("0") as HTMLInputElement;
  const radio3 = getByTestId("3") as HTMLInputElement;
  expect(radio0).not.toBeChecked();
  expect(radio3).toBeChecked();
});
