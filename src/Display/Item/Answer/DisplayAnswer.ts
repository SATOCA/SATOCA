import { Item } from "../../../DataModel/Item";
import { DisplayCheckboxButtons } from "./DisplayCheckboxButtons";
import { DisplayRadioButtons } from "./DisplayRadioButtons";

type DisplayAnswerProps = {
  item: Item;
};

export function DisplayAnswer(props: DisplayAnswerProps) {
  if (props.item.isMultiResponse) {
    return DisplayCheckboxButtons(props.item.answerOptions);
  } else {
    return DisplayRadioButtons(props.item.answerOptions);
  }
}
