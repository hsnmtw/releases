if(typeof window.dialogs === 'undefined') window.dialogs = [];
window.version = "2.2";


var pdfobjectoptions = {
    height: "100%",
    pdfOpenParams: { view: 'FitW', page: '1' }
};

var False = false;
var True = true;

var Char = {
    isNumber: function(c){
        if(c == null || !c || isNullOrEmpty(c)) return false;
        if(typeof c === 'number') return true;
        if(typeof c !== 'string') return false;
        if(c.length > 1) return Char.isNumber(c[0]) && Char.isNumber(c.slice(1));
        return '0123456789'.indexOf(c) > -1;
    },
    getNumbersOnly: function(s){
        if(typeof s !== 'string') return '';
        return s.toCharArray().filter(Char.isNumber).join('');
    }
};

function xrange(start, end) {
    var ans = [];
    for (var i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function xxrange(start, items){
    if(typeof start !== 'number') return [];
    if(typeof items !== 'number' || items <= 1) {
        items = start;
        start = 0;
    }
    return Array.apply(null, Array(items)).map(function (_, i) {return i+start;});
}

function range(start,end){
    return xxrange(start, end - start + 1);
}


(function () {
    'use strict';
    


    //this function is strict...
    if (typeof NodeList !== "undefined"){ 
        if(typeof NodeList.prototype.toList !== 'function') {
            NodeList.prototype.toList = function () { return Array.prototype.slice.call(this); };
        }

        if(typeof NodeList.prototype.forEach !== 'function') {
            NodeList.prototype.forEach = Array.prototype.forEach;
        }
    }

    if (typeof String !== "undefined"){
        if(typeof String.prototype.trim !== 'function') {
            String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); };
        }
        if(typeof String.prototype.startsWith !== 'function') {
            String.prototype.startsWith = function (part) { 
                if(typeof part === 'undefined' || part == null || part === '') return false;
                if(typeof part !== 'string') return false;
                return this.indexOf(part) === 0; 
            };
        }

        if (typeof String.prototype.toCharArray !== 'function') {
            String.prototype.toCharArray = function(){
                return this.split('');
            };
        }
        
        if (typeof String.prototype.endsWith !== 'function') {
            String.prototype.endsWith = function (part) { 
                if(typeof part === 'undefined' || part == null || part === '') return false;
                if(typeof part !== 'string') return false;
                return this.substring(this.lastIndexOf(part)) === part; 
            };
        }

        if(typeof String.prototype.firstAndLastNames !== 'function') {
            String.prototype.firstAndLastNames = function(){
                // public static string FirstAndLastNames(this string names)
                // {
                    var name = this.replaceAll("  "," ").trim().split(' ');
                    if(name.length==1) return name;
                    var first = name[0];
                    var middle = name[1]; 
                    var al = name.length > 2 ? name[name.length-2] : '';
                    var last = name[name.length-1];
                    return  name[0] + 
                            " " + 
                            (name.length > 2 && first.contains(".") && middle !== al ? middle + " " : "") + 
                            (name.length > 2 && ["aal","al","ال","آل"].contains(al)  ? al + " " : "") + 
                            last
                        ;
                //}
            };
        }

        if(typeof String.prototype.fromCamelToSpaced !== 'function') {
            String.prototype.fromCamelToSpaced = function(){
                //var collect = [];
                // this.toCharArray().forEach(function(element) {
                //     if(element >= 'A' && element <= 'Z') collect.push(' ');
                //     collect.push(element)
                // });
                //return collect.join('').trim();
                if(this.length<1) return this;
                var collect = this[0];
                for(var i = 1; i < this.length ; i++)
                {
                    var chr = this[i];
                    if(chr >= 'A' && chr <= 'Z' && this[i-1] >= 'a' && this[i-1] <= 'z') collect+=' ';
                    collect+=chr;
                }
                return collect;
            };
        }

        if(typeof String.prototype.contains !== 'function'){
            String.prototype.contains = function(seq){
                //return this.toCharArray().contains(''+chr);
                return this.indexOf(seq) > -1;
            };
        }


        if(typeof String.prototype.replaceAll !== 'function'){
            String.prototype.replaceAll = function(what,to){
                return this.split(what).join(to);
            }
        }

        if(typeof String.prototype.superTrim !== 'function'){
            String.prototype.superTrim = function(){
                var self = this;
                [['\r\n\r\n','\r\n']
                ,['\r\r','\r']
                ,['\n\n','\n']
                ,['  ',' ']
                ,['\r\n\r\n','\r\n']
                ,['\n ','\n']
                ,[' \n','\n']
                ,['\r ','\r']
                ,[' \r','\r']
                ,['  ',' ']].forEach(function(x){ self = self.replaceAll(x[0],x[1]); });

                return self.trim();
            };
        }

        if(typeof String.prototype.replaceTemplate !== 'function'){
            String.prototype.replaceTemplate = function (options) {
                var keys = Object.keys(options);
                var other = this + '';
                for(var i=0;i<keys.length;i++){
                    other = other.replaceAll(keys[i],options[keys[i]]);
                }
                return other;
            };
        }

        if(typeof String.prototype.take !== 'function'){
            String.prototype.take = function(count){ return this.toCharArray().take(count).join(''); }
        }

        if(typeof String.prototype.takeReverse !== 'function'){
            String.prototype.takeReverse = function(count){ return this.toCharArray().takeReverse(count).join(''); }
        }
    }

    if (typeof Array !== "undefined"){
        if(typeof Array.prototype.includes !== 'function') {
            Array.prototype.includes = function () { return arguments.length > 0 && ('|' + this.join('|') + '|').indexOf('|' + arguments[0] + '|') > -1; }
        }
    

        Array.prototype.count = function(x){
            var array = this;
            return array.filter(function(y){return y===x}).length;
        };

        Array.prototype.shuffle = function () {
            var array = this;
            var currentIndex = array.length,  randomIndex;
            
            // While there remain elements to shuffle...
            while (currentIndex != 0) {
            
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
            
                // And swap it with the current element.
                var tmp = array[currentIndex];
                
                array[randomIndex] = array[currentIndex];
                array[currentIndex] = tmp;
            }
            
            return array;
        }
        
        Array.prototype.intersect = function(other){
            return this.filter(function(x){ return other.contains(x); });
        };

        Array.prototype.containsAll = function(other){
            return this.intersect(other).length === other.length;
        };
        
        Array.prototype.distinct = function(){
            var list = this;
            var unique = [];
            //list.sort();
            for(var i=0;i<list.length;i++){
                if(unique.indexOf(list[i]) < 0) unique.push(list[i]);
            }
            return unique;
        }
        
        Array.prototype.last = function(){
            if(this.length == 0) return null;
            return this.slice(-1)[0];
        }
        
        Array.prototype.first = function(){
            if(this.length == 0) return null;
            return this[0];
        }
        
        Array.prototype.contains = function(item){
            return this.indexOf(item) > -1;
        }

        Array.prototype.sum = function(){ return this.reduce(function(a,x){return a+x;},0); }
        
        
        
        Array.prototype.any = function(){ return this.length > 0; };

        Array.prototype.sorted = function(){ this.sort(); return this; };
        
        Array.prototype.skip = Array.prototype.slice;
        
        Array.prototype.take = function(count){ return this.slice(0,count); }
        Array.prototype.or   = function(){ return this.any() && this.contains(true); };
        Array.prototype.and  = function(){ return this.any() && !this.contains(false); };
        
        Array.prototype.takeReverse = function(count){ return this.slice(this.length-count,this.length); }
        
        
        Array.prototype.sliceThenJoin = function(index,take,delim){
            return this.slice(index,take+index).join(delim);
        }
    }
    
}());

function isArrayEmptyOrNull(arr){
    return typeof arr === 'undefined' 
        || arr == null 
        || typeof arr !== 'object'
        || !Array.isArray(arr) 
        || !arr.any()
        ;
}

function move(element,delta,callback) {
    if(typeof element === 'string') return move(QS(element),delta,callback);
    if(isNullOrEmpty(element)) return;

    if(delta < 0 && element.previousElementSibling){
        element.parentNode.insertBefore(element, element.previousElementSibling);
        return invoke(callback,-1);
    }

    if(delta > 0 && element.nextElementSibling){
        element.parentNode.insertBefore(element.nextElementSibling, element);
        return invoke(callback,+1);
    }

    // var children = [].slice.call(element.parentNode.children);
    // var index = children.indexOf(element);

    // if(delta > 0 && index >= children.length) return;
    // if(delta < 0 && index > 0) return;
    // if(delta == 0) return;

    // var parent = element.parentNode;
    // if(delta > 0){
    //     parent.insertBefore(element,children[index]);
    //     invoke(callback,1);
    // }else{
    //     parent.insertBefore(element,children[index-1]);
    //     invoke(callback,-1);
    // }
}

function QS(x){ 
    if(typeof x !== 'string') return x;
    return document.querySelector(x);
};

function QSA(x){ 
    if(typeof x !== 'string') return x;
    return document.querySelectorAll(x).toList(); 
};

JSON.tryparse = function(text){
    try{
        var obj = JSON.parse(text);
        if(typeof obj !== 'object') return text;
        return obj;
    }catch(e){
        return text;
    }
}



var ICONS = {
    "error"   : '<i class="red times circle icon"></i>',
    "success" : '<i class="green check circle icon"></i>',
    "info"    : '<i class="blue info circle icon"></i>',
    "warning" : '<i class="brown warning exclamation triangle icon"></i>'
};


function FILEPROMPT(filetypes,callback)
{
    var ukey = "A"+("123456789aslkjasdlkjsadowiuqwertyuiopzxcvbnbmlkhjgfdsa".toCharArray().shuffle().take(5).join(''));
    return show.dialog({
        title: 'Select a file for upload',
        message: '<div class="ui form '+ukey+'">'+
                 ' <div class="field">'+
                 '  <label>File to upload: accepted types: ('+ filetypes +')</label>'+
                 '  <input autofocus type="file" accept="'+ filetypes +'" onclick=";this.value=null;" onchange="XHR.UPLOAD(this,QS(\'.'+ukey+' [name=dlgfilepath]\'))" />'+
                 '  <input type="hidden" name="dlgfilepath" id="dlgfilepath">'+
                 ' </div>'+
                 '</div>',
        size:'mini',
        onApprove: function(model){
            var filepath = model.dlgfilepath;
            if(!isNullOrEmpty(filepath)) invoke(callback,filepath);
        },
        onDeny: function(){ /* do nothing */ }
    });
}

function toggleShowPassword(inputSelector,container)
{
    var input = QS(inputSelector);
    if(input.type === 'password'){
        input.type = 'text';
        container.querySelectorAll('i.icon').forEach(function(i){
            i.className = 'eye slash outline icon';
        });
        setTimeout(function(){
            input.type = 'password';
            container.querySelectorAll('i.icon').forEach(function(i){
                i.className = 'eye icon';
            });
        },1000);
    }else{
        input.type = 'password';
        container.querySelectorAll('i.icon').forEach(function(i){
            i.className = 'eye icon';
        });
    }
}

function toggleDotsFont(inputSelector,container)
{
    var input = QS(inputSelector);
    if(input.getAttribute('data-pw-input') === 'on'){
        input.type = 'text';
        input.setAttribute('data-pw-input','off');
        container.querySelectorAll('i.icon').forEach(function(i){
            i.className = 'eye slash outline icon';
        });
        
    }else{
        input.type = 'password';
        input.setAttribute('data-pw-input','on');
        container.querySelectorAll('i.icon').forEach(function(i){
            i.className = 'eye icon';
        });
    }
}


function showLoading(){
    var ukey = 'l'+('1234567890abcdefghijklmnopqrstuvwxyz'.toCharArray().shuffle().take(10).join(''));
	var loading = '<div data-'+ukey+' style="z-index:99998;position:absolute;left:0;top:0;height:100%;width:100%" class="h-100 w-100 black"><div class="ui active dimmer"><div class="ui massive text loader">Loading</div></div></div>';
    //document.body.innerHTML+=loading;
    var container = document.createElement('div');
    container.innerHTML = loading;
    document.body.appendChild(container);
    return '[data-'+ukey+']';
}

function HIGHLIGHT(selector){
    each(selector, function(element){ element.style.backgroundColor = 'cornsilk'; });
}

// returns list of values from elements matching selector reading specified property
function EXTRACT(selector,property,includeNulls){
    return each(selector+'['+property+']',function(x){ return x.attributes[property].value ; })
            .filter(function(x){ return includeNulls || x !== null; });
}



function closeDialogAfterSave(r){
    // if(typeof r !== 'undefined' && r != null){
    //     showAlert(r, ()=> {
    //         if(window.dialogs.length > 0){
    //             window.dialogs[window.dialogs.length-1].modal('hide');
    //             setValue('#Id', r.Data);
    //         }
    //     });
    // }
    return showAlert(r,function(r){ 
        each('#Id',function(x){
            x.value=r.Data; 
        });
        setTimeout(function(){  
            if(top.location.href.toLocaleLowerCase().endsWith('/form/0')){
                var arr = top.location.href.split('/');
                top.location.href = arr.splice(0,arr.length-1).join('/') + '/' + r.Data;
            }else{
                //CONFIRM('Web page will be reloaded, click OK to confirm. [closeDialogAfterSave]', function(){ top.location.reload(); });
                top.location.reload();
            }
        }, 750); 
        
    });
}

function selectTab(containerSelector, tabName) {
    return each(containerSelector,function (x) {
        x.querySelectorAll('[data-tab]').forEach(function (a) { a.classList.remove('active'); });
        x.querySelectorAll('[data-tab="' + tabName + '"]').forEach(function (a) { a.classList.add('active'); });
    });
}

//disabled because it is not compatible with ui semantic

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return (txt + "").length < 4 ? txt : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function setSelect2Value(selector, value) {
    if(typeof selector === 'string'){
        return each(selector, function(x){ setSelect2Value(x, value); } );
    }
    
    if(selector === null || typeof selector !== 'object') return;

    selector.value = value;
    
    DISPATCH(selector, 'change');
}


function onready(callback) {
    addEventListener('DOMContentLoaded', callback);
}

function onload(callback) {
    addEventListener('load', callback);
}

// try{
//     // create a reference to the old `.html()` function
//     var htmlOriginal = $.fn.html;

//     // redefine the `.html()` function to accept a callback
//     $.fn.html = function (html, callback) {
//         // run the old `.html()` function with the first parameter
//         var ret = htmlOriginal.apply(this, arguments);
//         // run the callback (if it is defined)
//         if (typeof callback == "function") {
//             callback();
//         }
//         // make sure chaining is not broken
//         return ret;
//     }
// }catch(ex){

// }

function addToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isElement(elm,tag) { 
    return elm !== null 
        && elm !== undefined 
        && typeof button === 'object' 
        && elm.type === 'button' 
        && typeof elm.tagName === 'string' 
        && elm.tagName.toLowerCase() === tag.toLowerCase(); 
}

function toggleButtonsLoading(button,loading){
    try{
        //if(!isElement(button,'button')) return;
        button.disabled = loading;
        button.classList[loading ? 'add' : 'remove']('loading');
    }catch(e){

    }
}

function encodeUrlJSON(obj){
    return encodeURIComponent(JSON.stringify(obj));
}

function SMALLDIALOG(button,url, title, onShown) {
    return DIALOG(button,url,title,onShown,'small');
}

function LARGEDIALOG(button,url, title, onShown) {
    return DIALOG(button,url,title,onShown,'large');
}



function DIALOG(button,url, header, onShown, dialogsize, onClose) {
    
    if(isNullOrEmpty(dialogsize)) dialogsize = 'extra-large';

    if(typeof button === 'string' && typeof onShown === 'undefined' || onShown === null)
    {
        onShown = header;
        header = url;
        url = button;
    }
    if(isNullOrEmpty(header)) header = url;
    toggleButtonsLoading(button,true);
    hideAlert();
    GET(url, function (response) {
        toggleButtonsLoading(button,false);
        show.dialog({
            "scrollable": true,
            "title": '<div class="dialog-title">'+url+'</div>',
            "message": response,
            "size": dialogsize,
            "showX": true,
            "onShown": onShown,
            "onClose": onClose
        });
    });
    
}

function SERIALIZE(formSelector,includeEmptyOrNull) {
    var data = {};
    var forms = QSA(formSelector);
    if(forms.length === 0) return data;
    var form = forms.length > 0 ? forms[0] : document;
    
    // var inputs = QSA(selector + ' input');
    // var selects = QSA(selector + ' select');
    // var textareas = QSA(selector + ' text');
    
    // var controls = inputs.concat

    var fields = form.querySelectorAll('[data-is-valid-input=false]');
    if(fields.length > 0) {
        var message = fields.toList().map(function (field) {
            return '<div class="ui item error message"><i class="times red big icon"></i> field <b>' + field.name + '</b> with value ['+ field.value +'] failed validation</div>';
        }).join('\n');
        //show.alert('<div class="list">'+message+'</div>'); 
        show.alert('<div class="ui visible error message"><div class=""><i class="times circle red icon big"></i>ERROR</div><hr/>form cannot be submitted because it has some validation errors</div><div class="ui segment">' + message + '</div>');
        return {};
    }

    form.querySelectorAll('input[type="radio"]').toList().map(function(x){ return x.name; }).distinct().forEach(function(x){
        //console.log('1. x="'+x+'", = null');
        data[x]=null;
    });

    form.querySelectorAll('input[type="checkbox"]:not([data-type="list"])').toList().map(function(x){ return x.name; }).distinct().forEach(function(x){
        var length = form.querySelectorAll('input[name="'+x+'"][type="checkbox"]:not([data-type="list"])').toList().length;
        if(length > 1){
            form.querySelectorAll('input[name="'+x+'"][type="checkbox"]:not([data-type="list"])').toList().forEach(function(checkbox){
                checkbox.setAttribute('data-type','list');
            });
        }
    });

    form.querySelectorAll('input[type="checkbox"]:not([data-type="list"])').toList().map(function(x){ return x.name; }).distinct().forEach(function(x){
        //console.log('2. x="'+x+'", = null');
        data[x]=null;
    });

    form.querySelectorAll('input[type="checkbox"][data-type="list"]').toList().map(function(x){ return x.name; }).distinct().forEach(function(x){
        //console.log('3. x="'+x+'", = []');
        data[x]=[];
    });

    form.querySelectorAll('select,textarea,input:not([type="radio"]):not([type="checkbox"]):not([data-date-value]),input[type="radio"]:checked').forEach(function (x) {
        if (x.name.length === 0 && x.id.length === 0 ) return; 
        if (x.name === '') { x.name = x.id; } 
        //data[x.name] = getValue(x); 
        if (typeof data[x.name] === 'object' && Array.isArray(data[x.name])) {
            data[x.name].push(getValue(x)); 
        } else if(false === isNullOrEmpty(data[x.name])) {
           data[x.name] = [data[x.name], getValue(x)];
        } else if(typeof x.attributes['data-type'] !== 'undefined' && x.attributes['data-type'].value === 'list' && !Array.isArray(data[x.name])){
            data[x.name] = [getValue(x)];
        } else {
            data[x.name] = getValue(x);
        }
    }); 

    form.querySelectorAll('input[data-date-value]').forEach(function (x) { if(x.name===''){x.name=x.id} if (x.name.length > 0) data[x.name] = x.attributes['data-date-value'].value; });

    form.querySelectorAll('input[type="checkbox"][data-type="list"]:checked').forEach(function (x) {  
        if(x.name===''){x.name=x.id} 
        if (x.name.length > 0 && typeof data[x.name] === 'object' && Array.isArray(data[x.name])) {
            data[x.name].push(getValue(x)); 
        } else if(false === isNullOrEmpty(data[x.name])) {
           data[x.name] = [data[x.name],getValue(x)];
        } else {
            data[x.name] = [getValue(x)];
        }
    });

    form.querySelectorAll('input[type="checkbox"]:not([data-type="list"])').forEach(function (x) {  
        data[x.name] = x.checked;
    });

    form.querySelectorAll('[data-type="dictionary"]').forEach(function(el){
        if(typeof data[el.name] === 'undefined') data[el.name]={};
        data[el.name][el.attributes["data-key"].value]=el.value;
    });

    if(data.Username) data.Username = data.Username.toLowerCase();
    
    return data;
    //if(includeEmptyOrNull) return data;
    //return stripEmptyOrNull(data);
}

function stripEmptyOrNull(model){
    var data = {};
    Object.keys(model).forEach(function(key){
        if(typeof model[key] === 'boolean' ||  !isNullOrEmpty(model[key])) data[key] = model[key];
    });
    return data;
}

function DISABLE(selector){
    if(typeof selector === 'string'){
        each(selector, DISABLE);
    }else if(typeof selector === 'object'){
        if(typeof selector.disabled !== 'undefined') {
            selector.disabled = true;
        }
    }
}

function ENABLE(selector){
    if(typeof selector === 'string'){
        each(selector, ENABLE);
    }else if(typeof selector === 'object'){
        if(typeof selector.disabled !== 'undefined') {
            selector.disabled = false;
        }
    }
}

function htmlDecodeHex(x){
    var div = document.createElement('DIV');
    div.className = 'hide';
    div.innerHTML = x;
    return div.innerText;
}

function htmlEncodeHex(s) {
    var ret_val = '';
    s.toCharArray().forEach(function(chr){
        const code = chr.codePointAt(0);
        if (code > 127) {
        ret_val += '&#' + code.toString(16) + ';';
        } else {
        ret_val += chr;
        }
    });
    return ret_val;
}

function isValidHTML(text){
    return new DOMParser().parseFromString('<div>'+text+'</div>','text/html').getElementsByTagName('parsererror').length===0;
}


function DESERIALIZE2(selector, data, properties) {
    if(typeof selector !== 'string') throw Error('selector must be valid string');
    if(typeof data !== 'object' || data == null) throw Error('data is not object or null');
    if(typeof properties === 'undefined') properties = Object.keys(data);
    // var query = ['input','select','textarea'].map(function(x){ return [selector,x].join(' ') }).join(',')
    // each(query,function(x){
    //     if(properties.contains(x.name))
    // });

}


function DESERIALIZE(selector, data, properties) {
    if(typeof data === 'undefined' || isNullOrEmpty(data) || (typeof data === 'object' && Object.keys(data).length === 0)) return;
    if(typeof data === 'object' && (isNullOrEmpty(properties) || typeof properties !== 'object' || !Array.isArray(properties) || properties.length === 0)) properties = Object.keys(data);

    //var model = {};//SERIALIZE(selector, true);
    
    properties.forEach(function(key){
        
        //if (Object.hasOwnProperty.call(model, key)) {
            //console.log('attempting to deserialize key = "'+ key +'" to value = "'+ data[key] +'"' );
        //}
        var props = ['name','id'].filter(function(prop){ return QSA(selector+' ['+prop+'="'+key+'"]').length > 0; }).take(1);
        props.forEach(function (prop) {
            //var prop = 'name';
            
            each(selector+' input['+prop+'="'+key+'"]:not([type="radio"]):not([type="checkbox"]),select['+prop+'="'+key+'"],textarea['+prop+'="'+key+'"]', function (element) {
            //    console.log(element.name+":"+data[key]);
                setValue(element,data[key]);
            });

            each(selector+' input['+prop+'="'+key+'"][type="radio"][value="'+(data[key])+'"]', function (element) {
            //    console.log(element.name+":"+true);
                element.checked = true;
            });

            each(selector+' input['+prop+'="'+key+'"][type="checkbox"]', function (element) {
            //    console.log(element.name+":"+false);
                element.checked = false;
            });

            if(data[key] !== null && typeof data[key] === 'object' && Array.isArray(data[key]))
            {
                data[key].forEach(function(value){
                    each(selector+' input['+prop+'="'+key+'"][type="checkbox"][value="'+ (value)+'"]', function (element) {
                        element.checked = true;
                    });
                });
            }
            else
            {
                each(selector+' input['+prop+'="'+key+'"][type="checkbox"][value="'+data[key]+'"]', function (element) {
                    element.checked = false;
                });
            }
        });
    });
}





function disableForm(_formSelector) {
    var formSelector = _formSelector;
    if (formSelector === null || typeof (formSelector) === 'undefined' || formSelector instanceof Event || '' === formSelector) formSelector = 'body';
    each(formSelector,function (f) { 
        f.querySelectorAll('textarea,input,select,button').forEach(function (x) { try { x.disabled = 'disabled'; } catch (e) { } });
        f.querySelectorAll('.docs-datepicker-trigger').forEach(function (x) { try { x.style.visibility = 'hidden'; } catch (e) { } });
    });
    
}

function matchStart(params, data) {
    params.term = params.term || '';
    if (data.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
        return data;
    }
    return false;
}

function selec2matchStart(selector) {

    $(selector).select2({
        matcher: function (params, data) {
            return matchStart(params, data);
        },
    });
}



function SETBODY(r){
    if(r.startsWith('/')) GETHTML(r,'.partial-view-body');
    else {
        SETHTML('.partial-view-body',r);
    }
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function isJSON(item) {
    // if (item === null || item === "null" || item === "") return false;

    // if(typeof item !== "string"){
    //     item = JSON.stringify(item);
    // }

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    return true;

    // if (typeof item === "object" && item !== null) {
    //     return true;
    // }

    // return false;
}

function showSpinner() {
    SHOW('#alert-box-spinner');
}

function hideSpinner() {
    HIDE('#alert-box-spinner');
}

function getPageUrl(area,controller,action){
    if(area === 'common')  area = '';
    if(action === 'Index') action = '';
    return ['',area,controller,action,''].join('/').replaceAll('//','/');
}

function SCROLL(bookmarkAnchor){
    //very top window.scrollTo(0,0);
    //top.location.href = top.location.href.split('#').first() + bookmarkAnchor;
    if(bookmarkAnchor === '#top') window.scrollTo(0,0);
}

function HIDE(selector, callback){
    if(typeof selector === 'object') return hideElement(selector) && invoke(callback);
    each(selector, hideElement).any() && invoke(callback);
}

function hideElement(el){
    el.classList.add('hide');
    return true;
}

function SHOW(selector,callback){
    if(typeof selector === 'object') return showElement(selector) && invoke(callback);
    each(selector, showElement).any() && invoke(callback);
}

function showElement(el){ 
    ['hide', 'hide-0', 'hide-false', 'hide-False'].forEach(function(x){ el.classList.remove(x); });
    return true;
}

function consolelog(message){
    //disabled for now
    //console.log(message);
}

function distinct(l){
    var buffer = [];
    for(var x=0;x<l.length;x++){
      if(buffer.indexOf(l[x]) === -1) buffer.push(l[x]);
    }
    return buffer;
}

// from: https://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
function zip() {
    var args = [].slice.call(arguments);
    var shortest = args.length==0 ? [] : args.reduce(function(a,b){
        return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}

function encodeHtml(rawStr){
 return (''+rawStr).replace(/[\u00A0-\u9999<>\&]/g, function(i) {
    return '&#'+i.charCodeAt(0)+';';
 });
}

function TABULAR(obj) {
    if(typeof obj === 'undefined' || isNullOrEmpty(obj)) return 'NULL';
    return [
        '<table class="stats-table">',
        '  <tbody>',
        object2zipped(obj).map(function(pair){ return ['<tr><th>',pair[0].fromCamelToSpaced(),'</th><td>',(typeof pair[1] === 'object' ? JSON.stringify(pair[1]) : pair[1]),'</td></tr>'].join(''); }).join('\n'),
        '  </tbody>',
        '</table>'
    ].join('\n');
}

function object2zipped(obj){
    if(typeof obj === 'undefined' || obj == null) return [];
    var keys = Object.keys(obj);
    var vals = keys.map(function(x){ return obj[x]; });
    var zipped = zip(keys, vals);
    return zipped;
}

function object2UrlComponents(obj){
    return object2zipped(obj).map(function(pair){ return [pair[0],'=',encodeURIComponent(pair[1])].join(''); });//.join('&');
}



function setInnerText(selector, value){
    each(selector, function(x){
        x.innerText = value;
    });
}

function getInnerText(selector){
    var els = QSA(selector).map(function(x){ return x.innerText.trim(); });
    return els.join(':');
}

function getInnerHTML(selector){
    var elements = QSA(selector);
    for(var i=0;i<elements.length;i++){
        return elements[i].innerHTML;
    }
    return null;
}

function expandAll(selector){
    each(selector, function(x){
        x.setAttribute('data-toggle-expand','+');
        x.onclick();
    });
};

function collapseAll(selector){
    each(selector, function(x){
        x.setAttribute('data-toggle-expand','-');
        x.onclick();
    });
};

function notNull(x){
    return !isNullOrEmpty(x);
}

function checkRequiredFields(formSelector) {
    var fieldsLabeles = {};
    //var requiredFields = each(formSelector+' [required]:not([type="checkbox"]),[data-control-container-required="True"]',function(x){return isNullOrEmpty(x.name) ? x.id : x.name;}).distinct();
    var requiredFields = each(formSelector+' [required]',function(x){return isNullOrEmpty(x.name) ? x.id : x.name;}).distinct();
    var model = SERIALIZE(formSelector);
    var violations = requiredFields.filter(notNull).filter(function(property){
        
        each(formSelector + ' [name="' + property + '"]:not([type="checkbox"]),[aria-labelledby="select2-'+ property +'-container"]',function(control){
            control.parentElement.style.background = null;
            control.style.background = null;
            each(formSelector + ' [for="' + control.id + '"]',function(label){
                label.style.color = null;
            });
        });

        each(formSelector + ' [name="' + property + '"][type="checkbox"][data-control-container]',function(control){
            each(formSelector + ' [for="' + property + '"]',function(label){
                label.style.color = null;
            });
            each(formSelector + ' [data-control-container-id="'+ control.attributes['data-control-container'].value +'"]',function(container){
                container.style.background = null;
            });
        });

        var value = model[property];

        if(isNullOrEmpty(value)) {

            each(formSelector + ' [name="' + property + '"]:not([type="checkbox"]),[aria-labelledby="select2-'+ property +'-container"]',function(control){
                //control.parentElement.style.background = 'cornsilk';
                control.style.background = '#f0bfbf';
                control.setAttribute('data-failed-required-field-validation',true);
                each(formSelector + ' [for="' + control.id + '"]',function(label){
                    label.style.color = 'red';
                    fieldsLabeles[property] = label.innerText.trim();
                });
            });

            each(formSelector + ' [name="' + property + '"][type="checkbox"][data-control-container]',function(control){
                each(formSelector + ' [for="' + property + '"]',function(label){
                    label.style.color = 'red';
                });
                each(formSelector + ' [data-control-container-id="'+ control.attributes['data-control-container'].value +'"]',function(container){
                    container.style.background = '#f0bfbf'
                });
            });

            return true;
        }
        return false;
    });

    console.log('violations : ' + violations);

    if(violations.any()){
        
        var violationLabels = violations.map(function(property){
            if(Object.keys(fieldsLabeles).contains(property) && typeof fieldsLabeles[property] === 'string' && fieldsLabeles[property] !== null && fieldsLabeles[property].length > 0) 
                return fieldsLabeles[property];
            return property.fromCamelToSpaced();
        });
        var grouped = groupListByNumberOfGroups(violationLabels, 2);
        show.dialog({
            size: 'large',
            title: 'Required / Mandatory fields are required to be filled',
            message: '<div class="ui segment">'+
                     ' <p>The form cannot be submitted because it failed validation.</p>'+
                     ' <p>The following fields are mandatory:</p>'+
                     ' <div class="ui visible warning icon message">'+
                     '  <i class="ui info alternate circle red icon"></i>'+
                     '  <div class="content">'+
                     '   <div class="ui stackable grid">'+
                     grouped.map(function(group){
                        return ' <div class="eight wide column"><ul>' + group.map(function(x){ return '<li>'+ x +'</li>'; }).join('\n')+'</ul></div>';
                     }).join('\n')+
                     '   </div>'+
                     '  </div>'+
                     ' </div>'+
                     '</div>'
                     ,
            animate: false,
            backdrop: true,
            onApprove: function(){
                FOCUS(formSelector+' [name="'+violations.first()+'"]');
            }
        });
        
        return false;
    }
    return true;

}

function GETBROWSER(){
    var check = false;
    var agent = navigator.userAgent;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(agent||navigator.vendor||window.opera);
    //return check;
    var browser = 'Unknown';
    if(agent.contains("Opera") || agent.contains('OPR')) {
        browser = 'Opera';
    } else if(agent.contains("Edg")) {
        browser = 'Edge';
    } else if(agent.contains("Chrome")) {
        browser = 'Chrome';
    } else if(agent.contains("Safari")) {
        browser = 'Safari';
    } else if(agent.contains("Firefox")){
        browser = 'Firefox';
    } else if((agent.contains("MSIE")) || (!!document.documentMode == true )) {
        browser = 'IE';
    }

    return browser + (check ? ' | mobile' : '');
}

function TOGGLECHECKED(selector,status){
    if(status) SETCHECKED(selector); else SETUNCHECKED(selector);
}


function removeAfterAt(v){
    return v.split('@').first().trim().toLowerCase();
}

// function groupListByNumberOfItems(fields,numberOfItemsPerGroup){
//     var groupedFields = [];
//     var numberOfGroups = Math.round(fields.length / numberOfItemsPerGroup);
//     //console.log(numberOfGroups);
//     var x = 0;
//     for(var i=0;x<fields.length && i<=numberOfGroups;i++){
//         var sublist = [];
//         for(var j=0;x<fields.length && j<numberOfItemsPerGroup;j++){
//             sublist.push(fields[x++]);
//         }
//         groupedFields.push(sublist);
//     }
//     return groupedFields;
// }

function groupListByNumberOfGroups(fields,numberOfGroups){
    if(typeof numberOfGroups !== 'number') { consolelog('numberOfGroups must be numeric'); return [fields]; }
    if(numberOfGroups < 1) { consolelog('numberOfGroups must be positive greater than or equals to 1'); return [fields]; }
    if(!(typeof fields === 'object' && Array.isArray(fields) && fields.any())) { consolelog('fields must be an array and must contain some items'); return [fields]; }
    if(fields.length <= numberOfGroups) { consolelog( 'number of groups exceeds number of items'); return [fields]; }
    // var result = groupListByNumberOfItems(fields, Math.round(fields.length / numberOfGroups));
    // if(result.length > 1 && result.length > numberOfGroups){
    //     var xn = result.pop();
    //     var x1 = result.pop();
    //     result.push(x1.concat(xn));
    // }
    var l = Math.ceil(fields.length / numberOfGroups);
    return xxrange(numberOfGroups)
            .map(function(_,i){ 
                return fields.slice((i+0)*l,(i+1)*l);
            })
            .filter(function(x){ return x.any(); })
           ;
}


function SETCHECKED(selector){
    each(selector, function(x){ x.checked = true; });
}

function SETUNCHECKED(selector){
    each(selector, function(x){ x.checked = false; });
}

function reloadAfter2000(){
    setTimeout(function(){
        //CONFIRM('Web page will be reloaded, click OK to confirm. [reloadAfter2000]', function(){ top.location.reload(); });
        top.location.reload();
    },2000);
}

function showAlertThenReloadAfter2000(r){
    showAlert(r,reloadAfter2000);
}

function reloadAfter2000withId(r, uniqueIdentifier){
    setTimeout(function(){
        var selector = '[data-form-unique-identifier="'+ uniqueIdentifier +'"]';
        var form = QS(selector);
        if(top.location.href.toLowerCase().contains('/form'))
        {
            top.location.href = form.attributes["data-form-url"].value+'/'+r.Data;
        }
        else
        {
            GET(form.attributes["data-form-url"].value+'/'+r.Data,{"isPartial":true},function(r){
                //var alrt = QSA('[data-alert-box-view]').map(function(x){return x.innerHTML;}).take(1).join("");
                //form.parentElement.innerHTML = '<div data-alert-box-view>'+alrt+'</div>'+r;
                form.parentElement.innerHTML = r;
                initializeUI(selector);
            });
        }
    },200);
}




function makeDivLoading(selector){
    var loading = "  <div class='ui active dimmer'>" +
                  "    <div class='ui text loader'>Loading</div>" +
                  "  </div>";
    SETHTML(selector, loading);
}

function SETBODY(content){
    if((""+content).contains('<!-- BEGIN PAGINATION -->') && (""+content).contains('<!-- END PAGINATION -->')){
        var pagn = (""+content).split('<!-- BEGIN PAGINATION -->').last().split('<!-- END PAGINATION -->').first().trim();
        try{
            if(!isNullOrEmpty(pagn)){
                var div = document.createElement('div');
                div.innerHTML = pagn;
                QSA('.pagination-item').forEach(function(x){
                    x.parentElement.removeChild(x);
                });
                each('a.end-pagination',function(x){
                    div.childNodes.toList().forEach(function(n){
                        x.parentElement.insertBefore(n, x);
                    });
                });
            }
        }catch(e){
            console.error(e);
        }
    }
    return SETHTML('[data-main-body]', (""+content).split('<!-- BEGIN RENDER CONTENT -->').last().split('<!-- END RENDER CONTENT -->').first().trim() );
}


//Returns true if it is a DOM node
function isNode(o){
    return (
      typeof Node === "object" ? o instanceof Node : 
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
  }
  
  //Returns true if it is a DOM element    
  function isElement(o){
    return (
      typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
  }

function SETHTML(selector, content, callback){
    if(typeof selector === 'object' && [isNode,isElement].map(function(x){ return x(selector); }).or() )
    {
        var uid = makeid(10);
        selector.setAttribute('data-ix-unique-identifier', uid);
        selector = '[data-ix-unique-identifier="'+ uid +'"]';
    }
    // var html = (""+content).split('<!-- BEGIN RENDER CONTENT -->').last().split('<!-- END RENDER CONTENT -->').first().trim();
    //var pagn = (""+content).split('<!-- BEGIN PAGINATION -->').last().split('<!-- END PAGINATION -->').first().trim();
    each(selector, function(x){ x.innerHTML=content; });
    //if(!isNullOrEmpty(pagn)) each('.pagination-div-group',function(x){ x.innerHTML = pagn; });
    initializeUI(selector);
    try { each(selector + ' [data-dynamic-js-src]', applyDynamic); } catch(e){}
    invoke(callback);
}

function GETHTML(api, selector, callback, onFail) {
    showSpinner();
    //makeDivLoading(selector);
    GET(api,{}, function (response) {
        //each(selector, function (x) { x.innerHTML = xhtml; });
        SETHTML(selector,response);
        invoke(callback, response);
    },onFail);
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function ADDCLASS(selector, className){
    each(selector, function(x){ x.classList.add(className); });
}

function REMOVECLASS(selector, className){
    each(selector, function(x){ x.classList.remove(className); });
}


function populateDDL(options, selectElementId, valueElementId, optionValueProperty, listOfOptionTextProperty, isSelect2, toggleOnOffProperty) {
    if(isJSON(options) === false)
    {
        return show.alert(options);
    }
    
    var listOfOptionValueProperty = [];
    var optionValueDelim = ' | ';
    
    if (typeof listOfOptionTextProperty === 'string') listOfOptionTextProperty = [listOfOptionTextProperty];

    if(typeof optionValueProperty === 'string') {
        listOfOptionValueProperty = [optionValueProperty];
    }else if(typeof optionValueProperty === 'object') {
        listOfOptionValueProperty = optionValueProperty.keys;
        optionValueDelim = optionValueProperty.delim;
    }

    var toggle = typeof toggleOnOffProperty === 'string' && options.length > 0 && Object.keys(options.first()).contains(toggleOnOffProperty);

    var selectElement = document.getElementById(selectElementId);
    var v = getValue('#'+valueElementId);
    var l = [];
    options.forEach(function (x) {
        var option = document.createElement('option');
        if (listOfOptionValueProperty.length > 0) option.value = listOfOptionValueProperty.map(function(y){ return x[y]; }).join(optionValueDelim);
        l = [];
        for (var i = 0; i < listOfOptionTextProperty.length; i++) {
            var optionTextProperty = listOfOptionTextProperty[i];
            l.push(x[optionTextProperty]);
        }
        option.innerText = l.join(' | ');
        if (option.value.toLowerCase().localeCompare(v.toLowerCase()) === 0) {
            option.selected = true;
            selectElement.value = v;
        }
        if(toggle) {
            option.setAttribute('data-icon', x[toggleOnOffProperty] ? 'green toggle on icon' : 'grey toggle off icon' );
        }
        selectElement.appendChild(option);
    });
    if (isSelect2 === true) {
        //initSelect2('#' + selectElementId).val(v).trigger('change');
        setValue('#' + selectElementId, v);
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function QUERY(key){
    var allquerystrings = top.location.href.substr(top.location.href.indexOf('?')+1).split('&');
    for(var i=0;i<allquerystrings.length;i++){
       var kv = allquerystrings[i];
       var k = kv.substr(0,kv.indexOf('='));
       var v = kv.substr(1+kv.indexOf('='));
       if(k.localeCompare(key) === 0) return decodeURIComponent(v);
    };
    return null;
}


function isNullOrEmpty(val)
{
    if(val === 0 || val === '0') return false;
    return !val
        || typeof val === 'undefined'
        || val === 'undefined'
        || val === null
        || (val+'').trim() === ''
        || (val+'').trim().toLowerCase() === 'null'
        || (typeof val === 'object' && Array.isArray(val) && val.length === 0)
        ;
}

function or(listOfBooleans){
    for(var i=0;i<listOfBooleans.length;i++){
        if(listOfBooleans[i]) return true;
    }
    return false;
}

function and(listOfBooleans){
    if(listOfBooleans.length==0) return false;
    for(var i=0;i<listOfBooleans.length;i++){
        if(false==listOfBooleans[i]) return false;
    }
    return true;
}

function each(selector, callback){
	if(typeof selector === 'undefined') throw 'each ERROR';
    return QSA(selector).map(callback);
}

function toQueryString(obj){
    return Object.keys(obj).map(function(x){ return [x,encodeURIComponent(obj[x])].join('=') }).join('&');
}

function searchCards(cardsContainerSelector, searchWord){
    if(isNullOrEmpty(searchWord)) searchWord='';
    HIDE(cardsContainerSelector+' .card[data-content]');
    var cards = QSA(cardsContainerSelector+' .card[data-content]');
    for(var i=0;i<cards.length;i++){
        var content = (cards[i].attributes['data-content'].value+'').toLowerCase();
        if(content.contains(searchWord.toLowerCase())){
            SHOW(cards[i]);
        }
    }
}

function errorMessageAfterTimeout(time,message){
    return setTimeout(function () {
        dialogAlert({"Status":'error',"Message":message,"Data":null});
    },time);
}

function dialogAlert(r, callback){
    if(isNullOrEmpty(r) || Object.keys(r).intersect(['Status','Message','Data']).length < 3) {
        r = {Status:'unknown',Message: (typeof r === 'string' ? r : JSON.stringify(r)) ,Data:r}; 
    }
    
    each('.button',function(button){ toggleButtonsLoading(button,false) });
    
    show.dialog({
        "title":   (''+r.Status).toUpperCase(),
        "message": '<div class="px-1">'+
                   '  <div class="ui icon message '+r.Status+' visible">'+
                   '    <i class="ui icon '+ r.Status +'"></i>'+
                   '    <div class="content">'+
                   '      <div class="header">'+
                   '         Message from server:'+
                   '      </div>'+
                   '      <hr>'+ (""+r.Message).replace('|','<br>') +
                   '    </div>'+
                   '  </div>'+
                   '</div>',
        "onApprove": callback,
        "size": 'mini',
        "hideAlertHeader": true
    });
}

function showAlert(r, onSuccess, onFailure) {
    return ALERT('[data-alert-box-view]',r,onSuccess,onFailure);
}

function showAlertThenReload(r) {
    showAlert(r,function(){
        setTimeout(function(){
            top.location.reload();
        }, 1000);
    })
}

function FOCUS(el){
    if(typeof el === 'string') return FOCUS(QS(el));//each(el, FOCUS);
    try{
		if(el.classList.contains('select2')) return $(el).select2('open');
        el.focus(); 
        el.select();
    }catch(ex){
        console.log(ex);
    }
}

function ALERT(selector,r,onSuccess,onFailure){
    if(typeof r === 'undefined') {
        console.trace();
        throw Error('unable to show alert of undefined object').stack;
    }
    if (typeof r === 'string' && isJSON(r)) {
        r = JSON.parse(r);        
    }

    try{
        r.Message = r.Message.replace("https://empupdate.moh.gov.sa/InfoUpdate.aspx","<a href='https://empupdate.moh.gov.sa/InfoUpdate.aspx' target='_blank'>https://empupdate.moh.gov.sa/InfoUpdate.aspx</a>");
    }catch(e){
        //do nothing
    }
    
    if(!r || !r.Status){
        return show.dialog({ "title": 'ERROR', "message": r, "size": 'large' });
    }

    each('.button',function(button){ toggleButtonsLoading(button,false) });

    if (typeof onSuccess === 'function' && typeof r.Status !== 'undefined' && r.Status === 'success' && invoke(onSuccess, r)) {
        setTimeout(function(){ hideSlowly(selector); },15*1000);
    }else if(typeof onFailure === 'function'){
        if(!invoke(onFailure, r) && !['info','success','warning'].contains(r.Status)){
            dialogAlert(typeof(r) === 'string' && isJSON(r) ? TABULAR(JSON.parse(r)) : r);
        }
    }

    each(selector, function(alertbox){
        if(typeof r.Message === 'undefined') return;
        const rndm = makeid(7);
        alertbox.style = '';
        alertbox.className = "fade show ui " + r.Status + " message py-2 my-0 visible";
        alertbox.setAttribute('data-alertbox-message-'+rndm, 1 );
        //alertbox.innerHTML = ICONS[r.Status] + ' ' + (r.Message+'').replace('|','<br>') + (typeof r.Data === 'string' ? ' / ' + r.Data : '') + ' <button onclick="setTimeout(function(){ QSA(\''+ selector +'\').forEach(function(x){ x.className = \'fade hide\'; })  },50)" type="button" class="close p-0 ml-3" >&times;</button>';
        
        alertbox.innerHTML = '<i class="close icon" onclick="hideSlowly(\'[data-alertbox-message-'+ rndm +']\')" style="margin-top:-0.25em !important"></i>'+
							 '<span style="justify-content: center;display: flex;align-items:center" '+ (r.IsArabic ? ' class="rtl" dir="rtl"' : '') +'>'+
                             ICONS[r.Status] + 
                             ' <ul class="text-'+ (r.IsArabic ? 'right' : 'left') +'" style="display:inline-block"><li>' + (r.Message+'').replaceAll('|','</li><li>');
                             '</li></ul></span>';
    });
    //

    if(r.Status === 'warning') SCROLL('#top');
    
    return false;
}

// later we need to think about this
// var promptOptions = {
//     message: "Please enter required value?",
//     inputType: "textarea", // ['textarea'=default,'input','form'] single input and textarea will return string, while form will return model 
//     form: '<form class="ui form">'+
//           ' <div class="ui field">'+
//           '  <label>'+ this.message +'</label>'+
//           '  <textarea onblur="JSCommon.fixCapitalization(this)" name="prompt-dialog-text" rows="5" maxlength="255"></textarea>'+
//           ' </div>'+
//           '</form>',
// };
function PROMPT(msg, callback, initialValue){
    return show.prompt({
        title: msg,
        initialValue: initialValue,
        inputType: 'textarea',
		onApprove: function(model){  
			var result = model['prompt'];
			if(result != null && typeof callback === 'function') callback(result);
		}
    });
}

function POPUP(url,size,callback){
    if(typeof size === 'undefined' || isNullOrEmpty(size)) size='large';
    return GET(url,function(message){
        if(typeof message === 'string' && isJSON(message)) message = JSON.parse(message);
        if(typeof message === 'object') message = TABULAR(message);
        show.dialog({
            "title": url,
            "size":size,
            "message": '<div data-popup>'+message+'</div>',
            "showX": true,
            "onShown": function () {
                initializeUI('[data-popup]');
				invoke(callback);
            }
        });
    });
}

function ALERTCONFIRM(message,callback){
    var handle = 0;
    var selector = '[data-alert-box-view]';
    var div = document.createElement('div');
    var msg = document.createElement('span');
    var b1 = document.createElement('button');
    var b2 = document.createElement('button');
    
    div.style = 'background:#fefefe;border:1px solid navy;margin:2pt;padding:1pt;border-radius:0.3rem';
    msg.className = 'ml-2 mr-4';
    b1.className = 'ui primary tiny compact button mx-1 p-2';
    b1.innerText = 'Yes';
    b2.className = 'ui tiny compact button mx-1 p-2';
    b2.innerText = 'No';

    b1.onclick = function(e){ invoke(callback,e); div.className = 'hide'; clearInterval(handle); };
    b2.onclick = function(e){ div.className = 'hide'; clearInterval(handle); };

    msg.innerText = message;
    div.appendChild(msg);
    div.appendChild(b1);
    div.append(b2);
    
    each(selector, function(x){ x.appendChild(div); });
    SCROLL('#top');
    SHOW(selector);

    handle = setInterval(function(){
        div.style.background = (div.style.background === 'cornsilk' ? '#fefefe' : 'cornsilk');
    }, 1000);
}

function GETCONFIRM(url, callback, onShown){
    return XHR.GET(url,function(msg){
        return CONFIRM(msg,callback,onShown);
    });
}

function TINYGETCONFIRM(url, callback, onShown){
    return XHR.GET(url,function(msg){
        return show.confirm({
            message: msg,
            onApprove: callback,
            onShown: onShown,
            size: 'tiny'
        });
    });
}

function EMBEDPOPUP(url,size,callback){
    return GET(url,function(res){
        each('.modal-content',function(modal){
            modal.innerHTML = res;
        });
        invoke(callback);
    });
}

function GETCONFIRMEMBED(options){
    if(options == null || typeof options !== 'object') return console.error('??? unkown request !!!');
    var url      = options.url       
      , api      = options.api       
      , callback = options.callback       
      , onShown  = options.onShown     
      , method   = typeof options.method === 'string' && !isNullOrEmpty(options.method) ? options.method : 'POST'
      , selector = typeof options.selector === 'string' && !isNullOrEmpty(options.selector) ? options.selector : '.modal-content'
      , onClose  = typeof options.onClose === 'function' ? options.onClose : function(){}
      ;

    GET(url,function(response){
        var modal = QS(selector);
        modal.innerHTML = '<div class="ui segment">'+response + '<hr>'+
                          '<button data-action-button type="button" class="ui primary button">Save</button>'+
                          '<button data-action-button type="button" class="ui secondary button">Cancel</button>'+
                          '</div>';
        
        initializeUI(selector);
        setTimeout(function(){
            each(selector + ' input[autofocus]',FOCUS);
        },500);
        invoke(onShown,response);
        each(selector + ' button[data-action-button].secondary',function(x){
            x.onclick = function(){
                modal.innerHTML='';
                invoke(onClose);
            };
        });
        each(selector + ' button[data-action-button].primary',function(x){
            x.onclick = function(){
                if(!checkRequiredFields(selector)) return;
                var model = SERIALIZE(selector);
                if(typeof options.onApprove === 'function'){
                    options.onApprove(model);
                }else{
                    XHR[method](api, model, function(r){
                        showAlert(r,callback);
                        if(r.Status === 'success') {
                            modal.innerHTML='';
                            invoke(onClose);
                        }
                    },showAlert);
                }
            };
        });
    });    
}

function CONFIRM(msg, onApprove, onShown){
    return show.confirm({
        "centerVertical": false,
        "centerHorizontal": false,
        "message": msg,
        "size": 'large',
        "onDeny": function(){},
        // "onHide": function(){
        //     var dlgId = '#'+window.dialogs.last()[0].id;
        //     // var dlg = window.dialogs.last();
        //     // console.log(dlgId + ":" + typeof(dlg))
        //     // console.log("required fields: '" + dlg.getRequiredFields() + "'");
        //     // dlg.modal('show');
        //     return VALIDATEFORM(dlgId);
        // },
        "onApprove": onApprove,
        "onShown": onShown,
        "dialogType": "confirm"
    });
}

function VALIDATEFORM (selector) {

    //var model = SERIALIZE(selector);
    var superTrim = function(x){x.value=x.value.superTrim();};

    try{ each(selector + ' textarea',          superTrim); } catch(e) { }
    try{ each(selector + ' input[type="text"]',superTrim); } catch(e) { }
    try{ each(selector + ' input:not([type])', superTrim); } catch(e) { }

    var duplicates = QSA(selector + ' [data-duplicate="true"]');
    if(duplicates.any()){
        ALERTS.WARNING('Cannot submit this changes because they will cause duplicate entries');
        duplicates[0].focus();
        return false;
    }

    //if (getValue('[type="file"]') === '' && model.Body === '') return showAlert({ "Status": 'error', "Message": 'must select a word document file to upload' });


    if (!checkRequiredFields(selector)) return false;

    return true;
}

/**
 * hide with fade out animation
 * @param {selector} targetSelector
 */
function hideSlowly(targetSelector) {
    each(targetSelector,function(target){
        target.classList.add('fadable');
        target.style.opacity = '0';
        setTimeout(function () { HIDE(targetSelector); }, 3000);
    });
}

function hideAlert() {
    each('[data-alert-box-view]', function(x){x.className = "fade hide";});
}


// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

var ALERTS = {
"WARNING": function (message) { showAlert({ "Status": 'warning', "Message": message, "Data": null }); },
   "INFO": function (message) { showAlert({ "Status": 'info',    "Message": message, "Data": null }); },
"SUCCESS": function (message) { showAlert({ "Status": 'success', "Message": message, "Data": null }); },
  "ERROR": function (message) { showAlert({ "Status": 'error',   "Message": message, "Data": null }); }
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}


//////////////////////////////////////////////////
function validateDataListsSelection() {
    // Find all inputs on the DOM which are bound to a datalist via their list attribute.
    var inputs = QSA('input[list]');
    for (var i = 0; i < inputs.length; i++) {
        // When the value of the input changes…
        inputs[i].addEventListener('change', function () {
            var optionFound = false,
                datalist = this.list;
            // Determine whether an option exists with the current value of the input.
            for (var j = 0; j < datalist.options.length; j++) {
                if (this.value == datalist.options[j].value) {
                    optionFound = true;
                    break;
                }
            }
            // use the setCustomValidity function of the Validation API
            // to provide an user feedback if the value does not exist in the datalist
            if (optionFound) {
                this.setCustomValidity('');
            } else {
                this.setCustomValidity('Please select a valid value from the list.');
            }
        });
    }
}

/////////////////////////////////////////////////////////////
function iformatSelect2(icon) {
    var option = icon.element;
    if(typeof option === 'undefined' || (typeof option.attributes['data-icon'] === 'undefined' && typeof option.attributes['data-image-icon'] === 'undefined')) return icon.text;
    if(typeof option.attributes['data-image-icon'] !== 'undefined') {   
        return $('<span><img class="ui avatar image" src="' + $(option).data('image-icon') + '" width="24" height="24"/> ' + icon.text + '</span>');
        //console.log($(option).data('image-icon'));
    }
    return $('<span><i class="ui ' + $(option).data('icon') + '"></i> ' + icon.text + '</span>');
}


function initSelect2(selector){
    if(isNullOrEmpty(selector) || typeof selector !== 'string') selector = 'body .select2';
    
    
    $(selector+':not([data-select2-initialized-already="true"])').select2({
        "dropdownAutoWidth": false,
        "theme": "classic",
        "width": 'resolve',
        "allowHtml": true,
        "templateSelection": iformatSelect2,
        "templateResult": iformatSelect2,        
        "escapeMarkup": function(markup) {
            return markup;
        }
    });

    each(selector, function(x){
        x.classList.add('w-100'); 
        x.style = 'width:100% !important;' ;
        x.setAttribute('data-select2-initialized-already',"true");
    });
}



function inputOnKeyDownDateValidation(evt){
    evt = evt||window.event; // IE support
    

    var allowed = [
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
        'Delete',
        'Backspace',
        'Shift',
        'Control',
        'Insert',
        'Enter',
        'Home',
        'End',
        'Tab',
        '-',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0'
    ];
    if(['/','.','\\',' '].indexOf(evt.key) > -1){
        if(this.selectionStart <= 5 && this.value.split('-').length < 3)
        {
            this.value += '-';
            this.selectionStart = this.selectionEnd = this.value.length;
        }        
    }
    if(evt.key === '-' && this.value.split('-')>2 || allowed.indexOf(evt.key) === -1) 
        return evt.preventDefault();
}

function inputOnKeyUpDateValidation(evt){
    evt = evt||window.event; // IE support
    if(this.selectionStart <= 5 && this.value.split('-').length < 3)
    {
        if(this.value.toCharArray().last() !== '-'  && (this.value.length === 2 || this.value.length === 5)) {
            this.value += '-';
            this.selectionStart = this.selectionEnd = this.value.length;
        }
    }
}

function inputOnBlurDateValidation(evt) {
    evt = evt||window.event; // IE support
    this.setCustomValidity('');
    this.setAttribute('data-date-value','');
    var text = this.value;
    if (text.trim() === '') {
        this.value = '';
        return true;
    }

    var y, m, d;
    var dateparts = text.match(/\d+/g);

    if (dateparts === null || typeof (dateparts) === 'undefined' || dateparts.length !== 3) {
        this.setCustomValidity('Invalid date');
        this.select();
        this.focus();
        return false;
    }

    var p1, p2, p3;


    p1 = +(dateparts[0]);
    p2 = +(dateparts[1]);
    p3 = +(dateparts[2]);

    if (isNaN(p1) || isNaN(p2) || isNaN(p3)) {
        this.setCustomValidity('Invalid date');
        this.select();
        this.focus();
        //e.preventDefault();
        return false;
    }

    if (p1 > 31) { // this is a year
        if (dateparts[0].length < 4) {
            if (p1 > 50)  y = Number("19" + p1);
            else if(p1>9) y = Number("20" + p1);
            else          y = Number("200"+ p1);
        } else {
            y = p1;
        }
        if (p2 > 12) { // this is a day
            d = p2;
            m = p3;
        } else {
            d = p3;
            m = p2;
        }
    } else { // check second term if more than 12
        if (dateparts[2].length < 4) {
            if (p3 > 50) y = Number("19" + p3);
            if (p3 > 9)  y = Number("20" + p3);
            else         y = Number("200"+ p3);
        } else {
            y = p3;
        }
        if (p2 > 12) { // this is a day
            d = p2;
            m = p1;
        } else {
            d = p1;
            m = p2;
        }
    }

    var _year = new String(y);
    var _month = new String("00" + m).substr(-2);
    var _day = new String("00" + d).substr(-2);

    var datevalue = _year + '-' + _month + '-' + _day;

    try{
        if (new Date(datevalue).toISOString().substr(0, 10) !== datevalue) {
            throw Error('[' + datevalue + '] is not a valid date');
        }
    }catch(ex){
        this.value = '';
        showAlert({Status:'warning', Message: JSON.stringify(ex), Data:null});
        return false;        
    }
    
    if(this.placeholder === 'dd-mm-yyyy'){
        this.value = [_day,_month,_year].join('-');
    }else if(this.placeholder === 'yyyy-mm-dd'){
        this.value = [_year,_month,_day].join('-');
    }

    this.setAttribute('data-date-value',[_year,_month,_day].join('-'));

    return true;
}


function initDatePickers(selector,dateFormat) {
    if(isNullOrEmpty(selector)) selector = 'body';
    if(isNullOrEmpty(dateFormat)) dateFormat = 'dd-mm-yyyy';
    
    each(selector+' [data-toggle="datepicker"]:not([data-date-picker-initialized])',function(input){
        if (input.placeholder === dateFormat) return;
        input.placeholder = dateFormat;
        input.setAttribute('maxLength', 10);
        var wrapper = document.createElement('div');
        var icon = document.createElement('i');
        icon.id = "Icon_"+("ZXCVBNMASDFGHJKLQWERTYUIOP1234567890".toCharArray().shuffle().take(5).join(''));
        icon.classList='calendar alternate outline icon blue hand';
        wrapper.classList = 'ui right icon input';
        input.parentNode.insertBefore(wrapper,input);
        wrapper.appendChild(input);
        wrapper.appendChild(icon);
        input.setAttribute('data-date-picker-initialized',true);
        input.setAttribute('type','text');

        input.setAttribute('data-slots','dmy');
        
        input.addEventListener("blur", inputOnBlurDateValidation);
        // input.addEventListener("keyup", inputOnKeyUpDateValidation);
        // input.addEventListener("keydown", inputOnKeyDownDateValidation);
        
        input.max = '2030-12-31';
        input.min = '1990-01-01';
        $(input).datepicker({
            format: dateFormat,
            language: 'en-US',
            //trigger: '#' + icon.id,
            weekStart: 0,
            yearFirst: true,
            //inline: true,
            //autoHide: true,
            autoShow: false,
            zIndex: 999999,
        });
    });
    
    /*
    $(selector+' input[data-toggle="datepicker"]:not([data-date-picker-initialized])').each(function (k, input) {

        if (input.placeholder === dateFormat) return;
        input.type = "text";
        input.placeholder = dateFormat;
        input.setAttribute('maxLength', 10);
        
        var div = input.parentElement;
        var icon = document.createElement('i');
        icon.className = 'hand calendar alternate outline icon blue docs-datepicker-trigger';
        icon.id = 'i' + Math.abs(Math.ceil(Math.random() * (912410+k)));
        icon.style.cursor = "pointer";
        div.className = 'ui right icon input w-100';
        icon.onclick = function (e) {
            consolelog('date picker requested');
        };

        //div.appendChild(input);
        div.appendChild(icon);

        input.onblur = validateDate;
        input.max = '2030-12-31';
        input.min = '1990-01-01';
        $(input).datepicker({
            format: dateFormat,
            language: 'en-US',
            //trigger: '#' + icon.id,
            weekStart: 0,
            yearFirst: true,
            //inline: true,
            autoHide: true,
            //autoShow: true,
            zIndex: 999999,
        });
        input.setAttribute('data-date-picker-initialized',true);
    });
    */
}


function getValues(selector){
    return EXTRACT(selector,'value');
}

function isNullOrEmptyOrZero(x){
    return x == 0 || isNullOrEmpty(x);// || x === 0 || x === '0';
}

function getValue(element){
    if(typeof element === 'string') element = QS(element);
    if(isNullOrEmpty(element)) return undefined;
    
    if(isNullOrEmpty(element.attributes['data-date-value'])==false) return element.attributes['data-date-value'].value;

    if(element.attributes["data-type"] !== null && typeof element.attributes["data-type"] !== 'undefined' && element.attributes["data-type"].value === 'numeric'){
        if(isNullOrEmpty(element.value)) return 0;
        return parseFloat(element.value); //Number(element.value);
    } 

    if(element.attributes["data-type"] !== null && typeof element.attributes["data-type"] !== 'undefined' && element.attributes["data-type"].value === 'boolean'){
        if(['yes','true','1','-1'].contains(element.value.trim().toLowerCase())) return true;
        return false;
    } 

    if(element.type === 'checkbox' && typeof element.attributes["data-type"] === 'undefined' && isNullOrEmpty(element.attributes["value"])){
        return element.checked;
    }

    if((''+element.tagName).toUpperCase() === 'SELECT' && element.multiple){ 
        return getSelectValues(element);
    }
    
    return (element.value+'').superTrim();
}

// Return an array of the selected opion values
// select is an HTML select element
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }


function toDate(value) {
    if(isNullOrEmpty(value)) return null;
    if(typeof value !== 'string') return null;
    value = value.replaceAll('/','-').replaceAll('.','-').split(' ').first().split('T').first();
    var parts = value.split('-');
    var y = +parts[0];
    var m = +parts[1];
    var d = +parts[2];
    console.log({"year":y,"month":m,"day":d});
    try{
        var date1 = new Date(d,m-1,y,0,0,0,0);
        var date2 = new Date(y,m-1,d,0,0,0,0);
        console.log([d,m,y]+"|"+date1);
        console.log([y,m,d]+"|"+date2);
        if(date1.getDate()==y && date1.getMonth()==m-1 && date1.getFullYear()==d) return date1;
        if(date2.getDate()==d && date2.getMonth()==m-1 && date2.getFullYear()==y) return date2;
    }catch(e){
    }
    return null;
}

function getDateObject(str){
    var result = {
        "value": '',
        "date": ''
    };
    if(isNullOrEmpty(str)) return result;
    const parts = str.split('-');
    if(parts.length < 3) return result;
    
    if(+parts[0] > 31){
        result.date = str;
        result.value = str.split('-').reverse().join('-');
    }else{
        result.value = str;
        result.date = str.split('-').reverse().join('-');
    }
    return result;
}

function setValue(element, value){
    var el = {};
    if(typeof element === 'string') el = QS(element); else el = element;
    //console.log(el);
    if(isNullOrEmpty(el)) return;
    
    //console.log('Is SELECT2 : ' + el.classList.contains('select2'));
    if(el.classList.contains('select2')) { setSelect2Value(element, value); }
    else if (typeof el.attributes['data-toggle'] !== 'undefined' && el.attributes['data-toggle'].value === 'datepicker') {
        const dt = getDateObject(value);
        el.value = dt.value;
        el.setAttribute('data-date-value', dt.date);
        //$(el).datepicker('setDate', toDate(value) );
    }
    else el.value = value;
}


function PREVIEW(title, url, beforeCallback) {
    //Policy/GeneratePdf
    show.dialog({
        "title": title,
        "message": '<div class="PreviewTabsContainer">'+
                   ' <div class="ui top attached tabular menu">' +
                   '   <a data-tab="tab1" class="item active" href="#" onclick="selectTab(\'.PreviewTabsContainer\',\'tab1\')">'+ title +'</a>' +
                   ' </div>' +
                   ' <div data-tab="tab1" class="ui bottom attached tab active pdfobject pdf-preview">' +
                   '   <div class="ui active dimmer">' +
                   '      <div class="ui text loader">Loading</div>' +
                   '   </div>' +
                   '   <p style="color:whitesmoke">Please wait while the report is being generated !</p>' +
                   '   <div class="ui progress orange" data-precent="0">' +
                   '    <div class="bar"></div>' +
                   '   </div>' +
                   ' </div>'+
                   '</div>',
        "onShown": function () {
            
            
                if(false == invoke(beforeCallback, function(){ PDFObject.embed(url, '.pdfobject', pdfobjectoptions); })){
                    PDFObject.embed(url, '.pdfobject', pdfobjectoptions);
                }
            
        },
        "size": 'fullscreen',
        "onApprove": function(){}
    });
}

function DISPATCH(obj, eventName)
{
    var event;
    if(typeof(Event) === 'function') {
        event = new Event(eventName);
    }else{
        event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
    }
    obj.dispatchEvent(event);
}

function invoke(func, args){
    if(typeof func === 'function') {
        func(args);
        return true;
    }
    return false;
}

function getTemplate(templateSelector,options){
    var html = QS(templateSelector).innerHTML;
    var keys = Object.keys(options);
    for(var i=0;i<keys.length;i++){
        html = html.replaceAll(keys[i],options[keys[i]]);
    }
    return html;
}

function isEmptyObject(obj) {
    if(typeof obj !== 'object' || obj == null) return true;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

//[END site.js]


function alertThenGoBack(r){
	showAlert(r,function(){ 
		setTimeout(function(){ history.back(); },1000); 
	});
}

/*
function initRatings(selector){
    each(selector+' .ui.rating:not(.disabled)',function (x) {
        $(x).rating('setting','onRate',function(value){
            //x.setAttribute('data-rating',value);
        });
    });
    $(selector+' .ui.rating.disabled').rating('disabled');
}
*/



function initDropDowns(selector){ return; }

function initRatings(selector){ return; // disable to make the form shorter
    each(selector+' .ui.rating',function(rating){
		
		var input = rating.parentNode.querySelector('[data-survey-question]');
		if(input == null || input == undefined || typeof input === 'undefined') return; 
		var name = input.name;
        var mandatory = input.required;
		var html = '<div data-star-rating>'
		         + ' <div class="ui radio checkbox pt-1">'
				 + '   <input name="'+name+'" id="taring_'+name+'_5" type="radio" value="5" '+ (mandatory ? ' required ' : '') +'>'
				 + '				<label for="taring_'+name+'_5">'
				 + '					<strong>5 / 5</strong>'
				 + '					&nbsp;'
				 + '					<i class="ui star green icon"></i>'
				 + '					<i class="ui star green icon"></i>'
				 + '					<i class="ui star green icon"></i>'
				 + '					<i class="ui star green icon"></i>'
				 + '					<i class="ui star green icon"></i>'
				 + '				</label>'
				 + ' </div>'
				 + ' <div class="ui radio checkbox pt-1">'
				 + '   <input name="'+name+'" id="taring_'+name+'_4" type="radio" value="4" '+ (mandatory ? ' required ' : '') +'>'
				 + '				<label for="taring_'+name+'_4">'
				 + '					<strong>4 / 5</strong>'
				 + '					&nbsp;'
				 + '					<i class="ui star teal icon"></i>'
				 + '					<i class="ui star teal icon"></i>'
				 + '					<i class="ui star teal icon"></i>'
				 + '					<i class="ui star teal icon"></i>'
				 + '				</label>'
				 + ' </div>'	
				 + ' <div class="ui radio checkbox pt-1">'
				 + '   <input name="'+name+'" id="taring_'+name+'_3" type="radio" value="3" '+ (mandatory ? ' required ' : '') +'>'
				 + '				<label for="taring_'+name+'_3">'
				 + '					<strong>3 / 5</strong>'
				 + '					&nbsp;'
				 + '					<i class="ui star yellow icon"></i>'
				 + '					<i class="ui star yellow icon"></i>'
				 + '					<i class="ui star yellow icon"></i>'
				 + '				</label>'
				 + ' </div>'
				 + ' <div class="ui radio checkbox pt-1">'
				 + '   <input name="'+name+'" id="taring_'+name+'_2" type="radio" value="2" '+ (mandatory ? ' required ' : '') +'>'
				 + '				<label for="taring_'+name+'_2">'
				 + '					<strong>2 / 5</strong>'
				 + '					&nbsp;'
				 + '					<i class="ui star orange icon"></i>'
				 + '					<i class="ui star orange icon"></i>'
				 + '				</label>'
				 + ' </div>'
				 + ' <div class="ui radio checkbox pt-1">'
				 + '   <input name="'+name+'" id="taring_'+name+'_1" type="radio" value="1" '+ (mandatory ? ' required ' : '') +'>'
				 + '				<label for="taring_'+name+'_1">'
				 + '					<strong>1 / 5</strong>'
				 + '					&nbsp;'
				 + '					<i class="ui star red icon"></i>'
				 + '				</label>'
				 + ' </div>'				 
				 + '</div>';
		
                 
		rating.parentNode.innerHTML = html;
		
	});
}

function tidy(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.innerHTML;
}

var show = {
    "notImplementedAlert": function(){
        return this.alert('<i class="times circle red icon"></i> not implemented');
    },
    "error": function(errorMessage){
        return this.dialog({
            title:'Error', 
            size:'mini', 
            message:'<i class="times red circle icon"></i> ' + errorMessage,
            onApprove: function(){ /* do nothing */ }
        });
    },
    "open": function(url){
        GET(url,function(r){ show.dialog({message:r}); })
    },
    "dialog": function(options){
        options.title = tidy(options.title || "DIALOG");
        options.message = tidy(options.message);

        //if(!isValidHTML(options.message)) return this.alert('<h5 style="color:red">HTML Parsing Error</h5><pre style="padding:1em;border:1px solid #cccccc;border-radius:0.3rem;background-color:cornsilk;min-height:300px">'+ escapeHtml(options.message) +'</pre>');
        if(typeof window.dialogs === 'undefined') window.dialogs = [];
        options.size = options.size || "fullscreen";
        options.dialogType = options.dialogType || 'dialog';
        var uid = 'dlg-'+'1234567890qwertyuiopasdfghjklzxcvbnmABCDEFGHIJKLMNOPQRSTUVWXYZ'.toCharArray().shuffle().take(5).join('');
        
        var dlg = $(
            '<div id="'+ uid +'" class="ui '+options.size+' modal '+uid+'" data-dialogType="'+ options.dialogType +'">'+
            // '  <div class="header normalfont smaller hide-'+(options.size === 'fullscreen' ? 1 : 0)+'">'+
            // '    ' + options.title +
            // '  </div>'+
            '  <div class="ui grid pl-3 pt-3 pr-3">'+
            '    <div class="fourteen wide column">'+
            '   ' + options.title +
            '    </div>'+
            '    <div class="two wide column text-right">'+
            (options.hideCloseX ? '' : '      <i class="ui close icon" onclick="$(\'.'+uid+'\').modal(\'hide\');"></i>')+
            '    </div>'+
            '  </div><hr>'+
            // '  <i class="close icon hide-'+(options.size === 'fullscreen' ? 1 : 0)+'"></i>'+
            '  <div class="content">'+
            '    <div data-alert-box-view'+(options.hideAlertHeader?'-hide hide':'')+'></div>'+
            '    <div>'+ options.message + '</div>'+
            '  </div>'+
            '  <div class="actions text-right">'+
            '      <button class="ui black deny1 button hide-'+(typeof options.onDeny === 'function' ? 1 : 0)+'">'+
            '        Cancel'+
            '      </button>' +
            '      <button autofocus class="ui green positive1 approve1 button hide-'+(typeof options.onApprove === 'function' ? 1 : 0)+'">'+
            '        OK'+
            '        <i class="right chevron icon"></i>'+
            '      </button>'+
            '  </div>'+            
            '</div>'
        );

        var approve = dlg.find('button.approve1');
        var deny = dlg.find('button.deny1');
        if(deny.length > 0) deny[0].onclick = function(){ invoke(options.onDeny); dlg.modal('hide'); };
        if(approve.length > 0) approve[0].onclick = function(){
            var model = SERIALISE('#'+dlg[0].id);
            var required = QSA('#'+dlg[0].id + ' [required]').map(function(x){ return x.name || x.id }).distinct();
            if(typeof options.onApprove === 'function') {
                each('#'+dlg[0].id + ' [required]',function(x){
                    x.style.background = null;
                });
                for(var i=0;i<required.length;i++){
                    if(isNullOrEmpty(model[required[i]]))
                    {
                        showAlert({
                            Status: 'warning',
                            Message: 'Field ['+required[i]+'] is required',
                            Data: required
                        });

                        each('#'+dlg[0].id + ' [required][name='+ required[i] +']',function(x){
                            x.style.background = '#f0bfbf';
                            x.focus();
                        });

                        return false;
                    }
                }
                options.onApprove(model);
            }
            dlg.modal('hide');
        };
        
        dlg.modal({
            centered: false,
            blurring: false,
            allowMultiple: true,
            position: 'relative',
            autofocus: true,
			duration: 0,
            transitoin: 'fade',
            closable: typeof options.onApprove !== 'function',
            onHide:function(){
                if(typeof options.onHide === 'function') return options.onHide();
                console.log('modal:['+uid+'] is hidden');
                each('.modal.'+uid,function(x){
                    setTimeout(function(){x.innerHTML=x.innerText='';},1000);
                    x.classList.add('hide');
                });
                
            },
            onDeny: options.onDeny,
            onApprove: function(){
                var model = SERIALIZE('.modal.'+uid);
                if(typeof options.onApprove === 'function') return options.onApprove(model);
            },
            onVisible: function(){
                
                initializeUI('.modal.'+uid);

                invoke(options.onVisible);
                invoke(options.onShown);
            }
        })
        .modal('show')
        ;
        
        window.dialogs.push(dlg);
        return dlg;
    },
    
    "confirm": function(options){
        options.showActions = true;
        options.dialogType = 'confirm';
        if(typeof options.onDeny !== 'function'   ) options.onDeny = function(){ return false; };
        if(typeof options.onApprove !== 'function') options.onApprove = function(){ return true; };
        return show.dialog(options);
    },
    
    "alert": function(message){
        return show.dialog({message:message,size:'tiny',dialogType:'alert',onApprove:function(){}});
    },

    "prompt": function(options){
        if(typeof options.initialValue === 'undefined' || isNullOrEmpty(options.initialValue)) options.initialValue = '';
        options.message = '<div class="ui form"><div class="field"><label>'+options.title+'</label>'+(options.inputType === 'textarea' ? '<textarea autofocus rows="2" maxlength="500" data-placeholder="'+options.title+'" name="prompt">'+escapeHtml(options.initialValue)+'</textarea>' : '<input autofocus value="'+escapeHtml(options.initialValue)+'" name="prompt">')+'</div></div>';
        options.size = 'mini';
        options.dialogType = 'prompt';
        return show.confirm(options);
    },

    "progress": function(options,callback){
        options.size = 'mini';
        options.message = "  <div class='ui progress blue show-dlg-progress' data-precent='0'>" +
                          "    <div class='bar'></div>" +
                          "  </div>";
        options.onShown = callback;
        options.hideCloseX = true;
        return show.dialog(options);
    },
    
    "hideAll": function(){
        window.dialogs.forEach(function(dlg){
            dlg.modal('hide');
        });
    }
};

function initializeUI(selector){
    initDatePickers(selector);
    initSelect2(selector+' select.select2');
    initDropDowns(selector);
    initRatings(selector);
}



function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .trim();
 }

/** public static void main(String[]args){ */
    onready(function () {
        initializeUI('body');
        if(GETBROWSER() === 'IE') HIDE('footer');
    });
/** } */

var SERIALISE = SERIALIZE;
var DESERIALISE = DESERIALIZE;






function bannerImageSlideShow(){
    each('[data-login-banner] img',function(img){
        img.src='/img/banner/0.jpg?_='+(Math.random()*100029387);
    });
    //show.dialog({message:'<img width="100%" src="/img/banner/0.jpg"/>',onApprove:function(){}});
    if(1>0)return;
    window.banner = 0;
    window.banners = [5,1,2,8,7,0,6,4,3];
    window.fadeBannerDelta = 0.01;
    var img = QS('[data-login-banner] img');
    setInterval(function () {
        img.style.opacity -= window.fadeBannerDelta;
        if(img.style.opacity <= 0){
            var cur = window.banners[window.banner++ % window.banners.length];
            img.src = '/img/banner/'+cur+'.png?_=1';//?_='+(Math.random()*100029387);   
            img.style.opacity = 1.0;
            img.style.maxHeight = '380px';
        }
    },100);

    
}

var encryption = {
    "base64": {
        encode: function(str){ return btoa(str) },
        decode: function(str){ return atob(str) }
    }
};