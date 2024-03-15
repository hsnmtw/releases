/*
    interface 
        function filterResult(listOfFields:list[string])
*/
var filterinitialized = false;
var filterComparisonOptions = {
     Contains            : "%...%"
    ,DoesntContains      : "not( %...% )" 
    ,Match               : " = ?"
    ,NotMatch            : " != ?"
    ,IN                  : "in ( ... )" 
    ,NotIN               : "not in ( ... )" 
	,IsNull              : "Is NULL"
	,IsNotNull           : "Is NOT NULL"
    ,BeginsWith          : "...%"
    ,EndsWith            : "%..."
    ,DoesnotBeginWith    : "not( ...% )" 
    ,DoesnotEndWith      : "not( %... )" 
    ,GreaterThanOrEquals : "&gt;=" 
    ,LessThanOrEquals    : "&lt;=" 
    ,Between             : "between START and END"
}

var filterOptions = {};

function addFilterToForm(formSelector, filterName, filterComparisonOption, filterValue)
{
    var id = filterOptions.length;
    var row = "      <tr>" +
              "        <td nowrap><div class='ui checkbox'><input id='filterOption"+ filterName +"' name='filterOption' type='checkbox' data-filter-option='"+id+"' data-filter-name='"+ filterName +"' value='"+ filterName +"' /><label for='filterOption"+ filterName +"'>"+ filterName.fromCamelToSpaced() +"</label></div></td>" +
              "        <td nowrap>" + filterComparisonOptions[filterComparisonOption] + "</td>" +
              "        <td>" + filterValue + "</td>" +
              "      </tr>" ;
    document.querySelectorAll(formSelector).forEach(function(f){
        f.querySelectorAll('table tbody').forEach(function(t){
            t.innerHTML += row;
        });
    });
}

function addFilter(filterName,filterComparisonOption,filterValue,id){
    filterOptions[filterName] = {
        "Name"  : filterName,
        "Where" : filterComparisonOption,
        "Value" : [filterValue],
        "Id"    : id
    };
    addFilterToForm('.filterForm', filterName,filterComparisonOption,filterValue);
}

function removeFilter(filterName){
    if(!filterinitialized) initFilters();
    //filterOptions.splice(position,1);
    delete filterOptions[filterName];
    submitFilters();
}

function submitFilters(){
    var form = document.createElement('form');
    var input = document.createElement('input');
    input.type = 'hidden';
    input.setAttribute('data-filters-field','0');
    input.name = input.id = 'Filters';
    input.value = JSON.stringify(filterOptions);
    form.appendChild(input);


    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = input.id = 'SortAndFilterFields';
    input2.value = _listOfFields.join(',');
    form.appendChild(input2);

    form.method = 'GET';
    document.body.appendChild(form);
    form.submit();
}

function removeSelectedFilter(formSelector)
{
    document.querySelectorAll(formSelector).forEach(function(form){
        form.querySelectorAll('table tbody').forEach(function(tbody){
            tbody.querySelectorAll('tr').forEach(function(tr){
                tr.querySelectorAll('input[type=checkbox][data-filter-option][name=filterOption]:checked').forEach(function(checkbox){
                    //filterOptions.splice(+checkbox.attributes["data-filter-option"].value,1);
                    delete filterOptions[checkbox.attributes["data-filter-name"].value];
                    tbody.removeChild(tr);
                });
            });
        });
    });
}

function initFilters(){
    filterinitialized = true;
    var json = getValue('input[name=Filters]');
    try{
        filterOptions = {};
        if(json.superTrim() !== ''){
            
            var fs = JSON.parse( json );
            
            Object.keys(fs).forEach(function(key){
                var k = fs[key];
                addFilter(k.Name,k.Where,'"'+k.Value.join('", "').replaceAll('+',' ')+'"');
            });
        }
        
    } catch(exception) {
        console.error("EXCEPTION: "+exception+" <<" + json + " >>");
    }
}

var _listOfFields = [];
function filterResult(listOfFields)
{
    _listOfFields = listOfFields;
    var form = 
        "<form class='ui segment form filterForm' method='GET'>" +
        " <div class='three fields'>" +
        "  <div class='field'>" +
        "   <label>Filter</label>" +
        "   <select class='select2' id='filterName' autofocus>" + listOfFields.sort().map(function(f){ return "<option value='" + f + "'>" + f.fromCamelToSpaced() + "</option>"; }).join('\n') + "</select>" +
        "  </div>" +
        "  <div class='field'>" +
        "   <label>Condition</label>" +
        "   <select class='select2' id='filterComparisonOption' >" + Object.keys(filterComparisonOptions).map(function(x){ return "<option value='"+ x +"'>"+ filterComparisonOptions[x] +"</option>" }).join('\n') +"</select>" +
        "  </div>" +
        "  <div class='field'>" +  
        "   <label>Value</label>" +              
        "   <input  id='filterValue' data-placeholder='Filter Value' />" +
        "  </div>" +
        " </div>" +
        " <hr />" +
        " <button type='button' class='ui compact tiny labeled icon button' onclick='addFilter(filterName.value,filterComparisonOption.value,filterValue.value)'><i class='plus icon green'></i> Add</button>" +
        " <button type='button' class='ui compact tiny labeled icon button' onclick='removeSelectedFilter(\".filterForm\")'><i class='minus icon red'></i> Remove Selected</button>" +        
        "   <table class='stats-table' border='1'>" +
        "    <thead>" +
        "      <tr>" +
        "        <th><div class='ui checkbox'><input type='checkbox' onclick='TOGGLECHECKED(\".filterForm input[type=checkbox][data-filter-option][name=filterOption]\", this.checked)' /><label>Field</label></div></th>" +
        "        <th>Condition</th>" +
        "        <th>Value</th>" +
        "      </tr>" +
        "    </thead>" +
        "    <tbody>" +
        "    </tbody>" +
        "   </table>" +
        "</form>" 
    ;
    show.dialog({
        title: 'Filter result',
        message: form,
        onShown: initFilters,
        onApprove: submitFilters
    });
}



function submitFilterForm(selector,equality){
    var data = each('[data-filter-id]',function(x){ return [x.attributes['data-filter-id'].value, x.value]; });
    
    data.filter(function(predicate){ return predicate[1] !== ''; }).forEach(function(x){
        var filterName     = x[0];
        var filterValue    = x[1];
        var id = filterOptions.length;
        filterOptions[filterName] = ({
            "Name"  : filterName,
            "Where" : equality,
            "Value" : [filterValue],
            "Id"    : id
        });
    });
    var form = document.querySelector(selector);
    var filter = null;
    var filters = form.querySelectorAll('[data-filters-field]');
    if(filters.length === 0){
        filter = document.createElement('input');
        filter.type = 'hidden';
        filter.id = filter.name = 'Filters';
        filter.setAttribute('data-filters-field','0');
        form.appendChild(filter);
    }else{
        filter = filters[0];
    }
    filter.value = JSON.stringify(filterOptions);
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = input2.id = 'SortAndFilterFields';
    input2.value = _listOfFields.join(',');
    form.appendChild(input2);
    
    form.method = 'GET';
    form.submit();
}