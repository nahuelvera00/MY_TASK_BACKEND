import jwt from "jsonwebtoken";

class Helper {
  constructor() {}

  generateToken() {
    return Math.random().toString(32).substring(2) + Date.now().toString(32);
  }

  generateJWT(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
  }
}

module.exports = new Helper();
