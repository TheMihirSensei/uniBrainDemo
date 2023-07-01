const { Router } = require("express");
const { getAllProduct, addToCart, getCartProduct } = require("../controllers");
const { verifyTokenMiddleware } = require("../middlewares");

const productRoute = Router();

productRoute.get("/", getAllProduct);
productRoute.post("/cart", verifyTokenMiddleware, addToCart);
productRoute.get("/cart", verifyTokenMiddleware, getCartProduct);

module.exports = productRoute;
