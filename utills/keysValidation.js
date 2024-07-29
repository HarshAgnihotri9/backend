"use strict";

const Keyvalidation = (body) => {
  const Keys = [];
  for (const key of body) {
    if (Keys.includes(key)) {
      return {
        error: true,
        msg: `All keys should be different...Change this key ${key}`,
      };
    } else {
      Keys.push(key);
    }
  }

  return { error: false };
};

export default Keyvalidation;
