var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
        if (device.platform == "Android") {
            cordova.plugins.notification.local.schedule(toast, callback, scope, { skipPermission: true, sound: null, });
            this.showNotification();
            // Android customization
            cordova.plugins.backgroundMode.setDefaults({
                title: app_name,
                ticker: app_name,
                text: "",
                isPublic: true
            });
            //app.showNotification();
            app.clearNotification();
            // Enable background mode
            cordova.plugins.backgroundMode.enable();
        }
        if (device.platform == "iOS") {
        }
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
        this.showNotification();
        if (window.onesignal_show) {
            this.osInit();
        }
    },
    notificationCallback: function () {
        //window.plugins.toast.showShortBottom("Gracias por escucharnos! Volvé pronto ;-)");
    },

    showNotification: function () {
        cordova.plugins.notification.local.schedule({
            id: 1,
            title: app_name,
            text: window.description,
            skipPermission: true,
            sound: false,
            autoClear: false,
            ongoing: false,
            smallIcon: 'res://drawable/icon_status_bar.png',
            icon: 'res://drawable/ic_launcher_web.png',
            data: { test: 1 }
        });
    },
    clearNotification: function () {
        cordova.plugins.notification.local.clear(1, this.notificationCallback);
    },

    osInit: function () {
        window.localStorage.setItem("uuid", deviceUID);
        var deviceUID = device.uuid;
        window.id_celular = deviceUID;

        var notificationOpenedCallback = function (jsonData) {
            console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal.startInit(window.onesignal_appid)
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        console.log('OneSignal Iniciado: ' + window.onesignal_appid + '');

        window.plugins.OneSignal.getIds(id => {
            var player_id = id.userId;

            console.log("ID do Meu Celular: " + deviceUID);
            console.log("player_id: " + player_id);

            var Url = window.site + "/cliente";
            var data = {
                id_celular: deviceUID,
                id_onesignal: player_id
            };
            /*
                 $.post(Url, data, function (data, status) {
                    console.log(`Data ${data} e status é ${status}`)
                }); */
            $.post(Url, data)
                .done(function (data, status) {
                    //console.log(`Data ${data} e status é ${status}`)
                    //var cidade = data.id_cidade;
                    app.goFrame(
                        window.site + "/appwebview?info=" + deviceUID,
                        "" + app_name + ""
                    );
                })
                .fail(function (xhr, status, error) {
                    console.log(`Xhr: ${xhr} Status: ${status} Erro: ${error}`);
                });

            if (window.localStorage.getItem("uuid")) {
                console.log("Existe ID " + deviceUID + " no Storage Local");
            } else {
                console.log("Não existe ID no Storage Local");
            }
            //console.log('ID OneSignal: ' + idOneSignal + '');
        });
    },
    goFrame: function (source, name) {
        console.log(source);
        if (source == window.site + "/favoritos") {
            source = window.site + "/favoritos?info=" + window.id_celular;
            //console.log("NOVO SOURCE:" + source);
        }

        $(".title").html(name);
        menuHide();
        $.ajax({
            dataType: "html",
            type: "GET",
            async: true,
            success: function (data) {
                var frame =
                    '<iframe id="goGo" src="' +
                    source +
                    '" frameborder="0" width="100%" height="100%""></iframe>';
                $("#wrap").html(frame);
            },
            error: function (data) {
                goPage("sem-conexao.html", "Falha Na Conexão");
                /* window.plugins.toast.showWithOptions({
                                message: "Não foi possível conectar ao servidor do " + app_name + " ou você está sem Internet.",
                                duration: "long", // 2000 ms
                                position: "center",
                                styling: {
                                    opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                                    backgroundColor: '#FF0000', // make sure you use #RRGGBB. Default #333333
                                    textColor: '#d1d1e6', // Ditto. Default #FFFFFF
                                    textSize: 20.5, // Default is approx. 13.
                                    cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                                    horizontalPadding: 20, // iOS default 16, Android default 50
                                    verticalPadding: 16 // iOS default 12, Android default 30
                                }
                            }); */
            }
        });
    },
    goPage: function (source, name) {
        $(".title").html(name);
        menuHide();
        $.ajax({
            url: source,
            dataType: "html",
            type: "GET",
            async: true,
            success: function (data) {
                $("#wrap").html(data);
            },
            error: function (data) {
                window.plugins.toast.showWithOptions({
                    message: "Não foi possível visualizar " + source + ".",
                    duration: "short", // 2000 ms
                    position: "bottom",
                    styling: {
                        opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
                        backgroundColor: "#FF0000", // make sure you use #RRGGBB. Default #333333
                        textColor: "#d1d1e6", // Ditto. Default #FFFFFF
                        textSize: 20.5, // Default is approx. 13.
                        cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
                        horizontalPadding: 20, // iOS default 16, Android default 50
                        verticalPadding: 16 // iOS default 12, Android default 30
                    }
                });
            }
        });
    },
    socialLink: function () {
        alert($(this));
    }
};
var analytics_show = true; // Analytics Work ( true, false )
var google_stat = "Analytic do Aplicativo"; // Analytics Tag
//var app_name = 'Repórter PB'; // App Name for analytics

var oSBack = function (jsonData) { };

var menuHide = function () {
    $(".menu").animate({ left: "-75%" }, 500, function () {
        $(".open").hide();
        $(".menu").hide();
    });
};
var menuShow = function () {
    $(".open").show();
    $(".menu")
        .show()
        .animate({ left: "0px" }, 500);
};

function loadStartCallBack() {
    $("#status-message").text("Carregando ...");
}

function loadStopCallBack() {
    if (inAppBrowserRef != undefined) {
        inAppBrowserRef.insertCSS({ code: "body{font-size: 25px;" });
        $("#status-message").text("");
        inAppBrowserRef.show();
    }
}

function loadErrorCallBack(params) {
    $("#status-message").text("");
    var scriptErrorMesssage =
        "alert('Não foi possível localizar esta página. Erro do servidor:  " +
        params.message +
        "');";
    inAppBrowserRef.executeScript(
        { code: scriptErrorMesssage },
        executeScriptCallBack
    );
    inAppBrowserRef.close();
    inAppBrowserRef = undefined;
}

function executeScriptCallBack(params) {
    if (params[0] == null) {
        $("#status-message").text(
            "Não foi possível localizar esta página. Erro do servidor: '" +
            params.message +
            "'"
        );
    }
}

//End InappBrowser

var share = function () {
    if (device.platform == "Android") {
        var loja = "" + window.store + "";
    }
    if (device.platform == "iOS") {
        var loja = "" + window.storeiOS + "";
    }
    window.plugins.socialsharing.shareWithOptions(
        {
            message: "Eu estou usando o aplicativo " + app_name + ". Baixe em ", // not supported on some apps (Facebook, Instagram)
            subject: "Eu estou usando o aplicativo " + app_name + ". Baixe em ", // fi. for email
            files: ["", ""], // an array of filenames either locally or remotely
            url: loja,
            chooserTitle: "Compartilhe" // Android only, you can override the default share sheet title
        },
        function () {
            /* Success Message */
        },
        function () {
            /* Error Message */
        }
    );
};

$("body").on("click", "#Sair", function () {
    ShowExitDialog();
    return false;
});
// Dialog box when back button is pressed
function ShowExitDialog() {
    navigator.notification.confirm(
        "Tem certeza que deseja fechar o aplicativo " + window.app_name + "?", // message
        alertexit, // callback
        window.app_name, // title
        ["Sim", "Não"] // buttonName
    );
}
// Call exit function
function alertexit(button) {
    if (button == "1" || button == 1) {
        //device.exitApp();
        app.clearNotification();
        navigator.app.exitApp();
    }
}

$(document).ready(function () {
    $(".menus").click(menuShow);
    $(".open").click(menuHide);
    $(".share").click(share);
});
