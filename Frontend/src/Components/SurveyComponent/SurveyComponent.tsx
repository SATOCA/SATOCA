import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { DisplayItem } from "./DisplayItem/DisplayItem";
import SurveyFinished from "./SurveyFinished/SurveyFinished";
import SurveyApi from "../../Services/SurveyAPI";
import { Button, Container, Row } from "reactstrap";
import { Question } from "../../DataModel/Item";
import { AxiosError } from "axios";

type SurveyComponentProps = {
  surveyId: string;
  uniqueSurveyId: string;
};

export interface RouterSurveyComponentProps
  extends RouteComponentProps<SurveyComponentProps> {}

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
    setHasError(false);
    setErrorMessage("");

    surveyApi
      .getCurrentQuestion(props.surveyId, props.uniqueSurveyId)
      .then(async (axiosResponse) => {
        const response = await axiosResponse;
        if (response.error?.hasError) {
          setHasError(true);
          setErrorMessage(response.error.message);

          return;
        }

        const responseQuestion = response.item;

        console.log("current ability: ", (await response).ability);
        setSurveyEnded((await response).finished);
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
      .then(async (axiosResponse) => {
        const response = await axiosResponse;
        if (response.error?.hasError) {
          setHasError(true);
          setErrorMessage(response.error.message);

          return;
        }

        updateCurrentItem();
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });

    setSurveyEnded(false);
  };

  const onLoadCurrentQuestionClick = () => {
    updateCurrentItem();
  };

  const getContent = () => {
    if (surveyEnded) return <SurveyFinished />;
    if (isLoading) return <div>loading...</div>;
    if (hasError)
      return (
        <Container>
          <Row>{errorMessage}</Row>
          <Row>
            <Button onClick={onLoadCurrentQuestionClick}>
              Load current question
            </Button>
          </Row>
        </Container>
      );
    if (currentQuestion === undefined) return <div>no data</div>;

    return <DisplayItem question={currentQuestion} onAnswerSubmit={submit} />;
  };

  return (
    <Container className="glass-card-content" fluid="lg">
      <span data-testid="item">{getContent()}</span>
    </Container>
  );
}
