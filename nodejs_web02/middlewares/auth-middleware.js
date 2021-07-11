const jwt = require("jsonwebtoken");
// const { User } = require("../models/user");

//토근 검사모듈
module.exports  = (res, req, next) => {
    console.log(authorization)
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split('');
    console.log(tokenValue)
    if(tokenType !== 'Bearer'){
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }

    try{
        const { userId } = jwt.verify(tokenValue, "customized-secret-key");
        User.findById(userId).exec().then((user)=>{
            res.locals.user = user;
            next();
        });

    }catch(error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요",
        });
    }  
};

// const Token = model('token', jwtToken);
// module.exports = { Token }


