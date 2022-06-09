var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String,
  },
  price: { type: Number, required: true },
});

module.exports = new mongoose.model("Product", productSchema);