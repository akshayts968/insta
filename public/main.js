
// Add click event listener to the icon
    function heartBeat(icon) {
        // Toggle the 'clicked' class when the icon is clicked
        icon.classList.toggle('clicked');
    };

let comment_boxes = document.querySelectorAll(".comment");
console.log("hai");
comment_boxes.forEach(comment_box => {
    let parentDiv = comment_box.parentElement;
    comment_box.addEventListener("input", () => {
        let postButton = parentDiv.querySelector(".post-button");
        if (comment_box.value.trim().length != 0) { // Using value.trim() to handle whitespace
            postButton.style.display = 'flex'; // Display the anchor element
        } else {
            postButton.style.display = 'none'; // Hide the anchor element
        }
    });
});



/*function commandType(obj){
obj.addEventListener("oninput",()=>{

});
}*/
function typing(obj){
        console.log("hai");
        obj.addEventListener("input", () => {
            let postButton = obj.nextElementSibling;
            if (obj.value.trim().length != 0) { // Using value.trim() to handle whitespace
                postButton.style.display = 'flex'; // Display the anchor element
            } else {
                postButton.style.display = 'none'; // Hide the anchor element
            }
        });
    }
    function commentAdd(link,post){
        let textarea = link.parentNode.querySelector('textarea');
        let comment = textarea.value;
        if(!post){
            let postId=document.querySelector(".video-side-img");
            console.log(postId.alt);
            post=postId.alt;
        }
        console.log(post,"is")
        /*console.log(value);
        console.log(v);
        // Make an AJAX request to your Node.js server to update the database*/
       const xhr = new XMLHttpRequest();
        xhr.open("POST", "/updateDatabase", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    textarea.value='';
                    console.log("Database updated successfully");
                } else {
                    console.error("Failed to update database");
                }
            }
        };
        const data = { comment: comment, post: post };
        xhr.send(JSON.stringify( data ));
    }
    
    function hide(){
        let m=document.querySelectorAll(".nav-opt");
        m.forEach(item=>{
        item.style.display='none';
        });
    }