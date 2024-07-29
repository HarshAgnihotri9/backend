"use strict";

function validation(email, password) {
  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if email is valid
  if (!emailRegex.test(email)) {
    // If the email is not valid, provide suggestions
    if (email.length === 0) {
      return { error: true, msg: "Email is required." };
    } else if (!/@/.test(email)) {
      return { error: true, msg: "Email address must contain '@'." };
    } else if (!/\./.test(email)) {
      return { error: true, msg: "Email address must contain '.'." };
    } else {
      return { error: true, msg: "Invalid email address." };
    }
  }

  // Check if password is valid
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!password || password.trim() === "") {
    return { error: true, msg: "Password is required." };
  } else if (password.length < 8) {
    return { error: true, msg: "Password must be at least 8 characters long." };
  } else if (!passwordRegex.test(password)) {
    return {
      error: true,
      msg: "Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 8 characters long.",
    };
  }

  // If both email and password are valid
  return { error: false };
}

export default validation;
