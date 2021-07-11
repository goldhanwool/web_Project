const { Schema, model, Types } = require('mongoose')

const BlogSchema = new Schema({
    title: { type: String, require: true },
    nickname: { type: String, require: true },
    content: { type: String, require: true },
    // islive: { type: Boolean, required: true, default: false },
    // user: { type:Types.ObjectId, required: true, ref: "user"},
  }, { timestamps: true });

const Blog = model("blog", BlogSchema)
module.exports = { Blog };