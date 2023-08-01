
const items = document.querySelector('.items');
const item_container = document.querySelector('.item_container');
const options = document.getElementById('options');
const item = document.querySelector('.items ul');
const mobile_screen_box=document.getElementById('mobile_screen_box');
const logout = document.getElementById('logout');
const logout_all = document.getElementById('logout_all');
var profiles = document.getElementById("profiles");


options.addEventListener('click',()=>{
    if(mobile_screen_box.style.display=="block")
    {
        mobile_screen_box.style.display="none";
    }
    else
    {
        mobile_screen_box.style.display="block";
    }
});

function getdate(str)
{
    if(!str)
        return str;
    let rec = str.split("-");
    let ret = rec[2]+"-"+rec[1]+"-"+rec[0];
    return ret;
}


function fill_data()
{
    fetch('/find_mentor',{
        method:"post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({status:"need_data"}),
        credentials:"same-origin",
    }).then(response=>{
        return response.json();
    }).then(data=>{
        if(data.status=="success")
        {
            let cnt = 0;
            let mentors = data.mentors;
            for(var mentor of mentors)
            {
                var template = document.getElementById("template");
                var new_mentor = template.cloneNode(true);
                new_mentor.removeAttribute("id");
                new_mentor.id = `mentor${cnt}`
                
                profiles.appendChild(new_mentor);
                const profile_pic = document.querySelector(`#mentor${cnt} img`);
                const name = document.querySelector(`#mentor${cnt} h3`);
                name.innerHTML=mentor.name;
                const value_fields = document.querySelectorAll(`#mentor${cnt} p`);

                value_fields[0].innerHTML = mentor.email.split('@')[0];
                value_fields[1].innerHTML = mentor.course;
                value_fields[2].innerHTML = mentor.branch;
                value_fields[3].innerHTML = mentor.gradyear;
                value_fields[4].innerHTML = getdate(mentor.DOB);

                value_fields[5].innerHTML = mentor.contact_mob;
                value_fields[6].innerHTML = mentor.contact_email;
                value_fields[7].innerHTML = mentor.timing_from;
                value_fields[8].innerHTML = mentor.timing_to;

                value_fields[9].innerHTML = mentor.company1;
                value_fields[10].innerHTML = mentor.position1;
                value_fields[11].innerHTML = getdate(mentor.from1);
                value_fields[12].innerHTML = mentor.company2;
                value_fields[13].innerHTML = mentor.position2;
                value_fields[14].innerHTML = getdate(mentor.from2);
                value_fields[15].innerHTML = getdate(mentor.to2);
                value_fields[16].innerHTML = mentor.company3;
                value_fields[17].innerHTML = mentor.position3;
                value_fields[18].innerHTML = getdate(mentor.from3);
                value_fields[19].innerHTML = getdate(mentor.to3);
                value_fields[20].innerHTML = mentor.interviews;
                value_fields[21].innerHTML = mentor.interests;
                value_fields[22].innerHTML = mentor.achievements;

                value_fields[23].innerHTML = mentor.minorproject;
                value_fields[24].innerHTML = mentor.majorproject;
                value_fields[25].innerHTML = mentor.otherproject1;
                value_fields[26].innerHTML = mentor.otherproject2;
                value_fields[27].innerHTML = mentor.otherproject3;

                value_fields[28].innerHTML = mentor.linkedin;
                value_fields[29].innerHTML = mentor.github;
                value_fields[30].innerHTML = mentor.twitter;
                value_fields[31].innerHTML = mentor.instagram;
                value_fields[32].innerHTML = mentor.facebook;

                value_fields[33].innerHTML = mentor.codeforces;
                value_fields[34].innerHTML = mentor.codechef;
                value_fields[35].innerHTML = mentor.leetcode;
                value_fields[36].innerHTML = mentor.codingninja;

                fetch('/mentor_profile',{
                    method:"post",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify({id:mentor._id}),
                    credentials:"same-origin",
                }).then(response=>{
                    return response.blob();
                }).then(data=>{
                    var objectURL = URL.createObjectURL(data);
                    profile_pic.src = objectURL;
                });

                cnt=cnt+1;
            }
        }
        else
        {
            alert("Session time expired! Please sign in again");
            window.location="/sign_in";
        }
    })
}
fill_data();
