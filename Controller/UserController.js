// const userModel = require("../models/User");
// const userModel = require("../MongoModel/Usermodel.js");
import userModel from "../MongoModel/Usermodel.js";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";
// const { validateEmail } = require("../utils/validation");
import validateEmail from "../utils/validation.js";
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
import crypto from 'crypto';
// const cokkieparser = require("cookie-parser");
import cookieParser from "cookie-parser";
// const { mailAlerts } = require("../Mail/MailAlert.js");
import mailAlerts from "../Mail/MailAlert.js";
import { application } from "express";
import Tenant from "../MongoModel/TanentModel.js";
// const { string } = require("joi");
const {
  wrongAlert,
  loggedIn,
  signupAlert,
  lockerRequest,
  otp,
  resettpassword,
  sendEmail,
} = mailAlerts;

// const { validatePassword } = require("../utils/passwordvalidate.js");
// const cokie = require("cook");
// const { loggedIn } = require("../Mail/MailAlert.js");
// const express = require("express");
// const app = express();

const signUpUser = async (req, res) => {
  try {
    // console.log("hiiz");
    const { username, email, password } = req.body;
    console.log(password);
    if(username=='' || email=="" || password=="") {
      return res.status(400).json({message:'Plz fill all the feilds'})
    }

    if (password.trim() == "") {
      return res.status(400).jsom({message:"password must contain some value"})
    }

    if (!validateEmail(email))
     return res.status(400).json({ message: "Invalid email address" });

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log('hey');

    const result = await userModel.create({
      email: email,
      password: password,
      username: username,
    });

    console.log(result);
    // const token = jwt.sign(
    //   { username: req.body.username }, //payload
    //   process.env.SECRET_KEY,
    //   { expiresIn: "1m" }
    // );
    // console.log("hiii");
    signupAlert(email);

   return res.json({ message: "Account Creation Done" });

    // res.status(200).json("Account Creation Done", token);

    // res.json(token);

    // res.status(201).json({ error: false, message: "Account creation done" });
  } catch (error) {
    res.status(500).json({ Error: true, Message: error });
  }
};

//login user code

const loginuser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({email:email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not exists" });
    }
    
    // const existingUser = await userModel.findOne({ username: username });
    
    // const cheackpassword = await bcrypt.compare(
    //   password,
    //   existingUser.password
    // );
    let cheackpassword;
    if (existingUser.password == password) {
      cheackpassword = true;
    }
    // console.log(cheackpassword);

    // if (cheackpassword != password) {
      //   res.status(500).json({ Error: true, Message: error });
      // }

    if (!cheackpassword) {
      // wrongAlert(existingUser.email);
      return res.status(400).json({ message: "Password Incoorect" });
    }
    // let otpp = Math.floor(1000 + Math.random() * 1000);
    // otpp = otpp.toString();
    // console.log(otpp);

    // otp(existingUser.email, otpp);
    // console.log("j");
    const token = jwt.sign(
      { username: existingUser.username, id: existingUser._id }, //payload
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );
    // console.log("k");

    // console.log(user);

    // loggedIn(email);

    // loggedIn(existingUser.email);
    loggedIn(existingUser.email);
    return res
      .cookie("token", token)
      .status(200)
      .json({ message: "Logged in sucessfully", token: token, error: false,username:existingUser.username });
  } catch (error) {
    // wrongAlert(existingUser.email);
    return res.status(500).json({ Error: true, Message: error });
  }
};

const saveTenantDetails = async (req, res) => {
  const { pgNo, phoneNo, aadhaarNo, roomNo, totalRent, place } = req.body;
  console.log(req.body);
  

  try {
    const newTenant = new Tenant({
      pgNo,
      phoneNo,
      aadhaarNo,
      roomNo,
      totalRent,
      place,
    });
    const existingTenure= await Tenant.findOne({phoneNo})
    
    if(existingTenure){
      return res.status(400).json({ success: false,message: "Already a User"})
    }
    else{
      await newTenant.save();
      return res.status(201).json({ success: true, message: 'Tenant details saved successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const profileDetails = async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.username });
    console.log(user);

    return res
      .status(200)
      .json({ message: "Get user profile details", ProfileDetails: user });
  } catch (err) {
    console.log("hey");
    res.status(500).json({ Error: true, Message: err });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const { username, email, password } = req.body;
    // console.log(username);

    if (!validateEmail(email)) {
      // console.log("email ");
      return res.status(400).json({ message: "Invalid email address" });
    }
    user = await userModel.findByIdAndUpdate(id, {
      username: username,
      email: email,
      password: await bcrypt.hash(password, 10),
      // password: bcrypt.hash(password, 10),
    });
    console.log("error");
    if (!user) {
      // console.log("error1");
      return res.status(400).json({ Error: true, Message: "user not exist" });
    }
    // console.log("error2");

    return res.status(200).json({ message: "Update Done" });

    // console.log("error3");
  } catch (err) {
    res.status(400).json({ Error: err });
    // console.log("error4");
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.send("logout");
};

const resetpassword = async (req, res) => {
  const { email } = req.body;
  if (email) {
    try {
      const ress = await userModel.findOne({ email: email });

      if (ress != null) {
        resettpassword(ress.email, ress.password);
        return res.status(200).json({ message: "Password sent to the email" });
      } else {
        return res.status(400).json("user not found");
      }
    } catch (err) {
      res.status(err);
    }
  } else {
    return res.status(0).json({ Error: "Email is not there" });
  }
};

const sendotp= async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    console.log('Generated OTP:', otp);

    // Save OTP to the user record or a temporary storage (for simplicity, we'll save it directly here)
    user.otp = otp; // You need to add an otp field to your user schema
    await user.save();

    // Send OTP to user's email
    await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: "Error sending OTP", error });
  }
}
const verifyotp= async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP
    user.otp = null;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: "Error verifying OTP", error });
  }
}
const user = {
  resetpassword,
  signUpUser,
  loginuser,
  profileDetails,
  updateProfile,
  logoutUser,
  sendotp,verifyotp,
  saveTenantDetails
};

export default user;
