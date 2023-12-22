
/**
 * Insert HTML to div
 */
function render(content) {
    document.getElementById('dl-photos').innerHTML = content;
}


/**
 * Execute notification
 */
function notif(id, type, title, msg) {
    chrome.notifications.create(id, {
        type: "basic",
        title: title,
        message: msg,
        iconUrl: "img/notif_"+type+".png"
    });
}

/*
 * Parse an URL to return host, protocol, ...
 */
function parseUrl(url) {
    return new URL(url);
}


/**
 * Check file for ZIP archive
 */
function checkAndGetFileName(filename, index, blob) {
    let name = filename+"_";
    name += parseInt(index)+1;
    [type, extension] = blob.type.split("/");
    if (type != "image" || blob.size <= 0) {
        throw Error("Incorrect content");
    }
    return name+"."+extension;
}


/**
 * Create ZIP archive
 */
async function createArchive(urls, filename) {
    const zip = new JSZip();
    for (let index in urls) {
        try {
            const url = urls[index];
            const response = await fetch(url);
            const blob = await response.blob();
            zip.file(checkAndGetFileName(filename, index, blob), blob);
        } catch (err) {
            console.error(err);
        }
    };
    return await zip.generateAsync({type:'blob'});
}


/**
 * Download ZIP archive
 */
function downloadArchive(archive, zipName) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(archive);
    link.download = zipName+".zip";        
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);   
    
    notif('lbc-dl-photos-success', 'success', "Télécharger photos annonce Leboncoin", "Téléchargement des photos réussi !");
}


/**
 * Print photos
 */
function showPhotos(photos) {
    if (photos.length > 0) {
        var html = '';
        html += '<div class="list-photos">';

        photos.forEach(url => {
            html += '<div class="item-photo"><a href="'+url+'" target="_newtab"><img src="'+url+'"></a></div>';
        });

        html += '</div>';
    
        render(html);
    }
}