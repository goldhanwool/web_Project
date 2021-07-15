const express = require("express");
const mongoose = require("mongoose");
const nunjucks = require('nunjucks')
const { Blog } = require("./models/Blog") 
const { User } = require("./models/User"); 
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middlewares/auth-middleware");


//DB연결
mongoose.connect("mongodb://localhost/board-4end", {
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: true,
useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

//app정의
const app = express();
const router = express.Router();
//라우터 index를 쓰게한다

// app.set('view engine', 'html');
// nunjucks.configure('views', { express: app, watch: true});
app.use(express.urlencoded({ extended: false }), router);

app.use(express.json());
app.set('view engine', 'html');

//nunjucks 탬플릿
nunjucks.configure('views', {
    express: app,
    watch: true,
  });



//게시판 글쓰기-----------------------
router.get('/blog/write/detail', async(req, res) => {
    const userId = res.locals.user
    try{
        const user = await User.findOne({ _id: userId })
        return res.render('blog_write', {username: user.username})
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    };
});

//게시판 리스트------------------------   
router.get('/blog', async(req, res) => {
    const blogs = await Blog.find({}).sort("-createdAt")
    return res.render('blog', {blogs})
});

//글쓰기 입장---------------------------------------
router.post('/blog/write', async(req, res) => {
    try{
        console.log("글작성서버입장");
        const { username, title, content } = req.body;
        console.log(req.body)
        const blog = await new Blog({...req.body});
        console.log(blog)
        await blog.save();
        console.log("글작성디비저장완료");
        return res.send("success");
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message});
    };
});


router.get('/blog/write', authMiddleware, async(req, res) => {
    const userId = res.locals.user
    try {
        const user = await User.findOne({ _id: userId })
        const username = user.username
        return res.send({ 'result':'success', 'username': username})    

    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

//게시판 상세-------------------------
router.get('/blog/:blogId', async(req, res) => {
    try {
        const { blogId } = req.params
        const blogDetail = await Blog.findOne({ _id: blogId })
        console.log(blogDetail)
        return res.render('blog_detail', {blogDetail})    
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

//게시판 업데이트-------------------------
router.get('/blog/update/:blogId', async(req, res) => {
    console.log("업데이트입장");
    try {
        const { blogId } = req.params
        const blogUpdate = await Blog.findOne({ _id: blogId })
        console.log(blogUpdate)
        return res.send({'result':'success'})    
    }catch(err){
        console.log(err);
        res.status(500).send({err: err.message})
    }
});

// router.get('/blog/:blogId/update', authMiddleware, async(req, res) => {
//     try {
//         const { blogId } = req.params
//         const blogUpdate = await Blog.findOne({ _id: blogId })
//         console.log(blogUpdate)
//         return res.send({blogUpdate})    
//     }catch(err){
//         console.log(err);
//         res.status(500).send({err: err.message})
//     }
// });



//게시판 코멘트 쓰기-------------------------
router.post('/blog/:blogId/comment', async(req, res) => {

});

//회원가입-----------------------
router.get('/user/register', async(req, res) => {
    return res.render('member_register') 
});

router.post('/user/register', async(req, res) => {
    console.log("유저입장");
    const { username, email, password, confirmPassword } = req.body;
    const exist = await User.findOne({ username });
    if (exist == username) {
        res.statusCode = 400;
        res.send({msg:`중복된 닉네임입니다.`});
        return;
    }

    // 닉네임 검증 reg
    if (!/[a-zA-Z0-9]+/.test(username) || username.length < 3) {
        res.statusCode = 400;
        res.send(`닉네임은 3자이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9) 를 포함해야합니다.`);
        return;
    }

    // 패스워드 검증
    if (password.includes(username) || password.length < 4) {
        res.statusCode = 400;
        res.send(`비밀번호는 4자이상이며 닉네임을 포함하면 안됩니다.`);
        return;
    }
    // 두 패스워드가 같은지 검사
    if (password !== confirmPassword) {
        res.statusCode = 400;
        res.send(`비밀번호가 일치하지 않습니다.`);
    }
    const user = new User({
        username,
        password,
    });
    
    await user.save();
    res.statusCode = 200;
    console.log("보내기")
    res.send("가입성공");
});

//로그인-----------------------
router.get('/user/login', async(req, res) => {
    return res.render('login') 
});

router.post('/user/login', async(req, res) => {
    console.log("로그인입장")
    const { username, password } = req.body
    console.log(username, password)
    const user = await User.findOne({username, password}).exec();

    if(!user){
        res.status(400).send({
            errorMessage: "이메일 패스워드의 잘못"
   });
   return;
}
    console.log(user)
    const token = jwt.sign({userId: user.id}, "customized-secret-key");
    res.send({
        token,
    });
    console.log("비번확인", user, token);
});

//port
app.listen(2000, () => {
    console.log('server on! http://localhost:2000');
});
