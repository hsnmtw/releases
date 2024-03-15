'use strict';

(()=>{
	if(0>1) window.addEventListener('load',()=>{
		each('a[data-mask=""]', (a)=>{ a.setAttribute('data-mask',1);a.href=MASK(a.href) });
		each('img[data-mask=""]', (a)=>{ a.setAttribute('data-mask',1);a.src=MASK(a.src) });
		each('[data-form-intercept]', (f)=>{ 
			if (f.attachEvent) {
				f.attachEvent("submit", processForm);
			} else {
				f.addEventListener("submit", processForm);
			}
		});
	});
})();

function processInterceptedForm(e) {
    if (e.preventDefault) e.preventDefault();

    /* do what you want with the form */

	const form = this;
	const fdata = new FormData(e.target);
	const data = Object.fromEntries(fdata.entries());

	GETHTML2(MASK(form.action + '?' + JSON.stringify(data)),'[data-main-body]');

    // You must return false to prevent the default form behavior
    return false;
}

function MASK(x){
	console.log(x.replace(window.location.origin,''), encodeURIComponent(encryption.base64.encode(x.replace(window.location.origin,''))));
	return '/?e='+encodeURIComponent(encryption.base64.encode(x.replace(window.location.origin,'')));
}

function GETHTML2(api, selector, callback, onFail) {
	return GET2(api,{},(rsp)=>{ SETHTML(selector, rsp); invoke(callback, rsp); }, onFail);
}

function GET2(api, data, onSuccess, onFailure) {
	const url = api.split('?');
	const encrypted = encryption.base64.encode(url[0]+'?'+JSON.stringify(data)+(url.length > 1 ? '&' + url[1] : ''));
	return xhr.GET('/',{e:encrypted},onSuccess,onFailure);
}

function POST2(api, data, onSuccess, onFailure) {
	return GET2(api, data, onSuccess, onFailure);
}

function DELETE2(api, data, onSuccess, onFailure) {
	return GET2(api, data, onSuccess, onFailure);
}
