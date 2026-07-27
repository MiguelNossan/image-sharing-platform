export function styleChannelImages(images, channelContent_l, w) {
    if (!images.length) {
        channelContent_l.innerHTML = "";
        return;
    }
    const imagesPerLine = Math.max(1, Math.floor(w/204));
    let createdImages = 0;
    const lines = Math.ceil(images.length / imagesPerLine);
    channelContent_l.innerHTML = "";
    
    for (let a = 0; a < lines; a++) {
        const div = document.createElement("div")

        for (let i = createdImages; i < images.length && i < createdImages + imagesPerLine; i++) {
            const img = document.createElement("img");
            img.src = "images/" + images[i].filename;
            img.dataset.id = images[i]._id;
            img.dataset.imageNumber = i;
            img.className = "channelImage";
            div.appendChild(img)
        }
        channelContent_l.appendChild(div);
        createdImages += imagesPerLine
    }
}