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
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

export default function Authenticate() {
  const authCtx = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
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
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        authCtx.login(data.userId, data.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );
        authCtx.login(data.userId, data.token);
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isVaild && formState.inputs.password.isVaild
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: "", isVaild: false },
          image: { value: null, isVaild: false },
        },
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
            <>
              <Input
                id="name"
                element="input"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE]}
                onInput={inputHandler}
                errText="Please enter a vaild name."
                initialValue={formState.inputs.name.value}
                initialVaild={formState.inputs.name.isVaild}
              />
              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errText="Please provide an image."
              />
            </>
          )}

          <Input
            id="email"
            element="input"
            type="text"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
            errText="Please enter a vaild email address."
            initialValue={formState.inputs.email.value}
            initialVaild={formState.inputs.email.isVaild}
          />
          <Input
            id="password"
            element="input"
            type="text"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            errText="Please enter a vaild password (at least 6 characters)."
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
