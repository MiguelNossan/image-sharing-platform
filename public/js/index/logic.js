const navigationContainer = document.getElementById("navigationContainer");
const navigationMenu = document.getElementById("navigationMenu");
const navigationButtons = document.querySelectorAll(".navigationButton");
const goToHomePage = document.getElementById("goToHomePage");
const showDeleteAcctForm = document.getElementById("showDeleteAcctForm");
const goToFollowingPage = document.getElementById("goToFollowingPage");
const postImage = document.getElementById("postImage");
const likeBtn = document.getElementById("like");
const followBtn = document.getElementById("follow");
const openCommentsBtn = document.getElementById("openCommentsBtn");
const postContainer = document.getElementById("postContainer");
const authForm = document.getElementById("authForm");
const authFormTitle = document.getElementById("authFormTitle");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authUsernameInput = document.getElementById("authUsernameInput");
const authPasswordInput = document.getElementById("authPasswordInput");
const loader = document.getElementById("loader");
const ownerName = document.getElementById("ownerName");
const main = document.querySelector("main");
const followingSite = document.getElementById("followingSite");
const followingList = document.getElementById("followingList");
const channelSite = document.getElementById("channelSite");
const channelContent = document.getElementById("channelContent");
const channelSiteH2 = document.getElementById("channelSiteH2");
const channelSiteFollowBtn = document.getElementById("channelSiteFollowBtn");
const imageProbe = document.getElementById("imageProbe");
const goToProfilePage = document.getElementById("goToProfilePage");
const commentContainer = document.getElementById("commentContainer");
const commentInput = document.getElementById("commentInput");
const commentsDiv = document.getElementById("comments");

let userId = null;
let username = null;
let jwToken = '';
let currentImg = -1;
let images = [];
let authFormAction = "";
let imgLiked = false;
let following = [];
let followed = false;
let currentChannelImages = null;
let currentChannelOwnerId = null;
let currentChannelName = null;
let sidebarVisible = true;


function showLoggedInButtons() {
    document.querySelectorAll(".loggedOutNavigationButton").forEach(btn =>{
        btn.style.display = "none";
    })

    document.querySelectorAll(".loggedInNavigationButton").forEach(btn =>{
        btn.style.display = "block";
    })

    likeBtn.style.display = "block";
    followBtn.style.display = "block";
    openCommentsBtn.style.display = "block";
}

function activateNavigationButton(button) {
    navigationButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

function hideAllElements() {
    navigationContainer.style.display = "none";
    postContainer.style.display = "none";
    loader.style.display = "none";
    authForm.style.display = "none";
    followingSite.style.display = "none";
    channelSite.style.display = "none";
}

async function userHasJWT() {
    jwToken = localStorage.getItem("jwToken");
    const response = await fetch("/api/jwtlogin", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${jwToken}`
        }
    })

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwToken", data.jwToken);
        showLoggedInButtons();
        userId = data.userId;
        username = data.username;
        following = data.following || [];


        alert(data.message)
    } else {
        localStorage.removeItem("jwToken")
    }


}

async function deleteAccount() {
    const response = await fetch("/api/deleteaccount", {
        method: "delete",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwToken}`
        },
        body: JSON.stringify({ username: authUsernameInput.value, password: authPasswordInput.value })
    })

    const data = await response.json();

    if (!response.ok) {
        alert(data.message);
        return;
    }

    localStorage.removeItem("jwToken");
    location.reload();
}

function resizeChannel() {
    if (!currentChannelImages) return;

    const w = innerWidth;

    const imagesPerLine = Math.max(1, Math.floor(w/204));
    let createdImages = 0;
    const lines = Math.ceil(currentChannelImages.length / imagesPerLine);
    channelContent.innerHTML = "";
    
    for (let a = 0; a < lines; a++) {
        const div = document.createElement("div")

        for (let i = createdImages; i < currentChannelImages.length && i < createdImages + imagesPerLine; i++) {
            const img = document.createElement("img");
            img.src = "images/" + currentChannelImages[i].filename;
            img.dataset.id = currentChannelImages[i]._id;
            img.dataset.imageNumber = i;
            img.className = "channelImage";
            div.prepend(img)
        }
        channelContent.prepend(div);
        createdImages += imagesPerLine
    }
}

function updateLikeAndFollowButtons(imageNumber) {
    if (userId != images[imageNumber].owner._id && userId) {
        likeBtn.style.display = "block";
        followBtn.style.display = "block";
        openCommentsBtn.style.display = "block";
        if (images[imageNumber].likes.includes(userId)) {
            imgLiked = true;
            likeBtn.src = "styleImages/redHeart.webp";
            likeBtn.alt = "Liked"
        } else {
            imgLiked = false;
            likeBtn.src = "styleImages/emptyHeart.webp";
            likeBtn.alt = "Not liked"
        }
        if (following.some(user => user._id === images[imageNumber].owner._id)) {
            followBtn.src = "styleImages/unfollow.webp";
            followBtn.title = "Unfollow"
            followBtn.alt = "Unfollow"
            followed = true;
        } else {
            followBtn.src = "styleImages/follow.webp";
            followBtn.title = "Follow"
            followBtn.alt = "Follow"
            followed = false;
        }
    } else {
        likeBtn.style.display = "none";
        followBtn.style.display = "none";
        if (!userId) {
            openCommentsBtn.style.display = "none";
        }
    }
}

function createComment(comment) {    
    const article = document.createElement("article");
    article.className = "comment";

    const h3 = document.createElement("h3");
    h3.className = "commenterUsername";
    h3.textContent = comment.userId?.username ?? "Deleted User";

    const p = document.createElement("p");
    p.className = "commentText";
    p.textContent = comment.text;

    article.append(h3, p);
    return article;
}

document.querySelectorAll(".canBecomeActive").forEach(button => {
    button.addEventListener("click", ()=>{
        activateNavigationButton(button);
    })
})

window.addEventListener("resize", resizeChannel);


(async ()=>{

if (localStorage.getItem("jwToken"))  {
    userHasJWT();
}

await fetch("/api/images")
.then(res => res.json())
.then(files => {
    images = files;

    if (images.length > 0) {
        const randomImg = Math.floor(Math.random() * images.length)
        currentImg = randomImg;
        postImage.src = "../images/" + images[randomImg].filename;
        ownerName.innerText = images[randomImg].owner?.username ?? "Unknown user";
        ownerName.dataset._id = images[randomImg].owner?._id ?? "";
        updateLikeAndFollowButtons(randomImg)

        commentsDiv.innerHTML = "";

        if(images[randomImg].comments) {
            for (const comment of images[randomImg].comments) {
                commentsDiv.prepend(createComment(comment, images[randomImg]._id))
            }
        }

    }
})
})()


postImage.addEventListener("click", ()=>{
    if (images.length > 1) {
        let randomImg;
        do {
            randomImg = Math.floor(Math.random() * images.length);
        } while (randomImg === currentImg);
        
        currentImg = randomImg;
        postImage.src = "../images/" + images[randomImg].filename;
        ownerName.innerText = images[randomImg].owner?.username ?? "Unknown user";
        ownerName.dataset._id = images[randomImg].owner?._id ?? "";
        updateLikeAndFollowButtons(randomImg)

        commentsDiv.innerHTML = "";

        if(images[randomImg].comments) {
            for (const comment of images[randomImg].comments) {
                commentsDiv.prepend(createComment(comment))
            }
        }
    } else {
        console.log("The images aren't loading right now.")
    }
})

ownerName.addEventListener("click", async ()=>{
    const channelId = ownerName.dataset._id;
    if (channelId) {
        const response = await fetch("/api/images/otherChannel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channelId })
        })

        if (!response.ok) return;

        if (following.some(user => user._id === channelId)) {
            followed = true;
            channelSiteFollowBtn.innerText = "Unfollow"
        } else {
            followed = false;
            channelSiteFollowBtn.innerText = "Follow"
        }

        postContainer.style.display = "none";
        channelSite.style.display = "block";
        channelSiteFollowBtn.style.display = "inline-block"
        channelSiteH2.innerText = ownerName.innerText;
        currentChannelName = ownerName.innerText;
        currentChannelImages = await response.json();

        resizeChannel();
    }
})

likeBtn.addEventListener("click", async ()=>{
    let response = '';

    if (!imgLiked) {
        response = await fetch("/api/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}`
            },
            body: JSON.stringify({ imgId: images[currentImg]._id })
        })


        if (!response.ok) {                                                                                
            return;
        }

        likeBtn.src = "styleImages/redHeart.webp";
        likeBtn.alt = "Liked"
        imgLiked = true;
    } else {
        response = await fetch("/api/like", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}`
            },
            body: JSON.stringify({ imgId: images[currentImg]._id })
        })

        if (!response.ok) {
            return;
        }

        likeBtn.src = "styleImages/emptyHeart.webp";
        likeBtn.alt = "Not liked"
        imgLiked = false
    }

    const updatedImage = await response.json();
    
    images[currentImg] = updatedImage;
})


document.getElementById("showLoginForm").addEventListener("click", ()=>{
    authFormAction = "login";
    authFormTitle.innerText = "Log In";
    authSubmitBtn.innerText = "Log In";
    hideAllElements()
    authForm.style.display = "block";
});

document.getElementById("showSignUpForm").addEventListener("click", ()=>{
    authUsernameInput.value = "";
    authPasswordInput.value = "";
    authFormAction = "signup"
    authFormTitle.innerText = "Sign Up";
    authSubmitBtn.innerText = "Sign Up"
    hideAllElements()
    authForm.style.display = "block";
});
showDeleteAcctForm.addEventListener("click", ()=>{
    authUsernameInput.value = "";
    authPasswordInput.value = "";
    authFormAction = "deleteAccount";
    authFormTitle.innerText = "Delete Account";
    authSubmitBtn.innerText = "Delete Account";
    hideAllElements();
    authForm.style.display = "block";
})

document.getElementById("closeBtn").addEventListener("click", ()=>{
    activateNavigationButton(goToHomePage);
    authForm.style.display = "none";
    postContainer.style.display = "block";
    navigationContainer.style.display = "block"
    authUsernameInput.value = "";
    authPasswordInput.value = "";
})

authForm.addEventListener("submit", async (e)=>{
    try {
        e.preventDefault();
        let response = "";
        hideAllElements();
        loader.style.display = "block";

        if (authFormAction === "signup") {
            response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ username: authUsernameInput.value, password: authPasswordInput.value })
            })
        } else if (authFormAction === "login") {
            response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: authUsernameInput.value, password: authPasswordInput.value })
            })
        } else if (authFormAction === "deleteAccount") {
            await deleteAccount();
            return;
        }
        
        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            authPasswordInput.value = "";
            loader.style.display = "none";
            navigationContainer.style.display = "block";
            authForm.style.display = "block";
            return;
        }

        userId = data.userId;
        username = authUsernameInput.value;
        following = data.following || [];
        loader.style.display = "none";
        navigationContainer.style.display = "block";
        postContainer.style.display = "block";
        authUsernameInput.value = "";
        authPasswordInput.value = "";
        jwToken = data.jwToken;
        localStorage.setItem("jwToken", jwToken);
        activateNavigationButton(goToHomePage);
        showLoggedInButtons();

        alert(data.message)
    } catch (err) {
        console.log(err)
    }
})

followBtn.addEventListener("click", async ()=>{
    if (followed) {
        const response = await fetch("/api/follow", {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}` 
            },
            body: JSON.stringify({ userToFollowId: images[currentImg].owner._id })
        })

        if (!response.ok) {
            console.error("Somethink went wrong")
            return;
        }

        followed = false;
        followBtn.title = "Follow"
        following = following.filter(
            user => user._id !== images[currentImg].owner._id
        );
        followBtn.src = "styleImages/follow.webp";
    } else {
        const response = await fetch("/api/follow", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}` 
            },
            body: JSON.stringify({ userToFollowId: images[currentImg].owner._id })
        })

        if (!response.ok) {
            console.error("Something went wrong")
            return;
        }

        followed = true;
        followBtn.title = "UnFollow"
        following.push({
            _id: images[currentImg].owner._id,
            username: images[currentImg].owner.username
        });
        followBtn.src = "styleImages/unfollow.webp";
    }
})

document.getElementById("logOutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("jwToken");
    location.reload();
})

document.getElementById("goToUploadPage").addEventListener("click", ()=>{
    window.open("upload.html", "_blank")
})

goToFollowingPage.addEventListener("click", ()=>{
    hideAllElements();
    navigationContainer.style.display = "block"
    followingSite.style.display = "block"
    followingList.innerHTML = "";
    following.forEach(user=>{
        const a = document.createElement("a");
        a.classList = "followedChannelA";
        a.innerText = user.username;
        a.dataset.userId = user._id;
        a.dataset.username = user.username;
        a.href = "#";
        a.style.display = "block";

        followingList.prepend(a);
    })
})

document.addEventListener("click", async (e)=>{
    const a = e.target.closest(".followedChannelA");
    if (!a || !a.dataset.userId) return;

    currentChannelOwnerId = a.dataset.userId;
    currentChannelName = a.dataset.username;

    const response = await fetch("/api/images/otherChannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId: currentChannelOwnerId })
    })
 
    if (!response.ok) return;

    if (following.some(user => user._id === currentChannelOwnerId)) {
        followed = true;
        channelSiteFollowBtn.innerText = "Unfollow"
    } else {
        followed = false;
        channelSiteFollowBtn.innerText = "Follow"
    }

    followingSite.style.display = "none"
    channelSite.style.display = "block";
    channelSiteFollowBtn.style.display = "inline-block"
    channelSiteH2.innerText = currentChannelName;
    currentChannelImages = await response.json();

    resizeChannel();
})

goToProfilePage.addEventListener("click", async ()=>{
    const response = await fetch("/api/images/my", {
        headers: { "Authorization": `Bearer ${jwToken}`}
    });

    if(!response.ok) return;

    hideAllElements();
    navigationContainer.style.display = "block";
    channelSite.style.display = "block";
    channelSiteH2.innerText = username;
    channelSiteFollowBtn.style.display = "none"
    currentChannelImages = await response.json();
    currentChannelName = username;

    resizeChannel();
})

document.addEventListener("click", (e)=>{
    const img = e.target.closest(".channelImage");
    if (!img) return;
    const imageNumber = Number(img.dataset.imageNumber);
    postImage.src = img.src;
    ownerName.innerText = currentChannelName ?? "Unknown user"
    currentImg = images.findIndex(
        image => image._id === currentChannelImages[imageNumber]._id
    );
    hideAllElements();

    updateLikeAndFollowButtons(currentImg);

    navigationContainer.style.display = "block";
    postContainer.style.display = "block";
})

goToHomePage.addEventListener("click", ()=>{
    hideAllElements();
    postContainer.style.display = "block";
    navigationContainer.style.display = "block"
})

channelSiteFollowBtn.addEventListener("click", async ()=>{
    if (followed) {
        const response = await fetch("/api/unfollow", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}`
            },
            body: JSON.stringify({ userToFollowId: currentChannelOwnerId})
        })

        if (!response.ok) {
            console.error("Somethink went wrong")
            return;
        }

        followed = false;
        channelSiteFollowBtn.innerText = "Follow";
        following = following.filter(
            user => user._id !== currentChannelOwnerId
        );
    } else {
        const response = await fetch("/api/follow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwToken}`
            },
            body: JSON.stringify({ userToFollowId: currentChannelOwnerId})
        })

        if (!response.ok) {
            console.error("Somethink went wrong")
            return;
        }

        followed = false;
        channelSiteFollowBtn.innerText = "Unfollow";
        following.push({
            _id: currentChannelOwnerId,
            username: currentChannelName
        })
    }
})

openCommentsBtn.addEventListener("click", ()=>{
        commentContainer.style.display = "block";
})

document.getElementById("closeComments").addEventListener("click", ()=>{
    commentContainer.style.display = "none";
})

document.getElementById("commentContainer").addEventListener("submit", async (e)=>{
    e.preventDefault()
    const commentText = commentInput.value;
    
    const response = await fetch("/api/comment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwToken}`
        },
        body: JSON.stringify({ commentText, imageId: images[currentImg]._id})
    });
    if (!response.ok) {
        console.error("Somethink went wrong");
        console.log(response)
        return;
    }

    commentInput.value = "";

    const data = await response.json();
    const comments = data.comments;

    commentsDiv.innerText = "";

    for (const comment of comments) {
        commentsDiv.prepend(createComment(comment))
    }

})

document.getElementById("sidebarToggle").addEventListener("click", ()=>{
    if (sidebarVisible) {
        navigationMenu.style.display = "none";
        document.getElementById("navigationHr").style.display = "none";
        navigationContainer.style.background = "transparent";
        sidebarVisible = false;
    } else {
        navigationMenu.style.display = "block";
        document.getElementById("navigationHr").style.display = "block";
        navigationContainer.style.background = "black";
        sidebarVisible = true;
    }
})