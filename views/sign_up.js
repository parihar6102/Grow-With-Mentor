let today = new Date();
const year = today.getFullYear();
const socket = io('http://localhost:8000');

const name = document.getElementById('name');
const course = document.getElementById('course');
const branch = document.getElementById('branch');
const gradyear = document.getElementById('gradyear');
const DOB = document.getElementById('DOB');
const profile = document.getElementById('profile');
const email = document.getElementById('email');
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');
const otp = document.getElementById('otp');
const otp_generator = document.getElementById('gtrotp');
const otp_reply = document.getElementById('check_otp_msg');
const warning = document.getElementById('warning');
const user_details = document.getElementById('user_details');
const submit_now = document.getElementById('submit_now');

setTimeout(() => {
    warning.innerHTML="";
    success.innerHTML="";
}, 30000);

for(i=year-10;i<=year+6;i++)
{
    const new_element = document.createElement('option');
    new_element.innerHTML=i;
    new_element.value=i;
    gradyear.append(new_element);
}


let eraseti = setTimeout(() => {}, 0);
async function send_otp(email)
{
    socket.emit('send_email',email);
}

otp_generator.addEventListener('click',()=>{
    send_otp(email.value);
});
socket.on('email_sent',()=>{
    if(otp_reply.innerHTML!="")
    {
        clearTimeout(eraseti);
        otp_reply.innerHTML="";
    }
    setTimeout(() => {
        otp_reply.innerHTML="OTP sent successfully";
    }, 1000);
    otp_reply.style.color="green";
    eraseti = setTimeout(() => {
        otp_reply.innerHTML="";
    }, 30000);
});
socket.on('email_not_sent',()=>{
    if(otp_reply.innerHTML!="")
    {
        clearTimeout(eraseti);
        otp_reply.innerHTML="";
    }
    setTimeout(() => {
        otp_reply.innerHTML="Error occured in generating otp";
    }, 1000);
    otp_reply.style.color="red";
    eraseti = setTimeout(() => {
        otp_reply.innerHTML="";
    }, 30000);
});
socket.on('limit_exceed',()=>{
    if(otp_reply.innerHTML!="")
    {
        clearTimeout(eraseti);
        otp_reply.innerHTML="";
    }
    setTimeout(() => {
        otp_reply.innerHTML="Maximum 5 requests in 5 minutes";
    }, 1000);
    otp_reply.style.color="red";
    eraseti = setTimeout(() => {
        otp_reply.innerHTML="";
    }, 30000);
});

let flag_valid = 0;

function check_validity(){
    if(flag_valid==0)
    {
        const user_data = new FormData(user_details);
        var isValid = /\.jpe?g$/i.test(profile.value);
    
        if(password1.value.length<8)
        {
            alert("Password must contain atleast 8 characters");
            return false;
        }
        else if(password1.value!=password2.value)
        {
            alert("Password and confirm Password must be same");
            return false;
        }
        else if(otp.value.length!=4)
        {
            alert("Please enter 4 digit otp");
            return false;
        }
        else if(!isValid && profile.value!="") 
        {
            alert("profile picture must be in jpg format");
            return false;
        }
        else
        {
            console.log("Hello");
            const cross_check = confirm("Would you like to submit the form");
            if(cross_check==true)
            {
                socket.emit('checkotp',{email:email.value,otp:otp.value});
            }
            return false;
        }
    }
    else
    {
        flag_valid=0;
        return true;
    }
}


socket.on('wrong_otp',()=>{
    flag_valid=0;
    alert("Incorrect OTP or OTP expired");
});
socket.on('true_registration',()=>{
    flag_valid=1;
    user_details.submit();
});




const logo = document.getElementById('logo');
logo.addEventListener('click',()=>{
    window.location = '/'
})



