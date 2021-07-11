const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const { userRouter } = require('./routes/userRoute')
const nunjucks = require('nunjucks')
const { blogRouter } = require('./routes/blogRoute');


//ejs 템플릿 엔진
const server = async () => {
  try{
    //몽고디비연결
    await mongoose.connect('mongodb://localhost/s_blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    });
    mongoose.set('debug', true)
    console.log("mongoDB connected")
    
     
    app.set('view engine', 'html');
    nunjucks.configure('views', { express: app, watch: true});//app => server
    // app.set('view engine', 'ejs');

    app.use(express.json())
    //HTML Parser
    app.use(express.urlencoded({ extend: false }));

    //블로그 연결
    app.use('/', blogRouter);
    // app.use('/del', deleteRouter);
    

// Port setting
    const port = 5000;
    app.listen(port, function(){
      console.log('server on! http://localhost:' + port);

    })
  }catch(err){
    console.log(err)
  }
}

server()
