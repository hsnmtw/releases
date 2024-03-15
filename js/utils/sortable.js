//const { type } = require("jquery");

(function () {
    'use strict';

    const AZ = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down" viewBox="0 0 16 16">'+
               '     <path fill-rule="evenodd" d="M10.082 5.629L9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z" />'+
               '     <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />'+
               ' </svg>';

    const ZA = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">'+
               '   <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"/>'+
               '   <path fill-rule="evenodd" d="M10.082 12.629L9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"/>' +
               '   <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>'+
               ' </svg>';


    const TEMPLT = '<div class="m-0 p-0 ui simple dropdown menu">' +
                   '  <!-- text heading goes here --><i class="dropdown icon"></i>'+
                   '  <div class="ui menu">' +
                   '    <div class="item" onclick="dosort(true,this)">'+ AZ +' Ascending</div>' +
                   '    <div class="item" onclick="dosort(false,this)">'+ ZA +' Descending</div>' +
                   '    <div class="divider"></div>' +
                   '    <div class="select-all-chk-div"><!-- select all checkbox here --></div>'+
                   '    <div class="divider"></div>'+
                   '    <!-- filter items go here -->'
                   '  </div>' +
                   '</div>';

    

    window.sortable = function () {
        each('table[data-sortable]',makeSortable);
    }

    function makeSortable(table) {
        if(table.id !== null && table.id.indexOf('TBL') === 0) return;
        if (typeof (table.id) === 'undefined' || table.id === null || table.id === '') table.id = 'TBL' + "ASJKDHDKJAHD389712837JLKDSAJ".split('').shuffle().take(10).join('') ;
        //table.querySelectorAll('thead th:not([data-nosort])').forEach(wrapItWithBSDropdown);
        //'DataTable table table-sm table-striped table-bordered table-responsive'.split(' ').forEach(function (x) { table.classList.add(x); });
        
        var html = table.parentNode.innerHTML;
        var search = '<div class="ui form"><div class="field ui icon input">'+
                     ' <input placeholder="Search ..." class="ui input" oninput="searchTable(\'#'+table.id+'\',this.value)"><i class="search icon"></i>'+
                     '</div></div>'
                     ;
        table.parentNode.innerHTML = search+html;
    }


//     function wrapItWithBSDropdown(th) {
//         th.innerHTML = TEMPLT.replace('<!-- text heading goes here -->', th.innerText);
//         if (typeof (th.id) === 'undefined' || th.id === null || th.id === '') th.id = 'TH' + random();
//         var sortedObj = sort(true, th.firstChild);
//         var sorted = sortedObj._sort.sortedList;
        
//         var unique = [];
//         if (sorted.length > 0) unique.push(sorted[0][0]);
//         for (var i = 1; i < sorted.length; i++) {
//             var text = sorted[i][0];
//             if (unique[unique.length - 1] !== text)
//                 unique.push(text);
//         }
        
//         var liTemplate = th.querySelector('div.select-all-chk-div');
//         var chkSelectAll = document.createElement('input');
//         var chkSelectAllLabel = document.createElement('label');

//         chkSelectAll.className = "custom-checkbox mx-3 chk-all";
//         chkSelectAll.checked = true;
//         chkSelectAll.type = "checkbox";
//         chkSelectAll.id = "chk" + random() ;
//         chkSelectAll.onchange = function (e) {
//             var _this = this;
//             $(this).parents('th').find('input.chk-filter-item').each(function (k, c) {
//                 c.checked = _this.checked;
//                 $(c).change();
//             });
//         };
//         chkSelectAllLabel.for = chkSelectAll.id;
//         chkSelectAllLabel.innerText = "Select All";

//         liTemplate.appendChild(chkSelectAll);
//         liTemplate.appendChild(chkSelectAllLabel);
//         var ul = th.querySelector('.menu .menu');

//         for (var i = 0; i < unique.length; i++) {
//             var li = document.createElement('div');
//             var chk = document.createElement('input');
//             var lbl = document.createElement('label');
//             chk.setAttribute('data-sort-index', sortedObj._sort.index);
//             chk.setAttribute('data-sort-tableId', sortedObj._tableId);
//             chk.className = "custom-checkbox mx-2 chk-filter-item";
//             chk.checked = true;
//             chk.type = "checkbox";
//             chk.id = "chk" + random() ;
//             lbl.id = "lbl" + chk.id;
//             //lbl.for = chk.id;
//             //lbl.innerText = unique[i];
//             lbl.style.width = '150px !important';
//             lbl.style.maxWidth = '150px !important';
//             lbl.classList.add('text-truncate');
//             //lbl.classList.add('d-inline-block');
//             li.className = 'm-0 p-1 item';
//             li.nowrap = true;
//             chk.onchange = function (e) {
//                 //console.log(this.id + ":" + this.checked);

//                 var index = this.attributes['data-sort-index'].value;
//                 var rows = document.querySelector('#' + this.attributes['data-sort-tableId'].value + ' tbody').querySelectorAll('tr');
//                 for (var w = 0; w < rows.length; w++) {
//                     var td = rows[w].querySelectorAll('td')[index];
//                     var text = td.innerText.trim();
//                     var lbltext = this.nextElementSibling.innerText.trim();
//                     if (text.localeCompare(lbltext)  === 0 ) {
//                         if (this.checked)
//                             rows[w].classList.remove('hide');
//                         else
//                             rows[w].classList.add('hide');
//                     }
//                 }
//             };
//             var span = document.createElement('span');
//             span.innerText = unique[i];
//             lbl.appendChild(chk);
//             lbl.appendChild(span);
//             li.appendChild(lbl);
//             ul.appendChild(li);
//         }
//         th.style.padding = 0;
//         th.style.paddingRight = "1px";
//         th.nowrap = true;
//     }
})();

function searchTable(id,value){
    each(id,function(table){
        table.querySelectorAll('tbody tr').forEach(function(tr){
            if(tr.innerText.toLowerCase().contains((value+'').toLowerCase())) tr.classList.remove('hide');
            else tr.classList.add('hide');
        });
    });
}

// function random() {
//     return ("000000" + Math.ceil(Math.random() * 95324)).substr(-10);
// }

// function toDate(str) {
//     try {
//         var d = ((str+"").trim() + '-0-0-0').split('-');
//         var date1 = ("0000" + d[2]).substr(-4) + '-' + ("00" + d[1]).substr(-2) + '-' + ("00" + d[0]).substr(-2);
//         var date2 = ("0000" + d[0]).substr(-4) + '-' + ("00" + d[1]).substr(-2) + '-' + ("00" + d[2]).substr(-2);
//         var test1 = new Date(date1).toISOString().split('T')[0];
//         var test2 = new Date(date2).toISOString().split('T')[0];

//         //test if the date is reversed
//         if (test1 === date1) return date1.split('-');

//         //test if the date is not reversed
//         if (test2 === date2) return date2.split('-');
//     } catch (e) {
//         //console.error("JS ERROR (sortable:toDate) " + e);
//     }
//     //otherwise just give up
//     return str;
// }

// function comparator(a, b) {
    
//     //is it date
//     var d1 = toDate(a);
//     var d2 = toDate(b);

//     if (Array.isArray(d1) && Array.isArray(d2)) {
//         a = d1.join('');
//         b = d2.join('');
//     }

//     //is it numeric ?
//     if (!isNaN(a) && !isNaN(b))
//         return Number(a) === Number(b) ? 0 :  ((Number(a) > Number(b)) ? 1 : -1);

//     //then deal with it as string
//     return (a + "").localeCompare(b + "") ;    
// }

// /**
//  * takes list of lists as input, the child lists are of length=2, the child list is sorted and the return is the
//  * list of second items in the child lists
//  * 
//  * @param   {[[x,y]]} xys
//  * @param   {int}     index
//  * @param   {boolean} isAscending
//  * @returns {sortedList: [[x,y]], index: int}     sorted by x
//  */
// function sortBy(xys, index, isAscending) {
//     xys.sort(function (A, B) {
//         var a = A[0];
//         var b = B[0];
//         return comparator(a, b) * (isAscending ? 1: -1);
//     });
//     //var ys = [];
//     //for (var i = 0; i < xys.length; i++) {
//     //    ys.push( xys[i][1] );
//     //}
//     return {
//         "sortedList" : xys,
//         "index" : index
//     };
// }

// function sleep(seconds) {
//     var e = new Date().getTime() + (seconds * 1000);
//     while (new Date().getTime() <= e) { }
// }

// function sort(isAscending, btn) {
//     var th = $(btn).parents('th'); //if (th[0].id === 0) th[0].id = 'th-sortable-' + random();
//     var thead = th.parents('thead');
//     var table = thead.parents('table')[0];
//     var heads = $(table).find('thead').find('th');
//     var tbody = $(table).find('tbody');
//     var rows = tbody.find('tr');
//     var data = [];
//     var index = 0;

//     for (var x = 0; x < heads.length; x++) {
//         if (heads[x].id === th[0].id) {
//             index = x;
//             break;
//         }
//     }
//     for (var i = 0; i < rows.length; i++) {
//         var row = [];
//         var tds = $(rows[i]).find('td');
//         row.push($(tds[index]).text().trim());
//         if (rows[i].id === '') rows[i].id = 'tr-sortable-' + random();
//         row.push(rows[i].id);
//         data.push(row);
//     }
//     //console.log(data);
    
    
//     return {
//         "_sort": sortBy(data, index, isAscending),
//         "_tableId": table.id
//     };
// }

// function dosort(isAscending, btn) {
//     var th = $(btn).parents('th'); //if (th[0].id === 0) th[0].id = 'th-sortable-' + random();
//     var thead = th.parents('thead');
//     var table = thead.parents('table')[0];
//     var heads = $(table).find('thead').find('th');
//     var tbody = $(table).find('tbody');

//     var tosort = sort(isAscending, btn);
//     var sorted = tosort._sort.sortedList; // [[x,y]]
//     //var sortedItems = [];
//     for (var j = 0; j < sorted.length; j++) {
//         var tr = tbody.find('#' + sorted[j][1])[0];
//         tbody[0].appendChild(tr);
//         //sleep(1);
//     }
// }