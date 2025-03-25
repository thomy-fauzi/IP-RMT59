var jwt = require("jsonwebtoken");

function signToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}

module.exports = {
  signToken,
  verifyToken,
};
