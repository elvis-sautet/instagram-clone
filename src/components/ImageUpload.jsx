import { PhotoCamera } from "@material-ui/icons";
import PublishIcon from "@material-ui/icons/Publish";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { Button, makeStyles, IconButton, label } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "firebase";
import { storage, db } from "../Firebase";
import "./ImageUpload.css";

const useStyles = makeStyles({
  IconButton: {
    background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  },
  AddAPhotoIcon: {
    fontSize: "25px",
    color: "black",
  },
  upload: {
    color: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  },
});
function ImageUpload({ username }) {
  const classes = useStyles();
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);

  const inputFile = document.querySelector(".default__input");
  const fileName = document.querySelector(".file__name");

  const refInput = () => {
    inputFile.click();
  };
  const checkFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      fileName.textContent = file.name;
    }
  };

  const imageDisplay = document.querySelector(".inner__container");
  if (image) {
    imageDisplay.style.backgroundImage = `url(${image})`;
  }

  // uploading the image
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${files.name}`).put(files);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //   progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function
        console.error(error);
        alert(error.message);
      },
      () => {
        // complete function
        storage
          .ref("images")
          .child(files.name)
          .getDownloadURL()
          .then((url) => {
            // post the image inside the database
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              postComment: caption,
              imgUrl: url,
              username: username,
            });
            setProgress(0);
            setImage(null);
            setCaption("");
            setFiles(null);
            imageDisplay.style.backgroundImage =
              "url('https://www.pngitem.com/pimgs/m/378-3780329_hr-cloud-upload-icon-hd-png-download.png')";
            fileName.textContent = "";
          });
      }
    );
  };
  return (
    <div className="imgUpload">
      <div className="ImageUpload">
        <div className="image__Upload">
          <div className="inner__container"></div>
          <p style={{ color: "white" }} className="file__name"></p>
          <form className="file_upload">
            <input
              onChange={checkFile}
              type="file"
              className="default__input"
              hidden
              required
            />
            <IconButton
              onClick={refInput}
              className={classes.IconButton}
              aria-label="upload picture"
              component="span"
            >
              <AddAPhotoIcon className={classes.AddAPhotoIcon} />
            </IconButton>

            <textarea
              autoCorrect="off"
              autoComplete="off"
              style={{ height: "40px" }}
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.currentTarget.value)}
              placeholder="Add a caption..."
              required
            />
          </form>
          {image ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <progress value={progress} max="100" />
              <Button
                variant="contained"
                color="primary"
                className={classes.upload}
                onClick={handleUpload}
              >
                Upload
              </Button>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled
              className={classes.upload}
            >
              Upload
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
