import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { getSurveyFromMock } from "../../Services/SurveyDataService";
import { DisplayItem } from "./DisplayItem/DisplayItem";
import SurveyFinished from "./SurveyFinished/SurveyFinished";
import { validateSurveyId } from "../../Services/SurveyAPI";
import { Container } from "reactstrap";

function setupSurvey() {
  const survey = getSurveyFromMock();
  //! \todo implement logic. for now it is a random shuffle
  survey.items.sort(() => Math.random() - 0.5);
  return survey.items;
}

type SurveyComponentProps = {
  surveyId: string;
  uniqueSurveyId: string;
};

export interface RouterSurveyComponentProps
  extends RouteComponentProps<SurveyComponentProps> {}

export default function SurveyComponent(props: SurveyComponentProps) {
  //! \todo should have no items data -> items: {}
  let history = useHistory();
  const [items, setItems] = useState(setupSurvey());
  const [surveyEnded, setSurveyEnded] = useState(false);

  useEffect(() => {
    if (!validateSurveyId(props.surveyId, props.uniqueSurveyId)) {
      history.push("/404");
    }
  });

  let nextQuestion = () => {
    //let nextQuestion = (response: Array<number>) => {
    //    console.log("reponse: ", response);
    //    //! \todo store response from user. possible to map with item(id) or concat all answer.id's
    if (items.length > 1) {
      //! \todo implement logic to select next item. for now the first item will be poped.
      setItems(items.slice(1, items.length));
      setSurveyEnded(false);
    } else {
      setSurveyEnded(true);
    }
  };

  if (surveyEnded)
    return (
      <Container className="glass-card-content" fluid="lg">
        <SurveyFinished />
      </Container>
    );

  return (
    <Container className="glass-card-content" fluid="lg">
      <h3 data-testid="header">Survey with id: {props.surveyId}</h3>
      <h3 data-testid="header2">
        Unique Survey with id: {props.uniqueSurveyId}
      </h3>
      <span data-testid="item">
        <DisplayItem item={items[0]} onAnswerSubmit={nextQuestion} />
      </span>
    </Container>
  );
}
