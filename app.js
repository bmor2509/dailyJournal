//jshint esversion:6

// Declaration of the packages that are going to be used for functionality in the project
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require('mongoose');

// Some text to populate the starting pages
const homeStartingContent = "A basic daily journal that can be used as a blog website. New posts can be made using the 'compose' route, and once a new post has been submitted it will appear on the home page. From the home page, a preview of all the posts can be seen, each of these can be expanded using the 'read more' hyperlink, which will bring the user to a dedicated page for the post. ";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//Initialising express
const app = express();

//Setting the view engine to use EJS
app.set('view engine', 'ejs');

//Allowing for parsing of data from other files
app.use(bodyParser.urlencoded({
  extended: true
}));
// A static "public" folder that needs to be declared for use by the ejs files
app.use(express.static("public"));

//Mongoose connection
mongoose.connect("mongodb+srv://admin-ben:test123@cluster0.0n6zn.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//A schema that is used to structure new posts
const postSchema = {
  title: String,
  content: String
}

//Implementation of the post schema in to a collection
const Post = mongoose.model('Post', postSchema);

// home get route, which displays the starting content text as well as all the posts that have been composed
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      homeText: homeStartingContent,
      homeContent: posts
    });
  });
});

// contact route
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactText: contactContent
  });
});

// about route
app.get("/about", function(req, res) {
  res.render("about", {
    aboutText: aboutContent
  });
});

// compose route
app.get("/compose", function(req, res) {
  res.render("compose");
});

// Compose route post, to push new elements the posts database
app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.composeTitle,
    content: req.body.composePost
  });
  post.save(function(err, post) {
    if (err) {
      res.redirect("/");
    } else {
      console.log("Document sucessfully saved")
    }
  });
  res.redirect("/");
});

//Post route
app.get('/post/:postId', function(req, res) {
  const requestedTitle = req.params.postId;
  Post.findOne({
    _id: requestedTitle
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.post("/delete", function(req, res) {
  const selectedId = req.body.deleteButton;

  Post.findByIdAndRemove(selectedId, function(err) {
    if (!err) {
      console.log(selectedId);
      res.redirect("/");
    }
  })
});

//listening to the server on port 3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
