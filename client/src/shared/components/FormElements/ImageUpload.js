import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import classes from "./ImageUpload.module.css";
import styles from "./Input.module.css";

export default function ImageUpload(props) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isVaild, setIsVaild] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickHandler = (e) => {
    let pickedFile;
    let fileIsVaild = isVaild;
    if (e.target.files || e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsVaild(true);
      fileIsVaild = true;
    } else {
      setIsVaild(false);
      fileIsVaild = false;
    }
    props.onInput(props.id, pickedFile, fileIsVaild);
  };

  const pickImageHandler = () => filePickerRef.current.click();

  return (
    <div className={styles["form-control"]}>
      <input
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickHandler}
      />
      <div
        className={`${classes["image-upload"]} ${
          props.center && classes.center
        }`}
      >
        <div className={classes["image-upload__preview"]}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isVaild && <p>{props.errText}</p>}
    </div>
  );
}
