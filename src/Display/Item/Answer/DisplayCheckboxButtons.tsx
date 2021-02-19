import { Answer } from "../../../DataModel/Answer";
import React from "react";
import { Button, ButtonGroup } from "reactstrap";

export function DisplayCheckboxButtons(answerOptions: Answer[]) {
  const [cSelected, setCSelected] = React.useState<Array<number>>([]);

  const onCheckboxBtnClick = (selected: number) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  };

  return (
    <div className="Answer-Options">
      <h5>Checkbox Buttons</h5>
      <ButtonGroup>
        {answerOptions.map((answer) => (
          <Button
            color="primary"
            onClick={() => onCheckboxBtnClick(answer.id)}
            active={cSelected.includes(answer.id)}
          >
            {answer.text}
          </Button>
        ))}
      </ButtonGroup>
      <p>Selected: {JSON.stringify(cSelected)}</p>
    </div>
  );
}
