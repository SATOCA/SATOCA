import React from "react";
import { Button } from "reactstrap";
import { useHistory } from "react-router-dom";

type Props = {
  text: string;
  onClick: Function;
  children: string;
};

export default function StartButton(props: Props) {
  let history = useHistory();
  const { text, onClick } = props;

  let onClickInternal = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick(e);
    history.push("/test-survey/" + text);
  };

  return (
    <Button variant="success" size="lg" onClick={(e) => onClickInternal(e)}>
      {props.children}
    </Button>
  );
}
