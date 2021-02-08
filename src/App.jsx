import { Avatar, Modal, Button, Input, IconButton } from "@material-ui/core";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { db, auth } from "./Firebase";
import "./App.css";
import Post from "./components/Post";
import { makeStyles } from "@material-ui/core/styles";
import ImageUpload from "./components/ImageUpload";
import moment from "moment";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    maxWidth: 600,
    width: "60%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  IconButton: {
    color: "black",
  },
  AddAPhotoIcon: {
    fontSize: "40px",
    color: "black",
  },
  IconButton: {
    background: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  },
  upload: {
    color: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
  },
}));

function App({ username, imgUrl, postComment }) {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [posts, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [usrname, setUsrname] = useState("");
  const [user, setUser] = useState(null);
  const [err, setError] = useState(null);
  const [showImageUpload, setImageUpload] = useState(false);

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // if user has logged in...
        setUser(authUser);
        console.log(user);
      } else {
        // if user has logged out...
        setUser(null);
      }
    });
    return () => {
      // perform some clean up before refire again
      unSubscribe();
    };
  }, [user, username]);

  // fetching the posts from the database
  useEffect(() => {
    //  runs a piece of code based on a specific condition
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // everytime when the posts changes or gets updated;
        setPost(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
      });
  }, []);

  // sign up
  const handleLogin = (e) => {
    e.preventDefault();

    setError(null);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: usrname,
        });
      })
      .catch((error) => setError(error.message));

    setOpen(false);
  };

  const signin = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => setError(error.message));
  };

  const toggleImageUpload = () => {
    const ImageUploadDiv = document.querySelector(".ImageUpload");
    ImageUploadDiv.classList.toggle("toogle");
  };
  return (
    <div className="app ">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
          setUsrname("");
          setEmail("");
          setPassword("");
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              {err && <h6 style={{ color: "red" }}>{err}</h6>}
            </center>

            <Input
              placeholder="username"
              type="text"
              value={usrname}
              onChange={(e) => setUsrname(e.currentTarget.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button onClick={handleLogin} type="submit">
              sign up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
          setError(null);
          setEmail("");
          setPassword("");
        }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
              {err && <h6 style={{ color: "red" }}>{err}</h6>}
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button onClick={signin} type="submit">
              sign in
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
        {user ? (
          <div>
            <Button
              onClick={() => auth.signOut()}
              color="secondary"
              variant="contained"
              style={{ zIndex: 1000 }}
            >
              Log Out
            </Button>
            <div className="add__pic">
              <IconButton
                className={classes.IconButton}
                aria-label="upload picture"
                component="span"
              >
                <AddAPhotoIcon
                  onClick={toggleImageUpload}
                  variant="outlined"
                  className={classes.AddAPhotoIcon}
                />
              </IconButton>
            </div>

            <ImageUpload username={user.displayName} />
          </div>
        ) : (
          <div>
            <div className="app__loginContainer">
              <Button onClick={() => setOpen(true)}>sign up</Button>
              <Button onClick={() => setOpenSignIn(true)}>sign in</Button>
            </div>
          </div>
        )}
      </div>

      {/* post */}
      {posts.map(({ post, id }) => (
        <Post
          key={id}
          username={post.username}
          imgUrl={post.imgUrl}
          postComment={post.postComment}
          timestamp={post.timestamp}
        />
      ))}
    </div>
  );
}

export default App;
