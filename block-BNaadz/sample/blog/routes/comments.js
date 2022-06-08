var express = require("express");
const Article = require("../models/article");
var router = express.Router();
var Comment = require("../models/comment");

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render("editComment", { comment });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedcomment) => {
    if (err) return next(err);
    res.redirect("/articles/" + updatedcomment.articleId);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndRemove(id, (err, deletedcomment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      deletedcomment.articleId,
      { $pull: { comments: deletedcomment._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + deletedcomment.articleId);
      }
    );
  });
});

module.exports = router;
