import React from "react";
import "./Frontpage.css";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";

export default function Frontpage() {
  const history = useHistory();

  const clickMe = () => {
    history.push("/login");
  };

  return (
    <div className="centered front-page-alignment">
      <Button color="success" size="lg" onClick={() => clickMe()}>
        Trustee Login
      </Button>
    </div>
  );
}
