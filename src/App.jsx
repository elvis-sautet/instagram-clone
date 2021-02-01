import { Avatar } from "@material-ui/core";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { db } from "./Firebase";
import "./App.css";
import Post from "./components/Post";

function App({ username, imgUrl, postComment }) {
  const [posts, setPost] = useState([]);

  useEffect(() => {
    //  runs a piece of code based on a specific condition
    db.collection("posts").onSnapshot((snapshot) => {
      // everytime when the posts changes or gets updated;
      setPost(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);
  return (
    <div className="app ">
      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app__headerImage"
        />
      </div>
      {/* post */}
      {posts.map(({ post, id }) => (
        <Post
          key={id}
          username={post.username}
          imgUrl={post.imgUrl}
          postComment={post.postComment}
        />
      ))}
    </div>
  );
}

export default App;
