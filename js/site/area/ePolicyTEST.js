
//var ePolicyTEST = {
    var JS_ePolicyTEST = {
        "Document":{
            "saveForm": function(obj,selector,callback){
                var model = SERIALIZE(selector);
                var success = function(r){
                    showAlert(r,function(r){ 
                        setValue(selector + ' #Id', r.Data); 
                        invoke(callback,r);
                    });
                };
                return obj.save(model,success);
            },
            "Template": {
                "saveForm": function(selector,success){
                    return JS_ePolicyTEST.Document.saveForm(this,selector,success);
                },
                "save": function(model,success){
                    return POST('/ePolicyTEST/ApiDocument/SaveTemplate',model,success);
                },
                "addField": function(uid){
                    var form = '<div class="ui form">'+
                               ' <div class="field">'+
                               '  <label>Name</label>'+
                               '  <input name="Name" required maxlength="50" autofocus>'+
                               ' </div>'+
                               ' <div class="field">'+
                               '  <label>Type</label>'+
                               '  <select name="DataType" required>'+
                               '   <option>SHORTTEXT</option>' +
                               '   <option>LONGTEXT</option>' +
                               //'   <option>YESNO</option>' +
                               '   <option>CHECKLIST</option>' +
                               '   <option>OPTIONS</option>' +
                               '   <option>DROPDOWN</option>' +
                               '   <option>DATE</option>' +
                               '   <option>TIME</option>' +
                               '   <option>NUMBER</option>' +
                               '  </select>'+
                               ' </div>'+
                               ' <div class="field">'+
                               '  <label>Options (separated by semi-colon \';\')</label>'+
                               '  <textarea name="Options" maxlength="1000" rows="3"></textarea>'+
                               ' </div>'+
                               '</div>';
                    show.confirm({message:form,size:'mini',onApprove:function(model){
                        model['UID'] = uid;
                        POST('/ePolicyTEST/ApiDocument/SaveTemplateField',model,showAlertThenReloadAfter2000);
                    }});
                },
                "addSigner": function(uid){
                    var form = '<div class="ui form">'+
                               ' <div class="field">'+
                               '   <label>Name</label>'+
                               '   <input name="Name" required maxlength="50" autofocus>'+
                               ' </div>'+
                               ' <div class="field">'+
                               '   <label>Username</label>'+
                               '   <input name="Username" required maxlength="50">'+
                               ' </div>'+
                               ' <div class="field">'+
                               '   <label>Workflow Level</label>'+
                               '   <select name="WorkflowLevel" required>'+
                               '     <option>1</option>'+
                               '     <option>2</option>'+
                               '     <option>3</option>'+
                               '   </select>'+
                               ' </div>'+
                               '</div>';
                    show.confirm({title:'Add Signer',message:form,size:'mini',onApprove:function(model){
                        model['UID'] = uid;
                        POST('/ePolicyTEST/ApiDocument/SaveTemplateSigner',model,showAlertThenReloadAfter2000);
                    }});
                },
                "editField": function(model){
                    show.notImplementedAlert();
                },
                "editSigner": function(model){
                    show.notImplementedAlert();
                }
            },
            "Request": {
                "saveForm": function(selector,success){
                    return JS_ePolicyTEST.Document.saveForm(this,selector,success);
                },
                "save": function(model,success){
                    return POST('/ePolicyTEST/ApiDocument/SaveRequest',model,success);
                }
            }
        }
    };

    var JS_ePolicyTEST_PolicyTemplate =  {
        "getCurrentId": function(){ return getValue('#PolicyTemplateForm #Id[data-parent-id]'); },
        ////// JSCommon //////
        "changeSignatoryOrder": function (reorderDelta, callback){
            return JSCommon.changeSignatoryOrder('/ePolicyTEST/ApiPolicyTemplate',reorderDelta,callback);
        },
    
        "loadSigners": function () {
            return JSCommon.loadSigners('/ePolicyTEST/PolicyTemplate', JS_ePolicyTEST_PolicyTemplate.getCurrentId());
        },
        "saveSignatory": function () {
            return JSCommon.saveSignatory('/ePolicyTEST/ApiPolicyTemplate');
        },
        "resetSignatoryForm": JSCommon.resetSignatoryForm,
        "editSignatory": function(signatoryId, parentRecordId){
            return JSCommon.editSignatory(signatoryId,parentRecordId,'/ePolicyTEST/ApiPolicyTemplate');
        },
        "deleteSignatory": function(callback){
            return JSCommon.deleteSignatory('/ePolicyTEST/ApiPolicyTemplate/DeleteSignatory', callback);
        },
        ////// JSCommon //////
    };
    // END [JS_ePolicyTEST_PolicyTemplate]
    
    var JS_ePolicyTEST_Policy = {

        "addLabel": function(id){
            GET('/ePolicyTEST/ApiPolicy/GetAllLabels', function(r){
                var form = '<div class="ui form modal-form">'+
                       ' <div class="ui field">'+
                       '  <label for="Label">New Label:</label>'+
                       '  <input maxlength="500" id="Label" name="Label" autofocus />'+
                       ' </div>'+
                       ' <div class="ui field list">'+
                       r.Data.map(function(label,x){
                        return ' <div class="item my-1">'+
                               '    <div class="ui checkbox hover">'+
                               '     <input  id="policy_label_'+x+'" value="'+label+'" name="SelectedLabels" type="checkbox" data-type="list">'+
                               '     <label for="policy_label_'+x+'">'+label+'</label>'+
                               '    </div>'+
                               ' </div>';
                       }).join('\n')+
                       ' </div>'+
                       '</div>';
                CONFIRM(form,function(model){
                    if(isNullOrEmpty(model.Label) && !model.SelectedLabels.any())
                    {
                        return false;
                    }
                    model.PolicyId=id;
                    PUT('/ePolicyTEST/ApiPolicy/AddLabel',model,showAlertThenReload);
                },function(){
                    FOCUS('.modal-form input[name=Label]');
                });
            });
        },
        "removeLabel": function(id,label){
            var model = {PolicyId:id,Label:label};
            DELETE('/ePolicyTEST/ApiPolicy/RemoveLabel',model,showAlertThenReload);
        },
        
        "addToWorkspace": function(policyIds){
            PUT('/ePolicyTEST/ApiPolicy/addToWorkspace',{Policies: policyIds.map(function(x){ return {PolicyId: x}; }) },function(r){
                showAlert(r,function(){
                    CONFIRM('Do you want to open your workspace?',function(){
                        top.location.href='/ePolicyTEST/policy/workspace';
                    });
                });
            });
        },
        "removeFromWorkspace": function(policyIds){
            DELETE('/ePolicyTEST/ApiPolicy/removeFromWorkspace',{Policies: policyIds.map(function(x){ return {PolicyId: x}; }) },showAlertThenReloadAfter2000);
        },

        "confirmBodyFileUpdate": function(r){
            setTimeout(hideAlert,200);
            var id = QS('[data-policy-body-file-control]').attributes['data-policy-body-file-control'].value;
            show.dialog({message:'Are you sure to update the body file for policy # ' + id + ' ?',size:'mini',onDeny:function(){},onApprove:function(model){
                XHR.POST('/ePolicyTEST/PolicyContent/Save',{Id:id,Body:r.Data},showAlert);
            }});
        },

        "showBodyUploadForm": function(id){
            QS('[data-policy-body-file-control]').value=null;
            QS('[data-policy-body-file]').value=null;
            QS('[data-policy-body-file-control]').setAttribute('data-policy-body-file-control',id);
            QS('[data-policy-body-file-control]').click();
        },

        "exportToInformationCenter": function(id){
            XHR.POST('/ePolicyTEST/ApiPolicy/ExportToInformationCenter/'+id,{Id:id},showAlert);
        },

        //////////////////////////////////////////////////////////////////////////////////////////

        "getCurrentId": function(){
            return getValue('.policy-form #Id[data-parent-id]');
        },
    
        "isCurrentUserManager": function(){
            return getValue('.policy-form #IsCurrentUserManager');
        },
    
        "isEditable": function (){
            return getValue('.policy-form #IsEditable');
        },
    
        "isDraft": function (){
            return getValue('.policy-form #IsDraft');
        },
    
        "isJD": function () {
            return [24,25].contains(getValue('.policy-form #PolicyTemplateId'));
        },
    
        ////// JSCommon //////
        "changeSignatoryOrder": function (reorderDelta, callback){
            return JSCommon.changeSignatoryOrder('/ePolicyTEST/ApiPolicy',reorderDelta,callback);
        },
        "loadSigners": function () {
            return JSCommon.loadSigners('/ePolicyTEST/Policy', JS_ePolicyTEST_Policy.getCurrentId());
        },
        "saveSignatory": function () {
            return JSCommon.saveSignatory('/ePolicyTEST/ApiPolicy');
        },
        "resetSignatoryForm": JSCommon.resetSignatoryForm,
        "editSignatory": function(signatoryId, parentRecordId){
            return JSCommon.editSignatory(signatoryId,parentRecordId,'/ePolicyTEST/ApiPolicy');
        },
        "deleteSignatory": function(callback){
            return JSCommon.deleteSignatory('/ePolicyTEST/ApiPolicy/DeleteSignatory', callback);
        },
        ////// JSCommon //////
        "changeFromEffectiveToApproved": function (id, callback) {
            XHR.PATCH('/ePolicyTEST/ApiPolicy/ChangeFromEffectiveToApproved',{"Id":id},function(r){ showAlert(r,callback); });
        },
    
        "saveDates" : function (selector) {
            var model = SERIALIZE(selector);
            model.Tag = {};
            QSA('[data-name="SignatoryApprovedOn"]').forEach(function (signatoryApproveDate) {
                model.Tag[signatoryApproveDate.attributes["data-id"].value] = {
                    "Id": signatoryApproveDate.attributes["data-id"].value,
                    "NameEn": signatoryApproveDate.attributes['data-NameEn'].value,
                    "ApprovedOn": signatoryApproveDate.attributes['data-date-value'].value
                };
            });
            QSA('[data-name="SignatoryApprovedAt"]').forEach(function (signatoryApproveTime) {
                model.Tag[signatoryApproveTime.attributes["data-id"].value].ApprovedOn += ' ' + signatoryApproveTime.value;
            });
            model.Tag = JSON.stringify(model.Tag);
            XHR.PATCH('/ePolicyTEST/ApiPolicy/FixDates',model,function (r) {
                showAlert(r, reloadAfter2000, dialogAlert);    
            });
        },
    
        "addNote": function(policyId, comments){
            XHR.PUT('/ePolicyTEST/ApiPolicy/AddNote/'+policyId,{"Comment": comments, "PolicyId": policyId}, function(r){ 
                showAlert(r,function(){ 
                    GETHTML('/ePolicyTEST/Policy/Notes/'+policyId,'.PolicyNotes'); 
                }); 
            });
        },
    
        "sign": function (policyId,status,comments,onSuccess){
            //JSCommon.sign('.approve-reject-form', status, function (smodel) {
                var model = { 
                 "Comments": comments.superTrim().replace("approval/rejection comments ...",""),
                 "PolicyId": policyId,
                 "Status": status
                }; 
                XHR.PATCH('/ePolicyTEST/ApiPolicy/Sign/'+policyId+'/'+status, model, function (r) {
                    HIDE('[data-record-id="'+policyId+'"]');
                    showAlert(r, onSuccess);
                });
            //});
        },
    
        
        "activateEffectiveOn": function(checkbox){
            each('.policy-form [name="EffectiveOn"]',function(effectiveOn){
                effectiveOn.disabled = effectiveOn.readonly = checkbox.checked;
            });
    
        },
    
        "lock": function (policyIds, callback) {
            JS_ePolicyTEST_Policy.changeLockStatus(true, policyIds, callback);
        },
    
        "unlock": function (policyIds, callback) {
            JS_ePolicyTEST_Policy.changeLockStatus(false, policyIds, callback);
        },
    
        "reorderSignatories": function(orderby){
            var tbody = QS('[data-signatories-list]');
            var trs = QSA('[data-signatory-record]');
            var by = '';
            if('PrintOrder' === orderby){
                by = 'data-signatory-order';
            }else if('ApprovedOn' === orderby){
                by = 'data-approve-order';
            }else if('Historical' === orderby){
                by = 'data-historical-order';
            }
            var order = trs.map(function(x){ return Number(x.attributes[by].value); }).sorted();
            order.forEach(function(id){
                tbody.appendChild( QS('tr[data-signatory-record]['+by+'="'+ id +'"]') );
            });

        },
    
        "changeLockStatus": function (locked, policyIds, callback) {
            XHR.GET('/ePolicyTEST/Policy/All?IsPartial=true&' + policyIds.map(function(id){ return 'Ids=' + id; }).join('&') , function(r){
                
                var message = '<div>'+
                              ' <div class="ui message warning visible">'+
                              '  The following policies will be [ <i class="'+ (locked ? 'green lock' : 'orange unlock') +' icon"></i>' + (locked ? 'L' : 'Unl') + 'ocked ], to proceed click OK.'+
                              ' </div>' + r + 
                              '</div>';
                

                CONFIRM(message,function(model){
                    XHR.PATCH('/ePolicyTEST/ApiPolicy/ChangeLockFlag/'+ locked +'/'+ encodeURIComponent(policyIds.join(',')), {}, function(r) {
                        showAlert(r, function(r) { 
                            if(typeof callback === 'function') r.Data.forEach(callback);
                        });
                    });
                });
            });
        },
    
        "showPendingChangeRequests": function(id, isManager){
            ['.policy-form input','.policy-form select','.policy-form button'].forEach(DISABLE);
            ENABLE('.policy-form .PoliciesChangeRequests input[type="checkbox"]');
            if(isManager)
            {
                selectTab('.PolicyTabsContainer','tab3');
                var filters = {
                    "Status":{"Name":'Status',"Where":'IN',"Value":['Pending']}
                };
                DIALOG(null,'/ePolicyTEST/Policy/ChangeRequests?isPartial=true&Id='+JS_ePolicyTEST_Policy.getCurrentId()+'&Filters='+encodeUrlJSON(filters),'This policy has some pending change request(s):');
                
                //show.alert("");
            }
        },
        "reporthandle" : null,
    
        "lookup": function(input, callback){
            if(typeof input.attributes['data-lookedup'] === 'undefined'){
                input.setAttribute('data-lookedup','false');
            }
            if(input.value === '' || input.attributes['data-lookedup'].value !== 'false') return;
            input.setAttribute('data-lookedup', 'lookup');
            LOOKUP('/api/ApiCommon/SearchPolicies?query='+ encodeURIComponent(input.value),'IndexNumber', input.value,['IndexNumber','Title','Template','Department','PolicyId','Status'], function(r){
                input.value=r.IndexNumber;
                invoke(callback,r);
            })
        },
    
        "updateDates" : function(button, selector, id){
            XHR.POSTFORM(button,selector,'/ePolicyTEST/ApiPolicy/UpdatePolicyDates/'+id,closeDialogAfterSave);
        },
    
        "embedPDF" : function(id, selector){
            var html = "  <div class='ui progress teal' data-precent='0'>" +
                       "    <div class='bar'></div>" +
                       "  </div>";
            SETHTML(selector, html);
            JS_ePolicyTEST_Policy.generateReport(id, function(){
                $('.ui.progress').progress({"percent": 100 });
                //clearInterval(JS_ePolicyTEST_Policy.reporthandle);
                setTimeout(function () {
                    PDFObject.embed('/ePolicyTEST/Download/Policy/'+id+'?isEmbed=true', selector);
                },1000);
            });
        },
    
        //
        "embedPDFAttachments" : function(id, selector){
            PDFObject.embed('/ePolicyTEST/Download/PolicyAttachments/'+id+'?isEmbed=true', selector);
        },
    
        "previewAttachments": function(id){
            
            show.dialog({
                "size": 'extra-large',
                "title": 'Preview Policy: ' + id + ' Attachements',
                "message": '<div class="policy-attachments-preview"></div>',
                "onShown": function(){
                    JS_ePolicyTEST_Policy.embedPDFAttachments(id, '.policy-attachments-preview');
                }
            });
        },
    
        "PREVIEW": function(id) {
            
            show.dialog({
                "onEscape": function(){ return true; },
                "title": 'PDF PREVIEW OF POLICY # ' + id,
                "message": '<div class="PreviewTabsContainer">'+
                           ' <div class="ui top attached tabular menu">' +
                           '   <a data-tab="tab1" class="item active" href="#" onclick="selectTab(\'.PreviewTabsContainer\',\'tab1\')"><i class="ui file outline red pdf icon"></i> POLICY</a>' +
                           '   <a data-tab="tab2" class="item       " href="#" onclick="selectTab(\'.PreviewTabsContainer\',\'tab2\')"><i class="ui file outline red pdf icon"></i> HISTORY</a>' +
                           '   <a data-tab="tab3" class="item       " href="#" onclick="selectTab(\'.PreviewTabsContainer\',\'tab3\')"><i class="ui file outline red pdf icon"></i> ATTACHMENTS</a>' +
                           '   <a data-tab="tab4" class="item       " href="#" onclick="selectTab(\'.PreviewTabsContainer\',\'tab4\')"><i class="ui file outline red pdf icon"></i> COMBINED</a>' +
                           ' </div>' +
                           ' <div data-tab="tab1" class="ui bottom attached tab active pdfobject pdf-preview pdf-policy">' +
                           '   <!--<div class="ui active dimmer">' +
                           '      <div class="ui text loader">Loading</div>' +
                           '   </div>-->' +
                           '   <p style="color:whitesmoke">Please wait while the report is being generated !</p>' +
                           '   <div class="ui progress orange" data-precent="0">' +
                           '    <div class="bar"></div>' +
                           '   </div>' +
                           ' </div>'+
                           ' <div data-tab="tab2" class="ui bottom attached tab pdfobject pdf-preview pdf-history"></div>' +
                           ' <div data-tab="tab3" class="ui bottom attached tab pdfobject pdf-preview pdf-attachments"></div>' +
                           ' <div data-tab="tab4" class="ui bottom attached tab pdfobject pdf-preview pdf-combined"></div>' +
                           '</div>',
                "onShown": function () {
                    
                    XHR.GET('/ePolicyTEST/Download/Policy/'+id, function(){
                        PDFObject.embed('/ePolicyTEST/Download/Policy/'+id+'?isEmbed=true', '.PreviewTabsContainer .pdf-policy', pdfobjectoptions);
                        PDFObject.embed('/ePolicyTEST/Download/PolicyHistory/'+id+'?isEmbed=true', '.PreviewTabsContainer .pdf-history', pdfobjectoptions);
                        PDFObject.embed('/ePolicyTEST/Download/PolicyAttachments/'+id+'?isEmbed=true', '.PreviewTabsContainer .pdf-attachments', pdfobjectoptions);
                        PDFObject.embed('/ePolicyTEST/Download/PolicyCombined/'+id+'?isEmbed=true', '.PreviewTabsContainer .pdf-combined', pdfobjectoptions);
                    });
                    JS_ePolicyTEST_Policy.getReportProgress(id);
                    
                },
                "size": 'extra-large',
                "animate": true,
            });
        },
    
        "openForApproval": function(kind,id){
            var url = '/ePolicyTEST/'+kind+'/Open/'+id+'?isPartial=true';
            var header = 'Approval View for '+kind+' # '+id;
            var kindJS = ['Policy','Job Description'].contains(kind) ? 'JS_ePolicyTEST_Policy' : 'JS_ePolicyTEST_PolicyTermination';
            
            return GET(url,function(r){ //POPUP(url,'fullscreen', function(){
                SETBODY(r);
                top.location.href = '#loc='+url.split('?').first(); 
                window[kindJS].embedPDF(id, '.pdfobject.policyreport');
                if(kindJS === 'JS_ePolicyTEST_Policy') JS_ePolicyTEST_Policy.embedPDFAttachments(id, '.pdfobject.attachments');
            });
        },
    
        "setSaveButtonsEnabled": function(){
            each('.button[name="perform"]',function(btn){
                btn.classList.remove('loading');
                btn.disabled = false;
            });
        },
    
        "setSaveButtonsDisabled": function(){
            each('.button[name="perform"]',function(btn){
                btn.classList.add('loading');
                btn.disabled = true;
            });
        },
    
        "openReport" : function (id, index, type){
            var title = ['Policy # ',id,' (',index,') ', type].join('');
            var url   = ['/ePolicyTEST/Policy/GetFile/',id,'?fileType=',type].join('');
            PREVIEW(title, url, function(whendone){ JS_ePolicyTEST_Policy.generateReport(id, whendone); });
        },
        
        "resetReports" : function(id){
            return XHR.GET('/ePolicyTEST/ApiPolicy/ResetReports/'+id,function(r){
                showAlert(r, function () {
                    setTimeout(function () {
                        top.location.reload();
                    }, 2500);
                })
            });
        },
    
        "getReportProgress": function (id){
            XHR.GET('/ePolicyTEST/Download/GetProgress/'+id, function(percentage){
                var r = (+percentage);
                consolelog("report progress: " + r);
    
                var progress = $('.ui.progress');
                if(progress === null || r >= 99) {// || r < 0) {
                    if(r > 0) progress.progress({"percent": 100 });
                    return true; //clearInterval(JS_ePolicyTEST_Policy.reporthandle);
                }
    
                progress.progress({"percent": r >= 0 ? r : [0,25,50,75][(Math.random()*1000) % 4]});
    
                if(r >= 0 && r < 100) setTimeout(function () { JS_ePolicyTEST_Policy.getReportProgress(id); }, 500);
            });
        },
    
        "generateReport": function (id, whendone){
            $('.ui.progress').progress();
            setTimeout(function () { JS_ePolicyTEST_Policy.getReportProgress(id); }, 500);
            return XHR.GET('/ePolicyTEST/ApiPolicy/GeneratePDF/'+id, function (r) {
                var progress = $('.ui.progress');
                if(progress !== null) {
                    progress.progress({"percent": 100 });
                    //clearInterval(JS_ePolicyTEST_PolicyTermination.reporthandle);
                }
    
                invoke(whendone,r);
                
                if(typeof r.Status !== 'undefined' && !r.Status === 'success') {
                    show.hideAll();
                    show.alert('<pre class="danger">'+ r.Message+'</pre>');
                }
            },function(){});
            
        },
    
    
        "archive": function (id) {
        
            GETCONFIRM('/ePolicyTEST/Policy/ConfirmRevision/'+id,function(model){
                if(!model.agree) return ALERTS.WARNING('Action was cancelled because you have not checked "Yes" to agree.');
                if(isNullOrEmpty(model.Justification)) return ALERTS.WARNING('Justification is required');

                XHR.PATCH('/ePolicyTEST/ApiPolicy/Revision/'+id, model, showAlert);
            });
        },
    
        "reloadForm": function (id) {
            if (isNullOrEmptyOrZero(id)) id = JS_ePolicyTEST_Policy.getCurrentId();
            XHR.GET('/ePolicyTEST/Policy/Form/' + id + '?isPartial=true&_='+makeid(7), function (r) {
                each('.PolicyForm', function(el){
                    el.parentElement.innerHTML = r;
                    initSelect2();
                    initDatePickers();
                    if(['Deleted','Terminated'].contains(getValue("#Status"))) disableForm();
                });
            });
        },
    
        "withdraw": function (id) {
            JS_ePolicyTEST_Policy.getJustificationForChange("Confirmation to withdraw policy # " + id, function(justification){
                XHR.PATCH('/ePolicyTEST/ApiPolicy/Withdraw/'+id, {"PolicyId": id, "Justification": justification}, showAlert);
            });
        },
    
        "cancelChangeRequests": function (listOfPolicyChangeRequests, callback){
            XHR.PATCH('/ePolicyTEST/ApiPolicy/CancelChangeRequests',{"Requests": listOfPolicyChangeRequests},function(r){
                showAlert(r, callback);
            });
        },
    
        "checkIfDuplicate": function (field,callback){return;
            var input = QS('.policy-form [name="'+ field +'"]');
            var policyId = JS_ePolicyTEST_Policy.getCurrentId();
    
            input.classList.remove('duplicate');
            input.setAttribute('data-duplicate',"false");
            hideAlert();
            if(input.value !== '') {
                XHR.POST('/ePolicyTEST/ApiPolicy/CheckIfDuplicate/'+policyId,{"Id":policyId,"Title":input.value.trim(),"IndexNumber":input.value.trim(),"Tag":field},function(r){
                    if(typeof r.Status !== 'undefined' && r.Status === 'success'){
                        invoke(callback,r);
                    }else{
                        if(typeof r.Message !== 'undefined' && typeof r.Data !== 'undefined' && typeof r.Data.Id !== 'undefined') 
                            r.Message = ' | <a class="ui link" target="_blank" href="/ePolicyTEST/Policy/Form/'+ r.Data.Id +'">'+ r.Data.Id +'</a>'
                        showAlert(r);
                        input.setAttribute('data-duplicate',"true");
                        input.classList.add('duplicate');
                    }
                });
            }
        },
    
        
    
        "getJustificationForChange": function (message, onSuccess){
            if(typeof message === 'function'){
                onSuccess = message;
                message = '';
            }
    
            var form ="<div><div data-bootbox-alert></div><form data-bootbox-form class='ui segment form'>"+
                    message +
                    "  <div class='field'>"+
                    "   <label>Reason / Justification</label>"+
                    "   <textarea autofocus onblur='JSCommon.fixCapitalization(this)' rows='3' data-justification required id='justification' name='justification' maxlength='500' data-placeholder='Reason / Justification for this change'></textarea>"
                    "  </div>"+
                    "</form></div>";

            show.confirm({
                "size": 'mini',
                "title": 'Update policy justification',
                "message": form,
                "onDeny": function(){
                    each('.ui.button',function(b){ toggleButtonsLoading(b,false); });
                },
                "onApprove": function(model){
                    var justification = model.justification;
                    justification = distinct(justification.split(' ')).join(' ');
                    if (isNullOrEmpty(justification)){//} || justification.trim().length<10 || justification.trim().indexOf(' ') === -1 || justification.trim().split(' ').length < 3) {
                        return dialogAlert({"Status":'warning',"Message":'Justification cannot be empty or null, must be composed of meaningful three words sentence at least',"Data":null});
                    }
                    var filters = {"PolicyId":{"Name":'PolicyId',"Where":'IN',"Value":[JS_ePolicyTEST_Policy.getCurrentId()]}};
                    GETHTML('/ePolicyTEST/Policy/ChangeRequests?isPartial=true&Filters='+encodeUrlJSON(filters),'.pcr0');
                    invoke(onSuccess,justification);
                }
            });
            
        },
    
        "delete": function (id) {
            JS_ePolicyTEST_Policy.getJustificationForChange("<span class='danger'>Confirmation to delete policy # " + id + "</span>",function(justification){
                XHR.DELETE('/ePolicyTEST/ApiPolicy/Delete/'+id, {"Id": id, "Tag": justification}, showAlert);
            });
        },
    
        "notifyRequest": function (id, requestType) {
            var tr = QS('tr#PolicyRequest'+id);
            tr.style.backgroundColor = 'cornsilk';
            XHR.POST('/ePolicyTEST/ApiPolicy/NotifyRequest/'+id,{"Id":id, "RequestType": requestType}, function(r){
                showAlert(r, function(){
                    HIDE(tr);
                });
            });
        },
    
        "notifySignatory": function (policyId, id) {
            HIGHLIGHT('tr#PolicySignatory'+id);
            XHR.POST('/ePolicyTEST/ApiPolicy/NotifySignatory/'+policyId+'/' + id, function(r){
                showAlert(r,function(){ HIDE('tr#PolicySignatory'+id); });
            });
        },
    
        "notifySignatoryTermination": function (id) {
            HIGHLIGHT('tr#PolicyTerminationSignatory'+id);
            XHR.POST('/ePolicyTEST/ApiPolicyTermination/NotifySignatory/' + id, function(r){
                showAlert(r,function(){ HIDE('tr#PolicyTerminationSignatory'+id); });
            });
        },
    
        
        "autoApprove" : function(id){
            PATCH('/ePolicyTEST/ApiPolicy/AutoApprove/'+id,function(r){ showAlert(r, function(){
                JS_ePolicyTEST_Policy.reloadForm(id);
            }) });
        },
    
    
    
        "validateThisForm": function () {
    
            var model = SERIALIZE('.policy-form');
    
            if (model.Body === '') 
                return ALERTS.WARNING('must select a word document file to upload');
            
            if (model.PolicyTemplateId < 1)
                return ALERTS.WARNING('policy template must be selected');
            
            if (model.DepartmentEn === 'UNKNOWN-DEPARTMENT-NOT-SELECTED')
                return ALERTS.WARNING('department must be selected');
            
            return VALIDATEFORM('.policy-form');
        },
    
        "save": function (newStatus) {
    
            if (!JS_ePolicyTEST_Policy.validateThisForm()) return dialogAlert({
                Status: 'warning',
                Message: 'The form failed validation',
                Data: null
            });
    
            var onSuccess = function (r) {
                var id = r.Data;
                if(JS_ePolicyTEST_Policy.getCurrentId() != id){
                    setTimeout(function () { top.location.href = '/ePolicyTEST/Policy/Form/' + id; }, 1500);
                }else{
                    setTimeout(function () { 
                        JS_ePolicyTEST_Policy.reloadForm(id);  
                        JS_ePolicyTEST_Policy.setSaveButtonsEnabled();
                    }, 2500);
                }
            };
    
            if (newStatus === 'Submitted') {
                const signatoryGroups = each('[data-signatory-group]',function(el) {
                    return { 
                        "name":  el.attributes['data-signatory-group'].value,
                        "count": +('0'+el.attributes['data-signatory-group-count'].value)
                    };
                });

                const noSignatory = signatoryGroups.filter(g => g.count == 0);

                if(noSignatory.any()){
                    showAlert({Status:'warning',Message:'You need to add at least on signatory in groups: ' + noSignatory.map(g => g.name),Data:noSignatory});
                    return false;
                }

                const hasCommitteeMeetingBeenConducted = QSA('.policy-form #HasCommitteeMeetingBeenConducted_Yes:checked').any();
                const committeeMeetingDate = getValue('.policy-form #CommitteeMeetingDate');

                var message = "<div class='ui form'><div class='ui segment' data-bootbox-confirm-tc><strong>Are you sure to submit this document for approval?</strong>" + 
                              " <div class='ui visible negative icon message'>"+
                              "  <i class='ui question circle yellow icon'></i>"+
                              "  <div class='content list'>"+
                              "   <div class='item p-2'><div class='ui checkbox'><input name='cb1' data-type='boolean' value='true' type='checkbox' id='xcb1'><label for='xcb1'>The Body / Content file is freezed for modifications.</label></div></div>" +
                              "   <div class='item p-2'><div class='ui checkbox'><input name='cb2' data-type='boolean' value='true' type='checkbox' id='xcb2'><label for='xcb2'>Once status is changed to Effective, it cannot be withdrawn, but can be revisioned.</label></div></div>" +
                              "   <div class='item p-2'><div class='ui checkbox'><input name='cb3' data-type='boolean' value='true' type='checkbox' id='xcb3'><label for='xcb3'>I have read and reviewed the contents of the Body file, and it is accurate and ready for submission.</label></div></div>" +
                              "   <div class='item p-2'><div class='ui checkbox'><input name='cb4' data-type='boolean' value='true' type='checkbox' id='xcb4'><label for='xcb4'>The effective date can be set only after all signatories approve and the status is changed to Approved.</label></div></div>" +            
                              "  </div>"+
                              " </div>"+
                              " <div class='ui info message visible'>Please note: The Body file cannot be modified even when the policy is unlocked for modification.</div>"+
                              " "+
                              ' <hr> '+
                              '  <fieldset class="hide">'+
                              '      <legend>QPS Committee Meeting</legend>'+
                              '      <div class="two fields">'+
                              '          <div class="field">'+
                              '              <label>Was the policy approved in QPS committee?</label>'+
                              '              <div class="ui radio checkbox">'+
                              '                  <input id="xHasCommitteeMeetingBeenConducted_Yes" name="xHasCommitteeMeetingBeenConducted" type="radio" value="true" data-type="boolean" '+ ( hasCommitteeMeetingBeenConducted ? 'checked' : '') +'>'+
                              '                  <label for="xHasCommitteeMeetingBeenConducted_Yes">Yes</label>'+
                              '              </div>'+
                              '              <div class="ui radio checkbox">'+
                              '                  <input id="xHasCommitteeMeetingBeenConducted_No" name="xHasCommitteeMeetingBeenConducted" type="radio" value="false" data-type="boolean" '+ (!hasCommitteeMeetingBeenConducted ? 'checked' : '') +'>'+
                              '                  <label for="xHasCommitteeMeetingBeenConducted_No">No</label>'+
                              '              </div>'+
                              '          </div>'+
                              '          <div class="field">'+
                              '              <label>Committee meeting Date</label>'+
                              '              <input data-toggle="datepicker"  name="xCommitteeMeetingDate" type="text" data-date-value="'+ committeeMeetingDate +'" value="'+ committeeMeetingDate.split('-').reverse().join('-') +'">'+
                              '          </div>'+
                              '      </div>'+
                              '  </fieldset></div></div>';
                
    
                show.dialog({
                    "title": 'Confirmation to submit ' + (JS_ePolicyTEST_Policy.isJD() ? 'Job Description' : 'Policy') + ' # ' + JS_ePolicyTEST_Policy.getCurrentId(),
                    "message": message,
                    "onDeny": function(){
                        //JS_ePolicyTEST_Policy.saveForm(newStatus, onSuccess, JS_ePolicyTEST_Policy.setSaveButtonsEnabled);
                    },
                    "onApprove": function(model){
                        console.log('onApprove');
                        const checkboxes = QSA('[data-bootbox-confirm-tc] input[type="checkbox"]:checked');
                        if(checkboxes.length < 4) return false;
                        const radios = QSA('[data-bootbox-confirm-tc] input[type="radio"]:checked');
                        if(radios.length < 1) return false;
                        

                        TOGGLECHECKED('.policy-form #HasCommitteeMeetingBeenConducted_Yes', model.xHasCommitteeMeetingBeenConducted);
                        TOGGLECHECKED('.policy-form #HasCommitteeMeetingBeenConducted_No', !model.xHasCommitteeMeetingBeenConducted);
                        setValue('.policy-form #CommitteeMeetingDate', model.xCommitteeMeetingDate);


                        JS_ePolicyTEST_Policy.saveForm(newStatus, onSuccess, JS_ePolicyTEST_Policy.setSaveButtonsEnabled);
                        return true;
                    }
                });
            } else {
                JS_ePolicyTEST_Policy.saveForm(newStatus, onSuccess, JS_ePolicyTEST_Policy.setSaveButtonsEnabled);
            }
        
        },
    
        "saveForm": function (newStatus, onSuccess, onFailure) {
            //$('button').prop('disabled', true);
            //QSA('button').forEach(function (x) { x.className = 'hide'; });
            
    
            if(QS('button[name="perform"]').classList.contains('loading')) return;
    
            JS_ePolicyTEST_Policy.setSaveButtonsDisabled();
    
            each('input[type="text"],input[type=""],input:not([type]),textarea', function(el){ el.value = el.value.superTrim(); });
    
            var model = SERIALIZE('.policy-form'); //$('form').serializeArray();
            
            if(typeof newStatus === 'undefined') newStatus = model.Status;
    
            if(model.Status === 'Deleted') return ALERTS.WARNING('Deleted Policy cannot be updated');
            
            if(model.Status === 'Approved' && !model.IsAutomaticEffectiveOn && !model.IsLocked && !isNullOrEmpty(model.EffectiveOn)){
                var message = '<div class="ui segment">This policy is in ' +
                              ' <i class="green circle check icon"></i>' +
                              '<em>Approved</em> status and also <i class="unlock icon orange"></i> Unlocked <hr />' +
                              '<div class="ui message visible info">'+
                              ' Please note that once you save this form, '+
                              ' the status will be changed to <b style="color:navy">Effective</b>'+
                              ' and the record will be locked <i class="green lock icon"></i> for modification' +
                              '</div>'+
                              '</div>';
                return show.confirm(message,function(response){
                    if(!response) {
                        invoke(onFailure);
                        return true;
                    }
                    JS_ePolicyTEST_Policy.confirmBeforeSave (model, newStatus, function(){ setTimeout(function(){ top.location.reload(); },1500) },onFailure);
                });
            }
            
            JS_ePolicyTEST_Policy.confirmBeforeSave (model, newStatus, onSuccess, onFailure);
        },
    
        "confirmBeforeSave": function(model, newStatus, onSuccess, onFailure){
            if(['Reopened','Draft'].contains(model.Status))
            {
                if (newStatus === 'Submitted') {
                    model.Status = "Submitted";
                }
                return JS_ePolicyTEST_Policy.update(newStatus, model, onSuccess,onFailure);
            } 
            else
            {
                JS_ePolicyTEST_Policy.getJustificationForChange("Confirmation to change policy # " + model.Id + " properties",function(justification){
                    model.Tag = justification;
                    JS_ePolicyTEST_Policy.update(newStatus, model, onSuccess,onFailure);
                });
            }
        },
    
        "update": function (newStatus, model, onSuccess, onFailure){
            XHR.POST('/ePolicyTEST/ApiPolicy/Save/' + model.Id + '/' + newStatus, model, function (r) {
                showAlert(r,onSuccess, onFailure);
            });
        },
    
        "reloadTemplateSignatories": function(){
            var model = SERIALIZE('.policy-form');
            var templateId = model.PolicyTemplateId;
            JS_ePolicyTEST_Policy.update(model.Status, model, function(r){
                XHR.GET('/ePolicyTEST/PolicyTemplate/SignatoriesList/' + templateId, function (r) {
                    var templateName = QS('.policy-form #PolicyTemplateId.select2 option[value="'+ templateId +'"]').innerText;
                    var message = '<div class="ui message attached visible">Confirmation !</div><div class="ui segment attached signatories-dialog">' +
                                '<p class="ui warning visible message">This will delete all current signatories '+ 
                                ' and load the signatories from template, are you sure to proceed with this action?</p>'+
                                '<h5><u>'+ templateName +'</u></h5>'+
                                '<small>'+r+'</small>'+
                                '</div>';
                    CONFIRM(message, function(){
                        XHR.PATCH('/ePolicyTEST/ApiPolicy/LoadTemplateSignatories/'+JS_ePolicyTEST_Policy.getCurrentId(), function (r) {
                            showAlert(r,JS_ePolicyTEST_Policy.loadSigners);
                        });
                    });
                });
            }, function(){
                each('button[name="perform"]', function(b){
                    b.classList.remove('loading');
                    b.disabled = false;
                });
            });
        },
    
        
    
        "openPolicySignatory": function(policySignatoryId){
    
        },
    
        "hidePDF": function () {
            HIDE('.pdf-button');
        },
    
        
    
        "previewAudit": function (id) {
            XHR.GET('/ePolicyTEST/Policy/History/' + id, function (r) {
                show.dialog({ title: "Policy History #" + id, size: 'extra-large', message: r });
            });
        },
    
        "expandVersionSignatories": function(versionId){
            var detail = QS('[data-version-signatories="'+versionId+'"]');
            var button = QS('#ExpandVersionSignatories'+versionId+'Button');
            var expand = button.attributes["data-toggle-expand"].value === "+";
            if(expand){
                button.setAttribute('data-toggle-expand','-');
                button.innerHTML = '<i class="ui minus icon"></i>';
                detail.classList.remove('hide');
            }else{
                button.setAttribute('data-toggle-expand','+');
                button.innerHTML = '<i class="ui plus icon"></i>';
                detail.classList.add('hide');
            }
        },
    
        "expandRequestDetails": function (UID){
            var details = QSA('#Detail'+UID);
            var buttons = QSA('#Detail'+UID+'Button');
            for(var i=0;i<details.length;i++){
                var detail = details[i];
                var button = buttons[i];
                var expand = button.attributes["data-toggle-expand"].value === "+";
                if(expand){
                    button.setAttribute('data-toggle-expand','-');
                    button.innerHTML = '<i class="ui minus icon"></i>';
                    detail.classList.remove('hide');
                }else{
                    button.setAttribute('data-toggle-expand','+');
                    button.innerHTML = '<i class="ui plus icon"></i>';
                    detail.classList.add('hide');
                }
            }
        },
    
        "setSignatoryDate": function (policyId, id, approveDate) {
            if(QSA('input[name="IsAutomaticSignatoryApprovedOn"]:checked').length > 0) {
                return ALERTS.WARNING('Not allowed because this policy setting disallows manual update of signatory date');
            }

            var date = (''+approveDate).split(' ').first().split('-').reverse().join('-');
            var time = (''+approveDate).split(' ').last();

            var form = "<div class='ui form'>" +
                       " <div class='two fields'>"+
                       "  <div class='field'><label>Date</label><input name='DateValue' data-toggle='datepicker' value='"+date+"' autofocus /></div>" +
                       "  <div class='field'><label>Time</label><input name='TimeValue' type='time' step='1' value='"+time+"' /></div>"+
                       " </div>"+
                        ((isNullOrEmpty(approveDate) || JS_ePolicyTEST_Policy.isCurrentUserManager() || JS_ePolicyTEST_Policy.isEditable()) == false ? "<div class='field'><label>Justification</label><textarea onblur='JSCommon.fixCapitalization(this)' maxleength='500' rows='3' data-placeholder='Reason / Justification' name='Comments'>The date and time is modified to align with policy issue date</textarea></div>" : "<input type='hidden'  name='Comments' value='In Draft, Reopened, or Unlocked mode, or initial date to be set.' />") +
                       "</div>";
            
            show.dialog({
				message:form,
				size:'mini',
				onDeny: function(){},
				onApprove:function(model){
					model.Id = id;
					model.PolicyId = policyId; 
					model.ApprovedOn = [model.DateValue, model.TimeValue].join(' '); 
					model.PolicySignatoryId = id;
					model.Justification = model.Comments;
					XHR.PATCH('/ePolicyTEST/ApiPolicy/UpdateSignatoryDate/'+policyId+'/'+id, model, function (r) {
						showAlert(r,function(r){
							if(!JS_ePolicyTEST_Policy.isEditable()) return dialogAlert(r);
							var approvedOn = [model.DateValue.split('-').reverse().join('/'), model.TimeValue].join(' ');
							setInnerText("#SignatoryApprovedOn-" + id, approvedOn);
							each('#PolicySignatory_' + id +'[data-date-value]', function(x){ x.setAttribute('data-date-value',approvedOn); });
						});
					});
				}
			});
            
        },
    
        //////////////////////////////////////////////////////////////////////////////////////////////////////
    
        "loadVersions": function (callback) {
            var modelId = JS_ePolicyTEST_Policy.getCurrentId();
            XHR.GET('/ePolicyTEST/Policy/Versions/' + modelId, function (r) {
                QS('.versions').innerHTML = r;
                invoke(callback);
            });
        },
    
    
        "loadAttachments": function (callback) {
            var modelId = JS_ePolicyTEST_Policy.getCurrentId();
            XHR.GET('/ePolicyTEST/Policy/Attachments/' + modelId, function (r) {
                QS('.attachments').innerHTML = r;
                invoke(callback);
            });
        },
    
        "changeAttachmentOrder": function (id, delta, callback) {
            XHR.PATCH('/ePolicyTEST/ApiPolicy/ChangeAttachmentOrder/'+ JS_ePolicyTEST_Policy.getCurrentId() +'/' + id + '/' + delta, function (r) {
                showAlert(r);
                if (typeof r.Status !== 'undefined' && r.Status === 'success') {
                    JS_ePolicyTEST_Policy.loadAttachments(callback);
                }
            });
        },
    
        "deleteAttachment": function (id) {
            CONFIRM("Are you sure to delete this attachment?", function () {
     
                XHR.DELETE('/ePolicyTEST/ApiPolicy/DeleteAttachment/'+ JS_ePolicyTEST_Policy.getCurrentId() +'/' + id, function (r) {
                    showAlert(r);
                    JS_ePolicyTEST_Policy.loadAttachments(function () { });
                    JS_ePolicyTEST_Policy.hidePDF();
                });
            });
        },
    
        "addAttachment": function (id, filename, filepath) {
            var model = { 
                "AttachmentName": filename, 
                "FilePath": filepath, 
                "FileType": 'PDF', 
                "PolicyId": id, 
                "SortOrder": 1, 
                "Version": 1 
            };
            XHR.PUT('/ePolicyTEST/ApiPolicy/AddAttachment/' + id, model, function (r) {
                showAlert(r, function(r){
                    JS_ePolicyTEST_Policy.loadAttachments(function () { });
                    JS_ePolicyTEST_Policy.hidePDF();
                });
            });
        },
    
    
    
        "showRequest": function (form, requestId, requestType){
            return show.dialog({
                "size": 'large',
                "title": 'Pending Change Request',
                "message": form,
                "onApprove": function(){
                    var model = { "PolicyRequestType": requestType, "RequestId": requestId, "Status": 'Approved' };
                    XHR.PATCH('/ePolicyTEST/ApiPolicy/ReviewChangeRequest/'+requestId,model,function(r){
                        showAlert(r, function(){ JS_ePolicyTEST_Policy.reloadForm(JS_ePolicyTEST_Policy.getCurrentId()); });
                    });
                    return true;
                },
                "onDeny": function(){
                    var model = { "PolicyRequestType": requestType, "RequestId": requestId, "Status": 'Rejected' };
                    XHR.PATCH('/ePolicyTEST/ApiPolicy/ReviewChangeRequest/'+requestId, model, showAlert);
                    return true;
                }
                
            });
        },
    
    
        "hideRequest": function (requestType,r){
            showAlert(r, function(){
                var tr = QS('tr#'+requestType+'Request'+r.Data);
                tr.parentElement.removeChild(tr);
            });
        },
    
        "setRequestStatus": function (id,status,plolicyRequestType,uniqueRequestId){
            DISABLE('[data-approve-reject-button]');
            QS('tr#'+plolicyRequestType+'Request'+id).style = 'background-color: cornsilk';
            var model = { "PolicyRequestType": plolicyRequestType, "Status": status, "RequestId": id, "UID": uniqueRequestId };
            XHR.PATCH('/ePolicyTEST/ApiPolicy/ReviewChangeRequest/'+uniqueRequestId,model, function(r){ 
                JS_ePolicyTEST_Policy.hideRequest(plolicyRequestType,r); 
                ENABLE('[data-approve-reject-button]'); 
            });
        },

        "reviewChangeRequest": function(uniqueRequestId,status,callback){
            var loadingdlg = showLoading();
            if(isNullOrEmpty(uniqueRequestId)) uniqueRequestId=-1;
            if(isNullOrEmpty(status)) status = 'Rejected';
            XHR.POST('/ePolicyTEST/ApiPolicy/ReviewMultipleChangeRequests/'+status+'/'+uniqueRequestId,{"Status":status,"UIDs": [uniqueRequestId]},function(r){
                HIDE(loadingdlg);
                showAlert(r,callback);
            },function () {
                HIDE(loadingdlg);
            });
        },
    
        "setSelectedRequestsStatus": function (status){
            DISABLE('[data-approve-reject-button]');
            var urids = EXTRACT('input[type=checkbox][data-request]:checked','data-UID').distinct().map(Number);
            each('input[type=checkbox][data-request]:checked',function(x){ x.disabled=true; x.checked=false; x.parentElement.parentElement.parentElement.classList.add('hide'); });
            XHR.POST('/ePolicyTEST/ApiPolicy/ReviewMultipleChangeRequests/'+status+'/-1,'+urids.join(','),{"Status":status,"UIDs": urids},function(r){
                showAlert(r);
                //showAlert(r,reloadAfter2000);
                ENABLE('[data-approve-reject-button]');
            });
        }
    };
    
    // [END] JS_ePolicyTEST_Policy

//}


var JS_ePolicyTEST_PolicyTermination = {
    
    "getCurrentId": function(){ return getValue('.PolicyTerminationForm #Id[data-parent-id]'); },
    
    ////// JSCommon //////
    "changeSignatoryOrder": function (reorderDelta, callback){
        return JSCommon.changeSignatoryOrder('/ePolicyTEST/ApiPolicyTermination',reorderDelta,callback);
    },

    "loadSigners": function () {
        return JSCommon.loadSigners('/ePolicyTEST/PolicyTermination', JS_ePolicyTEST_PolicyTermination.getCurrentId());
    },
    "saveSignatory": function () {
        return JSCommon.saveSignatory('/ePolicyTEST/ApiPolicyTermination');
    },
    "resetSignatoryForm": JSCommon.resetSignatoryForm,
    "editSignatory": function(signatoryId, parentRecordId){
        return JSCommon.editSignatory(signatoryId,parentRecordId,'/ePolicyTEST/ApiPolicyTermination');
    },
    "deleteSignatory": function(callback){
        return JSCommon.deleteSignatory('/ePolicyTEST/ApiPolicyTermination/DeleteSignatory', callback);
    },
    ////// JSCommon //////


    "setSignatoryDate": function (policyTerminationId, id, approveDate) {
        if(QSA('input[name="IsAutomaticSignatoryApprovedOn"]:checked').length > 0) {
            return ALERTS.WARNING('Not allowed because this policy setting disallows manual update of signatory date');
        }

        var key = "DATE" + Math.ceil(Math.random() * 6542316);
        var message = '<div class="ui attached visible ignored message">'+
                      ' <div class="header">Set the approve date for this signatory</div>'+
                      '</div>'+
                      "<div class='DatePickDialog ui form segment attached' id='F" + key + "'>" +
                      " <div class='ui grid'>"+
                      "  <div class='eight wide column'><div class='ui input w-100'><input id='date' data-toggle='datepicker' /></div></div>" +
                      "  <div class='eight wide column'><div class='ui input w-100'><input id='time' type='time' step='1'     /></div></div>"+
                      " </div>"+
                      "</div>";

        CONFIRM(message,function (formData) {
            var date = formData.date;
            var time = formData.time;
            
            var model = {
                "Id":id, 
                "PolicyTerminationId": policyTerminationId, 
                "ApprovedOn": [date, time].join(' '), 
                "PolicyTerminationSignatoryId": id
            };

            XHR.PATCH('/ePolicyTEST/ApiPolicyTermination/UpdateSignatoryDate/'+policyTerminationId+'/'+id, model, function (r) {
                showAlert(r,function(){
                    var val = [date, time].join(' ');
                    setInnerText("#SignatoryApprovedOn-" + id, val);
                    each('#PolicyTerminationSignatory_' + id +'[data-date-value]', function(x){ x.setAttribute('data-date-value',val); });
                },dialogAlert);
            });
        },function(){
            initDatePickers('#F' + key,'dd-mm-yyyy');
            var date = QS('#F' + key + ' .DatePickDialog #date');
            var time = QS('#F' + key + ' .DatePickDialog #time');
            if (!isNullOrEmpty(approveDate)) {
                setValue(date, approveDate.split(' ').first());
                setValue(time, approveDate.split(' ').last());
            }
            try{
                FOCUS(date);
            }catch(e){
            }
        });
    },    

    "previewAudit": function (id) {
        XHR.GET('/ePolicyTEST/PolicyTermination/History/' + id, function (r) {
            show.dialog({ "title": 'Policy Termination History #' + id, "size": 'extra-large', "message": r });
        });
    },

    "sign": function (id, comments, status, onSuccess) {
        //JSCommon.sign('.approve-reject-form', status, function () {
            var model = { 
             "Comments": comments.superTrim(),
             "PolicyTerminationId": id,
             "Status": status
            }; 
            XHR.PATCH('/ePolicyTEST/ApiPolicyTermination/Sign/'+id+'/'+status, model, function (r) {
                showAlert(r, onSuccess);
            });
        //});
    },

    "notifySignatory" : function(id){
        HIGHLIGHT('tr#PolicySignatory'+id);
        XHR.POST('/ePolicyTEST/ApiPolicyTermination/NotifySignatory/' + id, function(r){
            showAlert(r,function(){ HIDE('tr#PolicySignatory'+id); });
        });
    },

    "withdraw": function (formSelector, callback) {
        var id = getValue(formSelector + ' #Id');
        CONFIRM('Are you sure to withdraw policy termination form # ' + id + '?', function () {
            XHR.PATCH('/ePolicyTEST/ApiPolicyTermination/Withdraw/' + id, function (r) {
                showAlert(r, function(){
                    invoke(callback,r);
                    setTimeout(function(){ top.location.reload(); }, 1000);
                });
            });
        });
    },

    "reporthandle" : null,

    "embedPDF" : function(id, selector){
        var html = "  <div class='ui progress pink' data-precent='0'>" +
                    "    <div class='bar'></div>" +
                    "  </div>";
        SETHTML(selector, html);
        JS_ePolicyTEST_PolicyTermination.generateReport(id, function(){
            $('.ui.progress').progress({"percent": 100 });
            //clearInterval(JS_ePolicyTEST_PolicyTermination.reporthandle);
            //
            setTimeout(function () {
                PDFObject.embed('/ePolicyTEST/Download/PolicyTermination/'+id+'?isEmbed=true', selector);
            },1000);
        });
    },

    "openReport" : function (id, index, type){
        var title = 'Policy Termination # '+id+' ('+index+') ' + type;
        var url   = '/ePolicyTEST/PolicyTermination/GeneratePdf/' + id;
        return PREVIEW(title, url, function(whendone){ JS_ePolicyTEST_PolicyTermination.generateReport(id, whendone); });
    },

    "getReportProgress": function (id){
        XHR.GET('/Public/PolicyTerminationReportProgress/'+id,function(percentage){
            var r = (+percentage);
            consolelog("report progress: " + r);

            var progress = $('.ui.progress');
            if(progress === null || r >= 99) {// || r < 0) {
                if(r > 0) progress.progress({"percent": 100 });
                return true; //clearInterval(JS_ePolicyTEST_PolicyTermination.reporthandle);
            }

            progress.progress({"percent": r });
            if(r >= 0 && r < 100) setTimeout(function () { JS_ePolicyTEST_PolicyTermination.getReportProgress(id); }, 500);
        });
    },

    "generateReport": function (id, whendone){
        $('.ui.progress').progress();
        setTimeout(function () { JS_ePolicyTEST_PolicyTermination.getReportProgress(id); }, 500);

        return XHR.GET('/ePolicyTEST/ApiPolicyTermination/GeneratePDF/'+id, function (r) {
            var progress = $('.ui.progress');
            if(progress !== null) {
                progress.progress({"percent": 100 });
                //clearInterval(JS_ePolicyTEST_PolicyTermination.reporthandle);
            }

            invoke(whendone,r);
            
            if(typeof r.Status !== 'undefined' && !r.Status === 'success') {
                show.hideAll();
                show.alert('<pre class="danger">'+ r.Message+'</pre>');
            }
        },function(){});
    },

    "resetReports" : function(id){
        return XHR.GET('/ePolicyTEST/ApiPolicyTermination/ResetReports/'+id, showAlert);
    },

    "delete": function (formSelector, callback){
        show.dialog({
            "title": 'Confirmation',
            "message": 'Are you sure to delete this record?',
            "onDeny": function(){},
            "onApprove": function(){
                var model = SERIALIZE(formSelector);
                XHR.DELETE('/ePolicyTEST/ApiPolicyTermination/Delete/'+model.Id,function(r){
                    showAlert(r, function(){ setTimeout(function(){ 
                        invoke(callback, r);
                        top.location.href='/ePolicyTEST/PolicyTermination/Form/0'; }, 1400); 
                    });
                });
            }
        });
    },

    "reload": function (id) {
        if(!id) return;
        top.location.href = '/ePolicyTEST/PolicyTermination/Form/' + id;
    },

    "reloadCommittees": function (id) {
        GETHTML('/ePolicyTEST/PolicyTermination/Committees/' + id , '.PolicyTerminationCommittees');
    },

    "reloadReasons": function (id) {
        GETHTML('/ePolicyTEST/PolicyTermination/Reasons/' + id, '.PolicyTerminationReasons');
    },

    "saveAndSubmitForApproval": function (formSelector, callback) {
        if(!checkRequiredFields(formSelector)) return;
        var model = SERIALIZE(formSelector);
        XHR.PATCH('/ePolicyTEST/ApiPolicyTermination/SaveAndSubmitForApproval/'+model.Id+'/'+model.Status, model, function (r) {
            showAlert(r,function(){
                invoke(callback, r);
                setTimeout(function(){ JS_ePolicyTEST_PolicyTermination.reload(r.Data); }, 2500);
            });
        });
    },

    "save": function (formSelector, callback) {
        if(!checkRequiredFields(formSelector)) return;
        var model = SERIALIZE(formSelector);
        XHR.PATCH('/ePolicyTEST/ApiPolicyTermination/Save/'+model.Id+'/'+model.Status, model, function (r) {
            showAlert(r,function(){
                invoke(callback,r);
                setTimeout(function(){ JS_ePolicyTEST_PolicyTermination.reload(r.Data); }, 2500);
            });
        });
    },

    "deleteCommittee": function (committeeId, callback) {
        XHR.DELETE('/ePolicyTEST/ApiPolicyTermination/DeleteCommittee/' + committeeId, function (r) {
            showAlert(r, callback);
            JS_ePolicyTEST_PolicyTermination.reloadCommittees(JS_ePolicyTEST_PolicyTermination.getCurrentId());
        });
    },

    "deleteReason": function (reasonId, callback) {
        XHR.DELETE('/ePolicyTEST/ApiPolicyTermination/DeleteReason/' + reasonId, function (r) {
            showAlert(r,callback);
            JS_ePolicyTEST_PolicyTermination.reloadReasons(JS_ePolicyTEST_PolicyTermination.getCurrentId());
        });
    },

    "addReason": function (policyTerminationId, successcallback) {
        // 1. display popup asking for the reason, and text for others if selected
        // 2. send to server 
        var options = ["Outdated_policy"                               
                       ,"Change_in_template_and_or_policy_making_process"
                       ,"Added_as_part_of_another_policy"
                       ,"No_longer_applicable"
                       ,"Others_please_specify"];

        var form = '<div class="ui visible ignored attached message"></div>'+
                   '<div class="ui form segment attached addTerminationReason"><form>' +
                   ' <div class="field">'+
                   '  <label for="PolicyTerminationReason">Termination Reason</label>'+
                   '  <select id="PolicyTerminationReason" name="PolicyTerminationReason" class="select2">'+
                   options.map(function(option){ return '<option value='+option+'>'+option.replace('_',' ')+'</option>'; }).join('')+
                   '  </select>'+
                   ' </div>'+
                   ' <div class="field">' +
                   '  <label for="OthersReason">If Others, please specify:</label>' +
                   '  <textarea onblur="JSCommon.fixCapitalization(this)" id="OthersReason" name="OthersReason" maxlength="255" rows="2"></textarea>' +
                   ' </div>' +
                   ' <div class="hidden" data-type="numeric" name="PolicyTerminationId" value="'+policyTerminationId+'">'+
                   '</form></div>';
        
        CONFIRM(form,function(model){
            //{ "PolicyTerminationId": policyTerminationId, "PolicyTerminationReason": reason, "OthersReason": others }
            XHR.PUT('/ePolicyTEST/ApiPolicyTermination/AddReason/'+policyTerminationId, model, function (r) {
                showAlert(r,successcallback);
                JS_ePolicyTEST_PolicyTermination.reloadReasons(JS_ePolicyTEST_PolicyTermination.getCurrentId());
            });
        });
    },

    "addCommittee": function (terminationModelId, successcallback) {
        // 1. display popup asking for the reason, and text for others if selected
        // 2. send to server 

        show.dialog({
            "title": 'Add Termination Reviewing department/Committee',
            "size": 'small',
            "message": '<div class="ui form segment addTerminationCommittee"><form>' +
                       ' <div class="field">' +
                       '  <label>Committee</label>' +
                       '  <select id="Committee" class="select2"></select>' +
                       ' </div>' +
                       '</form></div>',
            "onShown": function () {

                XHR.GET('/ePolicyTEST/ApiCommittee/All', function (allCommittees) {
                    //allCommittees = r;
                    each('#Committee', function (x) {
                        FOCUS(x);
                        allCommittees.forEach(function (y) {
                            var option = document.createElement('option');
                            option.value = y.CommitteeEn;
                            option.innerHTML = toTitleCase( y.CommitteeEn );
                            x.appendChild(option);
                        });
                    });
                    initSelect2();
                });
            },
            "onDeny": function(){},
            "onApprove": function(){
                each('.addTerminationCommittee', function (x) {
                    var committee = x.querySelector('#Committee').value;
                    XHR.PUT('/ePolicyTEST/ApiPolicyTermination/AddCommittee/'+terminationModelId, { "PolicyTerminationId": terminationModelId, "Committee": committee }, function (r) {
                        showAlert(r,successcallback);
                        JS_ePolicyTEST_PolicyTermination.reloadCommittees(JS_ePolicyTEST_PolicyTermination.getCurrentId());
                    });
                });
            }
        });
    },
}

// [END] JS_ePolicyTEST_PolicyTermination



var JS_ePolicyTEST_PolicyDashboard = {

    "selectStatus": function (status) {
        XHR.GET('/ePolicyTEST/ApiPolicy/GetPoliciesByStatus/' + status, function (r) {

            var container = document.getElementById('dbDocumentsSelection');
            container.style = 'max-height:50em !important;overflow-y:scroll;overflow-x:hidden';
            container.innerHTML = '';
            SETHTML('#dbContent','');
            for (var i = 0; i < r.Data.length; i++) {
                var doc = r.Data[i];
                var div = document.createElement('div');
                var a = document.createElement('a');
                div.id = 'doc-' + doc.Id;
                div.className = 'ui item message attached';
                div.appendChild(a);
                a.innerHTML = '[#' + doc.Id + '] - ' + doc.TemplateTitle + ' - ' + doc.Title + '<br />by: ' + doc.Author;
                a.href = 'javascript:void(JS_ePolicyTEST_PolicyDashboard.selectDocument(' + doc.Id + '))';
                container.appendChild(div);
            }
            REMOVECLASS('.db-status.teal','teal');
            ADDCLASS('.db-status#db-' + status,'teal');
        });
    },
    
    "selectDocument" : function (id) {
        XHR.GET('/ePolicyTEST/Policy/Form/' + id + '?isPartial=true&_='+makeid(8), function (r) {
            SETHTML('#dbContent',r);
            var container = document.getElementById('dbDocumentsSelection');
            container.querySelectorAll('.teal').forEach(function (x) {
                x.classList.remove('teal');
            });
            container.querySelectorAll('#doc-' + id).forEach(function (x) {
                x.classList.add('teal');
            });
        });
    }
};
// [END] JS_ePolicyTEST_PolicyDashboard

var JS_ePolicyTEST_Signature = {
    "addSignatureAuthorization": function(){
        XHR.GET('/ePolicyTEST/Signature/OnBehalfRequestForm',function(message){
            show.dialog({
                "title": 'Add On-Behalf Signature Authorization',
                "message": '<div class="dlg82736987iy">'+message+'</div>',
                "onShown": function(){
					initDatePickers('.dlg82736987iy');
                    FOCUS('.dlg82736987iy #AuthorizedUsername');
				},
                "onDeny": function(){},
                "onApprove": function(){
                    XHR.PUT('/ePolicyTEST/ApiSignature/AddSignatureAuthorization',SERIALIZE('.dlg82736987iy'),function(r){
                        showAlert(r,reloadAfter2000);
                    });
                    return true;
                }
            });
        });
    },
    "cancelSignatureAuthorizations": function(ids){
        ids.forEach(function(id){
			JS_ePolicyTEST_Signature.cancelSignatureAuthorization(id,showAlert);
		});
    },
    "cancelSignatureAuthorization": function(id,callback){
        XHR.PATCH("/ePolicyTEST/ApiSignature/CancelSignatureAuthorization",{"Id":id},callback);
    },
    

    "reviewSignatureOnBehalfRequest": function(id, status, callback){
        var message = '<div class="ui ignored visible attached message">'+
                      '  <div class="header"><span class="'+(status === 'Approved' ? 'green' : 'red')+'">['+status+']</span>'+
                      '     Signature On-Behalf Authorization Request</div>'+
                      '</div>'+
                      '<div class="ui segment attached form dlg37868346iugd">'+
                      ' <div class="field">'+
                      '  <label></label>'+
                      '  <textarea onblur="JSCommon.fixCapitalization(this)" name="ApprovalComments" autofocus data-placeholder="Approval Comments ..." rows="4" maxlength="1000"></textarea>'+
                      ' </div>'+
                      ' <input type="hidden" name="Id" value="'+id+'">'+
                      ' <input type="hidden" name="Status" value="'+status+'">'+
                      '</div>';
        //{"Id":id,"ApprovalComments":comments,"Status":status}
        CONFIRM(message, function (model) {
            XHR.PATCH('/ePolicyTEST/ApiSignature/ReviewSignatureAuthorization',model,function(r){
                showAlert(r,callback);
            })
        });

        
    },

    "submitChangeRequest": function(username, signature, comments, callback){
        var model = {
            "Username": username,
            "SignaturePath": signature,
            "Comments": comments
        };
        each('#SignatureChangeRequestForm input, #SignatureChangeRequestForm button, #SignatureChangeRequestForm textarea', DISABLE);
        XHR.POST('/ePolicyTEST/ApiSignature/SaveChangeRequest',model,function(r){
            showAlert(r,callback, function(){
                each('#SignatureChangeRequestForm input, #SignatureChangeRequestForm button, #SignatureChangeRequestForm textarea', ENABLE);
            });
        });
    },
    "uploadSignature": function(SignaturePath, file, submitButton, imageSelector){
        each(imageSelector, function(image){image.src ='';});
        submitButton.disabled = true;
        XHR.UPLOAD(file,SignaturePath,function(r){ 
            XHR.GET('/Public/EnhanceImage',{path:r.Data},function(r){
                if(!isNullOrEmpty(r)){
                    if(r.indexOf('500 - Server Error') > -1) return show.alert(r);
                    each(imageSelector, function(image){image.src = '/Download/File?name='+r;});
                    SignaturePath.value = r;
                    submitButton.disabled = false;
                }
            });
        });
    },

    "reviewRequests" : function(listOfSignatureChangeRequestIds,status,comments,callback){
        var counter = 0;
        listOfSignatureChangeRequestIds.forEach(function (id) {
            var record = QS('#SignatureChangeRequest'+id);
            if(record !== null) record.style.backgroundColor = 'cornsilk';
            DISABLE('[data-approve-reject-button]');
            XHR.PATCH('/ePolicyTEST/ApiSignature/ReviewChangeRequest',{"ChangeRequestId":id, "Status":status, "ReviewComments": comments},function (result) {
                showAlert(result, function (result) {
                    if(record !== null) record.classList.add('hide'); 
                });
                counter++;
                if(counter == listOfSignatureChangeRequestIds.length) invoke(callback); 
                ENABLE('[data-approve-reject-button]');
            })
        });
    }
};
// [END] JS_ePolicyTEST_Signature


var JS_ePolicyTEST_PolicySignatory = {

    // "signPolicy": function (policyId, comments, newStatus, onSuccess, onFailure) {
        
    //     return true;
    // },
    
    
    
    "expandCollapseDetails": function () {

        var a = QS('[data-toggle-expand]');
        var expand = a.attributes['data-toggle-expand'].value === '+';
    
        each('[data-toggle-show]', function(x){ 
            x.classList[ expand ? 'remove' : 'add' ]('hide'); 
        });
    
        a.innerHTML = '<i class="ui '+ (expand ? 'minus' : 'plus') +' icon"></i>';
        a.setAttribute('data-toggle-expand',expand ? '-' : '+');
    }


};
// [END] JS_ePolicyTEST_PolicySignatory