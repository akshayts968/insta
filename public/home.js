const searchDiv=document.querySelector(".search");
const noficationDiv=document.querySelector(".notification");
let focusOnNotification=false;
let focusOnSearch=false;

noficationDiv.addEventListener("click",()=>{
    
    if(!focusOnNotification){
        const opt=document.querySelectorAll(".nav-opt");
        const navBarDiv=document.querySelector(".nav-bar-div");
        const navIcon=document.querySelector(".navIcon");
        //const nav_1=document.querySelectorAll(".nav-1");
        const intaImg=document.querySelector(".instaImg");
        const searchScreen=document.querySelector(".notification-bar");
        searchScreen.classList.add('w3962px');
        navIcon.classList.add('display-flex');
        intaImg.classList.add('display-none');
        navBarDiv.classList.add('width-48');
        const searchI=document.querySelector(".notification-i");
        searchI.classList.add('white-border');
        //nav_1.classList.add('justify-c');
        opt.forEach(option=>{
            option.classList.add('display-none');
        })
    }
    else{
        const opt=document.querySelectorAll(".nav-opt");
        const navBarDiv=document.querySelector(".nav-bar-div");
        const navIcon=document.querySelector(".navIcon");

        //const nav_1=document.querySelectorAll(".nav-1");
        const intaImg=document.querySelector(".instaImg");
        intaImg.classList.remove('display-none');
        const searchScreen=document.querySelector(".notification-bar");
        searchScreen.classList.remove('w3962px');
        navBarDiv.classList.remove('width-48');
        navIcon.classList.remove('display-flex');
        const searchI=document.querySelector(".notification-i");
        searchI.classList.remove('white-border');
        //nav_1.classList.remove('justify-c');
        opt.forEach(option=>{
            option.classList.remove('display-none');
        })
    }
    focusOnNotification=!focusOnNotification;
})


searchDiv.addEventListener("click",()=>{
    if(!focusOnSearch){
        const navBarDiv=document.querySelector(".nav-bar-div");
        const opt=document.querySelectorAll(".nav-opt");
        const navIcon=document.querySelector(".navIcon");

        //const nav_1=document.querySelectorAll(".nav-1");
        const intaImg=document.querySelector(".instaImg");
        const searchScreen=document.querySelector(".search-screen");
        searchScreen.classList.add('w397px');
        searchScreen.classList.add('display-flex');
        intaImg.classList.add('display-none');
        const searchI=document.querySelector(".search-i");
        searchI.classList.add('white-border');
        //nav_1.classList.add('justify-c');
        navIcon.classList.add('display-flex');

        navBarDiv.classList.add('width-48');
        opt.forEach(option=>{
            option.classList.add('display-none');
        })
    }
    else{
        const navBarDiv=document.querySelector(".nav-bar-div");
        const opt=document.querySelectorAll(".nav-opt");
        const navIcon=document.querySelector(".navIcon");

        //const nav_1=document.querySelectorAll(".nav-1");
        const intaImg=document.querySelector(".instaImg");
        intaImg.classList.remove('display-none');
        const searchScreen=document.querySelector(".search-screen");
        searchScreen.classList.remove('w397px');
        searchScreen.classList.remove('display-flex');

        const searchI=document.querySelector(".search-i");
        searchI.classList.remove('white-border');
        navBarDiv.classList.remove('width-48');
        navIcon.classList.remove('display-flex');
        //nav_1.classList.remove('justify-c');
        opt.forEach(option=>{
            option.classList.remove('display-none');
        })
    }
    focusOnSearch=!focusOnSearch;
})