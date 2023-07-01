const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const mongoose = require("mongoose");
exports.getAllProduct = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    if (page) page = Number(page);
    if (limit) limit = Number(limit);

    if (!page) page = 1;
    if (!limit) limit = 10;

    const products = await productModel.aggregate([
      {
        $facet: {
          list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          count: [{ $count: "totalProduct" }],
        },
      },
    ]);
    res.status(200).json({
      message: "success",
      data: {
        list: products[0]?.list || [],
        count: {
          total: products[0]?.count?.[0].totalProduct || 0,
          current: page || 1,
          limit: limit,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Internal Server Error!",
    });
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    //validation
    //passed proper products -> for example quantiy and productId
    //product is valid or not. product is exist in our database
    //if user cart is already exist then alter cart

    const cartExist = await cartModel.findOne({ userId: req.userId }).lean();

    if (cartExist) {
      // loop thrught all the product of cart if product is exist then update the product if not then add that product

      const udpatedCartProduct = [
        ...(cartExist.products || []),
        ...req.body.products,
      ];

      const updatedCart = await cartModel
        .findOneAndUpdate(
          {
            userId: req.userId,
          },
          {
            $set: {
              products: udpatedCartProduct,
            },
          },
          { new: true }
        )
        .lean();

      return res.status(200).json({
        messaeg: "Added Successfully",
        data: updatedCart.products,
      });
    }

    let newCart = await cartModel({
      userId: req.userId,
      products: req.body.products,
    }).save();

    res.status(200).json({
      message: "success",
      data: newCart.products,
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Internal Server Error!",
    });
  }
};

exports.getCartProduct = async (req, res) => {
  try {
    console.log("req.userId", req.userId);
    const cartProducts = await cartModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(req.userId) },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: "$productData.title",
          productId: "$productData._id",
          thumbnail: "$productData.thumbnail",
          category: "$productData.category",
          price: "$productData.price",
          quntity: "$products.quantity",
          productTotalPrice: {
            $multiply: ["$productData.price", "$products.quantity"],
          },
        },
      },
      {
        $group: {
          _id: null,
          products: { $push: "$$ROOT" },
          totalPrice: { $sum: "$productTotalPrice" },
        },
      },
    ]);
    res.status(200).json(cartProducts);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err?.message || "Internal Server Error!",
    });
  }
};
