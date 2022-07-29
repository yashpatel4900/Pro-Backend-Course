// It makes sense writing all require  statements first
require("dotenv").config();

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - LCO</h1>");
});

// Instead of writing all listen statements in app.js we will write them in index.js
module.exports = app;
