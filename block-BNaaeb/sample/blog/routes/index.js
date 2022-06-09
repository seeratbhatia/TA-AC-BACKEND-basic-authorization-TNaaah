var express = require("express");
var router = express.Router();
var Product = require("../models/product");

/* GET home page. */
router.get("/", function (req, res, next) {
  Product.find({}, (err, items) => {
    if (err) return next(err);
    res.render("index", { items });
  });
});

module.exports = router;