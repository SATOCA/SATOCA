import React, { ChangeEvent, useState } from "react";
import { Button, Col, Form, FormGroup, Input, Label } from "reactstrap";

export default function ConfigureReport() {
  const [checkboxOption, setCheckboxOption] = useState(false);

  const handleSubmit = (event: {
    currentTarget: any;
    preventDefault: () => void;
  }) => {
    event.preventDefault();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckboxOption(event.target.checked);
  };

  return (
    <div>
      <Form className="Report-Options">
        <FormGroup data-testid="reportOptions">
          <Col sm={10}>
            <FormGroup check key="histogram">
              <Input
                data-testid="histogram"
                type="checkbox"
                id="histogram"
                name="checkboxHistogram"
                onChange={handleChange}
                value="histogram"
              />
              <Label check>Histogram</Label>
            </FormGroup>
          </Col>
        </FormGroup>
      </Form>
      <div className="submitButton">
        <Button
          data-testid="submitButton"
          className="btn btn-primary mt-2"
          type="submit"
          disabled={!checkboxOption}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
