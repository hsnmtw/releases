
'use strict';

var imageIcons = {
    minus: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRHJhdyI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiM5QUEwQTYiIGN4PSI4IiBjeT0iOCIgcj0iOCI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjUgNyAxMSA3IDExIDkgNSA5Ij48L3BvbHlnb24+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K',
    times: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTG9zcyI+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNFQTQzMzUiIGN4PSI4IiBjeT0iOCIgcj0iOCI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJQYXRoIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOC4wMDAwMDApIHJvdGF0ZSgtMzE1LjAwMDAwMCkgdHJhbnNsYXRlKC04LjAwMDAwMCwgLTguMDAwMDAwKSAiIHBvaW50cz0iMTIgOC44IDguOCA4LjggOC44IDEyIDcuMiAxMiA3LjIgOC44IDQgOC44IDQgNy4yIDcuMiA3LjIgNy4yIDQgOC44IDQgOC44IDcuMiAxMiA3LjIiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=',
    check: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iV2luIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzNBQTc1NyIgY3g9IjgiIGN5PSI4IiByPSI4Ij48L2NpcmNsZT4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgcG9pbnRzPSI2LjQgOS43NiA0LjMyIDcuNjggMy4yIDguOCA2LjQgMTIgMTIuOCA1LjYgMTEuNjggNC40OCI+PC9wb2x5Z29uPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==',
    blank: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iRW1wdHkiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0JEQzFDNiIgc3Ryb2tlLXdpZHRoPSIyIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgY3g9IjgiIGN5PSI4IiByPSI3Ij48L2NpcmNsZT4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=',
    down: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4xLjEgKDg3NjEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPm91dDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJJY29ucyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9Im91dCIgc2tldGNoOnR5cGU9Ik1TQXJ0Ym9hcmRHcm91cCI+CiAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtNTU4IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiPjwvcmVjdD4KICAgICAgICAgICAgPHBhdGggZD0iTTEzLDEzIEwxMyw2IEwxMSw2IEwxMSwxMyBMOCwxMyBMMTIsMTcgTDE2LDEzIEwxMywxMyBMMTMsMTMgWiIgaWQ9IlBhdGgtMiIgZmlsbD0iI0U1MUMyMyIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
    
}

function embedpdfs(selector){
    each(selector, function(pdf){ 
        PDFObject.embed(pdf.attributes['data-embed-pdf-src'].value,'#'+pdf.id); 
    });
}

function _preview_labels(){
    var options = SERIALISE('form[name="labels"]');
    var qs = Object.keys(options).map(function(key){ return [key,encodeURIComponent(options[key])].join('=') }).join('&');
    SETHTML('.pdf-embed','<iframe class="input rb" src="/labels/generate?'+ qs +'" width="100%" height="100%"></iframe>');
}
function _x(){
    SETHTML('.pdf-embed','الرجاء الانتضار ريثما يتم التحميل' + '<i class="notched circle loading icon"></i>');
    SETHTML('span.what', '<i class="notched circle loading icon"></i>');
    SHOW('span.what');
    var model = SERIALIZE('form[name="labels"]');
    model._timestamp = new Date().toString() +'_'+ '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').shuffle().take(15).join('');
    var done = function(){
        PDFObject.embed('/Public/GetQRCode?'+toQueryString(model),'.pdf-embed');
        HIDE('span.what');
        var len = (''+model.StartNumber).length;
        var init = Number('0'+model.StartNumber);
        var sn = (model.Same ? 0 : Number('0'+model.NumberOfLabels)) + init;
        DESERIALIZE('form[name="labels"]',{ 
            "StartNumber" : ('00000000000' + sn ).takeReverse(len)
        });
    };
    var retry = function(){
        SETHTML('.pdf-embed', QS('.pdf-embed').innerText + ' . ');
        GET('/Public/CookQRCode',model,function(res){
            if(res.contains('Loaded !')){
                clearInterval(window.retry_handle);
                invoke(done);
            }
        });
    };
    GET('/Public/CookQRCode',model,function(res){
        if(res.contains('Loaded !')){
            clearInterval(window.retry_handle);
            invoke(done);
        }
        else if(res.contains('Loading ...')){
            window.retry_handle = setInterval(retry,1000);
        }
    });
    //
    
    
}


function updateFieldUsingLastComponent(selector,selecElement){
    var option = selecElement.options[selecElement.selectedIndex].innerText + '';
    return setValue(selector, option.split('|').last().trim());
}

function paginate(selector, options){
    var model = SERIALIZE(selector);
	var keys = Object.keys(options);
	
	for(var i=0;i<keys.length;i++){
		model[keys[i]] = options[keys[i]] ;
	}
    
	var newurl = '?' + object2UrlComponents( model ).join('&').trim();
	//console.log(newurl);
	
	top.location.href = newurl;
}

var JSSideBar = {
    "FIRST_COLUMN": '[data-main-content-first-column]',
    "SECOND_COLUMN": '[data-main-content-second-column]',
    "close": function(){
        GET('/api/ApiCommon/HideSideBar',function(r){
            if(r === '1')
            {
                QS(JSSideBar.FIRST_COLUMN).className = 'sixteen wide column';
                QS(JSSideBar.SECOND_COLUMN).className = 'hide';
                QS('[data-side-bar] i').className = 'ui rocketchat alternate icon';
            }
        });
    },
    "toggle": function(){
        JSSideBar[QS('[data-side-bar] i').classList.contains('times') ? 'close' : 'open']();
    },
    "open": function(window){
        if(isNullOrEmpty(window)) window = 'chat';
        GET('/Home/'+window,function(r){
            QS(JSSideBar.SECOND_COLUMN + ' .'+window).innerHTML = r;
            JSSideBar.show();
        });
    },
    "show": function(){
        QS(JSSideBar.FIRST_COLUMN).className  = 'eleven wide column';
        QS(JSSideBar.SECOND_COLUMN).className = 'five wide column pr-4';
        QS('[data-side-bar] i').className = 'ui times alternate icon';
    }
};

var JSProfile = {
    "updatePhoto": function(username){
        FILEPROMPT('.png,.jpg,.jpeg,.bmp,.gif',function(filepath){
            XHR.PATCH('/api/ApiCommon/UpdateProfilePhoto/'+username,{"Username":username,"Photo":filepath},showAlert,showAlert);
        });
    }
};

var JS_Calendar = {
    "convert": function(){
        SETHTML('.input.rb.the-date','');
        var selector = '.converted-to';
        var model = SERIALISE('.mini-calendar-conversion');
        model.date = (model.date+'').split('-').join('/').split('.').join('/').split('\\').join('/');
        var splitted = model.date.split('/');
        var dd = '0'+splitted[0];
        var MM = '0'+splitted[1];
        var yyyy = (splitted[2] > 40 ? '19' : '20') + splitted[2];
        model.date = dd.takeReverse(2) + '/' + MM.takeReverse(2) + '/' + yyyy.takeReverse(4);
        SETHTML('.input.rb.the-date',model.date);
        GET('/api/apiuser/To' + model.convertto,model,function(r){
            SETHTML(selector,r);
        });
    },
    "showForm": function(){
        var form = '<div class="ui form segment mini-calendar-conversion">'+
                   ' <div class="field">'+
                   '    <label>Date <small>(dd/MM/yyyy)</small></label>'+
                   '    <input maxlength="12" name="date" placeholder="dd/MM/yyyy"/>'+
                   ' </div>'+
                   ' <input type="hidden" name="format" value="dd/MM/yyyy" />'+
                   ' <div class="field">'+
                   '    <label>Convert to</label>'+
                   '    <div class="ui radio checkbox"><input type="radio" name="convertto" value="Hijri" checked /><label>Hijri</label></div>'+
                   '    <div class="ui radio checkbox"><input type="radio" name="convertto" value="Gregorian" /><label>Gregorian</label></div>'+
                   ' </div>'+
                   '<div class="two fields">'+
                   '       <div class="field three wide">'+
                   '         <label>Date:</label>'+
                   '         <div class="input rb the-date"></div>'+
                   '       </div>'+
                   '       <div class="field three wide">'+
                   '         <label>Corresponding to:</label>'+
                   '         <div class="input rb converted-to"></div>'+
                   '       </div>'+
                   ' </div>'+
                   ' <hr>'+
                   ' <button type="button" class="ui primary button" onclick="JS_Calendar.convert()">Convert</button>'+
                   ' <button type="button" class="ui secondary button" onclick="JS_Calendar.hideForm()">Cancel</button>'+
                   '</div><br><br>';
        SETHTML('.modal-content', form);
        FOCUS('.modal-content [name=date]')
        
    },
    "hideForm": function(){
        SETHTML('.modal-content', '');
    }
};

var JS_common = {
    "translate": function(selector,lang){ // lang is enum {ar,en}
        GET('/language.json',function(dictionary){
            var ardictionary = {};
            Object.keys(dictionary).forEach(function(key){
                ardictionary[dictionary[key]] = key;
            });
            var dic = lang === 'ar' ? dictionary : ardictionary;
            each(selector,function(el){
                var text = (el.innerText+"").trim();
                if(typeof dic[text] !== 'undefined'){
                    el.innerText = dic[text];
                }
            });
        });
    },
    "openFormEmbeded": function(area,controller,id){
        return GETCONFIRMEMBED({
            "url": ['',area,controller,'form',id].join('/')+'?isPartial=true',      
            "api": ['',area,'api'+controller,'save'].join('/'),      
            "callback": function(r){ setTimeout(function(){top.location.reload();},500); }, 
            "onApprove": null,
            "onShown": null,  
            "method": null,   
            "selector": null, 
            "onClose": null  
        });
    },
    "embedPopup": function(url,selector,onApprove,onClose){
        return GETCONFIRMEMBED({
            "url": url,      
            "api": null,      
            "callback": null, 
            "onApprove": onApprove,
            "onShown": null,  
            "method": null,   
            "selector": selector, 
            "onClose": onClose 
        });
    }
}


window.onerror = function (message, file, line, column, errorObj) { //function(msg, url, line, col, error) {
    //if(msg.endsWith(error) && !isNullOrEmpty(error)) msg = msg.replace(error,"");
    //if() error = JSON.stringify(error);
    var model = { 
        "Message": message, 
        "Location": file, 
        "URL": top.location.href, 
        "Line": line, 
        "Column": column, 
        "Error": errorObj.stack
    };
    
    message = TABULAR(model);
    //model.Error = isEmptyObject(error) ? "unknown error" : error;
    var handler = function(){ 
        show.dialog({
            "size":'large',
            "title": 'Uncaught JS Error',
            "message": "<div class='ui segment borderless'>"+
                        " <h3 class='ui danger visible error icon message attached'>"+
                        "   <i class='ui times red circle icon'></i>"+
                        "   <div class='content'>UI Javascript Error caught:</div>"+
                        " </h3>"+
                        " <div class='mr-2 ui segment attached'>" + message + "</div>" +
                        "</div>"
        }); 
    };
    try{
        if(XHR.Status !== 'offline') XHR.PUT('/api/ApiCommon/LogJSError',model,handler,handler);
        else handler();
     }catch(ex){
         console.log(ex);
    }
};


function VALIDATE(selector,callback,whendone) {
    hideAlert();
    var field = null;
    if(typeof selector === 'object')      field = selector;
    else if(typeof selector === 'string') field = QS(selector);

    field.parentElement.classList.remove('error');
    field.setAttribute('data-is-valid-input',false);

    var callback = function (r) {
        field.setAttribute('data-is-valid-input',r.Data);
        if(r.Data === false) {
            field.parentElement.classList.add('error');
            if(!invoke(callback,r)) ALERTS.WARNING('Field (' + field.name + ') with value ['+ field.value +'] failed validation');
        }
        invoke(whendone, r.Data);
    };
    XHR.GET('/api/ApiCommon/Validate?subject='+field.value+'&field='+field.name,callback,callback);
    
}

function SHOWLOOKUP(data, onSuccess, onFail)
{
    var lookupDiv = function () { return QS('div.LOOKUP'); };
    var dlg = show.dialog({
        "title"   : "LOOKUP",
        "message" : data,
        "onShown" : function(){
            
            var options = lookupDiv().querySelectorAll('input[data-radio-lookup][type=radio]').toList();
            
            options.forEach(function(selected){
                selected.onblur = function(e){
                    var tr = lookupDiv().querySelector('tr[data-lookup-id="' + selected.attributes['data-radio-lookup'].value + '"]');
                    tr.classList.remove('lookup-highlight');
                };
                selected.onclick = function(e){
                    var tr = lookupDiv().querySelector('tr[data-lookup-id="' + selected.attributes['data-radio-lookup'].value + '"]');
                    tr.classList.add('lookup-highlight');
                };
                selected.onkeyup = function(event){
                    if(event.key === 'Enter') { event.preventDefault();
                        selected.checked = true;
                        invoke(onSuccess, JSON.parse(unescape(selected.value)));
                        dlg.modal('hide');
                    }
                };
            });

            if(options.any()) {
                options.first().checked = true;
                FOCUS(options.first());
                options.first().onclick();
            }
        },
        "onDeny": onFail,
        "onApprove": function () {
            var selected = lookupDiv().querySelectorAll('input[data-radio-lookup][type=radio]:checked');
            if(selected.length === 0) selected = QSA('input[data-radio-lookup][type=radio]');
            if(selected.length > 0) invoke(onSuccess, JSON.parse(unescape(selected[0].value)));
        }
    });
}

function LOOKUP(api, idKey, searchValue, shownKeys, onSelectCallback){
    
    XHR.GET(api,function(r) {
       if(r.length === 1 && r[0][idKey] === searchValue){
        invoke(onSelectCallback, r[0]);
        return ;
       }
       var i = 0;
       var data = '<div class="LOOKUP"><table class="stats-table"><thead>' +
                  '<tr><th width="10"></th><th>' + shownKeys.join('</th><th>') + '</th></tr>' +
                  '</thead><tbody>' + r.map(function(x){ 
                      i++;
                      return ' <tr data-lookup-id="LOOKUP_'+ i + '">' + '<td><input name="lookup_selection_radio_option" data-radio-lookup="LOOKUP_'+ i + '" type="radio" value="'+ escape(JSON.stringify(x)) +'"></td><td>' + shownKeys.map(function(k){ return x[k]; }).join('</td><td>') +'</td></tr>'; 
                  }).join('\n') + '</tbody></table></div>';
        
        SHOWLOOKUP(data, onSelectCallback);
    });
}

function confirmDelete(message,api,dataRecordId,callback){
    return CONFIRM(message,function(result){
        each('[data-record-id="'+dataRecordId+'"]', function(x){
            x.classList.add('style-112');
        });
        XHR.DELETE(api,hideAfterDelete,callback); 
    });
}

function hideAfterDelete(r){
    return showAlert(r,function(r){ 
        show.hideAll(); 
        each('[data-record-id="'+r.Data+'"]',function(x){
            x.classList.add('hide'); 
        });
    });
}

function activateStep(selector){
    hideAlert();
    each('.step',function(x){
        x.classList.add('disabled');
        x.classList.remove('active');
        x.querySelectorAll('i.icon').forEach(function(i){
            i.classList.add('grey');
        });
    });
    
    HIDE('.step-segment');

    each(selector,function(x){
        x.classList.add('active');
        x.classList.remove('disabled');
        x.classList.remove('hide');
        x.querySelectorAll('i.icon').forEach(function(i){
            i.classList.remove('grey');
        });
    });

    each(selector,function(el){
        var segment = el.getAttribute('data-segment');
        console.log(':::: '+segment);
        console.log(':::: '+segment.value);
        if(typeof segment === 'string' && !isNullOrEmpty(segment)){
            SHOW(segment);
        }
    });
}

var JSExport = {
    "csv": function(href,searchWord,filters,orderby,descending,sortAndFilterFields,allFields,recordsCount){
        // var data = {
        //     "href"               : href               ,    
        //     "searchWord"         : searchWord         ,          
        //     "filters"            : filters            ,       
        //     "orderby"            : orderby            ,       
        //     "descending"         : descending         ,          
        //     "sortAndFilterFields": sortAndFilterFields,                   
        //     "allFields"          : allFields          ,         
        //     "recordsCount"       : recordsCount                   
        // };

        //return console.log(JSON.stringify(data));
        
        var groupedFields = groupListByNumberOfGroups(allFields.split(','),4);
		if(isNullOrEmptyOrZero(recordsCount)) recordsCount = 999999;
        show.dialog({
            "size": 'large',
            "title": 'Export to excel: Select the columns to show in the exported file',
            "message": '<div class="ui segment form">'
                     + ' <div class="ui checkbox pt-1">'
                     + '  <input type="checkbox" checked id="selectAll_exportSelectedField" onclick="TOGGLECHECKED(\'input[type=checkbox][name=exportSelectedField]\',this.checked)">'
                     + '  <label for="selectAll_exportSelectedField">Select All</label>'
                     + ' </div>'
                     + '<hr />'
                     + '<div class="ui grid"><div class=" four wide column"><div class="ui list">'
                     +  groupedFields.map(function(group){ 
                             return group.map(function(field){
                                return '<div class="ui item">'
                                + '  <div class="ui checkbox pt-1">'
                                + '    <input type="checkbox" value="'+field+'" checked name="exportSelectedField" id="exportSelectedField_'+field+'">'
                                + '    <label for="exportSelectedField_'+field+'">'+field.fromCamelToSpaced()+'</label>'
                                + '  </div>'
                                + '</div>'
                                ;
                             }).join('\n');
                        }).join('</div></div><div class="four wide column"><div class="ui list">')
                     + '</div></div>'
                     + '</div>'
					 + ' <div class="ui field">'
					 + '   <label>Records to export</label>'
					 + '   <input type="number" data-type="numeric" name="export_records_count" value="'+ recordsCount +'">'
					 + ' </div>'
                     + '</div>',
            "onDeny": function(){
                
            },
            "onApprove": function(){
                var exportFields = EXTRACT('input[type="checkbox"][name="exportSelectedField"]:checked','value',false).join(',');
                        var parameters = {
                            "export": 'csv',
                            "searchWord": searchWord,
                            "filters": filters,
                            "orderby": orderby,
                            "descending": descending,
                            "sortAndFilterFields": sortAndFilterFields,
                            "allField": allFields,
                            "exportFields": exportFields,
							"pageSize": getValue('[name="export_records_count"]')
                        };
                        //top.location.href = href.split('?').first() + '?' + Object.keys(parameters).map(function(key,index){ return [key,encodeURIComponent(parameters[key])].join('='); }).join('&');
                        top.location.href = '?' + Object.keys(parameters).map(function(key,index){ return [key,encodeURIComponent(parameters[key])].join('='); }).join('&');
                        return true;
            }
        });
    }
};

function showAlertThenReloadAfter250(r){
	showAlert(r,function(){ setTimeout(function(){ top.location.reload(); },250); });
}




var JSCommon = {
    "statusIcons": {
        "Approved" : "check circle green",
        "Rejected" : "red circle times",
        "Pending"  : "hand rock outline gray",
        "Workflow" : "tasks blue",
        "Draft"    : "circle outline orange",
        "Cancelled": "red times",
        "Notified" : "envelope open outline blue"
    },
    "reviewNotificationRequest": function(area,workflowRequestType,requestId){
        if(area === 'ePolicy'){
            if(workflowRequestType === 'Policy')                 return JS_ePolicy_Policy.openForApproval('Policy',requestId);
            if(workflowRequestType === 'PolicyTermination')      return JS_ePolicy_Policy.openForApproval('PolicyTermination',requestId);
            if(workflowRequestType === 'SignatureAuthorization') return POPUP('/ePolicy/Signature/OnBehalfRequest/'+requestId+'?ispartial=true','fullscreen');
            if(workflowRequestType === 'PolicyRequest')          return POPUP('/ePolicy/Policy/ChangeRequest/'+requestId+'?ispartial=true','fullscreen');
            if(workflowRequestType === 'SignatureChangeRequest') return POPUP('/ePolicy/Signature/ReviewChangeRequest/'+requestId+'?ispartial=true','fullscreen');
        }
        if(area === 'ePolicyACO'){
            if(workflowRequestType === 'Policy')                 return JS_ePolicyACO_Policy.openForApproval('Policy',requestId);
            if(workflowRequestType === 'PolicyTermination')      return JS_ePolicyACO_Policy.openForApproval('PolicyTermination',requestId);
            if(workflowRequestType === 'SignatureAuthorization') return POPUP('/ePolicyACO/Signature/OnBehalfRequest/'+requestId+'?ispartial=true','fullscreen');
            if(workflowRequestType === 'PolicyRequest')          return POPUP('/ePolicyACO/Policy/ChangeRequest/'+requestId+'?ispartial=true','fullscreen');
            if(workflowRequestType === 'SignatureChangeRequest') return POPUP('/ePolicyACO/Signature/ReviewChangeRequest/'+requestId+'?ispartial=true','fullscreen');
        }
        if(area === 'ePolicyTEST'){
            if(workflowRequestType === 'Policy')                 return JS_ePolicyTEST_Policy.openForApproval('Policy',requestId);
            if(workflowRequestType === 'PolicyTermination')      return JS_ePolicyTEST_Policy.openForApproval('PolicyTermination',requestId);
            if(workflowRequestType === 'SignatureAuthorization') return POPUP('/ePolicyTEST/Signature/OnBehalfRequest/'+requestId+'?ispartial=true','fullscreen');
            if(workflowRequestType === 'PolicyRequest')          return POPUP('/ePolicyTEST/Policy/ChangeRequest/'+requestId+'?ispartial=true','fullscreen');
            if(workflowRequestType === 'SignatureChangeRequest') return POPUP('/ePolicyTEST/Signature/ReviewChangeRequest/'+requestId+'?ispartial=true','fullscreen');
        }
        if(area === 'eTickets'){
            if(workflowRequestType === 'TicketWorkflow')         return POPUP('/eTickets/Ticket/Open/'+requestId+'?ispartial=true','fullscreen',function(x){ JS_eTickets_Ticket.convertJSONcontent(x); embedpdfs('.modal [data-embed-pdf-src]'); });
        }
        throw Error('unknown notification request ["' + [area,workflowRequestType,requestId].join('","')+'"]');
    },
    "saveForm": function(apiUrl,selector,htmlUrl,callback){
        while(htmlUrl.endsWith('/')) htmlUrl=htmlUrl.slice(0,-1);
        XHR.POST(apiUrl,SERIALIZE(selector),function(r){ 
            if(Object.hasOwnProperty.call(r,'Status') && r.Status === 'success') {
                GETHTML(htmlUrl+'/'+r.Data+'?isPartial=true',selector);
                invoke(callback,r);
            }else{
                dialogAlert(r);
            }
        });
    },
    "fixCapitalization": function(element){
        try{
            if((element.value.split('').filter(function(x) { return x >= 'A' && x <= 'Z'; }).length/element.value.length)>=0.5) {
                element.value=element.value.toLowerCase();
            }
        }catch(e){

        }
    },
    "convertDate": function(formSelector,tableSelector){
        var model = SERIALIZE(formSelector);
        XHR.GET('/api/apiuser/to'+model.Calendar,{date:model.SourceDate,format:'yyyy-MM-dd'},function(r){ 
            var tbody = QS(tableSelector+' tbody');
            var gregorian,hijri;
            model.TargetDate = (""+r).split('-').reverse().join('/');
            model.SourceDate = (""+model.SourceDate).split('-').reverse().join('/');
            if(model.Calendar == 'Gregorian') {
                gregorian = model.TargetDate;
                hijri = model.SourceDate;
            }else{
                gregorian = model.SourceDate;
                hijri = model.TargetDate;
            }
            tbody.innerHTML += '<tr><td>'+gregorian+'</td><td>'+hijri+'</td></tr>';
        });
    },
    "updateProfileDefaultArea": function(username,area){
        XHR.PATH('/api/apiuser/updateProfileDefaultArea',{Username:username,DefaultArea:area},showAlert);
    },
    "signatoryFormSelector": '[data-signatory-form]',

    "updateSingleField": function(area,controller,field,id,value,callback){
        XHR.PATCH('/'+area+'/api'+controller+'/UPDATE',{"Field":field,"Id":id,"Value":value},function(r){
            if(typeof r === 'string') return show.dialog({message:r,onApprove:function(){}});
            invoke(callback,r);
        });
    },

    // "changeSignatoryOrder": function (apiController, reorderDelta, callback) {
        
    //     var form = '<div class="ui visible ignored message attached"><div class="header">'+
    //                '  Enter the number of levels (-/+) to re-order signatory position'+
    //                '</div></div>'+
    //                '<div class="ui segment attached form delta0">' +
    //                '  <div class="field six wide">       ' +
    //                '    <label>Delta</label>    ' +
    //                '    <input id="signatureOrderDelta" name="signatureOrderDelta" type="number" data-type="numeric" value="'+reorderDelta+'" disabled readonly /> ' +
    //                '    <button onclick="setValue(\'.delta0 input[name=signatureOrderDelta][type=number]\', +(getValue(\'.delta0 input[name=signatureOrderDelta][type=number]\')) - 1 )" type="button" class="ui icon button compact tiny"><i class="ui arrow red up icon"></i></button>' +
    //                '    <button onclick="setValue(\'.delta0 input[name=signatureOrderDelta][type=number]\', +(getValue(\'.delta0 input[name=signatureOrderDelta][type=number]\')) + 1 )" type="button" class="ui icon button compact tiny"><i class="ui arrow blow down icon"></i></button>' +
    //                '  </div>' +
    //                '</div>' ;

    //     CONFIRM(form,function(model) {
    //         var delta = model.signatureOrderDelta; //getValue('.delta0 input[type="number"]');
                        
    //         if(delta == 0) return true;
    //         var model = SERIALIZE(JSCommon.signatoryFormSelector);
    //         model.SignatoryOrder = delta;
    //         model.Justification = 'Reorder selected signatory';
    //         //var username = getValue('[data-signatory-form] [data-signatory-username]');
    //         var parentRecordId = getValue(JSCommon.signatoryFormSelector + ' [data-parent-id]');
    //         var signatoryId = getValue(JSCommon.signatoryFormSelector + ' [data-signatory-id]');
            
    //         XHR.PATCH([apiController,'ChangeSignatoryOrder',parentRecordId,signatoryId].join('/'), model, function (r) {
    //             showAlert(r, function(r){
    //                 JSCommon.loadSigners(apiController.replace('/Api','/'),parentRecordId,callback);
    //             });
    //         });
    //     });
    // },
    "changeSignatoryOrder": function (apiController, delta, callback) {
        var signatory = SERIALIZE(JSCommon.signatoryFormSelector);
        var parentId  = getValue(JSCommon.signatoryFormSelector + ' [data-parent-id]');
        XHR.GET([apiController,'GetSignatories', parentId].join('/'),function(r){
            var signatories = r.Data;
            var message = '<div class="reorder-signatories"><div class="ui visible ignored attached message p-0">' +
                          ' <div class="ui grid p-0">'+
                          '  <div class="ten wide column p-0"><div class="header pl-4 pt-3">Re-Ordering Signatories</div></div>'+
                          '  <div class="six wide column text-right p-1">'+
                          '   <input type="hidden" name="delta" value="0">'+ 
                          '   <div class="ui icon buttons">'+
                          '     <button onclick="move(\'.reorder-signatories [data-x]\',-1,function(d){setValue(\'.reorder-signatories [name=delta]\',d+Number(getValue(\'.reorder-signatories [name=delta]\')))})" class="ui icon compact button" type="button"><i class="ui arrow circle up red icon"></i></button>'+
                          '     <button onclick="move(\'.reorder-signatories [data-x]\',+1,function(d){setValue(\'.reorder-signatories [name=delta]\',d+Number(getValue(\'.reorder-signatories [name=delta]\')))})" class="ui icon compact button" type="button"><i class="ui arrow circle down blue icon"></i></button>'+
                          '   </div>'+
                          '  </div>'+
                          ' </div>'+
                          '</div>'+
                          '<div class="ui attached segment">'+ 
                          ' <table class="stats-table">'+
                          '  <thead>'+
                          '    <tr><th width="1%"></th><th>Name</th><th>Position</th><th>Status</th><th>Date</th></tr>'+
                          '  </thead>'+
                          '  <tbody>'+
                          signatories.filter(function(x){return x.SignatoryGroup == signatory.SignatoryGroup;}).map(function(x) {
                              return '    <tr'+(x.Id == signatory.Id ? ' style="background-color:cornsilk" data-x' : '')+'><td width="1%">input</td><td>name</td><td class="small">position</td><td>status</td><td>date</td></tr>'.replaceTemplate({
                                  "input":  x.Id == signatory.Id ? '<input type="radio" checked data-selected-signatory />' : '',
                                  "name":   (x.NameEn+'').firstAndLastNames(),
                                  "status": '<i class="'+ JSCommon.statusIcons[x.Status] +' icon"></i>', //x.Status,
                                  "position": x.JobTitleEn+'',
                                  "date":   (''+x.ApprovedOn).replace('T',' ')//.first()
                              });
                          }).join('\n') +
                          '  </tbody>'+
                          ' </table>'
                          '</div></div>';
            
            CONFIRM(message,function (model) {
                JSCommon.changeSignatoryOrderAction(apiController,model.delta,callback);
            },function () {
                move('.reorder-signatories [data-x]',delta,function(d){setValue('.reorder-signatories [name=delta]',d+Number(getValue('.reorder-signatories [name=delta]')))});
            });
            
        });
    },

    "changeSignatoryOrderAction": function (apiController, delta, callback) {
                    
        if(delta == 0) return true;
        var model = SERIALIZE(JSCommon.signatoryFormSelector);
        model.SignatoryOrder = delta;
        model.Justification = 'Reorder selected signatory';
        //var username = getValue('[data-signatory-form] [data-signatory-username]');
        var parentRecordId = getValue(JSCommon.signatoryFormSelector + ' [data-parent-id]');
        var signatoryId = getValue(JSCommon.signatoryFormSelector + ' [data-signatory-id]');
        
        XHR.PATCH([apiController,'ChangeSignatoryOrder',parentRecordId,signatoryId].join('/'), model, function (r) {
            showAlert(r, function(r){
                JSCommon.loadSigners(apiController.replace('/Api','/'),parentRecordId,callback);
            });
        });
    },    

    "deleteSignatory": function(api, callback){
        var message = '<div class="ui icon visible warning message">'+
                      '  <i class="ui warning circle orange alternate icon"></i>'+
                      ' <div class="content">'+
                      '  <div class="header">Warning !!!</div><hr>'+
                      '  <p>This will delete the selected signatory permenantly, to prceed click OK/Yes</p>'+
                      '  <br><div class="ui checkbox pt-1">'+
                      '     <input type="checkbox" name="confirmDeleteSignatory" id="confirmDeleteSignatory" data-type="boolean" value="true"> '+
                      '     <label for="confirmDeleteSignatory">I understand that this signatory will be permenantly removed from the list of approvals.</label>' +
                      '  </div>'+
                      ' </div>'+
                      '</div>';
        CONFIRM(message,function(model){
            if(!model.confirmDeleteSignatory) return;
            // var username = getValue('[data-signatory-form] [data-signatory-username]');
            // var parentRecordId = getValue(JSCommon.signatoryFormSelector + ' [data-parent-id]');
            var signatoryId = getValue(JSCommon.signatoryFormSelector + ' [data-signatory-id]');
            //XHR.DELETE([api,parentRecordId,signatoryId,username].join('/'), {"Id": signatoryId, "Justification": 'Signatory approval is not required anymore here' }, function (r) {
            XHR.DELETE(api, {"Id": signatoryId, "Justification": 'Signatory approval is not required anymore here' }, function (r) {
                showAlert(r, callback);
                JSCommon.resetSignatoryForm(JSCommon.signatoryFormSelector);
            }); 
        });
    },

    "loadSigners": function (controller, id, callback) {
        GETHTML(controller+'/Signatories/'+id, '.signatories', callback);
    },

    "saveSignatory": function (apiController) {
        
        var model = SERIALIZE(JSCommon.signatoryFormSelector);

        var fields = [
            "Designation",
            "Username",
            "JobTitleId",
            "SignatoryGroup",
            "SignatoryOrder"
        ];

        var emptyfields = fields.map(function(x){ return {name: x,status: isNullOrEmpty(model[x])}; }).filter(function(y){ return y.status; });

        if(emptyfields.any()){
            return ALERTS.WARNING( 'Cannot add signatory because of empty field(s): [' + emptyfields.map(function(x){ return x.name; }).join(',') + ']');
        }

        if (model.Id == 0 && QSA('input[type="radio"][data-signatory="' + model.Username + '"]').length > 0) {
            return ALERTS.WARNING('Signatory ['+ JSON.stringify(model) +'] Already added');
        }

        model.Justification = 'Updated designation, position, type';
        var parentRecordId = getValue(JSCommon.signatoryFormSelector + ' [data-parent-id]');
        var signatoryId = getValue(JSCommon.signatoryFormSelector + ' [data-signatory-id]');
        return XHR.PUT(apiController+'/SaveSignatory/'+parentRecordId+'/'+signatoryId, model, function (r) {
            showAlert(r);
            if(r.Status === 'success' || r.Status === 'info'){
                JSCommon.loadSigners(apiController.replace('/Api','/'), getValue('[data-parent-id]'));
                JSCommon.resetSignatoryForm();
            }
        });
    },

    "editSignatory": function(signatoryId, parentRecordId, apiController){
        each(JSCommon.signatoryFormSelector + ' .Username-Fullname',function(x){ x.innerText=''; });
        XHR.GET(apiController+'/GetSignatory/'+ parentRecordId +'/'+signatoryId, function (r) {
            if(typeof r.Status !== 'undefined' && r.Status === 'success'){
                var model = r.Data;
                DESERIALIZE(JSCommon.signatoryFormSelector, model);
                each(JSCommon.signatoryFormSelector + ' .Username-Fullname',function(x){ x.innerText=model.NameEn; });
                ['#Username','#SearchUsername'].forEach(function(x){ DISABLE(JSCommon.signatoryFormSelector + ' ' + x); });
            }
        })
    },

    "resetSignatoryForm": function () {
        each(JSCommon.signatoryFormSelector, function(form){
            DESERIALIZE(JSCommon.signatoryFormSelector,{
				"Designation": '',
				"Id": 0,
				"JobTitleId": 0,
				"SignatoryGroup": '',
				"SignatoryOrder": 1,
				"Username": ''
			});
            form.querySelectorAll('select.select2').forEach(function(s){ setValue(s,null); });
            form.querySelectorAll('.Username-Fullname').forEach(function(x){ x.innerText=''; });
            form.querySelectorAll('input[type=radio][data-signatory-type]:checked').forEach(function (x) { x.checked = false; });
            form.querySelector('#Username').disabled = false;
            form.querySelector('#SearchUsername').disabled = false;
            form.querySelector('#Username').focus();
        });
        each('.signatories input[type=radio]:checked',function(r){ r.checked = false; })
    },

    "sign": function (approveRejectFormSelector, status, callback) {
        //
        var icon = status === 'Approved' ? 'green check circle' : 'red times circle';
        var message = '<div class="ui segment attached borderless">'+
                      ' <div class="ui icon warning message visible attached">'+
                      '   <i class="question circle icon alternate"></i>' +
                      '   <div class="header content">Confirmation</div>'+
                      ' </div>'+
                      ' <div class="ui segment attached">'+
                      '  <p>This will result in making this form [ <i class="'+icon+' icon"></i> <b style="color:'+ (status === 'Rejected' ? 'red' : 'green') +'">'+ status +'</b> ],'+
                      '    to confirm, please click on OK.'+
                      '  </p>'+
                      (status === 'Rejected' ? '' : 
                      '   <div class="ui visible info message">'+
                      '     <i class="ui warning blue circle alternate icon"></i>'+
                      '     <em>Please note, once <b style="color:green">Approved</b>, you wont be able to revoke signature.</em>'+
                      '   </div>')+
                      ' </div>'+
                      '</div><input type="hidden" name="Status" value="'+ status +'">';

        CONFIRM(message, function (model) {
            each(approveRejectFormSelector + ' .button', function (btn) {
                toggleButtonsLoading(btn, true);
            });
            invoke(callback, model);
        });
        
        //     "container": QS(approveRejectFormSelector).parentElement,
        
    }
};





var JSFilter = {
    "Where" : { 
                "Contains": 'Contains',
                "DoesntContains": 'DoesntContains',
                "Match": 'Match',
                "NotMatch": 'NotMatch',
                "BeginsWith": 'BeginsWith',
                "EndsWith": 'EndsWith',
                "DoesnotBeginWith": 'DoesnotBeginWith',
                "DoesnotEndWith": 'DoesnotEndWith',
                //"GreaterThan": 'GreaterThan',
                //"LessThan": 'LessThan',
                "GreaterThanOrEquals": 'GreaterThanOrEquals',
                "LessThanOrEquals": 'LessThanOrEquals',
                "IN": 'IN',
                "NotIN": 'NotIN'
            },

    "update" : function(name, where, value){
        var filterElement = QS('input[name=Filters]');
        var json = filterElement.value;
        var fs = JSON.parse( json === '' ? '{}' : json );
        
        fs[name] = {
            "Name"  : name,
            "Where" : where,
            "Value" : value
        };

        filterElement.value = JSON.stringify(fs);
        filterElement.form.submit();
    },
    "filter": function(element){
        return JSFilter.update(element.name,JSFilter.Where.Equals,[element.value]);
    }
};
// [END] JSFilter


var ui_advanced = {
    "handleSubmit": function(e, formElement, model, success, error){
        e.preventDefault();
        POST(formElement.action, model, function(r) { showAlert(r, success, error) }, error);
        return false;        
    },
    
    "openReport": function(url){
        //var callback = function (){ 
            show.dialog({
                title: url,
                message: '<iframe src="'+ url +'" style="min-height:500px !important" width="100%"></iframe>'
            });
        // };

        // ui_advanced.save('crashcart','Cart', function(r){ 
        //     showAlert(r, function(r){ 
        //         ui_advanced.form('crashcart','Cart', r.Data); 
        //         callback();
        //     }); 
        // });
    },
    "saveItem": function(area,model,action,id,selector){
        if(!VALIDATEFORM(selector)) return;
        var api = '/'+area+'/api'+model+'/'+action;
        POST(api, SERIALISE(selector), function(r){
            showAlert(r,function(){
                ui_advanced.getItems(area,model,id,selector);
            });
        });
    },
    "openItem": function(area,model,id,query,selector){
        var action = 'item';
        var api = '/'+area+'/'+model+'/'+action+'/'+id+'?'+query;
        GET(api,{},function(res){
            SETHTML(QS(selector).parentNode, res);
        });
    },
    "getItems": function(area,model,id,selector){
        var action = 'items';
        var api = '/'+area+'/'+model+'/'+action+'/'+id;
        GET(api,{},function(res){
            SETHTML(QS(selector).parentNode, res);
        });
    },
    "deleteItems": function(area,model,id,selector){
        var action = 'deleteItems';
        var api = '/'+area+'/api'+model+'/'+action;
        DELETE(api, {"Id":id,"Items": each(selector + ' table input[type="checkbox"][data-listing-of-model-item="'+model+'Item"]:checked', function(x){ return {"Id":x.value} }) }, function(r){
            showAlert(r,function(){
                ui_advanced.getItems(area,model,id,selector);
            });
        });
    },
    "cancel": function(area,model){
        ui_advanced.search(area,model);
    },
    "save": function(area,model,callback){
        var api = '/'+area+'/api'+model+'/save';
        var selector = '[data-form-of-model="'+ model + '"]';
        if(VALIDATEFORM(selector)){ 
            POST(api,SERIALIZE(selector),function(r){ 
                showAlert(r,function(){ 
                    if(!invoke(callback,r)) ui_advanced.search(area,model);
                });
            }); 
        }
    },
    "search": function(area,model,index){
        if(typeof index === 'undefined') index = 1;
        var api = '/'+area+'/'+model+'/index?ShowMainControls=true';
        var selector = '[data-vm="'+ model + '"]';
        setValue(selector+' [name="Page"]',index); 
        GET(api,SERIALIZE(selector),function(res){ 
            SETHTML(QS(selector).parentNode, res); 
        }); 
    },
    "page": function(area,model,index){
        ui_advanced.search(area,model,index);
    },
    "add": function(area,model){
        ui_advanced.form(area,model,0);
    },
    "form": function(area,model,id){
        if(typeof id === 'undefined') id = 0;
        var api = '/'+area+'/'+model+'/form/'+id;
        GET(api,{ "IsPartial": true },function(res){ 
            SETHTML(QS('[data-vm="'+ model + '"]').parentNode, res); 
        });
    },
    "delete": function(area,model){
        var ids = getValues('input[data-listing-of-model-item="'+model+'"]:checked');
        if(ids.length < 1) return showAlert({Status:'warning',Message:'nothing was selected',Data:ids});
        CONFIRM("Are you sure to delete the selected " + ids.length + " records ?", function(){
            ui_advanced.doDelete(area,model,ids);
        });
    },
    "doDelete": function(area,model, ids){
        var api = '/'+area+'/api'+model+'/delete';
        var filters = {
            "Filters":[
                {
                    "Name":  'Id',
                    "Where": 'IN',
                    "Value": ids
                }
            ] 
        };
        return DELETE(api,filters,function(r){ 
            showAlert(r,function(){  
                ui_advanced.search(area,model);
            }); 
        });
    }
}

//make the num freezed
Object.freeze(JSFilter.Where);

//[END functions.js]



