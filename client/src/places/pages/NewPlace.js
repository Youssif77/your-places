import React from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "./../../shared/hooks/form-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "./../../shared/util/validators";
import classes from "./PlaceForm.module.css";

export default function NewPlace() {
  const [formState, InputHandler] = useForm(
    {
      title: { value: "", isVaild: false },
      description: { value: "", isVaild: false },
      address: { value: "", isVaild: false },
    },
    false
  );

  const placeSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  return (
    <form className={classes["place-form"]} onSubmit={placeSubmitHandler}>
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
  );
}
