import React, { ChangeEvent } from "react";
import { Col, Form, FormGroup, Input, Label } from "reactstrap";
import { Item } from "../../../../DataModel/Item";

type DisplayRadioBtnProps = {
  item: Item;
  onSelectionChange: (value: number) => void;
  rSelected: Array<number>;
};

export default class DisplayRadioButtons extends React.Component<
  DisplayRadioBtnProps,
  {}
> {
  constructor(props: DisplayRadioBtnProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  // for button type radios
  /* handleChange = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      this.props.onSelectionChange(parseInt(e.currentTarget.value));
    }; */

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onSelectionChange(parseInt(event.currentTarget.value, 10));
  };

  render() {
    return (
      <Form className="Answer-Options">
        <FormGroup data-testid="radioOptions">
          <Col sm={10}>
            {this.props.item.answerOptions.map((answer) => (
              <FormGroup check key={answer.id}>
                <Input
                  data-testid={answer.id.toString()}
                  type="radio"
                  name={this.props.item.question.text}
                  id={answer.id.toString()}
                  onChange={this.handleChange}
                  checked={this.props.rSelected[0] === answer.id}
                  value={answer.id}
                />
                <Label check for={answer.id.toString()}>
                  {answer.text}
                </Label>
              </FormGroup>
            ))}
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

// button type radios
/*
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

 */
