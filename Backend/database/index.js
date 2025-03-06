const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
require('dotenv').config();
// const {createUserRoutes}=require('./routes/user');
// const {createCourseRoutes}=require('./routes/courses')
const {userRouter}=require('./routes/user');
const {courseRouter}=require('./routes/courses');
const {adminRouter}=require('./routes/admin');
const mongoose=require('mongoose');
const {CourseModel}=require('./db')
// const { adminRouter } = require('./routes/admin');

// mongoose.connect("mongodb+srv://ayushmaan:ayushmaan@cluster0.5cua8.mongodb.net/coursera")

const app = express();
app.use(express.json());

app.use('/user',userRouter);
app.use('/courses',courseRouter); // better convention or way to route the requests 
app.use('/admin',adminRouter);

// createUserRoutes(app);
// createCourseRoutes(app);
// app.get('/course',async function(req,res){
//     try{
//         let courses=await CourseModel.find();
//         res.send(courses);
//     }catch(e){
//         res.status(500).send({
//         msg:"Internal server error"
//         })
//     }
// })
(async function main(){
await mongoose.connect(process.env.MONGOURI)
app.listen(5000);
})();