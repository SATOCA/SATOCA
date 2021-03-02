import React, { MouseEvent } from "react";
import { Item } from "../../DataModel/Item";
import { DisplayCheckboxButtons } from "./Answer/DisplayCheckboxButtons";
import { DisplayRadioButtons } from "./Answer/DisplayRadioButtons";

export type displayItemProps = {
  item: Item;
  onAnswerSubmit: () => void;
};

export type displayItemState = {
  selectedOptions: Array<number>;
};

export class DisplayItem extends React.Component<
  displayItemProps,
  displayItemState
> {
  constructor(props: displayItemProps) {
    super(props);
    this.state = {
      selectedOptions: [],
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  // todo: manage the state of which button(s) are active/select
  handleOptionChange = (changedAnswerID: number) => {
    let selected: Array<number> = this.state.selectedOptions.slice();
    if (this.props.item.isMultiResponse) {
      const index = selected.indexOf(changedAnswerID);
      if (index < 0) {
        selected.push(changedAnswerID);
      } else {
        selected.splice(index, 1);
      }
    } else {
      selected = [];
      selected.push(changedAnswerID);
    }
    this.setState({ selectedOptions: [...selected] });
  };

  handleFormSubmit = (
    submitEvent: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    submitEvent.preventDefault();
    console.log("You have submitted: ", this.state.selectedOptions);
    // todo: make it work!
    alert("You have submitted: " + this.state.selectedOptions.toString());
    this.setState({ selectedOptions: [] });
    this.props.onAnswerSubmit();
  };

  chooseButtonType = () => {
    if (this.props.item.isMultiResponse) {
      return (
        <DisplayCheckboxButtons
          answerOptions={this.props.item.answerOptions}
          onSelectionChange={this.handleOptionChange}
          cSelected={this.state.selectedOptions}
        />
      );
    } else {
      return (
        <DisplayRadioButtons
          answerOptions={this.props.item.answerOptions}
          onSelectionChange={this.handleOptionChange}
          rSelected={this.state.selectedOptions}
        />
      );
    }
  };

  render() {
    return (
      <div>
        <div className="question">
          <h5>{this.props.item.question.text}</h5>
        </div>
        {this.chooseButtonType()}
        <p>Selected: {this.state.selectedOptions.toString()}</p>
        <div className="submitButton">
          <button
            className="btn btn-primary mt-2"
            type="submit"
            onClick={this.handleFormSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}
