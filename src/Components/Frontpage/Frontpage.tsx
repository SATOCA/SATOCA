import React from "react";
import "./Frontpage.css";
import StartButton from "./StartButton";

export default function Frontpage() {
  const clickMe = () => {
    console.log("Survey Started");
  };

  return (
    <div className="centered front-page-alignment">
      <StartButton onClick={clickMe} text="42">Exemplary Survey</StartButton>
    </div>
  );
}
