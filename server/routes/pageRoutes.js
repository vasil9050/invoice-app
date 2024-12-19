const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const DIR = './public/temp/';
const router = express.Router();
const { read, utils } = require('xlsx');
const Product = require('../models/product');
const Invoice = require('../models/invoice');

// const auth = require('../controllers/auth');
// const config = require('../config/secret.json');
// const { authenticationToken } = require('../utils/AuthUtils');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const filePath = path.join(DIR);
//     if (!fs.existsSync(filePath)) {
//       fs.mkdirSync(filePath, { recursive: true });
//       cb(null, DIR);
//     } else {
//       cb(null, DIR);
//     }
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, uuidv4() + '-' + fileName);
//   },
// });

const storage = multer.memoryStorage();

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .xlsx format allowed!'));
    }
  },
});

router.post('/uploadxl', upload.single('file'), UploadXl);
router.get('/productData', ProductData);
router.post('/invoice', InvoiceSubmit);
router.get('/getinvoice', GetInvoice);
router.delete('/deleteInvoice/:id', InvoiceDelete);

module.exports = router;

async function UploadXl(req, res) {
  try {
    const file = read(req.file.buffer, { type: 'buffer' });

    let data = [];

    const sheets = file.SheetNames;

    for (let i = 0; i < sheets.length; i++) {
      const temp = utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }

    let lastPartType = null;
    let lastPartDescription = null;
    let lastProductInfo = null;

    await data?.forEach((i) => {
      if (i.PartType) {
        lastPartType = i.PartType;
      } else if (lastPartType) {
        i.PartType = lastPartType;
      }

      if (i.PartDescription) {
        lastPartDescription = i.PartDescription;
      } else if (lastPartDescription) {
        i.PartDescription = lastPartDescription;
      }

      if (i.ProductInfo) {
        lastProductInfo = i.ProductInfo;
      } else if (lastProductInfo) {
        i.ProductInfo = lastProductInfo;
      }
    });

    const newProduct = Product.insertMany(data);
    console.log('Product inserted');
  } catch (error) {
    console.log('>>> ERROR', error);
  }
}

async function ProductData(req, res) {
  try {
    const response = await Product.find();
    res.json(response);
  } catch (error) {
    console.log('ERROR', error);
  }
}

async function InvoiceSubmit(req, res) {
  try {
    console.log(req.body);
    const newProduct = Invoice.insertMany(req.body);
    console.log('Product inserted');
  } catch (error) {
    console.log('ERROR', error);
  }
}

async function GetInvoice(req, res) {
  try {
    console.log('>>> Fetching Invoices');

    // Execute the query and retrieve all invoices
    const invoices = await Invoice.find().lean(); // `.lean()` simplifies the result to plain objects

    // Send the response as JSON
    res.status(200).json(invoices);
  } catch (error) {
    console.error('ERROR', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices.' });
  }
}

async function InvoiceDelete(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Invoice ID is required." });
    }

    const result = await Invoice.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Invoice not found." });
    }

    res.status(200).json({ message: "Invoice deleted successfully." });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
}