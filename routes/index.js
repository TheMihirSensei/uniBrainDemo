const { Router } = require("express");
const authRoute = require("./auth.routes");
const productRoute = require("./product.routes");

const apiRoute = Router();

apiRoute.use("/auth", authRoute);
apiRoute.use("/products", productRoute);

module.exports = apiRoute;
