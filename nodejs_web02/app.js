const express = require("express");
const app = express();
//express서버에 라우터 메서드를 설정한 객체 정의 
const router = express.Router();
const mongoose = require("mongoose");
// const nunjucks = require('nunjucks')
const { User } = require('./models/User');
const { userRouter } = require('./routes/userRoute');
const { blogRouter } = require('./routes/blogRoute');
const { commentRouter } = require('./routes/commentRoute');
const nunjucks = require('nunjucks');
const authMiddleware = require('./middlewares/auth-middleware');
const jwt = require("jsonwebtoken");

//ejs 템플릿 엔진
const server = async () => {
  try {
    //몽구수 객체에 connect 메서드 넣기
    // mongoose.connect("mongodb://test:test@3.34.95.174:27017/dbTest", {
    mongoose.connect("mongodb://localhost/board-2end", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true
    });

    //디비연결을 위해 몽구스객체 담기
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));

    // app.use("/api", express.urlencoded({ extended: false }), router);
    app.use(express.urlencoded({ extend: false }));
    app.use(express.json());
    //HTML Parser
    //app.use(express.urlencoded({ extend: false }));

//-------------------------------------------------------------------------------------    
    app.set('view engine', 'html');
    nunjucks.configure('views', { express: app, watch: true});

//--------------------------------------------------------------------------------------
    app.get('/', async (req, res) => {
      return res.render( 'login' )
    })
    app.get('/register', async (req, res) => {
      return res.render( 'register' )
    })

    app.use('/user', userRouter);
    app.use('/blog', blogRouter);
    app.use('/blog/:blogId/comment', commentRouter);    

    app.post("/auth", async (req, res) => {
      const { email, password } = req.body
      console.log('email')
      const user = await User.findOne({email, password});
      console.log(user)
      if(!user){
          res.status(400).send({
              errorMessage: "이메일 패스워드의 잘못"
      });
      return;
    }
      const token = jwt.sign({userId: user.userId}, "customized-secret-key");
      res.send({
          token,
          user,
      });
      console.log(token)
      console.log("비번확인", user, token);
  });
  

    // Port setting
  app.listen(3000, function () {
    console.log('server on! http://localhost:3000');
  })




  } catch (err) {
    console.log(err)
  }
}

server()



// if (localStorage.getItem("token")) {
//   getSelf(function () {
//     alert("이미 로그인이 되어있습니다. 상품 페이지로 이동합니다.");
//     window.location.replace("/goods.html");
//   });
// }