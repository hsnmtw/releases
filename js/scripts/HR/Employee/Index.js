setTimeout(() => FOCUS('[data-hr-main] [name=query]') , 250);
document.querySelectorAll('[data-hr-main] th').forEach(el => {
	el.classList.add('text-right');
	/*
    const args = {
        Page: 1
    };
    GET('/hr/employee/query',args,function(model){
        el.innerHTML = `
		<div class="ui message ignored visible">
			<a class="teal ui button" href="/hr/employee/form"> + Add</a>
		</div>
		<div class="ui segment">
        <table class="stats-table">
            <thead><tr>
                <th>Employee Num</th>
                <th>NameEn</th>
                <th>NameAr</th>
            </tr></thead>
            <tbody>
            ${model.Data.map(e => `
                <tr>
                    <td>${e.EmployeeNum}</td>
                    <td>${e.NameEn}</td>
                    <td>${e.NameAr}</td>
                </tr>
            `)}
            </tbody>
        </table>
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