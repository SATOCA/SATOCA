import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import SurveyApi from "../../../Services/SurveyAPI";

interface LegalDisclaimerProps {
    surveyId: string,
    participantId: string
}

const LegalDisclaimer = (props: LegalDisclaimerProps) => {
    const surveyApi = SurveyApi.getInstance();
    const [text, setText] = useState("");
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        surveyApi.getLegalDisclaimer(props.surveyId)
            .then(async (response) => (setText((await response).legalDisclaimer)));
    }, [props.surveyId, surveyApi]);

    const handleSubmit = async (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        surveyApi.acceptLegalDisclaimer(props.participantId)
            .then(() => (window.location.reload()));
    };

    return (
        <div className="centered glass-card-content-min-height">
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    {text}
                </FormGroup>
                <FormGroup row>
                    <Input id="acceptLegalDisclaimerCheck" name="check" type="checkbox"
                           onChange={(e) => (setAccepted(e.target.checked))} />
                    <Label check for="acceptLegalDisclaimerCheck">Accept legal disclaimer</Label>
                </FormGroup>
                <FormGroup row>
                    <Button type="submit" disabled={accepted === false}>Start Survey</Button>
                </FormGroup>
            </Form>
        </div>
    );
};

export default LegalDisclaimer;
