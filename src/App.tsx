import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { SurveyComponent } from "./SurveyComponent";
import SurveyFinished from "./SurveyFinished/SurveyFinished";
import { Header } from "./Header/Header";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/survey-end">
          <SurveyFinished />
        </Route>
        <Route exact path="/404">
          <p>404</p>
        </Route>
        <Route exact path="/:surveyId">
          <SurveyComponent id={42} />
        </Route>
        <Route exact path="/">
          <h3>home</h3>
        </Route>
        <Redirect to="/404" />
      </Switch>
      <footer className="footer">insert footer here</footer>
    </Router>
  );
}

export default App;
