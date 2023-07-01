const { verifyToken } = require("../helpers");

exports.verifyTokenMiddleware = async (req, res, next) => {
  try {
    let token = req["headers"]["authorization"]?.split(" ")?.[1];
    if (!token) {
      return res.status(403).json({
        message: "Token Missing",
      });
    }
    const payload = await verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch (err) {
    res
      .status(400)
      .json({ message: err?.message || "something wrong in middleware" });
  }
};
