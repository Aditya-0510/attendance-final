const {Router, response}=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const userRouter=Router();
require('dotenv').config();
const {auth_user}=require('../middlewares/user')
const {UserModel, CourseModel,AttendanceModel, CurrentclassModel,MarkedModel}=require("../db");
const nodemailer = require('nodemailer');
const cors=require('cors');
const otpStore = new Map(); // Store email -> OTP pairs temporarily

// Configure nodemailer (use your email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'proxypakki@gmail.com',
    pass: 'rrtr uzwn ybme gkal'
  }
});




userRouter.use(cors({
    origin: 'https://proxy-pakki.onrender.com', // Allow only this origin
}));

userRouter.post('/signup', async (req, res) => {
  const { email, password, name, roll, batch } = req.body;

  try {
    const user=await UserModel.findOne({
        email:email
    })
    if(!user){
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Store user data against the OTP
    otpStore.set(otp, { email, password, name, roll, batch });

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
        msg:"User already exists "
    })
}
  } catch (err) {
    res.status(500).send({ msg: 'Failed to send OTP' +err});
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
  

  userRouter.post("/forget-user",async function(req,res){
        const email=req.body.email;
        console.log(email);
        try{
            const user= await UserModel.findOne({
                email:email
            })
            if(!user){
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
                
                    res.send({ msg: 'OTP sent to email. Please verify.' ,done:true});
                  } catch (err) {
                    res.status(500).send({ msg: 'Failed to send OTP' +err});
                  }
            }
        }
        catch(e){
            return res.status(500).send({
                msg:"Internal server error"
            })
        }
  })
  userRouter.post("/forget-verify",async function(req,res){
    const {otp}= req.body;
    console.log(otp);
    try {
        const userData = otpStore.has(parseInt(otp));
        console.log(userData);
        if (!userData) {
            return res.status(400).send({ msg: 'Invalid or expired OTP', success:false });
          }
            otpStore.delete(parseInt(otp),true);
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
  userRouter.post("/reset",async function(req,res){
    const password=req.body.password
    const email=req.body.email;
    const hashedPass = await bcrypt.hash(password, 5);
    try{
        await UserModel.updateOne(
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
            return res.send({
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
// userRouter.post("/marker",async function(req,res){
//     const userid=req.user.id;
//     const coursecode=req.body.coursecode;


// })
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
userRouter.get("/attendance-checker",async function(req,res){
    const userid=req.user.id;
    const ip=req.query.ip;
    console.log(ip+"        "+"gfdcjgvkhcgffffhvjvkgcfxdfcghvjvgcxdfchvjcgxdcvjcfhxhdfgchvj");
    try{
        const student = await MarkedModel.findOne({
            $or: [
                { studentid: userid },
                {ip:ip}
            ]
        })
        if(student){
            res.send({
                msg:"You have already marked one attendance",
                marked:true
            })
        }
        else{
            res.send({
                marked:false
            })
        }

    }
    catch(e){
        res.status(500).send({
            msg:"Internal server error"
        })
    }

})
userRouter.post('/mark-attendance',async function(req,res){
    let coursecode=req.body.coursecode;
    let hour=req.body.hour;
    let user=req.user.id;
    let ispresent=req.body.ispresent;
    let ip=req.body.ip;
    console.log(hour);
    console.lo
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
        await MarkedModel.create({
            coursecode:id,
            ispresent:ispresent,
            studentid:user,
            ip:ip

      })
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
        console.log("helloooooooooo");
        if(clas){
            
            res.send({
                msg:"Class is going,You cannot Signout",
                ongoing:true
            })
        }
        else{
            res.send({
                msg:"Signed out successfully",
                ongoing:false
            })
        }
    }
        catch(e){
            res.send({
                msg:"Internal server error"
            })
        }
})
module.exports={
    userRouter:userRouter
}