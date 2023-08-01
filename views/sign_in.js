const form1 = document.getElementById('form1')
const submit = document.getElementById('submit');
const error = document.getElementById('error');
setTimeout(() => {
    error.innerHTML="";
}, 30000);


const items = document.querySelector('.items');
const item_container = document.querySelector('.item_container');
const options = document.getElementById('options');
const item = document.querySelector('.items ul');
const mobile_screen_box=document.getElementById('mobile_screen_box');



const logo = document.getElementById('logo');
logo.addEventListener('click',()=>{
    window.location = '/';
})