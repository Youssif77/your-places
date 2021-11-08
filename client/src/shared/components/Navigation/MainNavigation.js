import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import classes from "./MainNavigation.module.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "./../UIElememnts/Backdrop";

export default function MainNavigation() {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawer = () => setDrawerIsOpen(true);
  const closeDrawer = () => setDrawerIsOpen(false);

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawer}>
        <nav className={classes["main-navigation__drawer-nav"]}>
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader onClick={closeDrawer}>
        <button
          className={classes["main-navigation__menu-btn"]}
          onClick={openDrawer}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className={classes["main-navigation__title"]}>
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className={classes["main-navigation__header-nav"]}>
          <NavLinks />
        </nav>
      </MainHeader>
      )
    </>
  );
}
