import React from "react";
import { showSavedAnswers } from "../../../Services/SubmitAnswerService";

function SurveyFinished() {
  showSavedAnswers();
  return <div>Survey Finished</div>;
}

export default SurveyFinished;
