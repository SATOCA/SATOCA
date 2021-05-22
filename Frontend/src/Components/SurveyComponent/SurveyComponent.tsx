import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { getSurveyFromMock } from "../../Services/SurveyDataService";
import { DisplayItem } from "./DisplayItem/DisplayItem";
import SurveyFinished from "./SurveyFinished/SurveyFinished";
import { getCurrentQuestion } from "../../Services/SurveyAPI";
import { Container, Spinner } from "reactstrap";
import { Question } from "../../DataModel/Item";

function setupSurvey() {
  const survey = getSurveyFromMock();
  // ! \todo implement logic. for now it is a random shuffle
  survey.items.sort(() => Math.random() - 0.5);
  return survey.items;
}

type SurveyComponentProps = {
  surveyId: string;
  uniqueSurveyId: string;
};

export interface RouterSurveyComponentProps
  extends RouteComponentProps<SurveyComponentProps> { }

export default function SurveyComponent(props: SurveyComponentProps) {
  const history = useHistory();
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [surveyEnded, setSurveyEnded] = useState(false);

  useEffect(() => {
    getCurrentQuestion(props.surveyId, props.uniqueSurveyId).then(response => {
      let currentQuestion = response.data.item;
      if (currentQuestion !== null)
        setCurrentQuestion(currentQuestion);
    }).catch(() => {
      history.push("/404");
    }).then(() => {
      setIsLoading(false);
    })
  }, []);

  const submit = () => {
    // todo

    setSurveyEnded(false);
  };

  if (isLoading)
    return (
      <Container className="glass-card-content" fluid="lg">
        <Spinner animation="border" role="status" />
      </Container>
    );

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
        {currentQuestion !== undefined ? <DisplayItem question={currentQuestion} onAnswerSubmit={submit} /> : <div />}
      </span>
    </Container>
  );
}
