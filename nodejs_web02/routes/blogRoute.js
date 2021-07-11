const { Router } = require('express');
const { model } = require('mongoose');
const blogRouter = Router();
const { Blog } = require('../models/Blog')
//user 정보 가져오기
const { User } = require("../models/User")
const { isValidObjectId } = require("mongoose")
const mongoose = require("mongoose")
const authMiddleware = require('../middlewares/auth-middleware');
const jwt = require("jsonwebtoken");
// const moment = require("moment");



// authMiddleware, 
blogRouter.post('/', async(req, res) => {
    try{
        const { title, nickname, content, userId } = req.body;
        let user = await User.findById(userId);
        let blog = new Blog({ ...req.body, user});
        await blog.save();
        // const blogs = await Blog.find({}).sort("-createdAt ");
        // return res.render( 'board', { blogs })
        return res.send("sucess")
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})
blogRouter.get('/', async(req, res) => {
    try{
        const blogs = await Blog.find({}).sort("-createdAt ");
        // return res.send({ blogs });
        return res.render( 'board', { blogs })
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})
// authMiddleware, 
blogRouter.get('/write',async(req, res) => {
    try{
        console.log("글쓰기 입장")
        // const { user } = res.locals
        return res.render('write_blog')    
    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });
blogRouter.get('/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        const blog = await Blog.findOneAndUpdate({ _id: blogId });
        return res.send({ blog });
        
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})
blogRouter.put('/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { title, content } = req.body;
        const blog = await Blog.findOneAndUpdate(
            { _id: blogId }, 
            { title, content }, 
            { new: true}
        )
        return res.send({blog})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})
blogRouter.delete('/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        console.log(blogId)
        if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        const blog = await Blog.findOneAndDelete({ _id: blogId });
        console.log(blog)
        return res.send({blog})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})

blogRouter.patch('/:blogId/live', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { islive } = req.body
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { islive },
            { new: true }    
        )
        return res.send({blog});
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    }
})
//-----------------------------------------------------기존
blogRouter.get('/find/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        console.log("아이디찾기")
        // if (!isValidObjectId(blogId))
        //     res.status(400).send({err: err.message});
        const blog = await Blog.findOne({_id: blogId})
        return res.render( 'detail', { blog })

    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });

blogRouter.post('/update/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { title, content } = req.body;
        console.log(req.body);
    //   if(!age) return res.status(400).send({err: "check age"})
    //   if(typeof age != 'number') return res.status(400).send({err: "use only number"})
        const blog = await Blog.findByIdAndUpdate({ _id: blogId }, { title, content }, {new: true});
    //   return res.send({blog})
        res.redirect('/blog');
    
    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });
blogRouter.get('/modify/:blogId', async(req, res) => {
    try{
        const {blogId} = req.params;
        console.log(blogId);
        if(!isValidObjectId(blogId)) return res.status(400).send({err: "Invalid BlogId"});
        // return res.send({blog})
        const blog = await Blog.findOne({_id: blogId})
        return res.render( 'update', { blog })
        // console.log(blog);
        }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    })
blogRouter.get('/del/:blogId', async(req, res) => {
    try{
        const {blogId} = req.params;
        console.log(blogId);
        if(!isValidObjectId(blogId)) return res.status(400).send({err: "Invalid BlogId"});
        // return res.send({blog})
        const D_blog = await Blog.findOneAndDelete({_id: blogId});
        // return res.render( 'board', { blogs })
        // console.log(blog);
        res.redirect('/blog');
        }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    })

module.exports = {blogRouter}