//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import "dotenv/config";
import md5 from "md5";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://" +
    process.env.USERNAME +
    ":" +
    process.env.PASSWORD +
    "@cluster0.zumpvf6.mongodb.net/userDB",
  { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser
    .save()
    .then(() => {
      res.render("secrets.ejs");
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets.ejs");
        }
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`Starting on port ${port}`);
});
