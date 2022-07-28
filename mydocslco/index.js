const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 4000;

// Swagger Docs Related
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use(fileUpload());

let courses = [
  {
    id: "11",
    name: "Learn ReactJS",
    price: 299,
  },
  {
    id: "22",
    name: "Learn Angular",
    price: 399,
  },
  {
    id: "33",
    name: "Learn Django",
    price: 499,
  },
];

app.listen(PORT, () => {
  console.log("Helloji");
});

app.get("/", (req, res) => {
  res.status(200).send("Boloji");
});

app.get("/api/v1/lco", (req, res) => {
  res.status(200).send("Hello from lco docs");
});

app.get("/api/v1/lcoobject", (req, res) => {
  res.status(200).send({ id: "55", name: "Learn Backend", price: 999 });
});

app.get("/api/v1/courses", (req, res) => {
  res.status(200).send(courses);
});

app.get("/api/v1/mycourse/:courseId", (req, res) => {
  const myCourse = courses.find((item) => item.id === req.params.courseId);
  res.send(myCourse);
});

app.get("/api/v1/coursequery", (req, res) => {
  let location = req.query.location;
  let device = req.query.device;

  res.send({ location, device });
});

app.post("/api/v1/addCourse", (req, res) => {
  console.log(req.body);
  courses.push(req.body);
  res.status(200).json(courses);
  // res.send(true)
});

app.post("/api/v1/courseupload", (req, res) => {
  const sampleFile = req.files.sampleFile;
  let path = __dirname + "/images/" + Date.now() + ".jpg";

  sampleFile.mv(path, (err) => {
    res.send(true);
  });
});
