// const express=require('express');
// const Router = express.Router;

const {Router}=require('express'); // both are same but this is oneliner to import
const {CourseModel}=require('../db')
const courseRouter=Router();
courseRouter.get("/preview",async function(req,res){
    try{
    let cours=await CourseModel.find();
    res.send(cours);
    }
    catch(e){
        res.status(500).send({
            msg:"Internal server error"
        })
    }
})
    
module.exports={
    courseRouter:courseRouter
}