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

export default function Authenticate() {
  const authCtx = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formState, InputHandler, setFormData] = useForm(
    {
      email: { value: "", isVaild: false },
      password: { value: "", isVaild: false },
    },
    false
  );

  const authSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLoginMode) {
      try {
        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
        setIsLoading(false);
        authCtx.login();
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
    } else {
      try {
        const res = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }
        setIsLoading(false);
        authCtx.login();
      } catch (err) {
        setIsLoading(false);
        setError(err.message || "Something went wrong, please try again.");
      }
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

  const errorHandler = () => setError(null);

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
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
