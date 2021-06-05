import React from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

export default function TrusteeLogin() {
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [validLogin, setValidLogin] = React.useState(false);
    const [validPassword, setValidPassword] = React.useState(false);
    const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        console.log(login,password);
    };
    const handleLoginInputChange = (e: { target: { name: any; value: any; }; }) => {
        setLogin(e.target.value);
        setValidLogin(e.target.value.length>0);
    };
    const handlePasswordInputChange = (e: { target: { name: any; value: any; }; }) => {
        setPassword(e.target.value);
        setValidPassword(e.target.value.length > 0);
    };
    return (
        <div className="centered front-page-alignment">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="exampleEmail">Login</Label>
                    <Input type="text" value={login} onChange={handleLoginInputChange} valid={validLogin}/>
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="text" value={password} onChange={handlePasswordInputChange} valid={validPassword} />
                </FormGroup>
                <Button disabled={validLogin===false || validPassword===false }>Submit</Button>
            </Form>
        </div>
    );
}