import React from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Redirect, Route, Switch } from "react-router-dom";
import { Jumbotron } from "reactstrap";
import { SurveyComponent } from "./SurveyComponent";
import SurveyFinished from "./SurveyFinished/SurveyFinished";

function App() {
  return (
    <Router>
      <Jumbotron>
        <h2>Secure Adaptive Testing for Organized Capability Assessment</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/3">Survey 3</Link>
            </li>
            <li>
              <Link to="/survey-end">Survey End</Link>
            </li>
          </ul>
        </nav>
      </Jumbotron>
      <Switch>
        <Route exact path="/survey-end">
          <SurveyFinished />
        </Route>
        <Route exact path="/404"><p>404</p></Route>
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
