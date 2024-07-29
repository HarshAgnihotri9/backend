import jwtModel from "../Schema/jwt.js";

const logout_validation = async (token) => {
  try {
    const output = await jwtModel.findOne({ jwt: token });

    const { flag } = output;

    if (flag === 0) return { loggedOut: false };

    if (flag === 1) return { loggedOut: true };
  } catch (err) {
    return { Error: err.message };
  }
};
export default logout_validation;
