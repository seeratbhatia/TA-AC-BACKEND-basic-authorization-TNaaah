var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "Register", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    slug: String,
  },
  { timestamps: true }
);

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;