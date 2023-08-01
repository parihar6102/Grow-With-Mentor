const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const io = require('socket.io');
const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const { emitKeypressEvents } = require('readline');
require('dotenv').config();
const socket = require('./socket');



const app = express();
const port = process.env.HOST_PORT;
const hostname = '127.0.0.1';



app.use('/static', express.static('static'));
app.set('view-engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded()); 


connect_db().catch(err => console.error(err));
async function connect_db() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);
}


const schemas = require('./schemas.js');
const {student} = schemas.student;
const {user_otp} = schemas.user_otp;
const {email_otp} = schemas.email_otp;
const {mob_otp} = schemas.mob_otp;
const {mentor} = schemas.mentor;


const auth_secret = async function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    try{
        let token = req.cookies.jwt;
        if(token)
        {
            let user_id = jwt.verify(token,process.env.JWT_KEY);
            let user = await student.find({_id:user_id._id});
            if(user_id)
            {
                let verify = user[0].tokens.filter((ele)=>{
                    return ele.token==token;
                });
                if(verify.length==0)
                {
                    res.clearCookie("jwt");
                    res.redirect("/sign_in");
                    res.end();
                }
                else
                {
                    let user_call = user[0]['email'].split('@')[0];
                    req.user_call = user_call;
                    req.det = user[0];
                    req.token = token;
                    next();
                }
            }
            else
            {
                res.redirect('/sign_in');
                res.end();
            }
        }
        else
        {
            res.redirect('/sign_in');
            res.end();
        }
    }
    catch{
        res.redirect('/sign_in');
        res.end();
    }
} 
const auth = async function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    try{
        let token = req.cookies.jwt;
        if(token)
        {
            let user_id = jwt.verify(token,process.env.JWT_KEY);
            let user = await student.find({_id:user_id._id});
            if(user_id)
            { 
                let verify = user[0].tokens.filter((ele)=>{
                    return ele.token==token;
                });
                if(verify.length==0)
                {
                    res.clearCookie("jwt");
                    next();
                }
                else
                {
                    let user_call = user[0]['email'].split('@')[0];
                    res.redirect(`/${user_call}/home`);
                    res.end();
                }
            }
            else
            {
                next();
            }
        }
        else
        {
            next();
        }
    }
    catch{
        console.log("Eror");
        next();
    }
} 
const auth_secret_fetch = async function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    try{
        let token = req.cookies.jwt;
        if(token)
        {
            let user_id = jwt.verify(token,process.env.JWT_KEY);
            let user = await student.find({_id:user_id._id});
            if(user_id)
            {
                let verify = user[0].tokens.filter((ele)=>{
                    return ele.token==token;
                });
                if(verify.length==0)
                {
                    res.clearCookie("jwt");
                    res.json(JSON.stringify({status:"session_expired"}));
                    res.end();
                }
                else
                {
                    let user_call = user[0]['email'].split('@')[0];
                    req.user_call = user_call;
                    req.det = user[0];
                    req.token = token;
                    next();
                }
            }
            else
            {
                res.json(JSON.stringify({status:"session_expired"}));
                res.end();
            }
        }
        else
        {
            res.json(JSON.stringify({status:"session_expired"}));
            res.end();
        }
    }
    catch{
        res.json(JSON.stringify({status:"session_expired"}));
        res.end();
    }
}

const auth_secret_fetch_img = async function(req,res,next){
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    try{
        let token = req.cookies.jwt;
        if(token)
        {
            let user_id = jwt.verify(token,process.env.JWT_KEY);
            let user = await student.find({_id:user_id._id});
            if(user_id)
            {
                let verify = user[0].tokens.filter((ele)=>{
                    return ele.token==token;
                });
                if(verify.length==0)
                {
                    res.type('jpg');
                    res.sendFile(path.resolve(`${path.join(__dirname,'profile/user_profile_pic.jpg')}`));
                    res.end();
                }
                else
                {
                    let user_call = user[0]['email'].split('@')[0];
                    req.user_call = user_call;
                    req.det = user[0];
                    req.token = token;
                    next();
                }
            }
            else
            {
                res.type('jpg');
                res.sendFile(path.resolve(`${path.join(__dirname,'profile/user_profile_pic.jpg')}`));
                res.end();
            }
        }
        else
        {
            res.type('jpg');
            res.sendFile(path.resolve(`${path.join(__dirname,'profile/user_profile_pic.jpg')}`));
            res.end();
        }
    }
    catch{
        res.type('jpg');
        res.sendFile(path.resolve(`${path.join(__dirname,'profile/user_profile_pic.jpg')}`));
        res.end();
    }
}


app.get("/", auth,(req, res) => {
    const params = {};
    res.render('home.pug', params);
    res.end();
});

app.get('/:user/home',auth_secret,async (req,res)=>{

    const det = req.det;
    const user_called = req.url.split('/')[1];
    const user_saved = req.user_call;
    if(user_called!=user_saved)
    {
        res.redirect(`/${user_saved}/home`);
        res.end();
    }
    else
    {
        const params={user:user_called};
        res.render('user_home.pug',params);
        res.end();
    }
});

app.get('/:user/mentor_reg',auth_secret,async (req,res)=>{
    let user_url = req.url.split('/')[1];
    if(user_url==req.user_call)
    {
        let params = {user:user_url,data:{}};
        const user_data = await mentor.findOne({user:req.user_call});
        if(user_data!=null)
            params.data = user_data;

        res.render('registration.pug',params);
    }
    else
    {
        res.redirect(`/${req.user_call}/mentor_reg`);
    }
});

app.get('/mentor_reg',auth_secret,(req,res)=>{
    res.redirect(`/${req.user_call}/mentor_reg`);
});

app.get('/logout',auth_secret,(req,res)=>{

    res.clearCookie("jwt");
    req.det.delete_token(req.token);
    res.redirect('/sign_in');
    res.end();
})
app.get('/logout_all',auth_secret,(req,res)=>{
    res.clearCookie("jwt");
    req.det.clear_tokens();
    res.redirect('/sign_in');
    res.end();
});

app.get("/sign_in", auth, (req, res) => {
    const params = {};
    res.render('sign_in.pug', params);
    res.end();
});

app.get('/sign_up',auth,(req, res) => {
    const params = {};
    res.render('sign_up.pug', params);
    res.end();
});

app.get('/:user/find_mentor',auth_secret,async (req,res)=>{
    let user_url = req.url.split('/')[1];
    if(user_url==req.user_call)
    {
        let params = {user:user_url};
        res.render('find_mentor.pug',params);
    }
    else
    {
        res.redirect(`/${req.user_call}/find_mentor`);
    }
});

app.get('/find_mentor',auth_secret,async (req,res)=>{
    res.redirect(`/${req.user_call}/find_mentor`);
    res.end();
});

app.post("/find_mentor",auth_secret_fetch,async (req,res)=>{
    let data = await mentor.find();
    let response_obj = {};
    response_obj.status="success";
    response_obj.mentors=data;
    res.json(response_obj);
    res.end();
})

app.post("/mentor_profile",auth_secret_fetch_img, async (req,res)=>{

    let mentor_id = req.body.id;
    let user = await mentor.findOne({_id:mentor_id},{user:1});
    let profile_path = await student.findOne({user:user.user},{profile:1});
    if(profile_path.profile==undefined)
    {
        res.type('jpg');
        res.sendFile(path.resolve(`${path.join(__dirname,'profile/user_profile_pic.jpg')}`));
    }
    else
    {
        res.type('jpg');
        res.sendFile(path.resolve(`${profile_path.profile}`));
    }
});

app.post("/sign_in", auth, async (req, res) => {
    const data = req.body;
    const email = data.email;
    const pass = data.password;
    const rec = await student.find({ email: email });
    if(rec.length==0) 
    {
        const params = { ret_msg: "Incorrect Details" };
        res.render('sign_in.pug', params);
        res.end();
    }
    else 
    {
        const matched = await bcrypt.compare(pass, rec[0].password);
        if (matched)
        {
            const user = email.split('@')[0];
            const token = await rec[0].create_token();
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+7200000),
                httpOnly:true,
            });
            res.redirect(`/${user}/home`);
            res.end();
        }
        else 
        {
            const params = { ret_msg: "Incorrect Details" };
            res.render('sign_in.pug', params);
            res.end();
        }
    }
});

app.post('/sign_up', uploads.single('profile'), async (req, res) => {

    let profile_pic = req.file;
    let data = req.body;
    let otp = data['otp'];
    let otps = await user_otp.find({email:data['email']},{otp:1,_id:1});
    var flag;
    for(var i=0;i<otps.length;i++)
    {
      var response = await bcrypt.compare(otp, otps[i].otp);
      if(response)
      {
        flag=otps[i]._id;
        break;
      }
    }

    if(!flag)
    {
        const params = {ret_msg_submit_warn:"OTP expired or Wrong otp entered"};
        res.render('sign_up.pug', params);
        res.end();
    }
    else
    {
        await student.deleteOne({email:data['email']});
        await user_otp.deleteOne({_id:flag});
        delete data['otp'];
        data['password']=await bcrypt.hash(data['password1'],9);
        delete data['password1'];    
        delete data['password2'];
        data['user']= data['email'].split('@')[0];
        if(profile_pic==undefined)
            data['profile']="";
        else
            data['profile']=path.join(__dirname,`/profile/${data['email'].split('@')[0]}.jpg`);
        let student1 = new student(data);
        await student1.save();
        if(profile_pic)
            await sharp(profile_pic.buffer).toFile(`${data['profile']}`);
        
            
        const params = {ret_msg_submit_sucs:"Registration successful"};
        res.render('sign_up.pug', params);
        res.end();
    }
});

app.post('/mentor_reg',auth_secret_fetch,async (req,res)=>{
    
    // let data = req.body;
    // let otp1 = data.otp1;
    // let otp2 = data.otp2;
    // let contact_mob = data.contact_mob;
    // let contact_email = data.contact_email;
    // let pre_user = await mentor.findOne({user:data.user});
    // let verification = 1;
    // if(pre_user==null)
    // {
    //     verification = 0;
    // }
    // else
    // {
    //     if(pre_user.contact_email!=data.contact_email)
    //     {
    //         verification = 0;
    //     }
    //     else if(pre_user.contact_mob!=data.contact_mob)
    //     {
    //         verification = 0;
    //     }
    // }
    
    // if(verification==0)
    // {
    //     const verify1 = await mob_otp.findOne({mob:contact_mob,otp:otp1});
    //     const verify2 = await email_otp.findOne({email:contact_email,otp:otp2});
    //     if(verify1==null && verify2==null)
    //     {
    //         res.json(JSON.stringify({status:"both_fail"}));
    //         res.end();
    //     }
    //     else if(verify1==null)
    //     {
    //         res.json(JSON.stringify({status:"mob_fail"}));
    //         res.end();
    //     }
    //     else if(verify2==null)
    //     {
    //         res.json(JSON.stringify({status:"email_fail"}));
    //         res.end();
    //     }
    //     else
    //     {
    //         await mob_otp.deleteOne({_id:verify1._id});
    //         await email_otp.deleteOne({_id:verify2._id});
    //     }
    // }
    // delete data['otp1'];
    // delete data['otp2'];
    // data['user']=req.user_call;
    // if(pre_user!=null)
    // {
    //     await mentor.deleteOne({_id:pre_user._id});
    // }
    // let new_mentor = new mentor(data);;
    // new_mentor.save();
    // res.json(JSON.stringify({status:"success"}));
    // res.end();






    let data = req.body;
    data['user']=req.user_call;
    delete data['otp1'];
    delete data['otp2'];
    data['name'] = req.det.name;
    data['course'] = req.det.course;
    data['branch'] = req.det.branch;
    data['gradyear'] = req.det.gradyear;
    data['DOB'] = req.det.DOB;
    data['email'] = req.det.email;

    let pre_user = await mentor.findOne({user:req.user_call});
    if(pre_user!=null)
    {
        await mentor.deleteOne({_id:pre_user._id});
    }
    let new_mentor = new mentor(data);;
    new_mentor.save();
    res.json(JSON.stringify({status:"success"}));
    res.end();
});






app.listen(port, hostname, () => {
    console.log(`Server is live at http://${hostname}:${port}/`);
});