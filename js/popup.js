document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        var currentTabUrl = currentTab.url;


        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            function: function() {
                return document.documentElement.outerHTML;
            }
        }, function(result) {

            document.querySelector('.loader').style.display = 'none';

            if (!result || !parseUrl(currentTabUrl).host.includes('leboncoin.fr')) {
                render('<div class="alert alert-warning">Vous devez être sur le site leboncoin.fr !</div>');
                notif('lbc-dl-photos-error', 'warning', "Télécharger photos annonce Leboncoin", "Vous devez être sur le site leboncoin.fr !");
                return;
            }

            var pageSource = result[0].result;

            var parser = new DOMParser();
            var doc = parser.parseFromString(pageSource, 'text/html');


            if (!doc.querySelector("#mainContent article div[data-qa-id='adview_spotlight_description_container']")) {
                render('<div class="alert alert-warning">Vous devez être sur une annonce pour pouvoir télécharger les photos !</div>');
                notif('lbc-dl-photos-no-result', 'warning', "Télécharger photos annonce Leboncoin", "Vous devez être sur une annonce !");
                return;
            }


            var adSubjectSlug = '';

            if (!doc.querySelector("script[id='__NEXT_DATA__']")) {
                render('<div class="alert alert-error">Erreur lors de la récupération des photos. Veuillez actualiser la page en cours (F5)</div>');
                notif('lbc-dl-photos-error', 'error', "Télécharger photos annonce Leboncoin", "Erreur lors de la récupération des photos. Veuillez actualiser la page en cours (F5)");
                return;

            } else {
                
                var photos = new Array;

                var rawjs = doc.querySelector("script[id='__NEXT_DATA__']").innerHTML;
                var json = JSON.parse(rawjs);

                if (json.hasOwnProperty('props')) {
                    if (json.props.hasOwnProperty('pageProps')) {
                        if (json.props.pageProps.hasOwnProperty('ad')) {

                            var ad = json.props.pageProps.ad;
                            // console.log(ad);
                            
                            if (ad.hasOwnProperty('images')) {

                                var json_photos = ad.images;

                                if (json_photos.nb_images > 0) {
                                    photos = json_photos.urls_large;
                                }

                                var adSubjectSlug = slugify(ad.subject + "_" + ad.location.city_label);
                                
                                
                                if (photos.length > 0) {
                                    document.querySelector('#dl-photos__container button#downloadBtn').style.display = "block";

                                    showPhotos(photos);
                                }


                            }
                        }
                    }
                }

                if (photos.length == 0) {
                    render('<div class="alert alert-warning">Aucune photo trouvée pour cette annonce.<br>Si l\'annonce comporte véritablement des photos, actualisez la page (F5)</div>');
                    notif('lbc-dl-photos-warning', 'warning', "Télécharger photos annonce Leboncoin", "Aucune photo trouvée pour cette annonce");
                    return;
                }
            }



            
            // Bouton Tout télécharger
            document.getElementById("downloadBtn").addEventListener("click", async() => {
                try {
                    const archive = await createArchive(photos, adSubjectSlug);
                    downloadArchive(archive, adSubjectSlug);
                } catch (err) {
                    notif('lbc-dl-photos-error', 'error', 'Télécharger photos annonce Leboncoin', err.message);
                }
            });


        });
    

    });
});