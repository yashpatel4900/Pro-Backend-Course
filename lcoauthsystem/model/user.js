const mongoose = require("mongoose");

// This is just the schema design
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    default: null,
  },
  lastname: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  //    you can add whole bunch of other things like token generated on, token expires in, etc.
});

// Exporting an object which is following this 'user' schema
// dosen't matter to write User or user as mongoose bring everything in lowercase while processing
module.exports = mongoose.Schema("user", userSchema);
