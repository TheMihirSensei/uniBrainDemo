const { Router } = require("express");
const { loginController, registerController } = require("../controllers");

const authRoute = Router();

authRoute.post("/login", loginController);
authRoute.post("/register", registerController);

module.exports = authRoute;
