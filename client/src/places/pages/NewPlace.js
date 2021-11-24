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
import ImageUpload from "./../../shared/components/FormElements/ImageUpload";

export default function NewPlace() {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: { value: "", isVaild: false },
      description: { value: "", isVaild: false },
      address: { value: "", isVaild: false },
      image: { value: null, isVaild: false },
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formDate = new FormData();
      formDate.append("title", formState.inputs.title.value);
      formDate.append("description", formState.inputs.description.value);
      formDate.append("address", formState.inputs.address.value);
      formDate.append("image", formState.inputs.image.value);
      formDate.append("creator", authCtx.userId);
      await sendRequest("http://localhost:5000/api/places/", "POST", formDate);
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
          onInput={inputHandler}
          errText="Please enter a vaild title."
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
          errText="Please enter a vaild description (at least 5 characters)."
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errText="Please enter a vaild address."
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isVaild}>
          Add Place
        </Button>
      </form>
    </>
  );
}
