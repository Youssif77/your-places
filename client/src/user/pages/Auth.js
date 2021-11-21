import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElememnts/Card";
import Button from "./../../shared/components/FormElements/Button";
import LoadingSpinner from "./../../shared/components/UIElememnts/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElememnts/ErrorModal";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import classes from "./Auth.module.css";
import { useHttpClient } from "./../../shared/hooks/http-hook";

export default function Authenticate() {
  const authCtx = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, InputHandler, setFormData] = useForm(
    {
      email: { value: "", isVaild: false },
      password: { value: "", isVaild: false },
    },
    false
  );

  const authSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authCtx.login();
      } catch (err) {}
    } else {
      try {
        await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authCtx.login();
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isVaild && formState.inputs.password.isVaild
      );
    } else {
      setFormData(
        { ...formState.inputs, name: { value: "", isVaild: false } },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className={classes.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE]}
              onInput={InputHandler}
              errText="Please enter a vaild name."
              initialValue={formState.inputs.name.value}
              initialVaild={formState.inputs.name.isVaild}
            />
          )}
          <Input
            id="email"
            element="input"
            type="text"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            onInput={InputHandler}
            errText="Please enter a vaild email address."
            initialValue={formState.inputs.email.value}
            initialVaild={formState.inputs.email.isVaild}
          />
          <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            onInput={InputHandler}
            errText="Please enter a vaild password (at least 8 characters)."
            initialValue={formState.inputs.password.value}
            initialVaild={formState.inputs.password.isVaild}
          />
          <Button type="submit" disabled={!formState.isVaild}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO
          {isLoginMode ? " SIGNUP" : " LOGIN"}
        </Button>
      </Card>
    </>
  );
}
