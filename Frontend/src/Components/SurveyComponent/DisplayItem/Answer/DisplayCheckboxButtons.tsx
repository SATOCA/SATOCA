import React, { ChangeEvent } from "react";
import { Col, Form, FormGroup, Input, Label } from "reactstrap";
import { Item } from "../../../../DataModel/Item";

type DisplayCheckboxBtnProps = {
  item: Item;
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

  // for button type checkboxes
  /*handleChange = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      this.props.onSelectionChange(parseInt(e.currentTarget.value));
    };*/

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onSelectionChange(parseInt(e.currentTarget.value));
  };

  render() {
    return (
      <Form className="Answer-Options">
        <FormGroup>
          <Col sm={10}>
            {this.props.item.answerOptions.map((answer, i) => (
              <FormGroup check key={i}>
                <Input
                  type="checkbox"
                  id={answer.id.toString()}
                  name={this.props.item.question.text}
                  onChange={this.handleChange}
                  checked={this.props.cSelected.includes(answer.id)}
                  value={answer.id}
                />
                <Label check>{answer.text}</Label>
              </FormGroup>
            ))}
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

// button type checkboxes
/*
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
 */
