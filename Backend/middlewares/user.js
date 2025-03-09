const jwt=require('jsonwebtoken');
require('dotenv').config();
function auth(req,res,next){
    let token=req.headers.token;
    console.log(token)
    if(token){
    let user=jwt.verify(token,process.env.JWT_SECRET_USER);
    req.user=user;
    next();
    }
    else{
        res.status(403).send({
            msg:"not logged in"
        })
    }
}
module.exports={
    auth_user:auth
}