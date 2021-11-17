import React from "react";
import Input from "../../shared/components/FormElements/Input";
import classes from "./NewPlace.module.css";

export default function NewPlace() {
  return (
    <form className={classes["place-form"]}>
      <Input element="input" type="text" label="title" />
    </form>
  );
}
