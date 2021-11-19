import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import classes from "./NavLinks.module.css";

const NavLinks = (props) => {
  const authCtx = useContext(AuthContext);
  return (
    <ul className={classes["nav-links"]}>
      <li>
        <NavLink activeClassName={classes.active} to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {authCtx.isLoggedIn && (
        <>
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
            <button onClick={authCtx.logout}>LOGOUT</button>
          </li>
        </>
      )}
      {!authCtx.isLoggedIn && (
        <li>
          <NavLink activeClassName={classes.active} to="/auth">
            AUTHENTICATE
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
