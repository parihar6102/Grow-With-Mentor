const options = document.getElementById('options');
options.addEventListener('click', () => {
    if (mobile_screen_box.style.display == "block") {
        mobile_screen_box.style.display = "none";
    }
    else {
        mobile_screen_box.style.display = "block";
    }
});

const position1 = document.getElementById('position1');
const mentor_form = document.getElementById('mentor_form');
const socket = io('http://localhost:8001');
const otp_reply1 = document.getElementById('otp_reply1');
const otp_reply2 = document.getElementById('otp_reply2');
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const mob_otp = document.getElementById('mob_otp');
const email_otp = document.getElementById('email_otp');
const contact_mob = document.getElementById('contact_mob');
const contact_email = document.getElementById('contact_email');
const save = document.getElementById('save');
otp_reply1.innerHTML = "";
otp_reply2.innerHTML = "";

function validateEmail(email) {
    const res = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return res.test(String(email).toLowerCase());
}


function validateMob(mob_no) 
{
    
    mob_no = String(mob_no);
    if(mob_no.length!=10)
        return false;

    if (mob_no[0] < '6') {
        return false;
    }
    else 
    {
        var flag = 0;
        for (var i = 0; i < 10; i++) {
            if (mob_no[i] < '0' || mob_no[i] > '9') {
                flag = 1;
                break;
            }
        }
        if (flag == 1) {
            return false;
        }
        else {
            return true;
        }
    }
}





btn2.addEventListener('click', async () => {

    alert('Whatsapp and email verification not needed');



    // let email = contact_email.value;
    // if(validateEmail(email))
    // {
    //     socket.emit('email_otp',email);
    // }
    // else
    // {
    //     alert("Enter correct email contact");
    // }


});

let timeout2;
socket.on('email_otp_success', async () => {
    if (otp_reply2.innerHTML != "") {
        otp_reply2.innerHTML = "";
        clearTimeout(timeout2);
    }
    setTimeout(async () => {
        otp_reply2.innerHTML = "OTP sent successfully on email";
        otp_reply2.style.color = "green";
    }, 1000);

    timeout2 = setTimeout(async () => {
        otp_reply2.innerHTML = "";
    }, 30000);
});
socket.on('email_otp_fail', async () => {
    if (otp_reply2.innerHTML != "") {
        otp_reply2.innerHTML = "";
        clearTimeout(timeout2);
    }
    setTimeout(async () => {
        otp_reply2.innerHTML = "OTP not sent! Please try again";
        otp_reply2.style.color = "red";
    }, 1000);

    timeout2 = setTimeout(async () => {
        otp_reply2.innerHTML = "";
    }, 30000);
});
socket.on('email_otp_limit', async () => {
    alert("OTP request limit exceed! Try after some time");
});






btn1.addEventListener('click', async () => {

    alert('Whatsapp and email verification not needed');

    // let mob_no = contact_mob.value;
    // if(validateMob(mob_no))
    // {
    //     socket.emit('mob_otp', mob_no);
    // }
    // else
    // {
    //     alert("Enter correct whatsapp contact");
    // }
});


let timeout1;
socket.on('mob_otp_success', async () => {
    if (otp_reply1.innerHTML != "") {
        otp_reply1.innerHTML = "";
        clearTimeout(timeout1);
    }
    setTimeout(async () => {
        otp_reply1.innerHTML = "OTP sent successfully on whatsapp";
        otp_reply1.style.color = "green";
    }, 1500);

    timeout1 = setTimeout(async () => {
        otp_reply1.innerHTML = "";
    }, 30000);
});
socket.on('mob_otp_fail', async () => {
    if (otp_reply1.innerHTML != "") {
        otp_reply1.innerHTML = "";
        clearTimeout(timeout1);
    }
    setTimeout(async () => {
        otp_reply1.innerHTML = "OTP not sent! Please try again";
        otp_reply1.style.color = "red";
    }, 1500);

    timeout1 = setTimeout(async () => {
        otp_reply1.innerHTML = "";
    }, 30000);
});
socket.on('mob_otp_limit', async () => {
    alert("OTP request limit exceed! Try after some time");
});










mentor_form.addEventListener('submit',async(e)=>{

    e.preventDefault();
    let mob_no = contact_mob.value;
    let email = contact_email.value;
    if(validateMob(mob_no)==false)
    {
        alert('Whatsapp contact is incorrect');
    }
    else if(!validateEmail(email))
    {
        alert('Email contact is incorrect');
    }
    else
    {
        let form_data = new FormData(mentor_form);
        let data = {};
        for(var p of form_data)
        {
            if(p[1])
            {    
                data[p[0]]=p[1];
            }
            else
                data[p[0]]="";
        }
        fetch('/mentor_reg',{
            method:"post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data),
            credentials:"same-origin",
        }).then(response=>{
            return response.json();
        }).then((data)=>{
            data = JSON.parse(data);
            if(data['status']=='both_fail')
            {
                alert("OTP verifications failed");
            }
            else if(data['status']=="email_fail")
            {
                alert("Email OTP verification failed");
            }
            else if(data['status']=="mob_fail")
            {
                alert("Whatsapp OTP verification failed");
            }
            else if(data['status']=="success")
            {
                alert("Details saved successfully");
            }
            else
            {
                alert("Session time expired! Please sign in again");
                window.location="/sign_in";
            }
        });
    }
});



