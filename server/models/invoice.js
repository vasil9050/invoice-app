const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  partType: {
    type: String,
    required: true,
    description: "Type of part",
  },
  partDescription: {
    type: String,
    required: true,
    description: "Description of the part",
  },
  color: {
    type: String,
    required: true,
    description: "Color of the product",
  },
  quantity: {
    type: String,
    required: false,
    description: "Quantity of the product, can be empty if single",
  },
  partNumber: {
    type: String,
    required: true,
    description: "Unique identifier for the part",
  },
  productInfo: {
    type: String,
    required: true,
    description: "Additional information about the product",
  },
  selectionType: {
    type: String,
    enum: ["single", "bulk"],
    required: true,
    description: "Selection type, either 'single' or 'bulk'",
  },
});

const invoiceSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    description: "Name of the customer",
  },
  date: {
    type: Date,
    required: true,
    description: "Date of the invoice",
  },
  products: {
    type: [productSchema],
    required: true,
    description: "List of products in the invoice",
  },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
