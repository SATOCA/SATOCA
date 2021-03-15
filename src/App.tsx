import React from "react";
import { Container } from "reactstrap";
import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import SurveyComponent, {
  RouterSurveyComponentProps,
} from "./Components/SurveyComponent/SurveyComponent";
import Header from "./Components/Header/Header";
import NotFound from "./Components/NotFound/NotFound";

function App() {
  return (
    <div className="App">
      <Header />
      <Container className="content" fluid="lg">
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
            <h3>home</h3>
          </Route>
          <Redirect to="/404" />
        </Switch>
      </Container>
      <footer className="footer">
        <Container fluid={true}>going live</Container>
      </footer>
    </div>
  );
}

export default App;
