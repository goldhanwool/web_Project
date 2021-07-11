const mongoose = require("mongoose")
const { Router } = require("express");
const commentRouter = Router({ mergeParams: true});
const { Comment } = require("../models/Comment");
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");

commentRouter.post('/', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { content, userId } = req.body;
        //promise를 이용하여 병렬로 불러오기
        const [ blog, user] = await Promise.all([
            Blog.findByIdAndUpdate(blogId), //이 블로그에 업데이트 할 것이라는 
            User.findByIdAndUpdate(userId),
        ]);
        const comment = new Comment({ content, user, blog });
        await comment.save();
        return res.send({ comment });
    }catch(err){
        return res.status(400).send({ err: err.message })
    }
});

commentRouter.get('/', async(req, res) => {
    const { blogId } = req.params;
    const comments = await Comment.find({ blog: blogId });
    return res.send({ comments});
});

commentRouter.put('/:commentId', async(req, res) => {
    try{
        const { commentId } = req.params;
        const { content } = req.body;
        const comment = await Comment.findOneAndUpdate(
            { _id: commentId }, 
            { content }, 
            { new: true}
        )
        return res.send({comment})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})

commentRouter.delete('/:commentId', async(req, res) => {
    try{
        const { commentId } = req.params;
        console.log(commentId)
        if (!mongoose.isValidObjectId(commentId)) return res.status(400).send({ err: "invalid blogId" })
        const comment = await Comment.findOneAndDelete({ _id: commentId });
        console.log(comment)
        return res.send({comment})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})


module.exports = { commentRouter }