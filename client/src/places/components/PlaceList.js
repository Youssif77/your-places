import React from "react";

import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElememnts/Card";
import Button from "./../../shared/components/FormElements/Button";
import classes from "./PlaceList.module.css";

export default function PlaceList(props) {
  if (!props.items.length)
    return (
      <div className={`${classes["place-list"]} center`}>
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );

  return (
    <ul className={classes["place-list"]}>
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </ul>
  );
}
