const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const app = express();

cloudinary.config({
  // cloud_name : process.env.CLOUD_NAME
  cloud_name: "yashpatel4900",
  api_key: "284557364345656",
  api_secret: "y7zL1ni-Py8rkcxi66N5VevgH4k",
});

app.set("view engine", "ejs");
app.use(express.json());

// Creates temporary zone where our file which is in a queue of being uploaded will stay for a while
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// When Data comes in URL Encoded format on not JSON, we must use this middleware
app.use(express.urlencoded({ extended: true }));

app.get("/myget", (req, res) => {
  console.log(req.body);
  res.send(req.query);
});

app.post("/mypost", async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  // Grabbing file comming from form
  let file = req.files.sampleFile;

  // Use exact keyword 'result' according to docs as cloudinary will return some data after upload
  // according to docs - cloudinary.v2.uploader.upload(file, options, callback);
  result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "users",
  });

  console.log(result);

  // Setting up details of what we have got from POST API
  details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    result,
  };
  res.send(details);
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
