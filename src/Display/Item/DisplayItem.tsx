import React, { FormEvent } from "react";
import { Item } from "../../DataModel/Item";
import { DisplayAnswer } from "./Answer/DisplayAnswer";

export type displayItemProps = {
  item: Item;
};

export type displayItemState = {
  selectedOption: string;
};

export class DisplayItem extends React.Component<
  displayItemProps,
  displayItemState
> {
  constructor(props: displayItemProps) {
    super(props);
    this.state = {
      selectedOption: "",
    };

    //this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }


  // todo: manage the state of which button(s) are active/select
  /*
    handleOptionChange = (changeEvent: any) => {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    };
*/

  handleFormSubmit = (formSubmitEvent: FormEvent<HTMLFormElement>) => {
    formSubmitEvent.preventDefault();

    console.log("You have submitted: ", this.state.selectedOption);
  };

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="question">
          <h5>{this.props.item.question.text}</h5>
        </div>
          <DisplayAnswer item={this.props.item} />
        <div className="submitButton">
          <button className="btn btn-primary mt-2" type="submit">
            Submit
          </button>
        </div>
      </form>
    );
  }
}
