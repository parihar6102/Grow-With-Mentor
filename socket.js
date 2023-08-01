const io = require('socket.io')(8000, { cors: { origin: '*' } });
const io1 = require('socket.io')(8001, { cors: { origin: '*' } });
const path = require('path')
const bcrypt = require('bcryptjs');
require('dotenv').config();

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS
  }
});

const mongoose = require('mongoose');
connect_db().catch(err => console.error(err));

async function connect_db() {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
}

const schemas = require('./schemas.js');
const {student} = schemas.student;
const {user_otp} = schemas.user_otp;


io.on('connection', async(socket) => {
  socket.on('send_email', async (email) => {
    otp = Math.floor(((Math.random()) * 8999) + 1000);
    otp=otp.toString();
    var email_otps = await user_otp.find({email:email});
    if (email_otps.length >= 5) 
    {
      socket.emit('limit_exceed');
    }
    else 
    {
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Grow with mentor',
        text: `Your otp for registration in growwithmentor is : ${otp} \n This otp is valid for next 5 minutes`
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          socket.emit('email_not_sent');
        }
        else {
          otp = await bcrypt.hash(otp,8);
          const opt1 = new user_otp({email:email,otp:otp});
          await opt1.save();
          socket.emit('email_sent');
          setTimeout(async () => {
            await user_otp.deleteMany({email:email,otp:otp});
          }, 300000);
        }
      });
    }
  });

  socket.on('checkotp', async (data) => {
    const email = data.email;
    const otp = data.otp;
    const val = await user_otp.find({email:email},{otp:1});
    let flag = false;
    for(var i=0;i<val.length;i++)
    {
      var response = await bcrypt.compare(otp,val[i].otp);
      if(response)
      {
        flag=true;
        break;
      }
    }
    if (flag==true) {
      socket.emit('true_registration');
    }
    else
      socket.emit('wrong_otp');
  });
});










const {email_otp} = schemas.email_otp;
const {mob_otp} = schemas.mob_otp;

io1.on('connection',async (socket)=>{
  
  socket.on('email_otp',async (email)=>{
    otp = Math.floor(((Math.random()) * 899999) + 100000);
    otp=otp.toString();
    var otp_cnt = await email_otp.find({email:email});
    if (otp_cnt.length >= 5) 
    {
      socket.emit('email_otp_limit');
    }
    else 
    {
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'GWM Email Verification',
        text: `Your otp for email verification in growwithmentor is : ${otp} \n This otp is valid for next 10 minutes`
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          socket.emit('email_otp_fail');
        }
        else {
          otp = await bcrypt.hash(otp,8);
          const otp1 = new email_otp({email:email,otp:otp});
          await otp1.save();
          socket.emit('email_otp_success');
          setTimeout(async () => {
            await email_otp.deleteMany({email:email,otp:otp});
          }, 600000);
        }
      });
    }
  });

  socket.on('mob_otp',async (mob_no)=>{
    otp = Math.floor(((Math.random()) * 899999) + 100000);
    otp=otp.toString();
    var otp_cnt = await mob_otp.find({mob:mob_no});
    if (otp_cnt.length >= 5) 
    {
      socket.emit('mob_otp_limit');
    }
    else 
    {
        // send otp on whatsapp on mob_no
        // if otp sent successfully 
        // socket.emit('mob_otp_success');
        // else
        //   socket.emit('mob_otp_fail')
    }
  });

});