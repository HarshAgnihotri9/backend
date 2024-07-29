// const mongoose = require("mongoose");
import mongoose from "mongoose";
import AES from "../utills/AES.js";

// Define User Schema
const UserSchema = {
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    set: AES.encrypt,
    get: AES.decrypt,
  },
  _id: false,
};

// Define Keys Schema
const KeysSchema = {
  key1: {
    type: String,
    required: true,
    set: AES.encrypt,
    get: AES.decrypt,
  },
  key2: {
    type: String,
    required: true,
    set: AES.encrypt,
    get: AES.decrypt,
  },
  key3: {
    type: String,
    required: true,
    set: AES.encrypt,
    get: AES.decrypt,
  },
  key4: {
    type: String,
    required: true,
    set: AES.encrypt,
    get: AES.decrypt,
  },
  key5: {
    type: String,
    required: true,
    set: AES.encrypt,
    get: AES.decrypt,
  },
  _id: false,
};

// Define JWT Schema
const JWTSchema = {
  // jwt: {
  //   type: String,
  //   // required: true,
  //   default: "",
  // },
  flag: {
    type: Number,
    default: 0,
  },
  _id: false,
};

// Combine all schemas into one
const ApplicationSchema = new mongoose.Schema({
  // User fields
  UserSchema: {
    type: UserSchema,
  },
  // Keys fields
  KeysSchema: {
    type: KeysSchema,
  },
  // JWT fields
  JWTSchema: {
    type: JWTSchema,
  },
});

// Create a model based on the combined schema
const Application = mongoose.model("Application", ApplicationSchema);

export default Application;
