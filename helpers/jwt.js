const jwt = require("jsonwebtoken");
const config = require("../config");

exports.generateToken = async (payload) => {
  return jwt.sign(payload, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresIn,
  });
};

exports.verifyToken = async (token) => {
  return new Promise(async (res, rej) => {
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {
      if (err) return rej(err);
      res(payload);
    });
  });
};
