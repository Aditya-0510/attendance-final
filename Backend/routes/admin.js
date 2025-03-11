const {Router}=require('express')
const adminRouter=Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const {auth_admin}=require('../middlewares/admin')
const cors=require('cors')
require('dotenv').config();
const {AdminModel,CourseModel, CurrentclassModel, AttendanceModel, UserModel, MarkedModel}=require("../db");


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



adminRouter.use(cors({
    origin: 'https://proxy-pakki.onrender.com', // Allow only this origin
}));


adminRouter.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const admin=await AdminModel.findOne({
        email:email
    })
    if(!admin){
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Store user data against the OTP
    otpStore.set(otp, { email, password, name});

    await transporter.sendMail({
        from: 'proxypakki@gmail.com',
        to: email,
        subject: 'Email Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Email Verification</h2>
            <p>Your OTP for email verification is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
          </div>
        `
      });

    res.send({ msg: 'OTP sent to email. Please verify.' });
}
else{
    res.send({
        msg:"faculty already exists"
    })
}
  } catch (err) {
    res.status(500).send({ msg: 'Failed to send OTP' });
  }
});


// OTP verification and user creation
adminRouter.post('/verify-otp', async (req, res) => {
    const { otp } = req.body;
    console.log(otp);
    try {
        const userData = otpStore.get(parseInt(otp));
        console.log(userData);
        if (!userData) {
          console.log("djebjkdbvkjbsdv")
        return res.status(400).send({ msg: 'Invalid or expired OTP',success:false });
      }
  
      const hashedPass = await bcrypt.hash(userData.password, 5);
  
      await AdminModel.create({
        email: userData.email,
        password: hashedPass,
        Name: userData.name,
      });
  
      otpStore.delete(parseInt(otp)); // Remove OTP after use
      console.log("hfhfhfh")
      res.send({ msg: 'User registered successfully',success:true });
    } catch (err) {
      res.status(500).send({ msg: 'Internal server error' });
    }
  });
// adminRouter.post("/signup",async function(req,res){
//     const email=req.body.email;
//     const password=req.body.password;
//     const name=req.body.name;
//     try{
//     await AdminModel.create({
//         email:email,
//         password:await bcrypt.hash(password,5),
//         Name:name
//     })
//     res.send({
//         msg:"registered sucessfully"
//     })
// }
// catch(e){
//     console.log(e);
//     res.status(409).send({
//         msg:"user already exists"
//     })
// }

// })


adminRouter.post("/forget-admin",async function(req,res){
        const email=req.body.email;
        try{
            const admin= await AdminModel.findOne({
                email:email
            })
            if(!admin){
                res.send({
                    msg:"Email not registered",
                    done:false
                })
            }
            else{
                try {
                    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
                
                    // Store user data against the OTP
                    otpStore.set(parseInt(otp));
                
                    await transporter.sendMail({
                        from: 'proxypakki@gmail.com',
                        to: email,
                        subject: 'Email Verification OTP',
                        html: `
                          <div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2>Email Verification</h2>
                            <p>Your OTP for email verification is:</p>
                            <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
                          </div>
                        `
                      });
                
                    res.send({ msg: 'OTP sent to email. Please verify.',done:true });
                  } catch (err) {
                    res.status(500).send({ msg: 'Failed to send OTP' });
                  }
            }
        }
        catch(e){
            return res.status(500).send({
                msg:"Internal server error"
            })
        }
  })
  adminRouter.post("/forget-verify-admin",async function(req,res){
    const { otp } = req.body;
    try {
        const adminData = otpStore.has(parseInt(otp));
        if (!adminData) {
            return res.status(400).send({ msg: 'Invalid or expired OTP', success:false });
          }
            otpStore.delete(parseInt(otp));
            res.send({
                msg:"otp verified successfully",
                success:true
            })
    }
    catch(e){
        res.status(500).send({
            msg:"Internal server error"
        })
    }

  })
  adminRouter.post("/reset-admin",async function(req,res){
    const password=req.body.password
    const email=req.body.email;
    const hashedPass = await bcrypt.hash(password, 5);
    try{
        await AdminModel.updateOne(
            { email: email },
            { $set: { password: hashedPass } } 
        );
        res.send({
            msg:"Password updated sucessfully"
        })
    }
    catch(e){
        res.status(500).send({
            msg:"Internal server error"
        })
    }
  })





adminRouter.post("/signin",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    
    try{
    const admin=await AdminModel.findOne({ // will return nothing or the user but if find is used then it will return [] or the array of the user.
        email:email
    })
    if(!admin){
        res.send({
            msg:"Incorrect credentials",
            success:false
        })
    }
    const passwordmatch=await bcrypt.compare(password,admin.password);
    if(passwordmatch){
        const token=jwt.sign({id:admin._id},process.env.JWT_SECRET_ADMIN);
        res.send({
            msg:"logged in sucessfully",
            token:token,
            admin:admin,
            success:true
        })
    }
    else{
        res.status(403).send({
            msg:"invalid email or password",
            success:false
        })
    }
}
catch(e){
   return res.status(500).send({
        msg:"internal server error"
    })
}

})

adminRouter.use(auth_admin);

adminRouter.get("/present",async function(req,res){
    const batch=req.query.batch;
    const title=req.query.title

    console.log("title"+title);
    console.log(batch+"hello");
    try{
        let attendance=[];
        const user=await UserModel.find({
            Batch:batch
        })
        for(let i=0;i<user.length;i++){
            let userId=user[i]._id
            const student = await MarkedModel.findOne({
                studentid:userId,
            })
            if(student){
                
                attendance.push({
                    rollno:user[i].rollno,
                    attendance:"Present"
                })
            }
            else{
                let email=user[i].email;
                let name=user[i].Name;
                await transporter.sendMail({
                    from: 'proxypakki@gmail.com',
                    to: email,
                    subject: 'Attendance Alert - Missed Class Notification',
                    html: `
                      <html>
                        <head>
                          <style>
                            body {
                              font-family: Arial, sans-serif;
                              padding: 20px;
                              background-color: #f4f4f4;
                              color: #333;
                              line-height: 1.6;
                            }
                            .email-container {
                              max-width: 600px;
                              background-color: #fff;
                              margin: 0 auto;
                              padding: 30px;
                              border-radius: 10px;
                              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                            }
                            h2 {
                              color: #D9534F;
                            }
                            p {
                              font-size: 16px;
                            }
                            .footer {
                              margin-top: 20px;
                              font-size: 14px;
                              color: #777;
                            }
                          </style>
                        </head>
                        <body>
                          <div class="email-container">
                            <h2>Dear ${name},</h2>
                            <p>Looks like you missed your <strong>${title}</strong> class! 📚</p>
                            <p>If this is news to you and you're certain you were present, we're sorry — you feel that way. Apps can make mistakes, but <strong>ProxyPakki</strong> doesn't. 😏</p>
                            <p>However, if you're convinced otherwise, you may report this discrepancy to the respective faculty. Just make sure you have a solid alibi! 🕵️‍♂️</p>
                            <div class="footer">
                              Best regards,<br>
                              <strong>ProxyPakki Team</strong>
                            </div>
                          </div>
                        </body>
                      </html>
                    `
                  });
                  
                  
                attendance.push({
                    rollno:user[i].rollno,
                    attendance:"Absent"
                })
            }

            await MarkedModel.deleteOne({
                studentid:userId
            });
        }

        console.log(attendance);
        res.send(attendance);
    }
    catch(e){
        console.log(e);
        res.status(403).send({
            msg:"internal server error"
        })
    }

})
adminRouter.get('/get-all',async function(req,res){
    const coursecode=req.query.coursecode;
    console.log(coursecode);
    try{
        const course=await CourseModel.findOne({
            coursecode:coursecode
        })
        const courseid=course._id
        console.log(courseid);
        const totalhours=course.total_hours
        const users=await AttendanceModel.find({
            coursecode:courseid
        })
        console.log(users);
        let data=[];
        for(let i=0;i<users.length;i++){
            let hour_attended=users[i].hours
            const user=await UserModel.findOne({
                _id:users[i].studentid
            })
            const rollno=user.rollno;
            let percentage=(hour_attended/totalhours)*100;
            data.push({
                rollno:rollno,
                percentage:percentage
            })
        }
        console.log(data);
        res.send(data);
    }
    catch(e){
        return res.status(404).send({
            msg:"Internal server error"
        })
    }
    
})
adminRouter.get('/profile',async function(req,res){
    const id=req.admin.id
    try{
    const admin=await AdminModel.findOne({
        _id:id
    })
    console.log(admin);
    res.send(admin)
}
catch(e){
    return res.send({
        msg:"internal server error"
    })
}
})

adminRouter.get("/checker",async function(req,res){
    const adminid=req.admin.id
    try{
        const clas=await CurrentclassModel.findOne({
            adminId:adminid
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
adminRouter.post('/start-class',async function(req,res){
    const coursecode=req.body.coursecode;
    const hours=req.body.hours;
    const batch=req.body.batch;
    const title=req.body.title;
    const adminId=req.admin.id;
    console.log(hours);
    try{
        

        await CurrentclassModel.create({
            Coursecode:coursecode,
            Hours:hours,
            Title:title,
            adminId:adminId,
            Batch:batch
        })
        const course=await CourseModel.findOne({
            coursecode:coursecode,
        })
        let thour=course.total_hours;
        console.log(thour);
        thour=thour+parseFloat(hours)

     await CourseModel.updateOne(
        { coursecode: coursecode }, // Find by coursecode
        { $set: { total_hours: thour } } // Use $set to update the field
      );
      const user=await UserModel.find({
        Batch:batch
    })
    for(let i=0;i<user.length;i++){
        name=user[i].Name;
        email=user[i].email;
        await transporter.sendMail({
  from: 'proxypakki@gmail.com',
  to: email,
  subject: "Class in Session - Don't Miss Out!",
  html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
          }
          .email-container {
            max-width: 600px;
            background-color: #fff;
            margin: 0 auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #4A47A3;
          }
          p {
            font-size: 16px;
          }
          .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <h2>Dear ${name},</h2>
          <p>Your <strong>${title}</strong> class has just begun! 📚</p>
          <p>Head over to the <strong>ProxyPakki</strong> app and mark your presence. Your attendance definitely matters — not so sure about your attention. 😉</p>
          <p>See you in class!</p>
          <div class="footer">
            Best regards,<br>
            <strong>ProxyPakki Team</strong>
          </div>
        </div>
      </body>
    </html>
  `
});

}
    res.send({
        msg:"Class has been raised",
        success:true
    })
}
catch(e){
    res.status(500).send({
        msg:"Internal server error",
        success:false
    })
}

})
adminRouter.delete("/end-class",async function(req,res){
    const adminId=req.admin.id;
    try{
        await CurrentclassModel.deleteOne({
            adminId:adminId
        })
        res.send({
            msg:"Class ended succesfully"
        })
    }
    catch(e){
        res.status(500).send({
            msg:"internal server error"
        })
    }
})
adminRouter.post('/add-course',async function(req,res){
    let coursecode=req.body.coursecode;
    // let totalh=req.body.totalh;
    let title=req.body.title;
    let admin=req.admin.id;
    try{
        await CourseModel.create({
            coursecode:coursecode,
            title:title,
            // total_hours:totalh,
            adminId:admin
        })
        res.send({
            msg:"course added sucessfully"
        })
    }
    catch(e){
        res.status(500).send({
            msg:"internal server error"
        })
    }
})
adminRouter.get('/courses',async function(req,res){
    const adminid=req.admin.id;
    const courses=await CourseModel.find({
        adminId:adminid
    })
    if(courses){
    res.send({
        courses:courses,
        isthere:true
    })
    }
    else{
        res.send({
            isthere:false
        })
    }
})
module.exports={
    adminRouter:adminRouter
}