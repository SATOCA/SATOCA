import React from "react";
import { Container } from "reactstrap";
import "./App.css";
import dotenv from "dotenv";
import { Redirect, Route, Switch } from "react-router-dom";
import SurveyComponent, {
  RouterSurveyComponentProps,
} from "./Components/SurveyComponent/SurveyComponent";
import Header from "./Components/Header/Header";
import NotFound from "./Components/NotFound/NotFound";
import Frontpage from "./Components/Frontpage/Frontpage";
import TrusteeLogin from "./Components/TrusteeLogin/TrusteeLogin";

dotenv.config({
  path: ".env",
});

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content-height">
        <Switch>
          <Route exact path="/404">
            <NotFound />
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
            <Frontpage />
          </Route>
          <Route exact path="/login">
            <TrusteeLogin />
          </Route>
          <Redirect to="/404" />
        </Switch>
      </div>
      <footer className="footer">
        <Container fluid>going live</Container>
      </footer>
    </div>
  );
}

export default App;
