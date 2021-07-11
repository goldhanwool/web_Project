const { Router } = require('express');
const userRouter = Router();
const { User } = require('../models/User') 
const mongoose = require("mongoose")


userRouter.get('/', async(req, res) => {
    try{
        const users = await User.find({});
        return res.send({users})
    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})

userRouter.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId);
      if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
      console.log(userId);
      const user = await User.findOne({ _id: userId })
      console.log(user);
      return res.send({ user });

    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: err.message })
    }
  })
 
  userRouter.post('/', async (req, res) => {
    try {
      //users.push({nickname:req.body.nickname, email:req.body.email,  password:req.body.password, confirmPassword:req.body.confirmPassword }) 
      let { nickname, email, password, confirmPassword } = req.body; 
      if (password!==confirmPassword) return res.status(400).send({ err: "check yor password" })
      const user = new User(req.body);//User는 일종의 클래스? User에 들어가서 body에 받아온 내용을 넣는다. 
      await user.save(); //User의 인스턴스를 만들다
      res.redirect('/');
      // return res.render( 'login' )
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: err.message })
    }
  })

  userRouter.delete('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      // if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
      const user = await User.deleteOne({ _id: userId });
      return res.send({ user })
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: err.message })
    }
  })

  userRouter.put('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
      const { email, nickname, password } = req.body;
      let updateBody = {}
      if(nickname) updateBody.nicknamel = nickname;
      if(password) updateBody.password = password;
      if(email) updateBody.email = email; 
      const user = await User.findByIdAndUpdate(userId, updateBody, {new: true});
      return res.send({ user })
    } catch (err) {
      console.log(err);
      return res.status(500).send({ err: err.message })
    }
  })

  module.exports = {
      userRouter
  }