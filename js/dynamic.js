
'use strict';

function applyDynamic(el){
    if(el.getAttribute('data-dynamic-is-applied')) return;
    const xhr = new XMLHttpRequest()
    xhr.onload = function(){ 
        try{ eval(xhr.responseText)  } catch(e) { console.error(e) }
        el.setAttribute('data-dynamic-is-applied',true)
    }
    xhr.open('GET', el.getAttribute('data-dynamic-js-src'))
    xhr.send()
}