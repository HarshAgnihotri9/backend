// const { boolean } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const MusicSchema = new schema(
  {
    English_Songs: {
      type: String,
    },
    New_Songs: {
      type: String,
    },
    Old_Songs: {
      type: String,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
