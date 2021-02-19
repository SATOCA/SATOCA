import { Answer } from "../../../DataModel/Answer";
import React from "react";
import { Button, ButtonGroup } from "reactstrap";

export function DisplayRadioButtons(answerOptions: Answer[]) {
  const [rSelected, setRSelected] = React.useState<number | null>(null);

  return (
    <div className="Answer-Options">
      <h5>Radio Buttons</h5>
      <ButtonGroup vertical>
        {answerOptions.map((answer) => (
          <Button
            color="primary"
            onClick={() => setRSelected(answer.id)}
            active={rSelected === answer.id}
          >
            {answer.text}
          </Button>
        ))}
      </ButtonGroup>
      <p>Selected: {rSelected}</p>
    </div>
  );
}
