const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const blogRouter = Router();
const { Blog } = require("../models/Blog");

// const { author, title, content, password } = req.body;
// const author = req.body.author 
// const title = req.body.title
// const content = req.body.content
// const password = req.body.password
// if(typeof author != "string") 
//     res.status(400).send({err: "Invalid author"});
// if(typeof title != "string") 
//     res.status(400).send({err: "Invalid title"});
// if(typeof content != "string") 
//     res.status(400).send({err: "Invalid content"});
// if(typeof password != "string") 
//     res.status(400).send({err: "Invalid password"});

blogRouter.post('/save_blog', async(req, res) => {
    try{
        console.log("hello")
        const { author, title, content, password } = req.body;
        console.log(req.body)
        // const goods = await Goods.find({ category }).sort("-goodsId");
        // res.json({ goods: goods });
        const blogs = new Blog(req.body);
        await blogs.save();
        // return res.send({ blog })
        // return res.render( 'index', { blogs })
        res.redirect('/');//url을 물고감
    }catch (err) {
        console.error(err);
        return res.status(500).send({err: err.message})
        }
    });

blogRouter.get('/', async(req, res) => {
    try{
        // const { createdAt } = req.query
        const blogs = await Blog.find({ }).sort("-createdAt ");
        // return res.send({ blogs });
        console.log(blogs)
        return res.render( 'index', { blogs })
        // console.log("완료")

    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });

blogRouter.get('/write', async(req, res) => {
    try{
        return res.render( 'write_blog' )

    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });

blogRouter.get('/find/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        console.log("아이디찾기")
        if (!isValidObjectId(blogId))
            res.status(400).send({err: err.message});
        const blog = await Blog.findOne({_id: blogId})
        return res.render( 'detail', { blog })
        console.log(blog)
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
        return res.render( 'check_pw_up', { blogId })
        // console.log(blog);
      }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
      }
    })


blogRouter.post('/check_pw_up/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { input_password } = req.body;
        console.log(input_password);
        const blogs  = await Blog.findOne({ _id: blogId }); 
        console.log(blogs);
        if (blogs['password'] != input_password) return res.status(400).send({err: err.message})
        const blog = await Blog.findOne({_id: blogId})
        return res.render( 'update', { blog })
        // console.log(blog)

    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });


blogRouter.post('/update/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { author, title, content, password } = req.body;
        console.log(req.body);
    //   if(!age) return res.status(400).send({err: "check age"})
    //   if(typeof age != 'number') return res.status(400).send({err: "use only number"})
        const blog = await Blog.findByIdAndUpdate({ _id: blogId }, { author, title, content, password }, {new: true});
    //   return res.send({blog})
        res.redirect('/');
    
    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    });

// 패치 patch    
// blogRouter.patch('/:blogId', async(req, res) => {
//     try{
    
//     }catch(err){
//         console.log(err);
//         return res.status(500).send({err: err.message})
//         }
//     });

// blogRouter.get('/del/:blogId', async(req, res) => {
//     try{
//         const {blogId} = req.params;
//         console.log(blogId);
//         if(!isValidObjectId(blogId)) return res.status(400).send({err: "Invalid BlogId"});
//         const blog = await Blog.findOneAndDelete({_id: blogId});
//         // return res.send({blog})
//         res.redirect('/blog');
//         console.log(blog);
//       }catch(err){
//         console.log(err);
//         return res.status(500).send({err: err.message})
//       }
//     })


blogRouter.get('/del/:blogId', async(req, res) => {
    try{
        const {blogId} = req.params;
        console.log(blogId);
        if(!isValidObjectId(blogId)) return res.status(400).send({err: "Invalid BlogId"});
        // return res.send({blog})
        return res.render( 'check_pw_del', { blogId })
        // console.log(blog);
      }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
      }
    })


blogRouter.post('/check_pw_del/:blogId', async(req, res) => {
    try{
        const { blogId } = req.params;
        const { input_password } = req.body;
        console.log(input_password);
        const blogs  = await Blog.findOne({_id: blogId}); 
        console.log(blogs);
        if (blogs['password'] != input_password) return res.status(400).send({err: err.message})
        const D_blog = await Blog.findOneAndDelete({_id: blogId});
        console.log(D_blog);
        res.redirect('/');
        // return res.send({ blog });

        }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
        }
    })
    


    // const { title, description, password: inputPassword, url } = req.body; 
    // const { password } = await Board.findOne({ id }); const pwdChk = await bcrypt.compare(inputPassword, password); 
    // if (pwdChk) { await Board.updateOne({ id }, { title, description, url }) 
    // res.json({ ok: true, url: `/${id}` }); }



module.exports = { blogRouter }
