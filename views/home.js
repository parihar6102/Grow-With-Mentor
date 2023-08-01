const items = document.querySelector('.items');
const item_container = document.querySelector('.item_container');
const options = document.getElementById('options');
const item = document.querySelector('.items ul');
const mobile_screen_box=document.getElementById('mobile_screen_box');

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

window.addEventListener('resize',()=>{
    if(window.innerWidth>=750)
    mobile_screen_box.style.display="none";
});