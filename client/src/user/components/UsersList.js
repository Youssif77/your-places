import React from "react";
import classes from "./UsersList.module.css";
export default function UsersList(props) {
  if (!props.items.length) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }
}
