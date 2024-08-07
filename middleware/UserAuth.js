"use strict";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const sk = process.env.SECRET_KEY;

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = jwt.verify(token, sk);
      req.email = user.email;
      req.token = token;
    } else {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized User" });
  }
};

export default auth;
