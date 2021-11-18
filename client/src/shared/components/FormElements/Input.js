import React, { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";
import classes from "./Input.module.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isVaild: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

export default function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isVaild: props.initialVaild || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isVaild } = inputState;
  useEffect(() => {
    onInput(id, value, isVaild);
  }, [id, value, isVaild, onInput]);

  const changeHandler = (e) => {
    dispatch({
      type: "CHANGE",
      val: e.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`${classes["form-control"]} ${
        !inputState.isVaild &&
        inputState.isTouched &&
        classes["form-control--invalid"]
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isVaild && inputState.isTouched && <p>{props.errText}</p>}
    </div>
  );
}
