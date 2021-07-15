const { Schema, model, Types } = require('mongoose')

const BlogSchema = new Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    username: {type: String, require: true}
}, { timestamps : true });

const Blog = model("blog", BlogSchema)
module.exports = { Blog };






