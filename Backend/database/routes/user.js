const {Router, response}=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const userRouter=Router();
require('dotenv').config();
const {auth_user}=require('../middlewares/user')
const {UserModel, CourseModel,AttendanceModel, CurrentclassModel}=require("../db");
const nodemailer = require('nodemailer');

const otpStore = new Map(); // Store email -> OTP pairs temporarily

// Configure nodemailer (use your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'proxypakki@gmail.com',
    pass: 'mifs gbfw sfzu awfm'
  }
});



userRouter.post('/signup', async (req, res) => {
  const { email, password, name, roll, batch } = req.body;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Store user data against the OTP
    otpStore.set(otp, { email, password, name, roll, batch });

    await transporter.sendMail({
      from: 'proxypakki@gmail.com',
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP for email verification is: ${otp}`
    });

    res.send({ msg: 'OTP sent to email. Please verify.' });
  } catch (err) {
    res.status(500).send({ msg: 'Failed to send OTP' });
  }
});


// OTP verification and user creation
userRouter.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
  
    try {
      const userData = otpStore.get(parseInt(otp));
      console.log(userData);
      if (!userData) {
        return res.status(400).send({ msg: 'Invalid or expired OTP', success:false });
      }
  
      const hashedPass = await bcrypt.hash(userData.password, 5);
  
      await UserModel.create({
        email: userData.email,
        password: hashedPass,
        Name: userData.name,
        rollno: userData.roll,
        Batch: userData.batch
      });
  
      otpStore.delete(parseInt(otp)); // Remove OTP after use
      res.send({ msg: 'User registered successfully' ,success:true});
    } catch (err) {
      res.status(500).send({ msg: 'Internal server error' });
    }
  });
  

  userRouter.post("/signin", async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        const user = await UserModel.findOne({
            email: email
        });
        
        // If user not found, return early with error message
        if (!user) {
            return res.status(401).send({
                msg: "Incorrect credentials",
                success: false
            });
        }
        
        const passwordmatch = await bcrypt.compare(password, user.password);
        
        if (passwordmatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_USER);
            return res.send({
                msg: "logged in successfully",
                success: true,
                token: token,
                user: user
            });
        } else {
            return res.status(403).send({
                msg: "invalid email or password"
            });
        }
    } catch (e) {
        return res.status(500).send({
            msg: "internal server error"
        });
    }
});

userRouter.use(auth_user);
userRouter.get('/profile',async function(req,res){
    const id=req.user.id
    try{
    const user=await UserModel.findOne({
        _id:id
    })
    console.log(user);
    res.send(user)
}
catch(e){
    res.status(500).send({
        msg:"internal server error"
    })
}
})
// userRouter.get('/getter',async function(req,res){
//     const userid=req.user.id;
//     try{
//         const user=await UserModel.findOne({
//             _id:userid
//         })
//         res.send(user);
//     }
//     catch(e){
//         res.status(500).send({
//             msg:"Internal server error"
//         })
//     }
// })
userRouter.get("/checker",async function(req,res){
    const userid=req.user.id
    try{
        const user=await UserModel.findOne({
            _id:userid
        })
        const batch=user.Batch;
        const clas=await CurrentclassModel.findOne({
            Batch:batch,
        })
        if(clas){
            res.send({
                ongoing:true,
                clas:clas
            });
        }
        else{
            res.send({
                ongoing:false
            })
        }
    }
    catch(e){
        res.status(500).send({
            msg:"internal server error"
        })
    }
})
userRouter.get('/total-attendance',async function(req,res){
    let Coursecode=req.query.Coursecode;
    let studentid=req.user.id;
    console.log(Coursecode);
    try{
        let course=await CourseModel.findOne({
            coursecode:Coursecode
        })
        let id=course._id;
        let attendance=await AttendanceModel.findOne({
            coursecode:id,
            studentid:studentid
        })
        let attendedHours=attendance.hours;
        let totalhours=course.total_hours;
        let percentage;
        if(totalhours!=0){
            percentage=(attendedHours/totalhours)*100;
        }
        else{
            percentage=0;
        }
        const data=[{
            coursecode:course.coursecode,
            title:course.title,
            attendedHours:attendedHours,
            totalhours:totalhours,
            percentage:percentage
        }]
        console.log(data);
        res.send(data)
    }
    catch(e){
        res.status(500).send({
            msg:"internal server error"
        })
    }
})
userRouter.post('/mark-attendance',async function(req,res){
    let coursecode=req.body.coursecode;
    let hour=req.body.hour;
    let user=req.user.id;
    let ispresent=req.body.ispresent;
    console.log(hour);
    try{
        let course=await CourseModel.findOne({
            coursecode:coursecode
        })
        let id=course._id;
        if(ispresent){
            let attendance=await AttendanceModel.findOne({
                coursecode:id,
                studentid:user
            })
            if(attendance){
            console.log(attendance.hours)
            let h=attendance.hours+hour;
            await AttendanceModel.updateOne(
                { coursecode: id, studentid: user }, // Filter criteria
                { $set: { hours: h } }, // Update operation using $set
                { upsert: false } // Optional: prevents creating a new document if none match
              );
              
        }
        else{
            await AttendanceModel.create({
                coursecode:id,
                studentid:user,
                hours:hour
            })
        }
        res.send({
            msg:"Attendance marked sucessfully",
            marked:true
        })
        }

    }
    catch(e){
        res.status(500).send({
            msg:`internal server error:${e}`
        })
    }

})

userRouter.post('/signout',async function(req,res){
    const userid=req.user.id
    try{
        const user=await UserModel.findOne({
            _id:userid
        })
        const batch=user.Batch;
        const clas=await CurrentclassModel.findOne({
            Batch:batch,
        })
        if(clas){
            
            res.send({
                msg:"breached you are marked absent"
            })
        }
    }
        catch(e){

        }
})
module.exports={
    userRouter:userRouter
}