var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var Product = require("../models/product");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

var filePath = __dirname.split("routes")[0];

/* GET home page. */
router.get("/", (req, res, next) => {
  Product.find({}, (err, items) => {
    if (err) return next(err);
    res.render("imagesPage", { items });
  });
});

// Step 8 - the POST handler for processing the uploaded file

router.post("/", upload.single("image"), (req, res, next) => {
  var obj = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    type: req.body.type,
    image: {
      data: fs.readFileSync(
        path.join(filePath + "/uploads/" + req.file.filename)
      ),
      contentType: "image/png",
    },
    price: req.body.price,
  };
  Product.create(obj, (err, item) => {
    if (err) {
      console.log(err);
    } else {
      // item.save();
      res.redirect("/products");
    }
  });
});

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndDelete(id, (err, product) => {
    if (err) return next(err);
    res.redirect("/products");
  });
});

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    res.render("editProducts", { product });
  });
});

router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Product.findById(id, (err, product) => {
    if (err) return next(err);
    console.log(product);
    res.render("singleProduct", { product });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Product.findByIdAndUpdate(id, req.body, (err, updatedproduct) => {
    if (err) return next(err);
    console.log(updatedproduct);
    res.redirect("/products/" + id);
  });
});

module.exports = router;