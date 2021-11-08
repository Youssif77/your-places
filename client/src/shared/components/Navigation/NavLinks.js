import React from "react";
import { NavLink } from "react-router-dom";

import classes from "./NavLinks.module.css";

const NavLinks = (props) => {
  return (
    <ul className={classes["nav-links"]}>
      <li>
        <NavLink activeClassName={classes.active} to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={classes.active} to="/u1/places">
          MY PLACES
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={classes.active} to="/places/new">
          ADD PLACE
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName={classes.active} to="/auth">
          AUTHENTICATE
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
