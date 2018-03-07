const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, index: true },
  gender: { type: String, index: true },
  price: { type: Number, required: true },
  sizes: { type: [String] },
  colors: { type: [String] },
  imageUrl: { type: [String], default: [] }
});

module.exports = {
  Product: mongoose.model('Product', ProductSchema)
};