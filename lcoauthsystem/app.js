// It makes sense writing all require  statements first
require("dotenv").config();

const express = require("express");
// User or user doesn't matter here also but industry standard in app.js is User
const User = require("./model/user");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - LCO</h1>");
});

app.post("/register", (req, res) => {
    const {firstname, lastname, email, password} = req.body

    // Error condition to check whether the requried information is provided or not
    if(!(firstname && lastname && email && password)){
        res.status(400).send("All fields are required.")
    }

    const existingUser = User.findOne({ email: email})

    if(existingUser){
        res.status(401).send("User already exists")
    }
})

// Instead of writing all listen statements in app.js we will write them in index.js
module.exports = app;
