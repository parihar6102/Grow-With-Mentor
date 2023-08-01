const items = document.querySelector('.items');
const item_container = document.querySelector('.item_container');
const options = document.getElementById('options');
const item = document.querySelector('.items ul');
const mobile_screen_box=document.getElementById('mobile_screen_box');
const logout = document.getElementById('logout');
const logout_all = document.getElementById('logout_all');
const find_mentor = document.getElementById('find_mentor');

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

find_mentor.onclick= ()=>{
    window.location="/find_mentor";
}



