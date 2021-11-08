import React from "react";

import classes from "./MainHeader.module.css";

export default function MainHeader(props) {
  return <header className={classes["main-header"]}>{props.children}</header>;
}
