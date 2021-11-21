import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElememnts/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElememnts/LoadingSpinner";
import { AuthContext } from "./../../shared/context/auth-context";
import { useHttpClient } from "./../../shared/hooks/http-hook";
import { useForm } from "./../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "./../../shared/util/validators";
import classes from "./PlaceForm.module.css";

export default function NewPlace() {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, InputHandler] = useForm(
    {
      title: { value: "", isVaild: false },
      description: { value: "", isVaild: false },
      address: { value: "", isVaild: false },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formState.inputs);
    try {
      await sendRequest(
        "http://localhost:5000/api/places/",
        "POST",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: authCtx.userId,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/");
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className={classes["place-form"]} onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
          errText="Please enter a vaild title."
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={InputHandler}
          errText="Please enter a vaild description (at least 5 characters)."
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
          errText="Please enter a vaild address."
        />
        <Button type="submit" disabled={!formState.isVaild}>
          Add Place
        </Button>
      </form>
    </>
  );
}
