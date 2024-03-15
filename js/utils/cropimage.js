'use strict';

var vanilla = {};

function setSignature(fileUpload,callback){
    XHR.SENDFILE('/api/ApiFile/Upload/'+fileUpload.name, fileUpload, function (r) { 
        vanilla.bind({
            "url": '/Download/File?name=' + r.Data,
            //orientation: 4
        });
        showAlert(r,callback);
    });
}

function getResult(){
    vanilla.result('base64').then(function(base64) {
        // do something with cropped blob
        var img = document.querySelector('img#outputImage');
        img.src = base64;
        img.classList.remove('hide');
    });
}

function submitSignature(button,username,callback){
    toggleButtonsLoading(button,true);
    vanilla.result('base64').then(function(base64) {
        XHR.POST('/ePolicy/ApiSignature/UploadBase64',{"Base64":base64, "Username": username}, function(r){
            button.classList.remove('loading');
            showAlert(r,function(r){
                if(callback !== null && typeof callback === 'function') callback(r);
                document.querySelectorAll('img[data-signature]').forEach(function(img){
                    var url = img.src;
                    if(url.indexOf('?') < 0) url += '?';
                    url += '&reload=' + encodeURIComponent(makeid(5));
                    img.src = url;
                });
            });
        });
    });
}

function prepareCroppie(){
    var el = document.getElementById('canvas');
    vanilla = new Croppie(el, {
        "viewport" : { "width" : 800, "height" : 275 },
        "boundary" : { "width" : 825, "height" : 300 },
        "showZoomer" : true,
        "enableOrientation" : true
    });
}