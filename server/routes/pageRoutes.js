const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const DIR = './public/temp/';
const router = express.Router();
const { read, utils } = require('xlsx');
const Product = require('../models/product');

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

    console.log(data);
    const newProduct = Product.insertMany(data);
    console.log('Product inserted', newProduct);
  } catch (error) {
    console.log('>>> ERROR', error);
  }
}

async function ProductData(req, res) {
  try {
    const response = await Product.find();
    console.log('>>>', response);
    res.json(response);
  } catch (error) {
    console.log('ERROR', error);
  }
}
