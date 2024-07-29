function validatePassword(password) {
  // Define your password criteria
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  // You can add more criteria as needed, like special characters

  // {
  //   Error: true,
  //   errorMessage: "Password must contain at least one letter"
  // }
  // Check if the password meets all criteria
  if (password.length < minLength) {
    return "Password must be at least " + minLength + " characters long";
  }
  if (!hasLetter) {
    return "Password must contain at least one letter";
  }
  if (!hasNumber) {
    return "Password must contain at least one number";
  }
  // Add more checks as needed

  // If the password passes all checks
  return true;
}

console.log(validatePassword("gaurav"));
module.exports = { validatePassword };
