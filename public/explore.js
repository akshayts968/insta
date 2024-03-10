function playPause(obj) {
    if(obj){
        console.log(obj);
    } 
    if (obj.paused) {
        obj.play();
    } else {
        obj.pause();
    }
}

function pauseVideo(obj) {
    var video = obj.querySelector('video');
    video.pause();
}
let con=true;
function centreVideo(obj){
    let centreDiv=document.querySelector(".centre-display");
    if(con){
        let video=obj.querySelector('video');
        var currentSource = video.getAttribute('src');
        centreDiv.classList.add("display-flex");
        let centreDivVideo=document.querySelector(".video-side-v");
        centreDivVideo.setAttribute('src', currentSource);
    } 
    else{
        var adjacentElement = obj.previousElementSibling;
        obj=adjacentElement.querySelector('video');
        obj.pause();
        centreDiv.classList.remove("display-flex");
    }
    
    con=!con;
}