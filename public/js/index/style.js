

function styling() {
    const imgDiv = document.getElementById("imgDiv");
    const postImgStyle = document.getElementById("postImg");
    const header = document.querySelector("header");
    const headerBtns = document.querySelectorAll(".headerBtn");
    const main = document.querySelector("main")
    const lisuForm = document.getElementById("lisuForm")
    const lisuH1 = document.getElementById("lisuH1")
    const lisuLabel = document.querySelectorAll(".lisuLabel")
    const lisuInput1 = document.getElementById("lisuInput1")
    const lisuInput2 = document.getElementById("lisuInput2")
    const lisuSubmitBtn = document.getElementById("lisuSubmitBtn")
    const closeBtn = document.getElementById("closeBtn")
    const imgH2 = document.getElementById("imgH2")


    let w = innerWidth;
    let h = innerHeight;
    let mainMT = 70;
    let headerBR = 2;
    let headerBtnFS = 16;
    let headerBtnW = 90;
    let headerBtnH = 50;
    let headerBtnM = "auto 10px"
    let ratio = postImgStyle.naturalWidth / postImgStyle.naturalHeight;
    let ihn = 1 / ratio;
    
    let lisuFormW = 500;
    let lisuFormH = 300;
    let lisuFormBR = 20;
    let lisuH1FS = 40;
    let lisuLabelFS = 25;
    let lisuInputFS = 20;
    let lisuSubmitBtnFS = 30;
    let closeBtnWH = 25;




    if (w < 600) {
        headerBtnM = "auto 5px"
        headerBR = 1;


        if (w >= 500) {
            headerBtnFS = 14;
            headerBtnW = 80;

        } else if (w >= 450) {
            headerBtnFS = 13;
            headerBtnW = 75;

            lisuFormW = 350;
            lisuFormH = 260;
            lisuH1FS = 35;
            lisuLabelFS = 20;
            lisuInputFS = 15;
            lisuSubmitBtnFS = 25;
            closeBtnWH = 20;
        } else if (w >= 400) {
            headerBtnFS = 11;
            headerBtnW = 65;
        } else if (w < 400) {
            mainMT = 55;
            headerBtnH = 40;
            headerBtnM = "auto 2px"

            if (w >= 350) {
                headerBtnFS = 10;
                headerBtnW = 60;
            } else if (w >= 300) {
                headerBtnFS = 8;
                headerBtnW = 50;
            } else if (w >= 250) {
                headerBtnFS = 6;
                headerBtnW = 40;
            } else if (w < 250) {
                headerBtnM = "auto 0"
                mainMT = 35;
                headerBtnH = 20;
                headerBR = 0;
                headerBtnFS = 4;
                headerBtnW = 30;
            }
        }


        if (w >= 450) {
            lisuFormW = 350;
            lisuFormH = 260;
            lisuH1FS = 35;
            lisuLabelFS = 20;
            lisuInputFS = 15;
            lisuSubmitBtnFS = 25;
            closeBtnWH = 20;
        } else if (w >= 350) {
            lisuFormW = 300;
            lisuFormH = 220;
            lisuH1FS = 30;
            lisuLabelFS = 18;
            lisuInputFS = 13;
            lisuSubmitBtnFS = 20;
            closeBtnWH = 15;
        } else if (w >= 275) {
            lisuFormW = 240;
            lisuFormH = 170;
            lisuFormBR = 15;
            lisuH1FS = 25;
            lisuLabelFS = 15;
            lisuInputFS = 12;
            lisuSubmitBtnFS = 17;
            closeBtnWH = 10;
        } else {
            lisuFormW = 150;
            lisuFormH = 150;
            lisuFormBR = 10;
            lisuH1FS = 20;
            lisuLabelFS = 10;
            lisuInputFS = 8;
            lisuSubmitBtnFS = 14;
            closeBtnWH = 8;
        }
        
        
    }
    

    header.style.height = mainMT - 5 + "px";
    header.style.borderRadius = `0 0 ${headerBR}em ${headerBR}em`
    headerBtns.forEach(btn => {
        btn.style.margin = headerBtnM;
        btn.style.fontSize = headerBtnFS + "px";
        btn.style.width = headerBtnW + "px";
        btn.style.height = headerBtnH + "px";
    })

    lisuForm.style.width = lisuFormW + "px"
    lisuForm.style.height = lisuFormH + "px"
    lisuForm.style.borderRadius = lisuFormBR + "px"
    lisuH1.style.fontSize = lisuH1FS + "px"
    lisuLabel.forEach(label => {
        label.style.fontSize = lisuLabelFS + "px";
    })
    lisuInput1.style.fontSize = lisuInputFS + "px";
    lisuInput2.style.fontSize = lisuInputFS + "px";
    lisuSubmitBtn.style.fontSize = lisuSubmitBtnFS + "px";
    closeBtn.style.width = closeBtnWH + "px"
    closeBtn.style.height = closeBtnWH + "px"



    main.style.marginTop = mainMT + "px"
    main.style.height = (h*0.9)-mainMT + "px"

    if (w >= h) {
        const imageSideLength = (h * 0.9) - mainMT;
        imgDiv.style.width = imageSideLength + 6 + "px";
        imgDiv.style.height = imageSideLength + 6 + "px"; 
        postImgStyle.style.width = imageSideLength + "px";
        postImgStyle.style.height = imageSideLength + "px";
        postImgStyle.style.borderRadius = (h * 0.05) - 3.5 + "px"; 
        
        imgH2.style.fontSize = Math.max(20, h * 0.08) + "px"
        while (imgH2.scrollWidth > postImgStyle.clientWidth * 0.9) {
            const size = parseFloat(imgH2.style.fontSize);
            imgH2.style.fontSize = (size - 1) + "px";             
        }
    } else {
        postImgStyle.style.width = (w * 0.9) - 65 + "px";
        postImgStyle.style.height = (w * 0.9) - 65 + "px";
        postImgStyle.style.borderRadius = (w * 0.05) - 3.5 + "px";
        imgH2.style.fontSize = Math.max(20, h * 0.08) + "px"
        while (imgH2.scrollWidth > postImgStyle.clientWidth * 0.9) {
            const size = parseFloat(imgH2.style.fontSize);
            imgH2.style.fontSize = (size - 1) + "px";             
        }
    }
    postImgStyle.style.border = "3px solid black"
}
/*
setInterval(()=>{
    styling();
}, 300)
*/

window.addEventListener("resize", styling);
window.addEventListener("load", styling);
styling();
