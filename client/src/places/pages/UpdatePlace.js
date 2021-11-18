import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "./../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "./../../shared/util/validators";
import classes from "./PlaceForm.module.css";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/375px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u1",
    location: { lat: 40.7484405, lng: 73.9878531 },
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/375px-Empire_State_Building_%28aerial_view%29.jpg",
    address: "20 W 34th St, New York, NY 10001, United States",
    creator: "u3",
    location: { lat: 40.7484405, lng: 73.9878531 },
  },
];

export default function UpdatePlace() {
  const [isLoading, setIsLoading] = useState(true);
  const { placeId } = useParams();
  const [formState, InputHandler, setFormData] = useForm(
    {
      title: { value: "", isVaild: false },
      description: { value: "", isVaild: false },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);
  useEffect(() => {
    setFormData(
      {
        title: { value: identifiedPlace.title, isVaild: true },
        description: { value: identifiedPlace.description, isVaild: true },
      },
      true
    );
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  if (!identifiedPlace) {
    return (
      <div className="center">
        <h2>Colud not find place!</h2>
      </div>
    );
  }

  const placeUpdateSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs);
  };

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <form className={classes["place-form"]} onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={InputHandler}
        errText="Please enter a vaild title."
        initialValue={formState.inputs.title.value}
        initialVaild={formState.inputs.title.isVaild}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
        onInput={InputHandler}
        errText="Please enter a vaild description (at least 5 characters)."
        initialValue={formState.inputs.description.value}
        initialVaild={formState.inputs.description.isVaild}
      />
      <Button type="submit" disabled={!formState.isVaild}>
        Update Place
      </Button>
    </form>
  );
}
