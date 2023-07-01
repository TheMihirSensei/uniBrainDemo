const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: Number,
  },
});

module.exports = model("product", productSchema);
