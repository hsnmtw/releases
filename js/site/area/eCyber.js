

function drawLineChart(selector, title, headings, jsonStringData){
    //   var data = google.visualization.arrayToDataTable([
    //     ['Year', 'Sales', 'Expenses'],
    //     ['2004',  1000,      400],
    //     ['2005',  1170,      460],
    //     ['2006',  660,       1120],
    //     ['2007',  1030,      540]
    //   ]);

      var json = JSON.parse(jsonStringData);
      var cols = headings.split(',');

      var table = json.map(function(row){
          return range(0,cols.length-1).map(function(i){ return row[cols[i]]; });
      });
      
      table.unshift(cols);
      console.log(table);

      var data = google.visualization.arrayToDataTable(table);

      var options = {
		  "width": 600,
        "height": 600,
        title: title,
        curveType: 'function',
        legend: { position: 'bottom' }
      };

      var chart = new google.visualization.LineChart(QS(selector));

      chart.draw(data, options);
}

function drawPieChart(selector,title,jsonStringvalues) {
    var values = JSON.parse(jsonStringvalues);
    // Define the chart to be drawn.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Percentage');
    data.addRows(values);
    //data.addRows([['Nitrogen', 0.78],
    //              ['Oxygen', 0.21],
    //              ['Other', 0.01]]);

    var options = {
        "width": 600,
        "height": 600,
        "title": title,
        "colors": ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6' //
                  ,'#7CFC00', '#7FFF00', '#006400', '#ADFF2F', '#9ACD32', '#32CD32', '#00FF00', '#228B22'// '#008000', '#00FF7F', '#00FA9A', '#90EE90', '#98FB98', '#8FBC8F', '#3CB371', '#20B2AA', '#2E8B57', '#808000', '#556B2F', '#6B8E23'
                  ,'#FFA07A', '#FA8072', '#B22222', '#FF0000', '#8B0000', '#E9967A', '#F08080', '#CD5C5C'// '#DC143C', '#800000', '#FF6347', '#FF4500', '#DB7093'
                  ,'#DCDCDC', '#D3D3D3', '#778899', '#708090', '#2F4F4F', '#C0C0C0', '#A9A9A9', '#808080'// '#696969', '#000000'
                  ,'#F0F8FF', '#E6E6FA', '#00BFFF', '#B0C4DE', '#1E90FF', '#B0E0E6', '#ADD8E6', '#87CEFA']// '#87CEEB', '#6495ED', '#4682B4', '#5F9EA0', '#7B68EE', '#6A5ACD', '#483D8B', '#4169E1', '#0000FF', '#0000CD', '#00008B', '#000080', '#191970', '#8A2BE2', '#4B0082'].shuffle()
    };
           

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(document.querySelector(selector));
    chart.draw(data, options);
}

window.REFRESH_TICKETS = true;

var JS_eCyber_Service = {
    "editField":function(id,serviceId){
        GETCONFIRM('/eCyber/Service/Field/'+id+'?serviceId='+serviceId,function(model){ 
            XHR.POST('/eCyber/ApiServiceField/Save',model,function(r){
                showAlert(r,function(){ 
                    JS_eCyber_Service.reloadFields(serviceId);
                });
            }); 
        });
    },
    "deleteField": function(id,name,serviceId){
        CONFIRM('Are you sure to delete field: "'+name+'" ?',function(){
            XHR.DELETE('/eCyber/ApiServiceField/Delete/'+id,function(r){
                showAlert(r,function(){ 
                    JS_eCyber_Service.reloadFields(serviceId);
                });
            });
        });
    },
    "reloadFields": function(serviceId){
        GETHTML('/eCyber/Service/Fields/'+serviceId,'.service-fields-list');
    },
    "addWorkflowTemplate": function(id){
        if(!checkRequiredFields('.service-workflow-template-'+id)) return;

        XHR.PUT('/eCyber/ApiService/AddWorkflowTemplate',SERIALIZE('.service-workflow-template-'+id),function(r){ 
            showAlert(r, function(){ 
                setValue('.service-workflow-template [name=Entitlement]',''); 
                JS_eCyber_Service.reloadWorkflowTemplates(id);
            }); 
        });
    },
    "recalculateWorkflowTemplateLevels": function(id,callback){
        XHR.PATCH('/eCyber/ApiService/RecalculateWorkflowLevels',{ServiceId: id}, callback);
    },
    "reloadWorkflowTemplates": function(id){
        GETHTML('/eCyber/Service/WorkflowTemplate/'+id,'.service-workflow-template-data');
    },
    "moveWorkflowTemplate": function(direction,callback){ /** @direction: ['up','down'] */
        each('input[data-workflow-entitlement]:checked',function(input){
            var model = {Id: input.value, Level: (direction == 'up' ? -1 : +1)}; 
            XHR.PATCH('/eCyber/ApiService/MoveWorkflowTemplate',model,function(r){
                if(r.Status === 'success') {
                    move('.service-workflow-template-'+model.Id,model.Level,function(){
                        each('.service-workflow-template-'+model.Id+' [data-no-arrows-number-input]',function(level){
                            level.value=r.Data;
                        });
                        invoke(callback,r);
                    });
                }
            });
        });
    },
    "updateWorkflowTemplate": function(id,field,value){
        return XHR.PATCH('/eCyber/ApiService/UpdateWorkflowTemplate',{Id:id,Field:field,Value:value},showAlert);
    },
    "deleteWorkflowTemplate": function(){
        each('input[data-workflow-entitlement]:checked',function(input){ 
            var workflowId  = input.value; 
            var entitlement = input.attributes['data-workflow-entitlement'].value; 
            var message = '<div class="ui error visible warning message">'+
                          ' <h4>Confirm to Delete Workflow Entitlment</h4>'+
                          ' <hr>'+
                          ' <p>Are you sure to delete Workflow Entitlement: [Id # '+workflowId+'] <strong>\''+entitlement+'\'</strong> ?</p>'+
                          ' <br>'+
                          ' <p>To proceed, click OK.</p>' +
                          '</div>'+
                          '<input name="Id" type="hidden" value="'+workflowId+'">';
            CONFIRM(message,function(model){ 
                XHR.DELETE('/eCyber/ApiService/DeleteWorkflowTemplate/0'+model.Id,function(r){
                    showAlert(r,function(){ 
                        HIDE('.service-workflow-template-'+model.Id); 
                    }); 
                }); 
            }); 
        });
    }
};

var JS_eCyber_Ticket = {

    "ALL_TICKET_STATUS": 'Open,Assigned,InProgress,OnHold,Resolved,Closed,Completed',//,Cancelled,Pending,Rejected,Draft',
    
    "refreshHandler": 0,

    "resendNotification": function(worflowId){
        XHR.GET('/eCyber/ApiTicket/ResendNotification/'+worflowId,showAlert);
    },

    "raiseTicketOnBehalfOfUser": function(username){
        POPUP('/eCyber/Ticket/Add?skipSurvey=true&showAllServices=true&ispartial=true&username='+username);
    },

    "refreshLoop": function(){
        
        JS_eCyber_Ticket.refreshHandler = setInterval(function(){
            if(window.REFRESH_TICKETS){
                JS_eCyber_Ticket.reloadListing('.grid-listing-table',SERIALIZE('.form-pagination-listing'));
            }
        }, 1000 * 60);
    },

    "revokeSurveyAnswers": function(uid){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            PROMPT('Please provide justification for revoking this ticket survey',function(comment){
                if(comment.length > 500) comment = comment.substr(0,500); 
                XHR.POST('/eCyber/ApiTicket/RevokeSurveyAnswers',{UID:uid,Comment:comment},JS_eCyber_Ticket.reload,showAlert);
            });
        });
    },

    "reload": function(r){
        showAlert(r);
        var href = top.location.href.split('?');
        var url = href.first().split('#').first();
        var args = href.last().split('#').first()+'&ispartial=true';
        XHR.GET(url + '?' + args,function(r){
            SETBODY(r);
            JS_eCyber_Ticket.convertJSONcontent();
        });
    },

    "updateResolution": function(id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            GETCONFIRM('/eCyber/Ticket/Resolution/'+id,function(model){
                if(isNullOrEmpty(model.Resolution)) return errorMessageAfterTimeout(500,'Resolution field is mandatory and cannot be empty / null');
                if(isNullOrEmpty(model.ResolutionNotes)) return errorMessageAfterTimeout(500,'Resolution Notes field is mandatory and cannot be empty / null');
                model.Attachment = null;
                if(model.ResolutionNotes.length > 500) model.ResolutionNotes = model.ResolutionNotes.substr(0,500); 
                XHR.PATCH('/eCyber/ApiTicket/UpdateResolution',model,JS_eCyber_Ticket.reload,showAlert);
            });
        });
    },

    "convertJSONcontent": function(){
        each('.ticket-description',function(description){
            var text = description.innerText;
            if(isJSON(text)){
                description.innerHTML = TABULAR(JSON.parse(text));
            }
        });
    },
    
    "createDomainUser": function(uid,username){
        XHR.POST('/eCyber/ApiTicket/CreateDomainUser',{UID:uid},function(r){
            showAlert(r,function(x){
                JS_eCyber_Ticket.reload(r);
                if(x.Data > 0){
                    JS_Security_User.openForm( username );
                }
            });
        });
    },

    "resolve": function(id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            GETCONFIRM('/eCyber/Ticket/Resolution/'+id,function(model){
                if(isNullOrEmpty(model.Resolution)) return errorMessageAfterTimeout(500,'Resolution field is mandatory and cannot be empty / null');
                if(isNullOrEmpty(model.ResolutionNotes)) return errorMessageAfterTimeout(500,'Resolution Notes field is mandatory and cannot be empty / null');
                model.Attachment = null;
                if(model.ResolutionNotes.length > 500) model.ResolutionNotes = model.ResolutionNotes.substr(0,500); 
                XHR.PATCH('/eCyber/ApiTicket/Mark',model,JS_eCyber_Ticket.reload,showAlert);
            });
        });
    },

    "showTickets": function(technician,title,fromUID,toUID){
        var options = {
            Technician:technician,
            Status:JS_eCyber_Ticket.ALL_TICKET_STATUS,
            Filters:'{"UID":{Name:"UID",Where:"Between",Value:["'+fromUID+'","'+toUID+'"]}}'
        };
        XHR.GET('/eCyber/Ticket/Listing',options,function(r){ 
            show.dialog({size:'large',title: 'Tickets closed by "'+title + '"', message: r }); 
        });
    },

    "submitSurvey": function(model,callback){

        model.Survey = Object.keys(model).filter(function(x){ return isNumeric(x); }).map(function(x){ 
            return {
                "TicketId": model.Id, 
                "Id": x, 
                //"Answer": (['no comments ...','nil','','nothing','no','nope','not'].contains((model[x]+'').trim().superTrim().toLocaleLowerCase()) ? null : model[x]), 
				"Answer": (['no comments ...','nil','','nothing','nope','not'].contains((model[x]+'').trim().superTrim().toLocaleLowerCase()) ? null : model[x]), 
                "Comment": model[['q',x,'Comment'].join('_')] 
            };
        });
        

        XHR.PATCH('/eCyber/ApiTicket/SubmitSurvey',model,function(r){
            //showAlert(r,callback);
            invoke(callback,r);
            model.IsPartial=true;
            if(QSA('[data-survey]').length > 0 && r.Status === 'success') {
                    XHR.GET('/eCyber/Ticket/SurveyForm',model,function(r){
                    each('[data-survey]',function(x){x.innerHTML=r;});
                });
            }else if(top.location.href.toLowerCase().contains('/surveyform')){
                top.location.reload();
            }
        });
    },

    "openWorkflowForReview": function(uid,id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            POPUP('/eCyber/Ticket/Open/'+uid+'?isPartial=true','fullscreen',function(){ 
                each('.modal .ticket-description-'+id, function(description){ 
                    var text = description.innerText; 
                    if(isJSON(text)){ 
                        description.innerHTML = TABULAR(JSON.parse(text)); 
                    } 
                }); 
            });
        });
    },

    "previewSurveyBeforeSubmit": function(data,callback){
        var model = {
            Survey: Object.keys(data).filter(function(x){ return isNumeric(x); }).map(function(x){ 
                return {"TicketId": data.SurveyTicketId, "Id": x, "Answer": data[x], "Comment": data[['q',x,'Comment'].join('_')] }; 
            }),
            Token: data.SurveyTicketToken,
            Id: data.SurveyTicketId,
            UID: data.SurveyTicketUID,
            Requester: data.SurveyTicketRequester
        };

        XHR.POST('/eCyber/Ticket/PreviewSurveyBeforeSubmit',model,function(r){
            CONFIRM(r,function(rmodel){
                JS_eCyber_Ticket.submitSurvey(rmodel,callback);
            });
        });

    },
    "update": function(id,field,value){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            var model = {Id:id, FieldToUpdate: field};
            model[field] = value;
            XHR.PATCH('/eCyber/ApiTicket/Update',model,function(r){
                showAlert(r, function(){ 
                    JS_eCyber_Ticket.reloadNotes(id); 
                    if(field === 'Technician') setTimeout(function(){top.location.reload();},1000);
                });
            });
        });
    },
    "reopen": function(id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            CONFIRM('Are you sure to re-open this ticket?',function(){
                XHR.PATCH('/eCyber/ApiTicket/ReOpen/'+id,{},JS_eCyber_Ticket.reload);
            });
        });
    },
    "reloadListing": function(selector,vmodel){
        XHR.GET('/eCyber/Ticket/Listing',vmodel,function(r){
            SETHTML(selector, r);
            if(r.contains('Password')) clearInterval(JS_eCyber_Ticket.refreshHandler);
        });
    },
    "showAssignTechnicianForm": function(id){
        SMALLDIALOG(null,'/eCyber/Ticket/Assignment/'+id);
    },
    "forwardToIssueTracking": function(id){
        GETCONFIRM('/eCyber/Ticket/ConfirmForwardToIssueTracking/'+id,function(model){
            XHR.PATCH('/eCyber/ApiTicket/ForwardToIssueTracking',model,JS_eCyber_Ticket.reload);
        });
    },

    "prepareSurvey": function(id){
        XHR.PATCH('/eCyber/ApiTicket/PrepareSurvey/'+id,{Id:id},showAlertThenReload);
    },
    
    "cancel": function(id){
        var msg = '<div class="ui warning visible icon message form"><input type="hidden" name="Id" value="'+id+'"><input type="hidden" name="Status" value="Cancelled">'+
                  ' <i class="ui exclamation triangle icon brown"></i>'+
                  ' <div class="content">'+
                  '  <div class="header">Warning !!!</div>'+
                  '  <div class="field">'+
                  '    <label>Reason for cancellation</label>'+
                  '    <textarea required onblur="JSCommon.fixCapitalization(this)" rows="2" name="CancellationNotes" data-placeholder="Reason for canelling this ticket ..." maxlength="500"></textarea>'+
                  '  </div>'+
                  '  <p>Proceeding with this action will make the ticket in (<em>Cancelled</em>) Status.</p>'+
                  '  <p>To proceed, click OK</p>'+
                  ' </div>'+
                  '</div>'; 
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');
        
            CONFIRM(msg,function(model){ 
                XHR.PATCH('/eCyber/ApiTicket/Mark',model,JS_eCyber_Ticket.reload);
            });
        });
    },
    
    "mark": function(id,status){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            if('OnHold' === status){
                var msg = '<div class="ui segment form">'+
                          '  <input type="hidden" name="Id" value="'+id+'" data-type="numeric">'+
                          '  <input type="hidden" name="Status" value="OnHold">'+
                          '  <div class="field">'+
                          '    <label class="boldish">Please provide reason for on-holding this ticket</label>'+
                          '    <textarea onblur="JSCommon.fixCapitalization(this)" maxlength="500" data-placeholder="reason for on-hold" name="OnHoldNotes" rows="3"></textarea>'+
                          '  </div>'+
                          '</div>';
                return CONFIRM(msg,function(model){
                    XHR.PATCH('/eCyber/ApiTicket/Mark',model, JS_eCyber_Ticket.reload,showAlert);
                });
            } else if('Resolved' === status){
                
                return JS_eCyber_Ticket.resolve();
            }
            return XHR.PATCH('/eCyber/ApiTicket/Mark',{Id:id,Status:status},JS_eCyber_Ticket.reload,showAlert);
        });
    },

    "showAddNoteView": function(id,uid,status){
        var msg = '<div class="ui form">'+
                  ' <div class="field">'+
                  '  <label>Ticket Id</label><div class="input rb">'+uid+'</div>'+
                  '  <input type="hidden" name="TicketId" data-type="numeric" value="'+ id +'" required>'+
                  '  <input type="hidden" name="UID" value="'+ uid +'" required>'+
                  '  <input type="hidden" name="Status" value="'+status+'" required>'+
                  ' </div>'+
                  ' <div class="field">'+
                  '  <label>Comment</label>'+
                  '  <textarea onblur="JSCommon.fixCapitalization(this)" maxlength="500" required name="Comment" rows="3" data-placeholder="Comments go here"></textarea>'+
                  ' </div>'+
                  ' <div class="field">'+
                  '  <label>Attachment</label>'+
                  '  <input type="hidden" name="Attachment" data-note-'+id+'-attachment >'+
                  '  <input type="file" onchange="XHR.UPLOAD(this,QS(\'[data-note-'+id+'-attachment][name=Attachment]\'))" accept=".png,.jpg,.jpeg,.bmp,.tif,.gif,.pdf,.xls,.doc,.docx,.doc,.txt,.zip">'+
                  ' </div>'+
                  '</div>';

        return CONFIRM(msg,JS_eCyber_Ticket.addNote);
    },
    "addNote": function(model){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            XHR.PUT('/eCyber/ApiTicket/AddNote',model, function(r){ 
                showAlert(r,function(){  
                    JS_eCyber_Ticket.reloadNotes(model.TicketId);
                    JS_eCyber_Ticket.reloadAttachments(model.TicketId); 
                }); 
            });
        });
    },
    "reloadMetrics": function(id){
        GETHTML('/eCyber/Ticket/Metrics/'+id,'.ticket-metrics-'+id); 
    },
    "reloadAttachments": function(id){
        GETHTML('/eCyber/Ticket/Attachments/'+id,'.ticket-attachments-'+id); 
    },
    "reloadNotes": function(id){
        GETHTML('/eCyber/Ticket/Notes/'+id,'.ticket-notes-'+id); 
    },
    "showPendingLastSurvey": function(username){
        XHR.GET('/eCyber/ApiTicket/GetUnratedTickets/'+username,function(r){
            if(r.Status === 'success' && r.Data.any()){
                XHR.GET('/eCyber/Ticket/RequesterSurvey/'+r.Data.last()+'?isPartial=true&attachToken=true',function(response){
					CONFIRM(response,function(model){
						JS_eCyber_Ticket.previewSurveyBeforeSubmit(model,showAlert);
					});
				});
            }
        });
    },

    "reinitializeWorkflow": function(model){
        var message = '<h4 style="color:red">Are you sure to perform a re-initialization of workflow?</h4>' + 
                      '<p>Please note that all approvals on this workflow list will be cleared.</p>'+
                      '<p>To continue, press OK</p>'+
                      TABULAR(model);
        CONFIRM(message, function(){
            PATCH('/eCyber/ApiTicket/ReInitializeWorkflow',model,function(r){
                showAlert(r);
                show.alert(r.Message);
                GETHTML('/eCyber/Ticket/Workflow/'+model.Id,'.ticket-workflow-'+model.Id);
                GETHTML('/eCyber/Ticket/Notes/'+model.Id,'.ticket-notes-'+model.Id);
            });
        });
    },

    "isTherePreviousTickets": function (username, callback) {
        XHR.GET('/eCyber/ApiTicket/QueryOpenTicket',{"Username":username},function(response){
            
            if(response.Data !== null){
                return dialogAlert({
                    Status: 'warning',
                    Message: "You already have a ticket that is in '"+ response.Data.Status +"' Status, <br>with Reference # <b>" + response.Data.UID + "</b> which was requested on: "+ response.Data.RequestedOn +
                             "<hr>"+
                             "Please wait for this ticket to be processed before raising another one !",
                    Data: null
                });
            }

            invoke(callback);
        });
    },

    "submitSurveyAndProceedToNextStep": function(callback){
        var formSelector = '.ticket-survey-form';
        if(!checkRequiredFields(formSelector)) return;
        var model = SERIALIZE(formSelector);
        JS_eCyber_Ticket.previewSurveyBeforeSubmit(model, function(r){
            //dialogAlert(r,callback);
            var message = typeof r === 'string' ? r : ICONS[r.Status] + r.Message;
            show.dialog({
                "title"    : 'Message from server',
                "message"  : message,
                "size"     : 'mini',
                "onApprove": function(){},
                "onShown"  : callback
            });
            HIDE('.new-requst-survey-reminder');
            SHOW('.new-requst-step-3');
            SCROLL('#bm-step-3');
            FOCUS('input[data-search-cards-input]');
        });
    },

    "showUnansweredSurvey": function(requester){
        XHR.GET('/eCyber/Ticket/GetLastTicketUnansweredSurvey',{Username:requester},function(res){
            if(!isNullOrEmpty(res.Data)){
                XHR.GET('/eCyber/Ticket/GetLastUnansweredSurvey',res.Data,function(r){
                    if(!isNullOrEmpty(r))
                    {
                        SETHTML('[data-survey]',r);
                        SHOW('.new-requst-survey-reminder'); 
                        HIDE('.new-requst-step-3');
                    }
                });
            }
        });
    },

    "submitTicketStep1": function (btn) {
        if(!checkRequiredFields('.TicketForm .step1')) return;

        try{ setValue('#RaisedUsingBrowser', GETBROWSER()); } catch(e) { }
        
        var model = SERIALIZE('.TicketForm');
        XHR.POST('/api/apiuser/IsAllowedToUseEServices',{Username:model.TicketUsername},function(r){
            showAlert(r,function(){
                XHR.POST('/api/ApiUser/IdentifyByPasswordOrNationalIdOrIqama',{Username : model.TicketUsername, NationalId : model.TicketPassword},function(r){
                    showAlert(r,function(r){ 
                        JS_eCyber_Ticket.isTherePreviousTickets(model.TicketUsername, function() {
                        
                            var rmodel = r.Data;
                            rmodel.NameAr = (''+rmodel.NameAr).firstAndLastNames();
                            rmodel.NameEn = (''+rmodel.NameEn).firstAndLastNames();
                            ['Username','NameEn','NameAr','Department'].forEach(function(x){ 
                                each('.Requester-'+x, function(y){ 
                                    y.innerText = rmodel[x]; 
                                });
                            });
                            HIDE('.step1'); 
                            SHOW('.step2'); 

                            DESERIALIZE('.TicketForm', {
                                "RequesterNameEn"    : rmodel.NameEn,
                                "RequesterNameAr"    : rmodel.NameAr,
                                "Requester"          : rmodel.Username,
                                "RequesterDepartment": rmodel.Department,
                                "xContactNumber"     : rmodel.Mobile
                            });
                            
                            JS_eCyber_Ticket.showUnansweredSurvey(rmodel.Username);
                            each('.TicketForm #SelectUserButton',function(b){ b.onclick(); });                 
                        });
                    });
                });
            });
        });
    },
    "submitTicketStep2": function (btn) {
        var model = SERIALIZE('.TicketForm');
        SHOW('.UserInformationTemplate');
        
        XHR.GET('/api/ApiUser/Query/IAFH/'+model.Requester,function(r){
            showAlert(r,function(r){  
                var rmodel = r.Data;
                rmodel.NameAr = (''+rmodel.NameAr).firstAndLastNames();
                rmodel.NameEn = (''+rmodel.NameEn).firstAndLastNames();
                ['Username','NameEn','NameAr'].forEach(function(x){ 
                    each('.Requester-'+x, function(y){ 
                        y.innerText = rmodel[x]; 
                    });
                });
                DESERIALIZE('.TicketForm', {
                    RequesterNameEn: rmodel.NameEn,
                    RequesterNameAr: rmodel.NameAr,
                    Requester: rmodel.Username
                });
                each('.end-user-name',function(x){ x.innerText = [rmodel.Username,rmodel.NameEn,rmodel.NameAr].join(" | "); });
                HIDE('.step2');
                SHOW('.step3');
            });
        });
    },
    "skipSurvey":function(){
        SETHTML('.new-requst-survey-reminder',null);
        HIDE('.new-requst-survey-reminder'); 
        SHOW('.new-requst-step-3'); 
        SCROLL('#bm-step-3'); 
        FOCUS('input[data-search-cards-input]');
    },
    "submitTicketStep3": function(btn){
        // if(['#ServiceId'].map(getValue).filter(isNullOrEmptyOrZero).any()) {
        //     return ALERTS.ERROR('You must select a service');
        // }
        each('.new-requst-survey-reminder [required]',function(x){ x.required=false; });
        if(!checkRequiredFields('.TicketForm .step3')) return;

        //var serviceSelect = QS('#ServiceId');
        //var option = serviceSelect.options[serviceSelect.selectedIndex];
        var serviceId = getValue('#ServiceId');
        var service = QS('.card-service-'+serviceId);
        var icon = service.querySelector('img[data-service-icon]'); 
        var text = service.attributes['data-content'].value;
        SETHTML('.service-requested','<img class="ui avatar image" src="'+ icon.src +'" height="40" width="40"> ' + text );

        HIDE('.step3');
        SHOW('.step4');
        //FOCUS('#BuildingId');

        QS("#DepartmentId").disabled = false;

        try{
            var data_service_requester_department = service.getAttribute('data-service-requester-department').toLocaleLowerCase();
            
            var requesterDepartment = getValue('#RequesterDepartment');

            if(data_service_requester_department == 'true' && !isNullOrEmpty(requesterDepartment)){
                var option = QSA('select#DepartmentId option').filter(function(x){return x.innerText.trim().startsWith(requesterDepartment)}).first();
                setValue('#DepartmentId', option.value);
                setValue('#Department', option.innerText.trim());
                QS("#DepartmentId").disabled = true;
            }
        }catch(exception){
            //do nothing
        }

        SETHTML('.service-fields-template','');
        setValue('.TicketForm [name=ContentType]','TEXT');
        setValue('.TicketForm #Subject',null);
        setValue('.TicketForm #Description',null);
        SHOW('.TicketForm .description');
        SHOW('.TicketForm .subject');
        HIDE('.service-fields-template-form');

        XHR.GET('/eCyber/Service/FieldsTemplate/'+serviceId,function(response){
            //var description = QS('.TicketForm [name=Description]');
            if(!isNullOrEmpty(response))
            {
                HIDE('.TicketForm .description');
                HIDE('.TicketForm .subject');
                SHOW('.service-fields-template-form');
                setValue('.TicketForm [name=ContentType]','JSON');
                setValue('.TicketForm [name=Subject]', QS('.card-service-'+getValue('.TicketForm [name=ServiceId]')).attributes['data-display-name'].value );
                SETHTML('.service-fields-template',response);
            }
        });
    
    },
    "submitTicketStep4": function(btn){
        // if(['#BuildingId','#FloorId','#DepartmentId','#ContactNumber'].map(getValue).filter(isNullOrEmptyOrZero).any()) {
        //     return ALERTS.ERROR('You must provide building, floor, department and contact number');
        // }

        if(!checkRequiredFields('.TicketForm .step4')) return;

        var serviceId = getValue('.TicketForm #ServiceId');
        var departmentId = getValue('.TicketForm #DepartmentId');
        var requester = getValue('.TicketForm #Requester');

        GETHTML('/eCyber/Ticket/PreviewWorkflow?serviceId='+serviceId+'&departmentId='+departmentId+'&requester='+requester,'.ticket-preview-workflow');
        
        HIDE('.step4');
        SHOW('.step5');
        FOCUS('.TicketForm #Subject');
    },
    "submitTicketStep5": function(btn){
        

        try{ setValue('#RaisedUsingBrowser', GETBROWSER()); } catch(e) { }
        var formSelector = '.TicketForm .service-fields-template';
        if(QS(formSelector).innerText.trim().length > 0){
            if(!checkRequiredFields(formSelector)){
                return;
            }

            var form = SERIALISE(formSelector);
            
            var validations = Object.keys(form)
                                    .filter(function(x){ return QSA(formSelector+' [data-name="'+x+'"][data-control-container-required="True"][data-unaccepted-entries]').any(); })
                                    .map(function(x){ var el=QSA(formSelector+' [name="'+x+'"][data-control-container-required="True"]').first(); return [x,el.attributes['data-validation-message'].value,form[x],JSON.parse(el.attributes['data-unaccepted-entries'].value)]; })
                                    .filter(function(x){ return x[3].contains(x[2]); })
                                    ;
            if(validations.any()){
                show.dialog({
                    title: 'Unaccepted responses | اجابات غير مقبولة',
                    message: '<table class="stats-table"><tbody><tr><th>'+
                                validations.map(function(x){ return x[0]+' </th><td> '+x[1]; }).join('</td></tr><tr><th>')+
                             '</td></tr></tbody></table>',
                    onApprove: function(){
                        FOCUS(formSelector+' [name="'+validations.first().first()+'"]');
                    },
                    size:'small'
                });
                return;
            }

            setValue('.TicketForm #Description',JSON.stringify(form).replaceAll('"_','"'));
        }

    


        if(!checkRequiredFields('.TicketForm .step5')) return;
        // if(['#Subject','#Description'].map(getValue).filter(isNullOrEmpty).any()) {
        //     return ALERTS.ERROR('You must provide subject and description of the ticket');
        // }
        var hndl = 0;
        var p = 0;
        var dlg = show.progress({title:'Please wait while ticket is being created ...'},function(){
            hndl = setInterval( function() {
                $('.ui.progress.show-dlg-progress').progress({"percent": 100*p });
                p+=0.25;
                if(p>=1) p=0;
            }, 250);
        });
        toggleButtonsLoading(btn, true);
        var model = SERIALIZE('.TicketForm');
        

        XHR.POST('/eCyber/ApiTicket/Submit',model,function(r){
            try{ clearInterval(hndl); } catch(e) {}
            dlg.modal('hide');
            showAlert(r,function(){ 
                //GETHTML('/eCyber/Ticket/Detail/'+r.Data,'.ConfirmationView'); 
                var UID = r.Data;
                GETHTML('/eCyber/Email/TicketConfirmation/'+UID+'?isPartial=true','.ConfirmationView');

                SETHTML('.ticket-uid',UID);

                HIDE('.step5'); 
                SHOW('.step6'); 
            },function(){
                toggleButtonsLoading(btn, false);
            });
        },dialogAlert);
        
    },

    // tasks management

    "getTicketCompletionRate": function(uid,callback){
        XHR.GET('/eCyber/ApiTicket/GetTicketCompletionRate/'+uid,function(r){
            if(r.Status == 'success') invoke(callback,r.Data);
        });
    },

    "reloadTasks": function(uid){
        GETHTML('/eCyber/Ticket/Tasks/'+uid+'?'+top.location.href.split('?').last(),'.ticket-tasks-'+uid,function(){
            each('[data-tasks-completed]',function(x){
                if(x.attributes['data-tasks-completed'].value === 'true'){
                    setTimeout(function () { top.location.reload(); },1000);
                }
            });
        });
        JS_eCyber_Ticket.getTicketCompletionRate(uid,function(rate){
            setInnerText('.ticket-completion-rate-'+uid,rate);
        });
    },

    "editTask": function(id,uid,sn,taskId){
        var url = '/eCyber/Ticket/TaskEdit/'+taskId+'?'+object2UrlComponents({"TicketId":id,"UID":uid,"SN":sn,"IsPartial":true}).join('&');
        var onOK = function(model){
            XHR.PUT('/eCyber/ApiTicket/SaveTask',model,function(r){ 
                showAlert(r,function(){ JS_eCyber_Ticket.reloadTasks(uid) }); 
                JS_eCyber_Ticket.reloadNotes( id );
            });
        };
        GETCONFIRM(url,onOK);
    },
    
    "changeTaskStatus": function(id,uid,sn,notes,username,status,statusList){
        var form = '<div class="ui form">'+
                   ' <input type="hidden" name="TicketId" value="'+id+'"/>' +
                   ' <input type="hidden" name="UID" value="'+uid+'"/>' +
                   ' <input type="hidden" name="SN" value="'+sn+'"/>' +
                   ' <input type="hidden" name="Username" value="'+username+'"/>' +
                   ' <div class="field">'+
                   '   <label>New Status</label>'+
                   '   <select name="Status" class="select2" required value="'+status+'">'+
                   statusList.map(function(x){ return '<option '+ (status === x.IdValue?' selected ':'') +' value="'+x.IdValue+'">'+x.DisplayName+'</option>'; }).join('\n')+
                   '   </select>'+
                   ' </div>'+                   
                   ' <div class="field">'+
                   '   <label>Notes</label>'+
                   '   <textarea rows="3" name="Notes" maxlength="255" value="'+ notes +'">'+notes+'</textarea>'+
                   ' </div>'+
                   '</div>';
        CONFIRM(form,function(model){
            XHR.PATCH('/eCyber/ApiTicket/ChangeTaskStatus',model,function(r){ 
                showAlert(r,function(){ JS_eCyber_Ticket.reloadTasks(uid) });
                JS_eCyber_Ticket.reloadNotes( id );
            });
        });
    },

    "previewTask": function(uid,sn){
        POPUP('/eCyber/Ticket/Task?'+toQueryString({UID:uid,SN:sn}),'small');
    },

    "selectService": function(id){
        setValue('#ServiceId', id); 
        QS('#selectServiceButton').disabled = false;
        each('[data-selected-card]',function(x){ x.attributes.removeNamedItem('data-selected-card'); }); 
        QS('.card-service-'+id).setAttribute('data-selected-card',true);
        QS('#ServiceOption'+id).checked=true; 
        QS('#selectServiceButton').onclick()
    },

    "saveTicketAssigned": function(btn,selector){
        //var serviceIdSelect = QS(selector +' [name=ServiceId]');
        //setValue(selector + ' [name=Service]', serviceIdSelect.options[serviceIdSelect.selectedIndex].innerText.trim());

        if(!checkRequiredFields(selector)) return;
        toggleButtonsLoading(btn,true);
        var model = SERIALIZE(selector);
        XHR.POST('/eCyber/ApiTicket/SaveTicketAssigned',model,function(r){
            toggleButtonsLoading(btn,false);
            console.log(typeof(r.Data));
            if(typeof(r.Data) === 'undefined') return show.dialog({
                title:'ERROR',
                message: r
            });
            if(typeof(r.Data) === 'string') r.Data = JSON.parse(r.Data);
            
            // console.log(r.Data);
            // console.log(r.Data.Id);
            // console.log(r.Data.UID);
            showAlert(r,function(){
                //DESERIALIZE(selector,r.Data);
                setTimeout(function(){
                    top.location.href='/eCyber/Ticket/Form/'+r.Data.UID+'?inEditMode=true';
                }, 500);
            });
        });
    }
};



var JS_eCyber_Issue = {
    "addNote": function(uid){
        PROMPT('Please provide some notes to add as an update to this ticket?',function(note){
            XHR.PUT('/eCyber/ApiIssue/AddNote',{"UID":uid,"Note":note},JS_eCyber_Issue.reload);
        });
    },
    "reload": function(r){
        showAlert(r);
        var href = top.location.href.split('?');
        var url = href.first().split('#').first();
        var args = href.last().split('#').first()+'&ispartial=true';
        GETHTML(url + '?' + args,'.partial-view-body');
    }
};