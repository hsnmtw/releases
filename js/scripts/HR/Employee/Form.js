
document.querySelectorAll('[data-hr-main]').forEach(el => {
/*
    const args = {
        Page: 1,
		Filters: [{Name: 'Id', Value: [ el.getAttribute('data-dynamic-id') ]}]
    };
    GET('/hr/employee/query',args,function(model){
		
		const e = model.Data.Length > 0 ? model.Data[0] : {};
		el.innerHTML = `
			<div class="ui message ignored visible">
				<a class="secondary ui button" href="/hr/employee"> &lt; - Back</a>
			</div>
			<div class="ui segment">
				<form>
					<p>EmployeeNum: <input value="${e.EmployeeNum}"></p>
					<p>NameEn: <input value="${e.NameEn}"></p>
					<p>NameAr: <input value="${e.NameAr}"></p>
				</form>
			</div>
		`;
			
		
        
    });
*/
})


document.body.addEventListener('htmx:load', function(evt) {
    const selector  = '[data-hr-main]';
	initDatePickers(selector);
    initSelect2(selector+' select.select2');
});