const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
require('dotenv').config();

const stu_schema = new mongoose.Schema({
  user:String,
  name: String,
  course: String,
  branch: String,
  gradyear: Number,
  DOB: String,
  profile: String,
  email: String,
  password: String,
  tokens:[{
      token:{
          type:String,
          required:true,
      }
  }]
});
stu_schema.methods.create_token = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
  this.tokens = this.tokens.concat({ token: token });
  await this.save();
  return token;
};
stu_schema.methods.delete_token = async function (token1) {
  this.tokens = this.tokens.filter((ele) => {
    return ele.token != token1;
  });

  await this.save();
};
stu_schema.methods.clear_tokens = async function () {
  this.tokens = [];
  await this.save();
};

const student = mongoose.model('student', stu_schema);


const user_otp_schema = new mongoose.Schema({
  email: String,
  otp: String,
});
const user_otp = mongoose.model('user_otp', user_otp_schema);


const email_otp_schema = new mongoose.Schema({
  email: String,
  otp: String,
});
const email_otp = mongoose.model('email_otp', email_otp_schema);

const mob_otp_schema = new mongoose.Schema({
  mob: String,
  otp: String,
});
const mob_otp = mongoose.model('mob_otp', mob_otp_schema);



const mentor_schema = new mongoose.Schema({
  user:String,
  contact_mob:String,
  contact_email:String,
  timing_from:String,
  timing_to:String,
  company1:String,
  position1:String,
  from1:String,
  company2:String,
  position2:String,
  from2:String,
  to2:String,
  company3:String,
  position3:String,
  from3:String,
  to3:String,
  interviews:Number,
  interests:String,
  achievements:String,
  minorproject:String,
  majorproject:String,
  otherproject1:String,
  otherproject2:String,
  otherproject3:String,
  linkedin:String,
  github:String,
  twitter:String,
  instagram:String,
  facebook:String,
  codeforces:String,
  codechef:String,
  leetcode:String,
  codingninja:String,
  name: String,
  course: String,
  branch: String,
  gradyear: Number,
  DOB: String,
  email: String,
});

const mentor = mongoose.model('mentor',mentor_schema);


module.exports = {student:{student},user_otp:{user_otp},email_otp:{email_otp},mob_otp:{mob_otp},mentor:{mentor}};
