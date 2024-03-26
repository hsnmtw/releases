    /****************************************************
     * XHR
     *   
     ****************************************************/

     function readFormData(data) {
        if ((typeof data === 'object' && !Array.isArray(data)) || typeof data.map !== 'function') return data;
        return Object.fromEntries(data.map(function(x){ return [x.name,x.value]; }));
        // var result = {};
        // for (var i in data) {
        //     result[data[i].name] = data[i].value;
        // }
        // return result;

        // return data.map(function(x){
        //     return 
        // });
    }

     var XHR = {    
        "Status": 'online',
        "UPLOAD": function (fileInputElement, targetSelector, onSuccess, onFail, friendlyName) {
           if(fileInputElement.files.length < 1) return;
           var target = QS(targetSelector);
           var name = isNullOrEmpty(target.id) ? target.name : target.id;
           var size = fileInputElement.files[0].size / (1024 * 1024);

           if(typeof friendlyName === 'undefined' || isNullOrEmpty(friendlyName)) friendlyName=name; 
   
           if(typeof target === 'string') target = QS(target);
           
           if(size > 40) {
               fileInputElement.value = null;
               return ALERTS.WARNING('File size is larger than 40 MB : file size = [' + Number(size).toFixed(2) + ']');
           }
   
           XHR.SENDFILE('/api/ApiFile/Upload/_'+[name,size,friendlyName].map(encodeURIComponent).join('/'),fileInputElement,function(r){
               showAlert(r, onSuccess, onFail);
               if(typeof r.Status !== 'undefined' && r.Status === 'success'){
                   target.value = r.Data;
               }
           },function(r){

                if(!invoke(onFail,r)) {
                    console.log('got here ...');
                    showAlert(r);
                }
           });
       },
   
       "SENDFILE": function (api, fileInputElement, onSuccess, onFailure) {
           //var uid = makeid(5);
           //var parameters = ["_=" + makeid(10) + encodeURIComponent(new Date().toISOString())];
           var formData = new FormData();
           var xmlHttpRequest = new XMLHttpRequest();
   
           var callbackExecuted = false;
   
           var inError = false;
           showSpinner();
           xmlHttpRequest.onreadystatechange = function () {
               hideSpinner();
               if (inError) return;
               
               if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >= 400){
                   inError = true;
                   //if(!invoke(onFailure, xhr.responseText)) 
                   var o = xmlHttpRequest.responseText;
                   if(isJSON(o)) o = JSON.parse(o);
                   if(!invoke(onFailure, o)) //throw(xmlHttpRequest.responseText);
                   {
                    show.dialog({
                        title: 'Error while uploading file through ajax request, ' + JSON.stringify({"readyState": xmlHttpRequest.readyState,"status":xmlHttpRequest.status}),
                        message: typeof o === 'object' ? TABULAR(o) : o,
                        size: 'large'
                       });
                   }
               }
   
               if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
                var o = xmlHttpRequest.responseText;
                if(isJSON(o)){
                    o = JSON.parse(o);
                    if(typeof o.Status === 'string' && o.Status !== 'success'){
                        return XHR.onErrorEvent(xmlHttpRequest,api,"POST",onFailure);
                    }
                }
               }else{
                showSpinner(); 
                return;
               }
   
               var loginPageHeader = xmlHttpRequest.getResponseHeader("LoginPage");
               if (loginPageHeader && loginPageHeader !== "") {
                   XHR.GET(loginPageHeader, showAlert);
                   return;
               }
   
               if (!callbackExecuted) {
                   callbackExecuted = true;
                   console.log('call back executed ...');
                   var res = xmlHttpRequest.responseText+"";
                   console.log(typeof(res) + ":" + isJSON(res));
                   console.log('**************************************************');
                   console.log(res);
                   console.log('**************************************************');
                   invoke(onSuccess, isJSON(res) ? JSON.parse(res) : res);
               }
           };
   
           if(typeof fileInputElement !== 'string' && typeof fileInputElement.files !== 'undefined' && fileInputElement.files.length > 0) {
               fileInputElement = fileInputElement.files[0];
           }
   
           formData.append('file', fileInputElement);//.files[0]);
           
           xmlHttpRequest.upload.addEventListener('progress', function(evt){
               var percent = (evt.loaded / evt.total) * 100;
               console.log('Upload progress: ' + percent + '%');
               showAlert({
                   "Status" : 'info',
                   "Message": 'File upload: ' + Number(percent).toFixed(2) + ' %',
                   "Data"   : percent
               });
           }, false);
   
           
           xmlHttpRequest.open('POST', api, true);
           xmlHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
           xmlHttpRequest.setRequestHeader('Accept', 'application/json');

           xmlHttpRequest.onprogress = function(e){ showSpinner(); };
           xmlHttpRequest.onload =     function(e){ hideSpinner(); };
           xmlHttpRequest.onabort =    function(e){ inError=true; hideSpinner(); }; // onErrorEvent(xhr,api,'POST/UPLOAD',onFailure); };
           xmlHttpRequest.onerror =    function(e){ inError=true; hideSpinner(); }; // onErrorEvent(xhr,api,'POST/UPLOAD',onFailure); };    
   
           return xmlHttpRequest.send(formData);
       },
   
       "tryConvertToJSON": function (responseText,api,type){
           var rspObj = responseText;
   
           rspObj = JSON.tryparse(rspObj);
           if(typeof rspObj !== 'object') return responseText;
           rspObj.Data = JSON.tryparse(rspObj.Data);
   
           if(isNullOrEmpty(rspObj.AJAX)) rspObj.AJAX = true;                   
           if(isNullOrEmpty(rspObj.Url)) rspObj.Url = api;                     
           if(isNullOrEmpty(rspObj.HTTPMethod)) rspObj.HTTPMethod = type;             
   
           return rspObj;
       },
   
       "onErrorEvent": function (xmlHttpRequest,api,type,onFailure){
           hideSpinner();
           var head = '<div class="ui error visible message"><i class="circle red times icon"></i> ERROR: '+ xmlHttpRequest.status + ' ' + xmlHttpRequest.statusText +' / ' + xmlHttpRequest.readyState + ' : ['+type+'] ' + api + '</div>';
           var rsp = '';
           if(xmlHttpRequest.responseText === '') rsp = '<h1 class="dange">'+ xmlHttpRequest.status +' Server Error</h1>';
           else rsp = XHR.tryConvertToJSON(xmlHttpRequest.responseText,api,type);
   
           if (!invoke(onFailure, rsp) && typeof rsp === 'string') show.alert(head+'<hr>'+rsp);
           else show.alert(head+TABULAR(rsp));
       },
       /*
       An Ajax http request has 5 states as your reference documents:
   
       0   UNSENT  open() has not been called yet.
       1   OPENED  send() has been called.
       2   HEADERS_RECEIVED    send() has been called, and headers and status are available.
       3   LOADING Downloading; responseText holds partial data.
       4   DONE    The operation is complete.
       */
       "ajax": function (type, api, data, onSuccess, onFailure) {
   
           //var id = makeid(5);
           //var no_cache = "_=" + makeid(10) + encodeURIComponent(new Date().toISOString());
           var parameters = []; //[no_cache];
           var i;
           var xmlHttpRequest = new XMLHttpRequest();
   
           if (typeof (data) == 'function') {
               onFailure = onSuccess;
               onSuccess = data;
           }
           else if (typeof (data) == "object" && Array.isArray(data)) {
               var keys = Object.keys(data);
   
               for (i = 0; i < keys.length; i++) {
                   if (data[keys[i]] !== undefined) parameters.push([data[keys[i]].name, encodeURIComponent(data[keys[i]].value)].join('='));
               }
           } else if (typeof (data) == "object" && false == Array.isArray(data)) {
               //do nothing, the data is in perfect shape
               if(type === 'GET'){
                   parameters = object2UrlComponents(data);
               }else{
                //    var keys = Object.keys(data);
                //    for (var index = 0; index < keys.length; index++) {
                //        var element = keys[index];
                //        data[element] = encodeURIComponent(data[element]);
                //    }
               }
           } else {
               parameters = [data];
           }

           parameters = parameters.filter(function(x){ return !(x+'').toLowerCase().startsWith("ispartial"); });
           parameters.push('ispartial=true');
   
           //consolelog(type+":"+parameters+":"+id);
   
           xmlHttpRequest.open(type, [api, (type === 'GET' ? parameters.join('&') : '')].join(!api.contains('?') ? '?' : '&'), true);
           showSpinner();
           
           var inError = false;
   
           showSpinner();
           xmlHttpRequest.onreadystatechange = function () {
               hideSpinner();

               var contentType = '' + xmlHttpRequest.getResponseHeader('Content-Type');

               if(isNullOrEmpty(contentType))
               {
                contentType = isJSON(xmlHttpRequest.responseText) ? 'application/json' : 'text/html';
               }
               
               if (inError) return hideSpinner();
               if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 0) {
                   inError = true;
                   XHR.Status = 'offline';
                   show.dialog({
                    title: 'Error',
                    message:  '<i class="ui times big circle red icon"></i>'+
                             +'<span>net::ERR_CONNECTION_REFUSED - server is down or bad network connection !</span>',
                    size: 'mini'
                   });
               }
               if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >= 400){
                   inError = true;
                   //if(!invoke(onFailure, xhr.responseText)) 
                   hideSpinner();
                   var result = invoke(onFailure, isJSON(xmlHttpRequest.responseText) ? JSON.parse(xmlHttpRequest.responseText) : xmlHttpRequest.responseText);
                   if(!result)
                   {
                        //throw(xmlHttpRequest.responseText);
                        var txt = this.responseText;
                        var rsp = isJSON(txt) ? JSON.parse(txt) : txt;
                        
                        if(typeof rsp === 'object' && Object.keys(rsp).intersect(['Status','Message','Data']).length === 3){// && rsp.Message.startsWith('#')){
                            if(typeof onSuccess === 'function') 
                                onSuccess(rsp); 
                            else 
                                showAlert(rsp);
                        }else{
                            if(typeof rsp === 'object') rsp = TABULAR(rsp);
                            show.dialog({
                                    "title": 'Error while loading ajax request, ' + JSON.stringify({"readyState": xmlHttpRequest.readyState,"status":xmlHttpRequest.status}),
                                    "message": rsp,
                                "size": 'large'
                            });
                        }
                    }
               }
               
               if (!(xmlHttpRequest.readyState == 4 && (xmlHttpRequest.status == 200 || xmlHttpRequest.status == 204))) { XHR.Status = 'online'; showSpinner(); return;}
   
               if (xmlHttpRequest.responseText.toLocaleLowerCase().indexOf("session expired") > -1) {
                   inError = true;
                   return CONFIRM('session expired, will be redirected to login page', top.location.reload);
               }

               //
               // E403
               if (xmlHttpRequest.responseText.indexOf("ERROR 403") > -1 || (xmlHttpRequest.responseText.indexOf("E403") > -1 && xmlHttpRequest.responseText.toLocaleLowerCase().indexOf("access denied") > -1)) {
                   inError = true;
                   //return show.dialog({title:'ERROR 403 - Access Denied', message: xmlHttpRequest.responseText });
                   return showAlert({Status:'warning',Message:'ERROR 403 - Forbidden | الوصول لهذه الخدمة غير مصرح به',Data:403});
               }
   
               var obj = XHR.tryConvertToJSON(xmlHttpRequest.responseText,api,type);
               if(typeof obj === 'string' && contentType.toLowerCase().contains('json')){
                obj = JSON.parse(obj);
               }
               //var httpStatusCode = xmlHttpRequest.getResponseHeader("HttpStatusCode") === '200';
               
               var successHttpStatus = xmlHttpRequest.readyState == 4 
                                    && (xmlHttpRequest.status == 200 || xmlHttpRequest.status == 204)
                                    && (typeof obj !== 'object' || typeof obj.Status === 'undefined' || obj.Status !== 'error')
                                    ;
               //console.log(">>>>>>>>> "+successHttpStatus);
               if(successHttpStatus) 
               { 
                invoke(onSuccess, obj) || (typeof obj === 'object' && showAlert(obj));
               }
               else if(!invoke(onFailure, obj)) {
                    // var _obj = {};

                    // obj.Data = typeof obj.Data === 'string' && !isNullOrEmpty(obj.Data) && obj.Data.contains(' at ') ? null : obj.Data;

                    // _obj.METHOD = type;
                    // _obj.API = api;
                    // _obj.Content_Type = contentType;
                    // _obj.Http_Status = xmlHttpRequest.status;
                    // _obj.Http_Ready_State = xmlHttpRequest.readyState;
                    // _obj.Type = typeof(xmlHttpRequest.responseText) + " : " + typeof(obj);
                    // _obj.Response_Text = typeof(obj) === 'object' ? TABULAR(obj) : xmlHttpRequest.responseText;
                    // _obj.Success_Http_Status = successHttpStatus;
                    // _obj.On_Success = typeof onSuccess === 'function';
                    // _obj.On_Failure = typeof onFailure === 'function';
                    
                    // show.dialog({
                    //     title: '<i class="red circle times icon"></i> Error while loading ajax request',
                    //     message: TABULAR(_obj),
                    //     size: 'mini'
                    // });

                    if(!invoke(onSuccess, obj)) showAlert(obj);
               }
               
            };
   
           xmlHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
           if (type !== 'GET') {
               xmlHttpRequest.setRequestHeader('Accept', 'application/json');
               xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
               return xmlHttpRequest.send(JSON.stringify(readFormData(data)));
           }
   
           xmlHttpRequest.onprogress = function(e){ showSpinner(); };
           xmlHttpRequest.onload =     function(e){ hideSpinner(); };
           xmlHttpRequest.onabort =    function(e){ inError=true; hideSpinner(); }; // onErrorEvent(xhr,api,type,onFailure); };
           xmlHttpRequest.onerror =    function(e){ inError=true; hideSpinner(); }; // onErrorEvent(xhr,api,type,onFailure); };
   
           return xmlHttpRequest.send();
       },
   
       "GET": function (api, data, onSuccess, onFailure) {
           return XHR.ajax("GET", api, data, onSuccess, onFailure);
       },
   
       "POST": function (api, data, onSuccess, onFailure) {
           return XHR.ajax("POST", api, data, onSuccess, onFailure);
       },
   
       "PATCH": function (api, data, onSuccess, onFailure) {
           return XHR.ajax("PATCH", api, data, onSuccess, onFailure);
       },
   
       "PUT": function (api, data, onSuccess, onFailure) {
           return XHR.ajax("PUT", api, data, onSuccess, onFailure);
       },
   
       "DELETE": function (api, data, onSuccess, onFailure) {
           return XHR.ajax("DELETE", api, data, onSuccess, onFailure);
       },
   
       "POSTFORM": function (button,selector, api, callback, onfail) {
           if(!VALIDATEFORM(selector)) return;
           toggleButtonsLoading(button,true);
           try{
               var model = SERIALIZE(selector);
               if(typeof model === 'object' && Object.keys(model).length === 0) return ALERTS.ERROR('Cannot submit the form because no data to submit');
               XHR.POST(api, model, function(r){
                   invoke(callback, r);
                   toggleButtonsLoading(button,false);
               }, onfail);
           }catch(e){
               toggleButtonsLoading(button,false);
               console.error(e);
           }
       },
   
       "SUBMITFORM": function (button, uniqueIdentifier, action, whenSuccessfulDo){
           var selector = '[data-form-unique-identifier="'+uniqueIdentifier+'"]';
           
           toggleButtonsLoading(button,true);
           return XHR.POSTFORM(button,selector,action, function(r){ 
               toggleButtonsLoading(button,false);
               showAlert(r, function(r){ 
                   DESERIALIZE(selector,{Id:r.Data});
                   if('dialog-close' === whenSuccessfulDo) {
                       if(typeof window.dialogs !== 'undefined' && Array.isArray(window.dialogs) && window.dialogs.any() && !isNullOrEmpty(window.dialogs.last()) ){
                           window.dialogs.pop().modal('hide');
                           XHR.GET(top.location.href.split('?').first(),{ispartial:true},function(r){
                               SETBODY(r);
                           })
                       }
                   }
                   else if('index' === whenSuccessfulDo){
                       top.location.href = (top.location.href).split(/[/]form/i).first();//+'/Index';
                   }
                   //else if('stay' === whenSuccessfulDo){
                   //alert(r.Data);
                   //}
                   else{// if('reload' === whenSuccessfulDo){ // || isNullOrEmptyOrZero(top.location.href.split('?').first().split('/').last()) ) {
                       reloadAfter2000withId(r, uniqueIdentifier);
                   }
               }); 
           });
       }    
   };
   
   var GET = XHR.GET;
   var GETJSON = XHR.GET;
   var POST = XHR.POST;
   var PATCH = XHR.PATCH;
   var PUT = XHR.PUT;
   var DELETE = XHR.DELETE;
   var POSTFORM = XHR.POSTFORM;
   var SUBMITFORM = XHR.SUBMITFORM;
   var UPLOAD = XHR.UPLOAD;
   var SENDFILE = XHR.SENDFILE;
   XHR.GETJSON = XHR.GET;
   //JSON.isJSON = isJSON;
   
   //[END xhr.js]