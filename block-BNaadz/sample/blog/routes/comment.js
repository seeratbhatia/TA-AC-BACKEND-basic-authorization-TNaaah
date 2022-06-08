const express = require('express');
const router = express.Router();

const Comment = require('../models/comment');
const Article = require('../models/article');

router.get('/:id/edit', (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render('updateComment', { comment });
  });
});

router.post('/:id', (req, res, next) => {
  console.log(req.body);
  const id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if (err) return next(err);
    res.redirect('/articles/' + updatedComment.articleId);
  });
});

router.get('/:id/delete', (req, res, next) => {
  const commentId = req.params.id;
  Comment.findByIdAndRemove(commentId, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      comment.articleId,
      { $pull: { comments: comment._id } },
      (err, article) => {
        res.redirect('/articles/' + comment.articleId);
      }
    );
  });
});

module.exports = router;
