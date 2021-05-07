import React from "react";
import { showSavedAnswers } from "../../../Services/SubmitAnswerService";

function SurveyFinished() {
  showSavedAnswers();
  return (
    <div className="centered glass-card-content-min-height">
      <h1>Survey Finished</h1>
    </div>
  );
}

export default SurveyFinished;
