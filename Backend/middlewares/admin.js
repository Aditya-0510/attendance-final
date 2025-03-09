const jwt=require('jsonwebtoken');
const cors=require('cors');
require('dotenv').config();

function auth(req,res,next){
    let token=req.headers.token;
    console.log(token)
    if(token){
    let admin=jwt.verify(token,process.env.JWT_SECRET_ADMIN);
    req.admin=admin;
    next();
    }
    else{
        res.status(403).send({
            msg:"not logged in"
        })
    }
}

module.exports={
    auth_admin:auth
}