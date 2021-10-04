import React, { useState } from "react";
import "./UploadSurveyFile.css";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import SurveyApi from "../../../Services/SurveyAPI";

type UploadSurveyFileProps = {
  login: string;
  password: string;
};

export default function UploadSurveyFile(props: UploadSurveyFileProps) {
  const [listItems, setListItems] = useState(<div />);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState(false);

  const surveyApi = SurveyApi.getInstance();

  const updateFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event === null || event.target === null || event.target.files === null)
      return;

    setFile(event.target.files[0]);
  };

  const upload = async () => {
    if (file !== undefined)
      await surveyApi
        .uploadSurveyFile(file, props.login, props.password)
        .then((response) => {
          console.log(response);
          setListItems(
            <ol>
              {response.links.map((link) => (
                <li>
                  <Link to={link} style={{ color: "blue" }}>
                    {process.env.REACT_APP_FRONTEND + link}
                  </Link>
                </li>
              ))}
            </ol>
          );

          setHasError(response.error.hasError);
          setError(response.error.message);
        })
        .catch();
  };

  return (
    <Form>
      <FormGroup>
        <Label for="fileUpload">Survey File (.xslx)</Label>
        <Input
          type="file"
          id="fileUpload"
          name="surveyFile"
          label="Upload a survey file!"
          onChange={updateFileChanged}
        />
      </FormGroup>
      <Button disabled={file === undefined} onClick={upload}>
        Submit
      </Button>
      {listItems}
      {hasError ? <div>{error}</div> : <div />}
    </Form>
  );
}
