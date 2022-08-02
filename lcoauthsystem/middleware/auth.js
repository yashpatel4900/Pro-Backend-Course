const jwt = require("jsonwebtoken");

// Model is optional

const auth = (req, res, next) => {
  // For debugging purposes
  console.log(req.cookies);

  // Finding the token while a route is requested to access
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header("Authorization").replace("Bearer ", "");

  // Checking if token was not passed
  if (!token) {
    return res.status(400).send("Token is missing");
  }

  // Process of Verifying the token and its validation
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    // To check what this decode variable has
    // console.log(decode);

    // Many ways to use decode variable but the most common one is
    req.user = decode;

    // OR bring in info from DB to grab some more infromation about the user
  } catch (error) {
    res.status(401).send("Invalid Token or maybe the token was expired");
  }

  return next();
};

module.exports = auth;
