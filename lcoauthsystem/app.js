// It makes sense writing all require  statements first
require("dotenv").config();

// Calling up the 'connect' method from ./config/databse.js file
require("./config/database").connect();

const express = require("express");
// User or user doesn't matter here also but industry standard in app.js is User
const User = require("./model/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("./model/user");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - LCO</h1>");
});

app.post("/register", async (req, res) => {
  // Why to use try catch? because all the await function requires promise and right now we are not handling promises
  try {
    const { firstname, lastname, email, password } = await req.body;

    // Checking two conditions

    // 1. Error condition to check whether the requried information is provided or not
    if (!(firstname && lastname && email && password)) {
      res.status(400).send("All fields are required.");
    }

    // 2. If we already have any existing user with same email
    const existingUser = await User.findOne({ email }); // Promise will be there refering to success or failure conditions

    if (existingUser) {
      res.status(401).send("User already exists");
    }

    // If none of the error conditions are true then:

    // Encrypting Password and storing it in a variable to use later
    const myEncPassword = await bcryptjs.hash(password, 10);

    // Creating a user with all the details we have grabbed
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    // Token Creation - 3 Parts
    // Header, Payload, Signature
    const token = await jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      // Some Hashing algorithm can ne also added with expiresIn
      {
        expiresIn: "2h",
      }
    );

    // Assigning the token to the user object
    user.token = await token;
    // Various strategies on Update or not

    // Do not want to send the encrypted password to the res
    user.password = undefined;

    // 201 because something is created
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    // Grabbing enterned email, password
    const { email, password } = req.body;

    // Check if any mandatory field is missing
    if (!(email && password)) {
      res.status(400).send("A required field is missing");
    }

    // Search for the user in database
    const user = await User.findOne({ email });

    // Check is the user registered one?
    if (user === null) {
      res
        .status(400)
        .send(
          "Email entered is not a registered one. Please first register it."
        );
    }
    // For debugging
    // console.log(user);

    // If everything matching generate and asign a token for 2h
    if (email && (await bcryptjs.compare(password, user.password))) {
      const token = await jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      user.token = token;
      user.password = undefined;
      // res.status(200).json(user);

      // This is option 2 that we are trying in place of sending token in headers
      // Sending the token through cookie
      const option = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        // httpOnly when sets to true, it makes sure that the cookie will not be accessable by frontend
        httpOnly: true,
      };

      res.status(200).cookie("token", token, option).json({
        success: true,
        token,
        user,
      });
    }

    // If password doesn't match
    res.send(400).send("Either email or password is incorrect");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.clearCookie("token").send("Welcome to secret information.");
});

// Instead of writing all listen statements in app.js we will write them in index.js
module.exports = app;
