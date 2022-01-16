import React, { useState } from "react";
import "./UploadSurveyFile.css";
import { Link } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import SurveyApi from "../../../../Services/SurveyAPI";

type UploadSurveyFileProps = {
  login: string;
  password: string;
  surveyUploaded: () => void;
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
    setListItems(<div />);
  };

  const upload = async () => {
    if (file !== undefined) {
      setHasError(false);
      setError("");
      await surveyApi
        .uploadSurveyFile(file, props.login, props.password)
        .then((response) => {
          console.log(response);

          setListItems(
            <div>
              <h3>Participant links:</h3>
              <ol>
                {response.links.map((link) => (
                  <li>
                    <Link to={link} style={{ color: "blue" }}>
                      {process.env.REACT_APP_FRONTEND + link}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          );

          setHasError(response.error.hasError);
          setError(response.error.message);

          props.surveyUploaded();
        })
        .catch();
    }
  };

  return (
    <Form className="p-5">
      <FormGroup>
        <h1>Upload Survey File</h1>
        <Label for="fileUpload">Survey File (.xlsx)</Label>
        <Input
          type="file"
          id="fileUpload"
          name="surveyFile"
          label="Upload a survey file!"
          onChange={updateFileChanged}
        />
      </FormGroup>
      <Button color="primary" disabled={file === undefined} onClick={upload}>
        Submit
      </Button>
      <div className="space-after-submit" />
      {listItems}
      {hasError ? (
        <div>
          <h3>Error</h3>
          {error}
        </div>
      ) : (
        <div />
      )}
    </Form>
  );
}
