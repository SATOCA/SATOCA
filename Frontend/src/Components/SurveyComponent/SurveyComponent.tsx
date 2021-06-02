import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { DisplayItem } from "./DisplayItem/DisplayItem";
import SurveyFinished from "./SurveyFinished/SurveyFinished";
import SurveyApi from "../../Services/SurveyAPI";
import { Container } from "reactstrap";
import { Question } from "../../DataModel/Item";
import { AxiosError } from "axios";

type SurveyComponentProps = {
  surveyId: string;
  uniqueSurveyId: string;
};

export interface RouterSurveyComponentProps
  extends RouteComponentProps<SurveyComponentProps> { }

export default function SurveyComponent(props: SurveyComponentProps) {
  const history = useHistory();
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [surveyEnded, setSurveyEnded] = useState(false);

  const surveyApi = SurveyApi.getInstance();

  const updateCurrentItem = useCallback(() => {
    setIsLoading(true);
    surveyApi
      .getCurrentQuestion(props.surveyId, props.uniqueSurveyId)
      .then(async (response) => {
        const responseQuestion = (await response).item;
        if (responseQuestion !== null) setCurrentQuestion(responseQuestion);
      })
      .catch((error: AxiosError) => {
        if (error.code === "404") history.push("/404");
        else {
          setHasError(true);
          setErrorMessage(error.message);
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [history, props.surveyId, props.uniqueSurveyId, surveyApi]);

  useEffect(() => {
    updateCurrentItem();
  }, [props.surveyId, props.uniqueSurveyId, updateCurrentItem]);

  const submit = (question: Question, selectedOptions: Array<number>) => {
    const answers = question.choices.filter((answer) =>
      selectedOptions.includes(answer.id)
    );

    const answerDto = {
      itemId: question.id,
      answers,
    };

    surveyApi
      .submitAnswer(props.surveyId, props.uniqueSurveyId, answerDto)
      .then(() => updateCurrentItem());

    setSurveyEnded(false);
  };

  const getContent = () => {
    if (isLoading) return <div>loading...</div>;
    if (hasError) return <div>{errorMessage}</div>;
    if (currentQuestion === undefined) return <div>no data</div>;

    return <DisplayItem question={currentQuestion} onAnswerSubmit={submit} />;
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
      <span data-testid="item">{getContent()}</span>
    </Container>
  );
}
