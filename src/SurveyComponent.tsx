import React, { useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { getSurveyFromMock } from "./Services/SurveyDataService";
import { DisplayItem } from "./Display/Item/DisplayItem";

function setupSurvey() {
  const survey = getSurveyFromMock();
  //! \todo implement logic. for now it is a random shuffle
  survey.items.sort(() => Math.random() - 0.5);
  return survey.items;
}

type SurveyComponentProps = {
  surveyId: string;
  uniqueSurveyId: string;
}

export interface RouterSurveyComponentProps
  extends RouteComponentProps<SurveyComponentProps> {}

export function SurveyComponent(props: SurveyComponentProps) {
  //! \todo should have no items data -> items: {}
  const [items, setItems] = useState(setupSurvey());
  let history = useHistory();

  let nextQuestion = () => {
//let nextQuestion = (response: Array<number>) => {
//    console.log("reponse: ", response);
//    //! \todo store response from user. possible to map with item(id) or concat all answer.id's
    if (items.length > 1) {
      //! \todo implement logic to select next item. for now the first item will be poped.
      setItems(items.slice(1, items.length));
    } else {
      history.push("/survey-end");
    }
  };

  return (
    <div>
      <h3 data-testid="header">Survey with id: {props.surveyId}</h3>
      <h3 data-testid="header2">
        Unique Survey with id: {props.uniqueSurveyId}
      </h3>
      <span data-testid="question">
        <DisplayItem item={items[0]} onAnswerSubmit={nextQuestion} />
      </span>
    </div>
  );
}


