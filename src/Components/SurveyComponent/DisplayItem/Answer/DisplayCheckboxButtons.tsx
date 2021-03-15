import { Answer } from "../../../../DataModel/Answer";
import React, { MouseEvent } from "react";
import { Button, ButtonGroup } from "reactstrap";

type DisplayCheckboxBtnProps = {
  answerOptions: Answer[];
  onSelectionChange: (value: number) => void;
  cSelected: Array<number>;
};

export class DisplayCheckboxButtons extends React.Component<
  DisplayCheckboxBtnProps,
  {}
> {
  constructor(props: DisplayCheckboxBtnProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    this.props.onSelectionChange(parseInt(e.currentTarget.value));
  };

  render() {
    return (
      <div className="Answer-Options">
        <h5>Checkbox Buttons</h5>
        <ButtonGroup>
          {this.props.answerOptions.map((answer) => (
            <Button
              key={answer.id}
              color="primary"
              onClick={this.handleChange}
              active={this.props.cSelected.includes(answer.id)}
              value={answer.id}
            >
              {answer.text}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    );
  }
}
