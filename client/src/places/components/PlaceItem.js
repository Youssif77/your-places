import React, { useState } from "react";

import Card from "../../shared/components/UIElememnts/Card";
import Map from "../../shared/components/UIElememnts/Map";
import Button from "./../../shared/components/FormElements/Button";
import Modal from "./../../shared/components/UIElememnts/Modal";
import classes from "./PlaceItem.module.css";

export default function (props) {
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass={classes["place-item__modal-content"]}
        footerClass={classes["place-item__modal-actions"]}
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className={classes["map-container"]}>
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <li className={classes["place-item"]}>
        <Card>
          <div className={classes["place-item__image"]}>
            <img src={props.image} alt={props.title} />
          </div>
          <div className={classes["place-item__info"]}>
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className={classes["place-item__actions"]}>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            <Button to={`places/${props.id}`}>EDIT</Button>
            <Button danger>DELETE</Button>
          </div>
        </Card>
      </li>
    </>
  );
}
