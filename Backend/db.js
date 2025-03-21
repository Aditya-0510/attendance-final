const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const ObjectId=Schema.ObjectId;


const user= new Schema({
    email:{type:String,unique:true},
    password:String,
    Name:String,
    rollno:String,
    Batch:String
})

const attendance= new Schema({
    coursecode:ObjectId,
    hours:{type:Number,default:0},
    studentid:ObjectId,
})

const marked=new Schema({
    coursecode:ObjectId,
    ispresent:Boolean,
    studentid:ObjectId,
    ip:String
})

const admin= new Schema({
    email:{type:String,unique:true},
    password:String,
    Name:String,
    
})
const currentclass=new Schema({
    Coursecode:String,
    Title:String,
    Batch:String,
    Hours:Number,
    adminId:ObjectId,
})
const course= new Schema({
    coursecode:String,
    title:String,
    total_hours:{type:Number,default:0},
    adminId:ObjectId
})
const UserModel=mongoose.model("user",user);
const AdminModel=mongoose.model("admin",admin);
const CourseModel=mongoose.model("course",course);
const AttendanceModel=mongoose.model("attendance",attendance)
const CurrentclassModel=mongoose.model("currentclass",currentclass);
const MarkedModel=mongoose.model("marked",marked)
module.exports={
    UserModel:UserModel,
    AdminModel:AdminModel,
    CourseModel:CourseModel,
    AttendanceModel:AttendanceModel,
    CurrentclassModel:CurrentclassModel,
    MarkedModel:MarkedModel
}