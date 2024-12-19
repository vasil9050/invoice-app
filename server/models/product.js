const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  ProductInfo: {
    type: String,
  },
  PartType: {
    type: String,
  },
  PartDescription: {
    type: String,
  },
  Color: {
    type: String,
  },
  PartNumber: {
    type: String,
  },
  Quantity: {
    type: String,
  },
  SingleP: {
    type: String,
  },
  BulkP: {
    type: String,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
