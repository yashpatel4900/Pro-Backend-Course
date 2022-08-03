const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(
  fileUpload({
    useTemplate: true,
    tempFileDir: "/tmp/",
  })
);

// When Data comes in URL Encoded format on not JSON, we must use this middleware
app.use(express.urlencoded({ extended: true }));

app.get("/myget", (req, res) => {
  console.log(req.body);
  res.send(req.query);
});

app.post("/mypost", (req, res) => {
  console.log(req.body);
  console.log(req.files);
  res.send(req.body);
});

app.get("/mygetform", (req, res) => {
  res.render("getform");
});
app.get("/mypostform", (req, res) => {
  res.render("postform");
});

app.listen(4000, () => {
  console.log("listening on Port 4000...");
});
