import { Answer } from "../../../../DataModel/Answer";
import React, { MouseEvent } from "react";
import { Button, ButtonGroup } from "reactstrap";

type DisplayRadioBtnProps = {
  answerOptions: Answer[];
  onSelectionChange: (value: number) => void;
  rSelected: Array<number>;
};

export class DisplayRadioButtons extends React.Component<
  DisplayRadioBtnProps,
  {}
> {
  constructor(props: DisplayRadioBtnProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    this.props.onSelectionChange(parseInt(e.currentTarget.value));
  };

  render() {
    return (
      <div className="Answer-Options">
        <ButtonGroup vertical>
          {this.props.answerOptions.map((answer) => (
            <Button
              key={answer.id}
              color="primary"
              onClick={this.handleChange}
              active={this.props.rSelected[0] === answer.id}
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
