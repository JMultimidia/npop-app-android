var urlInfo;
var url;
var data = [];
var result = [];

$.ajaxSetup({
    timeout: 3000,
    retryAfter: 7000
});

function getInfo() {
    $.ajax({
        url: urlInfo,
        cache: false,
        dataType: "json",
        type: "GET",
        async: true
    })
        .success(function (data) {
            //alert('Ajax request worked');
            console.log("Api retornada com sucesso!");
            appSetup(data);
        })
        .error(function () {
            setTimeout(getInfo, $.ajaxSetup().retryAfter);
        });
    return false;
}

function appSetup(data) {
    window.email = data.mail_user;
    window.facebook = data.facebook;
    window.instagram = data.instagram;
    window.youtube = data.youtube;
    window.storeiOS = data.storeios

    /* youtube = data[0].youtube; */
    /* youtube = data.youtube;           */
    $(".showFacebook").html(
        '<a href="#" onClick="window.open(window.facebook, \'_system\', \'location=yes\');"><img src="img/icones/nav-facebook.png" class="icon-local">Facebook</a>'
    );
    /*$('.showFacebook').html("<a href=\"facebook://facebook.com/wall?user="+data[0].page_id+"\"><i class=\"fab fa-facebook-square\"></i>Facebook</a>");*/
    $(".showYoutube").html(
        '<a href="#" onClick="window.open(window.youtube, \'_system\', \'location=yes\');"><img src="img/icones/nav-youtube.png" class="icon-local">Youtube</a>'
    );
    $(".showInstagram").html(
        '<a href="#" onClick="window.open(window.instagram, \'_system\', \'location=yes\');"><img src="img/icones/nav-instagram.png" class="icon-local">Instagram</a>'
    );
    $(".about_app").html("" + data.about_app + "");
    $(".visitas").html("" + data.visitas + "");
    $(".whatsapp").html("" + data.whatsapp + "");
    $(".mail_user").html("" + data.mail_user + "");
    $(".send").html(
        "<a href=\"#\" onClick=\"window.open(buildContact(window.email), '_system', 'location=yes');\">Envie um E-mail</a>"
    );
    $(".falenozap").html(
        "<a href='whatsapp://send?text=Olá " +
        data.app_title +
        "&phone=+55" +
        data.whatsapp +
        "'>Converse via WhatsApp</a>"
    );

    /*setBackgroundImage(config.image);
      if (config.logourl) {
          setLogoImage(config.logourl);
      }
  
      $("#wrapper").css("display", "block");
      $("#loading").css("display", "none");
      */
}

//InappBrowser

$("body").on("click", "#Avalie", function () {
    menuHide();
    if (device.platform == "Android") {
        var loja = "" + window.store + "";
    }
    if (device.platform == "iOS") {
        var loja = "" + window.storeiOS + "";
    }
    var ref = window.open(loja, "_system", "location=yes");
    return false;
});

function buildContact(contact) {
    if (contact.indexOf("http://") == 0) {
        return contact;
    } else {
        return "mailto:" + contact;
    }
}

// Fetch the config

/*
function getVideos() {
    var urlVideos = site + "/api/?funcao=videos&v=" + Math.random();
    var exibeVideo = '';
    $.ajax({
        type: "GET",
        url: urlVideos,
        timeout: 3000,
        cache: false,
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        //dataType: "jsonp",
        success: function (videos) {

            for (i = 0; i < videos.length; i++) {
                videoID = YouTubeGetID(videos[i].url);
                exibeVideo += '<div class="title-style04 underline04"><h5>' + videos[i].name + '</h5></div>';
                exibeVideo += '<div class="videocontainer"><iframe width="100%" height="180" src="http://www.youtube.com/embed/' + videoID + '" frameborder="0" allowfullscreen></iframe></div>';
            }
            document.getElementById('listaVideos').innerHTML = exibeVideo;
        },
    });
    return false;
}

function YouTubeGetID(url) {
    url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}
*/
