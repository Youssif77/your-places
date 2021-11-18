import React, { useCallback, useReducer } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import classes from "./NewPlace.module.css";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "./../../shared/util/validators";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsVaild = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsVaild = formIsVaild && action.isVaild;
        } else {
          formIsVaild = formIsVaild && state.inputs[inputId].isVaild;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isVaild: action.isVaild },
        },
        isVaild: formIsVaild,
      };
    default:
      return state;
  }
};

export default function NewPlace() {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: { value: "", isVaild: false },
      description: { value: "", isVaild: false },
    },
    isVaild: false,
  });

  const InputHandler = useCallback(
    (id, value, isVaild) => {
      dispatch({ type: "INPUT_CHANGE", inputId: id, value, isVaild });
    },
    [dispatch]
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
