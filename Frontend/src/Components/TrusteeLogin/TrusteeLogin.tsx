import React from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import SurveyApi from "../../Services/SurveyAPI";
import { TrusteeLoginDto } from "../../DataModel/dto/TrusteeLoginDto";
import UploadSurveyFile from "./UploadSurveyFile/UploadSurveyFile";

export default function TrusteeLogin() {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [validLogin, setValidLogin] = React.useState(false);
  const [validPassword, setValidPassword] = React.useState(false);
  const [loginSuccessful, setLoginSuccessful] = React.useState(false);
  const surveyApi = SurveyApi.getInstance();

  const handleSubmit = (event: {
    currentTarget: any;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    const data: TrusteeLoginDto = { login, password };
    surveyApi.trusteeLogin(data).then(async (e) => {
      setLoginSuccessful((await e).success);
    });
  };

  const handleLoginInputChange = (e: { target: { name: any; value: any } }) => {
    setLogin(e.target.value);
    setValidLogin(e.target.value.length > 0);
  };
  const handlePasswordInputChange = (e: {
    target: { name: any; value: any };
  }) => {
    setPassword(e.target.value);
    setValidPassword(e.target.value.length > 0);
  };

  if (loginSuccessful) {
    return (
      <div className="centered front-page-alignment">
        <UploadSurveyFile login={login} password={password} />
      </div>
    );
  }

  return (
    <div className="centered front-page-alignment">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Login</Label>
          <Input
            data-testid="input-login"
            type="text"
            value={login}
            onChange={handleLoginInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            data-testid="input-password"
            type="password"
            value={password}
            onChange={handlePasswordInputChange}
          />
        </FormGroup>
        <Button
          data-testid="btn-submit"
          type="submit"
          disabled={!validLogin || !validPassword}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
