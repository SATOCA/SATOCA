import React from "react";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Jumbotron } from "reactstrap";

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
          </ul>
        </nav>
      </Jumbotron>
      <Switch>
        <Route path="/:surveyId">
          <h3>Survey with id</h3>
        </Route>
        <Route path="/">
          <h3>home</h3>
        </Route>
      </Switch>
      <footer className="footer">insert footer here</footer>
    </Router>
  );
}

export default App;
