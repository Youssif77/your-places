import React, { useReducer } from "react";
import classes from "./Input.module.css";

const inputReducer = (state, action) => {};

export default function Input(props) {
  const [state, dispatch] = useReducer(inputReducer, initialState, init);
  const changeHandler = () => {};

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
      />
    ) : (
      <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler} />
    );

  return (
    <div className={`${classes["form-control"]}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
}
