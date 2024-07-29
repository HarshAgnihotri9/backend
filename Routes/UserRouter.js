// const express = require("express");
import express from "express";
// const { auth } = require("../middleware/Auth");
import auth from "../middleware/Auth.js";
// const {
//   signUpUser,
//   loginuser,
//   profileDetails,
//   updateProfile,
//   logoutUser,
// } = require("../Controller/UserController");
import user from "../Controller/UserController.js";
const {
  signUpUser,
  loginuser,
  profileDetails,
  updateProfile,
  logoutUser,
  resetpassword,
  sendotp,
  verifyotp,
} = user;

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginuser);
router.get("/profile", auth, profileDetails);
router.put("/updateProfile/:id", updateProfile);
router.get("/logout", logoutUser);
router.post('/sendotp',sendotp)
router.post('/verifyotp',verifyotp)
router.post("/resetpassword", resetpassword);

// module.exports = router;
export default router;
