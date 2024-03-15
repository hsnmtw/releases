

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

var JS_eTickets_Service = {
    "Field":{
        "onBlurValidate": function(option,id,value){
            var attribute = option.getAttribute('data-validation-message');
            
            each('span[data-validation-id="' + id + '"]',function(s){ 
                s.innerText = '';
                s.setAttribute('data-validation-message', '');
                s.setAttribute('data-is-valid', true);
            });
            var span = QS('span[data-validation-id="' + id + '"][data-value="'+ value +'"]');
			if(span == null || typeof span !== 'object') return;
            var validationMessage = (''+attribute).replaceAll('[','<').replaceAll(']','>');

            span.innerText = '';
            span.setAttribute('data-validation-message', '');
            span.setAttribute('data-is-valid', true);
            
            if(option.attributes['data-invalid'].value.toLowerCase() == 'true'){ 
                //show.error(validationMessage); 
                span.innerHTML = '✖ ' + validationMessage; 
                span.setAttribute('data-is-valid', false);
                span.setAttribute('data-validation-message', validationMessage); 
            }
        },
        "edit":function(id,serviceId){
            GETCONFIRMEMBED({
                "url":'/eTickets/Service/Field/'+id+'?serviceId='+serviceId,
                "onApprove": function(model){ 
                    XHR.POST('/eTickets/ApiServiceField/Save',model,function(r){
                        showAlert(r,function(){ 
                            JS_eTickets_Service.Field.reload(serviceId);
                            SETHTML('.modal-content','');
                        });
                    });
                }
            });
        },
        "delete": function(id,name,serviceId){
            CONFIRM('Are you sure to delete field: "'+name+'" ?',function(){
                XHR.DELETE('/eTickets/ApiServiceField/Delete/'+id,function(r){
                    showAlert(r,function(){ 
                        JS_eTickets_Service.Field.reload(serviceId);
                    });
                });
            });
        },
        "reload": function(serviceId){
            GETHTML('/eTickets/Service/Fields/'+serviceId,'.service-fields-list');
        },
        "Response":{
            "edit": function(serviceFieldId,id){
                var self = this;
                return GETCONFIRM('/eTickets/Service/FieldResponse/'+id+'?serviceFieldId='+serviceFieldId,function(model){
                    return POST('/eTickets/ApiServiceFieldResponse/Save', model, function(r){
                        return showAlert(r,function(){ self.reload(serviceFieldId) });
                    });
                });
            },
            "delete": function(serviceFieldId,listOfIds){
                var self = this;
                CONFIRM('Are you sure to delete the selected responses ?', function(){
                    var responses = listOfIds.map(function(id){return {"Id":id, "ServiceFieldId": serviceFieldId};});
                    var model = {"Id": serviceFieldId,"Responses": responses};
                    return DELETE('/eTickets/ApiServiceField/DeleteResponses',model, function(r){
                        return showAlert(r,function(){ self.reload(serviceFieldId) });
                    });
                });
            },
            "reload": function(serviceFieldId){
                GETHTML('/eTickets/Service/FieldResponses/'+serviceFieldId,'.service-field-responses-list');
            }
        }
    },
    
    "addWorkflowTemplate": function(id){
        if(!checkRequiredFields('.service-workflow-template-'+id)) return;

        XHR.PUT('/eTickets/ApiService/AddWorkflowTemplate',SERIALIZE('.service-workflow-template-'+id),function(r){ 
            showAlert(r, function(){ 
                setValue('.service-workflow-template [name=Entitlement]',''); 
                JS_eTickets_Service.reloadWorkflowTemplates(id);
            }); 
        });
    },
    "recalculateWorkflowTemplateLevels": function(id,callback){
        XHR.PATCH('/eTickets/ApiService/RecalculateWorkflowLevels',{ServiceId: id}, callback);
    },
    "reloadWorkflowTemplates": function(id){
        GETHTML('/eTickets/Service/WorkflowTemplate/'+id,'.service-workflow-template-data');
    },
    "moveWorkflowTemplate": function(direction,callback){ /** @direction: ['up','down'] */
        each('input[data-workflow-entitlement]:checked',function(input){
            var model = {Id: input.value, Level: (direction == 'up' ? -1 : +1)}; 
            XHR.PATCH('/eTickets/ApiService/MoveWorkflowTemplate',model,function(r){
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
        return XHR.PATCH('/eTickets/ApiService/UpdateWorkflowTemplate',{Id:id,Field:field,Value:value},showAlert);
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
                XHR.DELETE('/eTickets/ApiService/DeleteWorkflowTemplate/0'+model.Id,function(r){
                    showAlert(r,function(){ 
                        HIDE('.service-workflow-template-'+model.Id); 
                    }); 
                }); 
            }); 
        });
    }
};

var JS_eTickets_Ticket = {

    "ALL_TICKET_STATUS": 'Open,Assigned,InProgress,OnHold,Resolved,Closed,Completed',//,Cancelled,Pending,Rejected,Draft',
    
    "refreshHandler": 0,

    "formatDates": function(selector, selector1, selector2){
        setTimeout(function(){
            var date = getValue(selector1).split('-');
            var val1 = date[2]+'/'+date[1]+'/'+date[0];
            var val2 = getValue(selector2);

            console.log('selector1 = ' + selector1);
            console.log('date = ' + date);
            console.log('val1 = ' + val1);
            console.log('val2 = ' + val2);

            //return new Date(val1).toLocaleDateString('en-UK')+' ['+val2+']';
            GET('/api/apiuser/ToHijri',{date: val1 , format: 'dd/MM/yyyy'},function(r){
                val2 = r;
                setValue(selector2, val2);
                setValue(selector, val1 +' ['+val2+']');
            });
        },250);
    },

    "showEditUserRegistrationDescriptionForm": function(id){
        var selector = '.ticket-description-'+id;
        var valuesSelector = selector + ' td[data-key]';
        var dates = ['DateOfBirth','DateOfJoin','NationalIdExpiry','SCHSExpiryDate']
        each(valuesSelector, function(x){
            var name = x.getAttribute('data-key').trim();
            var value = x.innerText;
            if(dates.contains(name)){
                x.innerHTML = '<div class="two fields"><input type="hidden" name="'+ name +'" value="'+ value +'">'
                            + ' <div class="field x-date date-'+name+'-gr"><input data-name-'+name+'-'+id+'-Gr onblur="JS_eTickets_Ticket.formatDates(\'.ticket-description-'+id+' '+ '[name='+ name +']\', \'[data-name-'+name+'-'+id+'-Gr]\',\'[data-name-'+name+'-'+id+'-Hj]\')" value="'+ value.split(' ').first().replaceAll('/','-') +'" data-toggle="datepicker"></div>'
                            + ' <div class="field x-date date-'+name+'-hj"><input data-name-'+name+'-'+id+'-Hj value="'+ value.split(' ').last().replaceAll('[','').replaceAll(']','').trim() +'" disabled readonly></div>'
                            + '</div>';
            }else if(name === 'Id'){
                x.innerHTML = '<input name="'+ name +'" value="'+ value +'" disabled readonly>';
            }else{
                x.innerHTML = '<input name="'+ name +'" value="'+ value +'">';
            }
        });
        initializeUI(selector);
        HIDE('[data-edit-description-button="'+id+'"]');
        SHOW('[data-save-description-button="'+id+'"]');
        SHOW('[data-cancel-edit-description-button="'+id+'"]');
    },

    "saveEditUserRegistrationDescriptionForm": function(id){
        POST('/eTickets/ApiTicket/SaveTicketDescriptionForm/'+id, SERIALIZE('.ticket-description-'+id),function(r){
            showAlert(r, function(){ JS_eTickets_Ticket.cancelEditUserRegistrationDescriptionForm(id); });
        })
    },
    "cancelEditUserRegistrationDescriptionForm": function(id){
        setTimeout(function(){
            GETHTML('/eTickets/Ticket/GetDescription/'+id,'.ticket-description-'+id);
            SHOW('[data-edit-description-button]');
            SHOW('[data-edit-description-button="'+id+'"]');
            HIDE('[data-save-description-button="'+id+'"]');
            HIDE('[data-cancel-edit-description-button="'+id+'"]');
        },250);
    },

    "popup": function(url,callback){
        JS_common.embedPopup(url,'.ticket-modal-popup',callback,function(){
            SHOW('.right-pane-ticket-buttons');
        });
        //top.location.href = top.location.href.split('?').first().split('#').first()+'#ticket-modal-popup';
    },

    "Resolution": {
        "reload": function(resolutionId){
            //do nothing now
        },
        "query": function(resolutionCatgory, dropDownSelector){
            setValue(dropDownSelector,'');
            ENABLE(dropDownSelector);
            GET('/eTickets/ApiResolutionCategory/Get',{"NameEn":resolutionCatgory},function(r){
                if(r.Status !== 'success') return showAlert(r);
                var model = r.Data;
                each(dropDownSelector, function(el){
                    el.innerHTML = '<option disabled selected value="">--- SELECT ---</option>' + 
                        model.Resolutions.filter(function(resolution){
                            return resolution.Enabled;
                        }).map(function(resolution){
                            return '<option value="'+ resolution.IdValue +'">'+ resolution.DisplayName +'</option>';
                        }).join('\n')
                        ;
                });
            });
        },
        "delete": function(resolutionId, attachmentIds){
            var model = {
                "Id": resolutionId, 
                "Attachments": attachmentIds.map(function(id){return {"Id":id};})
            };
            DELETE('/eTickets/ApiTicket/DeleteResolutionAttachments',model,function(r){
                showAlert(r,function(){ JS_eTickets_Ticket.Resolution.reload(resolutionId) })
            });
        },
        "loadAttachmentsTemplate": function(resolutionId, resolutionNoteSelector){
            var templateDiv = QS('.list-of-resolution-attachment');
            templateDiv.innerHTML = '';
            setValue(resolutionNoteSelector, '');
            GET('/eTickets/ApiTicket/GetResolution/0'+resolutionId,function (r) {
                var model = r.Data;
                setValue(resolutionNoteSelector, model.Description);
                model.Attachments.forEach(function(attachment){
                    templateDiv.innerHTML += getTemplate('.resolution-attachment-list-template', {
                        "VALUE": attachment.Path,
                        "LABEL": attachment.Name,
                        "xinput": 'input'
                    });     
                });
            })
        },
        "fileUpload": function(fileInput){
            XHR.UPLOAD(fileInput, QS('[data-resolution-attachment][name=Attachment]'),function(r){ 
                setValue('[data-resolution-attachment][name=Attachment]', null); 
                QS('.list-of-resolution-attachment').innerHTML += getTemplate('.resolution-attachment-list-template', {
                    "VALUE": r.Data,
                    "LABEL": r.Message.split("'")[1],
                    "xinput": 'input'
                }); 
            });
        },
        "add": function(resolutionId){
            GETCONFIRM('/eTickets/Resolution/Attachment?ResolutionId='+resolutionId,function(model){
                PUT('/eTickets/ApiTicket/SaveResolutionAttachment',model,function(r){
                    showAlert(r,function(){ JS_eTickets_Ticket.Resolution.reload(resolutionId) })
                });
            });
        }
    },

    "editDescriptionForm": function(id,serviceId,serviceFormName){
        GETCONFIRMEMBED({
            url: '/eTickets/Ticket/TicketDescriptionForm/'+id+'?'+object2UrlComponents({"ServiceId":serviceId,"ServiceFormName":serviceFormName}).join('&'),
            api: '/eTickets/ApiTicket/SaveTicketDescriptionForm/'+id,
            selector: '.ticket-description-'+id,
            callback: function(r){
                
            },
            onShown: function(){
                HIDE('[data-edit-description-button]');
                var inputs = QSA('.modal-content input,textarea');
                if(inputs.any()) setTimeout(function(){
                    FOCUS(inputs.first());
                },500);
            },
            onClose: function(){
                setTimeout(function(){
                    GETHTML('/eTickets/Ticket/GetDescription/'+id,'.ticket-description-'+id);
                    SHOW('[data-edit-description-button]');
                },250);
            }
        });
        /*
        GET('/eTickets/ApiTicket/GetTicketForm/'+id,{"ServiceId":serviceId,"ServiceFormName":serviceFormName},function(r){
            showAlert(r,function(r){
                GET('/eTickets/Service/FieldsTemplate/'+serviceId,function(form){
                   var uid = 'dlg_'+makeid(5);
                   show.dialog({
                    "title": 'Edit service ticket form : ' + serviceFormName,
                    "message": '<div data-'+uid+'>'+form+'</div>',
                    "scrollable": true,
                    "onShown": function(){
                        var model = r.Data;
                        var xmodel = {};
                        var keys = Object.keys(model);
                        for(var i=0;i<keys.length;i++){
                            xmodel['_'+keys[i]] = model[keys[i]];
                        }
                        DESERIALISE('[data-'+uid+']', xmodel);
                    },
                    "onApprove": function(model){
                        //testing now
                    },
                    "onDeny": function(){
                        //do nothing, just close the dialog form
                    }
                   }); 
                });
            });
        });
        */
    },

    "addLabel": function(id){
        GET('/eTickets/ApiTicket/GetAllLabels', function(r){
            var form = '<div class="ui form modal-form">'+
                   ' <div class="ui field">'+
                   '  <label for="Label">New Label:</label>'+
                   '  <input maxlength="500" id="Label" name="Label" autofocus />'+
                   ' </div>'+
                   ' <div class="ui field list">'+
                   r.Data.map(function(label,x){
                    return ' <div class="item my-1">'+
                           '    <div class="ui checkbox hover">'+
                           '     <input  id="policy_label_'+x+'" value="'+label.Label+'" data-id="'+ label.Id +'" name="SelectedLabels" type="checkbox" data-type="list">'+
                           '     <label for="policy_label_'+x+'">'+label.Label+'</label>'+
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
                model.TicketId=id;
                PUT('/eTickets/ApiTicket/AddLabel',model,showAlertThenReload);
            },function(){
                FOCUS('.modal-form input[name=Label]');
            });
        });
    },
    "removeLabel": function(id,label){
        var model = {TicketId:id,Label:label};
        DELETE('/eTickets/ApiTicket/RemoveLabel',model,showAlertThenReload);
    },

    "resendNotification": function(worflowId,callback){
        XHR.GET('/eTickets/ApiTicket/ResendNotification/'+worflowId,function(r){showAlert(r,function(){
            if(typeof callback === 'function') setTimeout(callback,500);
        });});
    },

    "raiseTicketOnBehalfOfUser": function(username){
        POPUP('/eTickets/Ticket/Add?skipSurvey=true&showAllServices=true&ispartial=true&username='+username);
    },

    "refreshLoop": function(){
        
        JS_eTickets_Ticket.refreshHandler = setInterval(function(){
            if(window.REFRESH_TICKETS){
                JS_eTickets_Ticket.reloadListing('.tickets-listing',SERIALIZE('.form-pagination-listing'));
            }
        }, 1000 * 60);
    },

    "revokeSurveyAnswers": function(uid){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            PROMPT('Please provide justification for revoking this ticket survey',function(comment){
                if(comment.length > 500) comment = comment.substr(0,500); 
                XHR.POST('/eTickets/ApiTicket/RevokeSurveyAnswers',{UID:uid,Comment:comment},JS_eTickets_Ticket.reload,showAlert);
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
            JS_eTickets_Ticket.convertJSONcontent();
        });
    },

    "updateResolution": function(id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');
            HIDE('.right-pane-ticket-buttons');
            JS_eTickets_Ticket.popup('/eTickets/Ticket/Resolution/'+id,function(model){
                if(isNullOrEmpty(model.Resolution)) return errorMessageAfterTimeout(500,'Resolution field is mandatory and cannot be empty / null');
                if(isNullOrEmpty(model.ResolutionNotes)) return errorMessageAfterTimeout(500,'Resolution Notes field is mandatory and cannot be empty / null');
                model.Attachment = null;
                if(model.ResolutionNotes.length > 500) model.ResolutionNotes = model.ResolutionNotes.substr(0,500); 
                XHR.PATCH('/eTickets/ApiTicket/UpdateResolution',model,JS_eTickets_Ticket.reload,showAlert);
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

    "updateProfileDocuments": function(uid,username){
        XHR.POST('/eTickets/ApiTicket/UpdateProfileDocuments',{UID:uid},function(r){
            showAlert(r,function(x){
                //JS_eTickets_Ticket.reload(r);
                if(x.Data){
                    JS_Security_User.openForm( username );
                }
            });
        });
    },
    
    "createDomainUser": function(uid,username){
        XHR.POST('/eTickets/ApiTicket/CreateDomainUser',{UID:uid},function(r){
            showAlert(r,function(x){
                JS_eTickets_Ticket.reload(r);
                if(x.Data > 0){
                    JS_Security_User.openForm( username );
                }
            });
        });
    },

    "resolve": function(id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            HIDE('.right-pane-ticket-buttons');

            JS_eTickets_Ticket.popup('/eTickets/Ticket/Resolution/'+id,function(model){
                if(isNullOrEmpty(model.Resolution)) return errorMessageAfterTimeout(500,'Resolution field is mandatory and cannot be empty / null');
                if(isNullOrEmpty(model.ResolutionNotes)) return errorMessageAfterTimeout(500,'Resolution Notes field is mandatory and cannot be empty / null');
                model.Attachment = null;
                if(model.ResolutionNotes.length > 500) model.ResolutionNotes = model.ResolutionNotes.substr(0,500); 
                XHR.PATCH('/eTickets/ApiTicket/Mark',model,JS_eTickets_Ticket.reload,showAlert);
            });
        });
    },

    "showTickets": function(technician,title,fromUID,toUID){
        var options = {
            Technician:technician,
            Status:JS_eTickets_Ticket.ALL_TICKET_STATUS,
            Filters:'{"UID":{Name:"UID",Where:"Between",Value:["'+fromUID+'","'+toUID+'"]}}'
        };
        XHR.GET('/eTickets/Ticket/Listing',options,function(r){ 
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
        

        XHR.PATCH('/eTickets/ApiTicket/SubmitSurvey',model,function(r){
            //showAlert(r,callback);
            invoke(callback,r);
            model.IsPartial=true;
            if(QSA('[data-survey]').length > 0 && r.Status === 'success') {
                    XHR.GET('/eTickets/Ticket/SurveyForm',model,function(r){
                    each('[data-survey]',function(x){x.innerHTML=r;});
                });
            }else if(top.location.href.toLowerCase().contains('/surveyform')){
                top.location.reload();
            }
        });
    },

    

    "openWorkflowForReview": function(requestId,id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');
            
            POPUP('/eTickets/Ticket/Open/'+requestId+'?ispartial=true','fullscreen',function(x){ JS_eTickets_Ticket.convertJSONcontent(x); embedpdfs('.modal [data-embed-pdf-src]'); });
            
            // POPUP('/eTickets/Ticket/Open/'+uid+'?isPartial=true','fullscreen',function(){ 
            //     each('.modal .ticket-description-'+id, function(description){ 
            //         var text = description.innerText; 
            //         if(isJSON(text)){ 
            //             description.innerHTML = TABULAR(JSON.parse(text)); 
            //         } 
            //     }); 
            // });
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

        XHR.POST('/eTickets/Ticket/PreviewSurveyBeforeSubmit',model,function(r){
            CONFIRM(r,function(rmodel){
                JS_eTickets_Ticket.submitSurvey(rmodel,callback);
            });
        });

    },
    "update": function(id,field,value){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            var model = {Id:id, FieldToUpdate: field};
            model[field] = value;
            XHR.PATCH('/eTickets/ApiTicket/Update',model,function(r){
                showAlert(r, function(){ 
                    JS_eTickets_Ticket.reloadNotes(id); 
                    if(field === 'Technician') setTimeout(function(){top.location.reload();},1000);
                });
            });
        });
    },
    "reopen": function(id){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            CONFIRM('Are you sure to re-open this ticket?',function(){
                XHR.PATCH('/eTickets/ApiTicket/ReOpen/'+id,{},JS_eTickets_Ticket.reload);
            });
        });
    },
    "reloadListing": function(selector,vmodel){
        SETHTML(selector,'<center><br><br><br><i class="notched big circle loading icon"></i></center>');
        XHR.GET('/eTickets/Ticket/Listing',vmodel,function(r){
            //SETHTML(selector, r);
            var thead = r.split('<thead>').last().split('</thead>').first();
            var rows = r.split('<tbody>').last().split('</tbody>').first().split('</tr>');
            var row = 0;
            SETHTML(selector,'<table class="stats-table"><thead>'+thead+'</thead><tbody></tbody></table>');
            var handler =0;
			//setTimeout(function(){
				handler = setInterval(function(){
                    var tbody = QS(selector+' table tbody');
                    if(tbody == null || typeof tbody !== 'object') return;
					if(row >= rows.length) {
						clearInterval(handler);
						return;
					}
					tbody.innerHTML += rows[row] + '</tr>';
					row++;
				},5);
			//},250);
            if(r.contains('Password')) clearInterval(JS_eTickets_Ticket.refreshHandler);
        });
    },
    "showAssignTechnicianForm": function(id){
        SMALLDIALOG(null,'/eTickets/Ticket/Assignment/'+id);
    },
    "forwardToIssueTracking": function(id){
        GETCONFIRM('/eTickets/Ticket/ConfirmForwardToIssueTracking/'+id,function(model){
            XHR.PATCH('/eTickets/ApiTicket/ForwardToIssueTracking',model,JS_eTickets_Ticket.reload);
        });
    },

    "prepareSurvey": function(id){
        XHR.PATCH('/eTickets/ApiTicket/PrepareSurvey/'+id,{"Id":id},showAlertThenReload);
    },
    
    "cancel": function(id){
        var msg = '<div class="ui warning visible icon message form">'+
                  ' <i class="ui exclamation triangle icon brown"></i>'+
                  ' <div class="content">'+
                  '  <div class="header">Warning !!!</div>'+
                  '  <div class="field">'+
                  '    <label>Reason for cancellation</label>'+
                  '    <textarea autofocus required onblur="JSCommon.fixCapitalization(this)" rows="2" name="CancellationNotes" data-placeholder="Reason for canelling this ticket ..." maxlength="500"></textarea>'+
                  '  </div>'+
                  '  <p>Proceeding with this action will make the ticket in (<em>Cancelled</em>) Status.</p>'+
                  '  <p>To proceed, click OK</p>'+
                  ' </div>'+
                  '</div>'; 
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');
        
            CONFIRM(msg,function(model){ 
                model.Id = id;
                model.Status = 'Cancelled';
                XHR.PATCH('/eTickets/ApiTicket/Mark',model,JS_eTickets_Ticket.reload);
            });
        });
    },
    
    "mark": function(id,status){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            if('OnHold' === status){
                var msg = '<div class="ui segment form">'+
                          '  <div class="field">'+
                          '    <label class="boldish">Please provide reason for on-holding this ticket</label>'+
                          '    <textarea autofocus required onblur="JSCommon.fixCapitalization(this)" maxlength="500" data-placeholder="reason for on-hold" name="OnHoldNotes" rows="3"></textarea>'+
                          '  </div>'+
                          '</div>';
                return CONFIRM(msg,function(model){
                    model.Id = id;
                    model.Status = status;
                    XHR.PATCH('/eTickets/ApiTicket/Mark',model, JS_eTickets_Ticket.reload,showAlert);
                });
            } else if('Resolved' === status){
                
                return JS_eTickets_Ticket.resolve();
            }
            return XHR.PATCH('/eTickets/ApiTicket/Mark',{Id:id,Status:status},JS_eTickets_Ticket.reload,showAlert);
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
                  '  <textarea onblur="JSCommon.fixCapitalization(this)" maxlength="500" required name="Comment" rows="3" data-placeholder="Comments go here" autofocus></textarea>'+
                  ' </div>'+
                  ' <div class="field">'+
                  '  <label>Attachment</label>'+
                  '  <input type="hidden" name="Attachment" data-note-'+id+'-attachment >'+
                  '  <input type="file" onchange="XHR.UPLOAD(this,QS(\'[data-note-'+id+'-attachment][name=Attachment]\'))" accept=".png,.jpg,.jpeg,.bmp,.tif,.gif,.pdf,.xls,.doc,.docx,.doc,.txt,.zip">'+
                  ' </div>'+
                  '</div>';

        return CONFIRM(msg,JS_eTickets_Ticket.addNote);
    },
    "addNote": function(model){
        XHR.GET('/Api/ApiUser/GetCurrentUser',function(username){
            if(isNullOrEmpty(username)) return POPUP('/User/Login?ispartial=true','mini');

            XHR.PUT('/eTickets/ApiTicket/AddNote',model, function(r){ 
                showAlert(r,function(){  
                    JS_eTickets_Ticket.reloadNotes(model.TicketId);
                    JS_eTickets_Ticket.reloadAttachments(model.TicketId); 
                }); 
            });
        });
    },
    "reloadMetrics": function(id){
        GETHTML('/eTickets/Ticket/Metrics/'+id,'.ticket-metrics-'+id); 
    },
    "reloadAttachments": function(id){
        GETHTML('/eTickets/Ticket/Attachments/'+id,'.ticket-attachments-'+id); 
    },
    "reloadNotes": function(id){
        GETHTML('/eTickets/Ticket/Notes/'+id,'.ticket-notes-'+id); 
    },
    "showPendingLastSurvey": function(username){
        XHR.GET('/eTickets/ApiTicket/GetUnratedTickets/'+username,function(r){
            if(r.Status === 'success' && r.Data.any()){
                XHR.GET('/eTickets/Ticket/RequesterSurvey/'+r.Data.last()+'?isPartial=true&attachToken=true',function(response){
					CONFIRM(response,function(model){
						JS_eTickets_Ticket.previewSurveyBeforeSubmit(model,showAlert);
					});
				});
            }
        });
    },

    "reinitializeWorkflow": function(model){
        var message = '<h4 style="color:red">Are you sure to re-initialize workflow of ticket # "'+model.UID+'"?</h4>' + 
                      '<p>Please note that all approvals on this workflow list will be cleared.</p>'+
                      '<p>To continue, press OK</p>'+
                      TABULAR(model);
        CONFIRM(message, function(){
            PATCH('/eTickets/ApiTicket/ReInitializeWorkflow',model,function(r){
                showAlert(r,function(){
                    setTimeout(function(){ top.location.reload(); },1000);
                });
            });
        });
    },

    "toggleEdit": function(editable,id,username){
        var model = {
            inEditMode: editable,
            Id: id,
            Editor: username,
            IsPartial: true,
            DoneEdit: editable ? null : username
        };
        GETHTML('/eTickets/Ticket/Form/'+id+'?' + toQueryString(model) ,'.partial-view-body');
    },

    "cancelWorkflow": function(model){
        var message = '<h4 style="color:red">Are you sure to cancel workflow of ticket # "'+model.UID+'"?</h4>' + 
                      '<p>Please note that all approvals on this workflow list will be cleared.</p>'+
                      '<p>To continue, press OK</p>'+
                      TABULAR(model);
        CONFIRM(message, function(){
            PATCH('/eTickets/ApiTicket/CancelWorkflow',model,function(r){
                showAlert(r,function(){
                    setTimeout(function(){ top.location.reload(); },1000);
                });
            });
        });
    },

    "reloadWorkflow": function(id){
        GETHTML('/eTickets/Ticket/Workflow/'+id,'.ticket-workflow-'+id);
    },

    "isTherePreviousTickets": function (username, callback) {
        XHR.GET('/eTickets/ApiTicket/QueryOpenTicket',{"Username":username},function(response){
            
            if(response.Data !== null){
                return dialogAlert({
                    Status: 'warning',
                    Message: "You already have a ticket that is in '"+ response.Data.Status +"' Status, <br>with Reference # <b>" + response.Data.UID + "</b> which was requested on: "+ response.Data.RequestedOn +
                             "<hr>"+
                             "Please wait for this ticket to be processed before raising another one !"+
                             "<br><hr><br>"+
                             "لا يمكنك رفع طلب او تذكرة بسبب وجود تذكرة سابقة غير مغلقة",
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
        JS_eTickets_Ticket.previewSurveyBeforeSubmit(model, function(r){
            //dialogAlert(r,callback);
            var message = typeof r === 'string' ? r : ICONS[r.Status] + r.Message.replaceAll('!','<br><br>'+ICONS[r.Status]);
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
        XHR.GET('/eTickets/Ticket/GetLastTicketUnansweredSurvey',{Username:requester},function(res){
            if(!isNullOrEmpty(res.Data)){
                XHR.GET('/eTickets/Ticket/GetLastUnansweredSurvey',res.Data,function(r){
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

        toggleButtonsLoading(btn,true);
        
        try{ setValue('#RaisedUsingBrowser', GETBROWSER()); } catch(e) { }
        
        var model = SERIALIZE('.TicketForm');
        // model.TicketUsername = username;
        // model.TicketPassword = password;
        XHR.POST('/api/apiuser/IsAllowedToUseEServices',{"Username": model.TicketUsername},function(r){
            showAlert(r,function(){
                XHR.POST('/api/ApiUser/IdentifyByPasswordOrNationalIdOrIqama',{Username : model.TicketUsername, NationalId : model.TicketPassword},function(r){
                    showAlert(r,function(r){ 
                        model.NationalId = r.Data.NationalId;
                        model.Mobile = r.Data.Mobile;
                        model.Requester = model.Username = r.Data.Username;
                        model.NameEn = r.Data.NameEn;
                        setValue('.TicketForm #NationalId', model.NationalId);
                        //XHR.POST('/api/ApiUser/ValidateMOHUserInformation',model,function(r){
                        //    showAlert(r,function(){
                                //if(r.Data.NationalId != model.NationalId) return ALERTS.WARNING('Wrong National Id');
                                //model = r.Data;
                                model.Justification = r.Data.Justification = 'for raising a service ticket on IAFH ePolicy web site';
                                /*
                                JS_Security_User.promptForPIN(r.Data,function(){JS_eTickets_Ticket.submitTicketStep1Verify(model,r.Data)},showAlert,function(r){
                                    showAlert(r);
                                    toggleButtonsLoading(btn,false);
                                    invoke(onsuccess,r);
                                });
                                
                               */

                                JS_Security_User.embedSendPIN({
                                    "selector": '.TicketForm #TicketKnowUserForm',
                                    "model": model,
                                    "rmodel": r.Data,
                                    "onshown": function(){
                                        //btn.disabled = true;
                                    },
                                    "onsuccess": function(res){
                                        if(typeof res !== 'undefined') showAlert(res);
                                        each('.ui.small.rounded.image',function(x){ x.src = '/Public/ProfilePhoto/' + model.Username; })
                                        JS_eTickets_Ticket.submitTicketStep1Verify(model,r.Data);
                                    },
                                    "onfail": function(res){
                                        if(typeof res !== 'undefined') showAlert(res);
                                    }
                                });
                                
                        //     });
                        // },function(r){
                        //     showAlert(r);
                        //     toggleButtonsLoading(btn,false);
                        // });
                    });
                });
            });
        });
            
            
    },
    "submitTicketStep1Verify": function(model,rmodel){
        

        JS_eTickets_Ticket.isTherePreviousTickets(model.TicketUsername, function() {
                        
            //var rmodel = r.Data;
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
            
            JS_eTickets_Ticket.showUnansweredSurvey(rmodel.Username);
            each('.TicketForm #SelectUserButton',function(b){ b.onclick(); });                 
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
        var serviceId = getValue('.TicketForm #ServiceId');
        var service = QS('.card-service-'+serviceId);
        if(serviceId == 0 || service == null || typeof service === 'undefined') {
            return dialogAlert({Status:'error',Message:'You need to select a service first <br><br> يتطلب اختيار خدمة أولا',Data:serviceId});
        }
        var icon = service.querySelector('img[data-service-icon]'); 
        var text = service.attributes['data-content'].value;
        SETHTML('.service-requested','<img class="ui avatar image" src="'+ icon.src +'" height="40" width="40"> ' + text );
        
        var agentIcons = {
            "IPAddress": '<i class="ui globe icon"></i>',
            "Asset": '<i class="ui desktop blue icon alternate"></i>',
            "AssetSerialNumber": '<i class="ui barcode red icon alternate"></i>',
            "FixedAssetSerialNumber": '<i class="ui qrcode icon black alternate"></i>'
        };
        var agent = SERIALIZE('.agent-information');
        SETHTML('.agent-info', Object.keys(agentIcons).map(function(x){ return agentIcons[x]+"&nbsp; : &nbsp;"+agent[x]; }).join('<br>'));
        HIDE('.step3');
        SHOW('.step4');
        //FOCUS('#BuildingId');

        QS(".TicketForm #DepartmentId").disabled = false;

        try{
            var data_service_requester_department = service.getAttribute('data-service-requester-department').toLocaleLowerCase();
            
            var requesterDepartment = getValue('.TicketForm #RequesterDepartment');

            if(data_service_requester_department === 'true' && !isNullOrEmpty(requesterDepartment)){
                var option = QSA('.TicketForm select#DepartmentId option').filter(function(x){return x.innerText.trim().startsWith(requesterDepartment)}).first();
                setValue('.TicketForm #DepartmentId', option.value);
                setValue('.TicketForm #Department', option.innerText.trim());
                QS(".TicketForm #DepartmentId").disabled = true;
            }
        }catch(exception){
            //do nothing
        }

        SETHTML('.service-fields-template','');
        setValue('.TicketForm [name=ContentType]','TEXT');
        setValue('.TicketForm [name=Subject]',null);
        setValue('.TicketForm [name=Description]',null);
        SHOW('.TicketForm .description');
        SHOW('.TicketForm .subject');
        HIDE('.service-fields-template-form');

        XHR.GET('/eTickets/Service/FieldsTemplate/'+serviceId+'?requester='+getValue('.TicketForm [name=Requester]'),function(response){
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
        var workflow = getValue('.TicketForm [data-service-workflow]');
        
        if(workflow || workflow === 'true' || workflow === 'True')
        {
            GET('/eTickets/Ticket/PreviewWorkflow?serviceId='+serviceId+'&departmentId='+departmentId+'&requester='+requester,function(response){
                if(!isNullOrEmpty((""+response).trim()))
                {
                    show.alert(ICONS['warning']+'<br>'+
                            'The selected service has a workflow enabled. This ticket can be processed only when the workflow is approved <br><br>'+
                            'الخدمة المطلوبة تحتاج للإعتماد - سيتم تنفيذ الطلب و معالجة التذكرة عند اعتمادها'+
                            '<br><br><hr>'+
                            '<h4>'+ QS('.service-requested').innerHTML +'</h4>'+
                            '<div class="ui visible warning message attached"><div class="header">Workflow</div></div><div class="ui segment attached">'+response+'</div>');
                    SETHTML('.ticket-preview-workflow',response);
                }
            });
        }
	  
        HIDE('.step4');
        SHOW('.step5');
        FOCUS('.TicketForm [name=Subject]');
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
                                    .filter(function(x){ return QSA(formSelector+' [data-field-name="'+x+'"][data-required="True"] span.validity[data-is-valid="false"]').any();  })
                                    .map(function(x){ var el = QSA(formSelector+' [data-field-name="'+x+'"][data-required="True"] span.validity[data-is-valid="false"]').first(); return [x,(''+el.attributes['data-validation-message'].value).replaceAll('[','<').replaceAll(']','>')]; })
                                    ;
            if(validations.any()){
                show.dialog({
                    title: 'Unaccepted responses | اجابات غير مقبولة',
                    message: validations.map(function(x){ return '<div class="ui message attached visible error">'+x[0]+' </div>'+
                                                                 '<div class="ui segment attached"> '+x[1]+'</div>'; 
                                                        }).join('<br>')
                             ,
                    onApprove: function(){
                        FOCUS(formSelector+' [name="'+validations.first().first()+'"]');
                    },
                    size:'small'
                });
                return;
            }

            setValue('.TicketForm [name=Description]',JSON.stringify(form).replaceAll('"_','"'));
        }

    


        if(!checkRequiredFields('.TicketForm .step5')) return;
        // if(['#Subject','#Description'].map(getValue).filter(isNullOrEmpty).any()) {
        //     return ALERTS.ERROR('You must provide subject and description of the ticket');
        // }
        var hndl = 0;
        var p = 0;
        var dlg = show.progress({"title":'Please wait while ticket is being created ...'},function(){
            hndl = setInterval( function() {
                $('.ui.progress.show-dlg-progress').progress({"percent": 100*p });
                p+=0.25;
                if(p>=1) p=0;
            }, 250);
        });
        toggleButtonsLoading(btn, true);
        var model = SERIALIZE('.TicketForm');
        

        XHR.POST('/eTickets/ApiTicket/Submit',model,function(r){
            try{ clearInterval(hndl); } catch(e) {}
            dlg.modal('hide');
            showAlert(r,function(){ 
                //GETHTML('/eTickets/Ticket/Detail/'+r.Data,'.ConfirmationView'); 
                var UID = r.Data;
                GETHTML('/eTickets/Email/TicketConfirmation/'+UID+'?isPartial=true','.ConfirmationView');

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
        XHR.GET('/eTickets/ApiTicket/GetTicketCompletionRate/'+uid,function(r){
            if(r.Status == 'success') invoke(callback,r.Data);
        });
    },

    "reloadTasks": function(uid){
        GETHTML('/eTickets/Ticket/Tasks/'+uid+'?'+top.location.href.split('?').last(),'.ticket-tasks-'+uid,function(){
            each('[data-tasks-completed]',function(x){
                if(x.attributes['data-tasks-completed'].value === 'true'){
                    setTimeout(function () { top.location.reload(); },1000);
                }
            });
        });
        JS_eTickets_Ticket.getTicketCompletionRate(uid,function(rate){
            setInnerText('.ticket-completion-rate-'+uid,rate);
        });
    },

    "editTask": function(id,uid,sn,taskId){
        //var url = '/eTickets/Ticket/TaskEdit/'+taskId+'?'+object2UrlComponents({"TicketId":id,"UID":uid,"SN":sn,"IsPartial":true}).join('&');
        // var onOK = function(model){
        //     XHR.PUT('/eTickets/ApiTicket/SaveTask',model,function(r){ 
        //         showAlert(r,function(){ JS_eTickets_Ticket.reloadTasks(uid) }); 
        //         JS_eTickets_Ticket.reloadNotes( id );
        //     });
        // };
        //GETCONFIRM(url,onOK);
        HIDE('[data-task-edit-form]');
        GETCONFIRMEMBED({
            "url": '/eTickets/Ticket/TaskEdit/'+taskId+'?'+object2UrlComponents({"TicketId":id,"UID":uid,"SN":sn,"IsPartial":true}).join('&'),
            "api": '/eTickets/ApiTicket/SaveTask',
            "method": 'PUT',
            "callback": function(){ 
                JS_eTickets_Ticket.reloadTasks(uid); 
                JS_eTickets_Ticket.reloadNotes(id); 
            },
            "selector": 'div[data-task-edit-form="'+ taskId +'"]',
            "onShown": function(){ 
                setTimeout(function(){ 
                    //top.location.href = top.location.href.split('#').first() +'#task-' + taskId;
                    //SETHTML('div[data-task-edit-form]','');
                    SHOW('[data-task-edit-form="'+taskId+'"]',function(){
                        FOCUS('div[data-task-edit-form="'+taskId+'"] [autofocus]');
                    });
                },250); 
            }
        });
        
    },
    
    "changeTaskStatus": function(id,uid,sn,notes,username,status,statusList){
        var form = '<div class="ui form">'+
                   ' <input type="hidden" name="TicketId" value="'+id+'" data-type="numeric">' +
                   ' <input type="hidden" name="UID" value="'+uid+'">' +
                   ' <input type="hidden" name="SN" value="'+sn+'" data-type="numeric">' +
                   ' <input type="hidden" name="Username" value="'+username+'">' +
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
            XHR.PATCH('/eTickets/ApiTicket/ChangeTaskStatus',model,function(r){ 
                showAlert(r,function(){ JS_eTickets_Ticket.reloadTasks(uid) });
                JS_eTickets_Ticket.reloadNotes( id );
            });
        });
    },

    "previewTask": function(uid,sn,ticketId,taskId){
        //POPUP('/eTickets/Ticket/Task?'+toQueryString({"UID":uid,"SN":sn}),'small');
        //SETHTML('div[data-task-edit-form]','');
        HIDE('[data-task-edit-form]');
        GET('/eTickets/Ticket/Task/'+taskId,{"UID":uid,"SN":sn},function(r){
            //top.location.href = top.location.href.split('#').first() +'#task-' + taskId;
            SETHTML('div[data-task-edit-form="'+taskId+'"]',r);
            SHOW('[data-task-edit-form="'+taskId+'"]');
        });
    },
    //(@service.Id,'@(service.DisplayName)','@(service.Icon)',@service.Workflow)
    "selectService": function(id,displayName,icon,workflow){
        setValue('.TicketForm #ServiceId', id); 
        setValue('.TicketForm [data-service-workflow]', workflow); 
        
        QS('#selectServiceButton').disabled = false;
        each('[data-selected-card]',function(x){ x.attributes.removeNamedItem('data-selected-card'); }); 
        QS('.card-service-'+id).setAttribute('data-selected-card',true);
        QS('#ServiceOption'+id).checked=true; 
        QS('#selectServiceButton').onclick();
    },

    "saveTicketAssigned": function(btn,selector){
        //var serviceIdSelect = QS(selector +' [name=ServiceId]');
        //setValue(selector + ' [name=Service]', serviceIdSelect.options[serviceIdSelect.selectedIndex].innerText.trim());

        if(!checkRequiredFields(selector)) return;
        toggleButtonsLoading(btn,true);
        var model = SERIALIZE(selector);
        XHR.POST('/eTickets/ApiTicket/SaveTicketAssigned',model,function(r){
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
                    top.location.href='/eTickets/Ticket/Form/'+r.Data.UID+'?inEditMode=true';
                }, 500);
            });
        });
    }
};



var JS_eTickets_Issue = {
    "close": function(listOfIssueIds){
        if(typeof listOfIssueIds === 'undefined' || listOfIssueIds == null || !Array.isArray(listOfIssueIds)) return;
        XHR.PATCH('/eTickets/ApiIssue/Close',{"Issues": listOfIssueIds}, function(){
            top.location.reload();
        });
    },
    "addNote": function(uid){
        PROMPT('Please provide some notes to add as an update to this ticket?',function(note){
            XHR.PUT('/eTickets/ApiIssue/AddNote',{"UID":uid,"Note":note},JS_eTickets_Issue.reload);
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

var hidden = "";
var visibilityChange = "";

(function () {
    'use strict';
    
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, function (e) {
        if (document[hidden]) {
            clearInterval(JS_eTickets_Ticket.refreshHandler);
            console.log('clearing interval');
        }
    });
}());