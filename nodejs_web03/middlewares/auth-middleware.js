const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

module.exports = (req, res, next) => {
    console.log(req.headers);
    const { authorization } = req.headers;
    const [ tokenType, tokenValue ] = authorization.split(' ');
    console.log(tokenType, tokenValue)
    if(tokenType !== 'Bearer'){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요'
        });
        return;
    }
    try{
        console.log('userId 확인')
        console.log(jwt.verify(tokenValue, "customized-secret-key"))
        const {userId} = jwt.verify(tokenValue, "customized-secret-key");
        User.findById(userId).exec().then((user) => {
            res.locals.user = userId;
            console.log(user)
            console.log("토큰확인완료")
            next();
        }); 
    }catch(error){
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요"
        })
    }
}
