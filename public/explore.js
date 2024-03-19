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
let val;

function centreVideo(obj,post="",user){
    let dataPost;
    if(user){
        let img=document.querySelector(".status-img");
        const dataObject = JSON.parse(user);
        const username = dataObject.username;
        let name=document.querySelector(".cs-head-sp-1");
        img.src=dataObject.profile;
        name.innerHTML=username;
        dataPost = JSON.parse(post);
        console.log(dataPost._id);
        val=dataPost._id;
        console.log("dataId",dataPost._id);
        console.log("datapost",dataPost);
        fetchCommand(dataPost.comments);
        
    }
    
    let centreDiv=document.querySelector(".centre-display");
    if(!post){
    if(con){
        let video=obj.querySelector('video');
        var currentSource = video.getAttribute('src');
        centreDiv.classList.add("display-flex");
        let centreDivVideo=`<video class="video-side-v" autoplay loop src="${currentSource}" onclick="playPause(this)"></video>`;
        let v=document.querySelector('.video-side');
        v.innerHTML = centreDivVideo;
        
    } 
    else{
        var adjacentElement = obj.previousElementSibling;
        obj=adjacentElement.querySelector('video');
        obj.pause();
        console.log("inside video");
        centreDiv.classList.remove("display-flex");
    }
}
else{
    if(con){
        centreDiv.classList.add("display-flex");
        console.log(dataPost.videourl);
        let str=dataPost.videourl;
        str = str.replace(/"/g, '').trim();
        let centreDivVideo = `<img class="video-side-img" src="${str}" alt="${dataPost._id}" style="object-fit: cover; width: 100%; height: 100%;">`;
        let v = document.querySelector('.video-side');
        v.innerHTML = centreDivVideo;

    } 
    else{
        var adjacentElement = obj.previousElementSibling;
        obj=adjacentElement.querySelector('video');
        if(obj){
            obj.pause();
        }
        console.log("inside img");
        centreDiv.classList.remove("display-flex");
    }
}
con=!con;
}



async function fetchCommand(comments){
    try {
        console.log("comments is",comments);
        const response = await fetch(`/fetchcomment?q=${comments}`);
        const data = await response.json();
        console.log("data is missing",data);
        displayData(data);
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}


function displayData(data) {
console.log("dataa",data);
const outputDiv = document.querySelector('.cs-mid-div-2');
outputDiv.innerHTML = ''; // Clear previous dat

for(item of data) {
    // Create a div for comment
    const commentDiv = document.createElement('div');
    commentDiv.textContent = `Comment: ${item.comment}`;

    // Create a div for owner
    const ownerDiv = document.createElement('div');
    ownerDiv.textContent = `Owner: ${item.userDetails.username || 'Unknown User'}`;

    // Create an image element for profile
    const profileImg = document.createElement('img');
    profileImg.src = item.userDetails.profile || '';
    profileImg.alt = 'Profile Image';
    const deleteForm = document.createElement('form');
    deleteForm.method = 'post'; // Or 'DELETE' if your server supports it directly
    //deleteForm.action = `/user/${item.userDetails.userId}/${item._doc._id}?_method=DELETE`;
    
    // Create the button element
    /*const deleteButton = document.createElement('button');
    deleteButton.type = 'submit';
    deleteButton.textContent = 'Delete';
    */
    // Append the button to the form
    
    
    // Append the form to the outputDiv
    outputDiv.appendChild(deleteForm);
    // Append commentDiv, ownerDiv, and profileImg to outputDiv
    outputDiv.appendChild(commentDiv);
    outputDiv.appendChild(ownerDiv);
    outputDiv.appendChild(profileImg);
    //deleteForm.appendChild(deleteButton);
};
    
}


function getValue(callback) {
    const value = val||"hai kochi"; // This could be obtained asynchronously
    callback(value);
}
