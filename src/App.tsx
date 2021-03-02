import React from "react";
import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import { RouterSurveyComponentProps, SurveyComponent } from "./SurveyComponent";
import SurveyFinished from "./SurveyFinished/SurveyFinished";
import { Header } from "./Header/Header";

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/survey-end">
          <SurveyFinished />
        </Route>
        <Route exact path="/404">
          <p>404</p>
        </Route>
        <Route
          exact
          path="/:surveyId/:uniqueSurveyId"
          render={({ match }: RouterSurveyComponentProps) => (
            <SurveyComponent
              uniqueSurveyId={match.params.uniqueSurveyId}
              surveyId={match.params.surveyId}
            />
          )}
        />
        <Route exact path="/">
          <h3>home</h3>
        </Route>
        <Redirect to="/404" />
      </Switch>
      <footer className="footer">going live</footer>
    </div>
  );
}

export default App;
