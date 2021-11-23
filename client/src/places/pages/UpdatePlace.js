import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElememnts/Card";
import LoadingSpinner from "../../shared/components/UIElememnts/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElememnts/ErrorModal";
import { useForm } from "./../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "./../../shared/util/validators";
import classes from "./PlaceForm.module.css";
import { useHttpClient } from "./../../shared/hooks/http-hook";
import { AuthContext } from "./../../shared/context/auth-context";

export default function UpdatePlace() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const { placeId } = useParams();
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const [formState, InputHandler, setFormData] = useForm(
    {
      title: { value: "", isVaild: false },
      description: { value: "", isVaild: false },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setLoadedPlace(data.place);
        setFormData(
          {
            title: { value: data.place.title, isVaild: true },
            description: { value: data.place.description, isVaild: true },
          },
          true
        );
      } catch (err) {}
    };
    fetchPlace();
  }, [sendRequest, setFormData, placeId]);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push(`/${authCtx.userId}/places`);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Colud not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && loadedPlace && (
        <form
          className={classes["place-form"]}
          onSubmit={placeUpdateSubmitHandler}
        >
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            onInput={InputHandler}
            errText="Please enter a vaild title."
            initialValue={loadedPlace.title}
            initialVaild={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            onInput={InputHandler}
            errText="Please enter a vaild description (at least 5 characters)."
            initialValue={loadedPlace.description}
            initialVaild={true}
          />
          <Button type="submit" disabled={!formState.isVaild}>
            Update Place
          </Button>
        </form>
      )}
    </>
  );
}
