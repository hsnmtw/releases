var JS_Security_Session = {
    "kill": function (listOfSessionIds) {
        if(!listOfSessionIds.any()) return;
        CONFIRM('Are you sure to kill the selected session(s)?<br><ul><li>'+listOfSessionIds.join('</li><li>')+'</li></ul>',function(){
            XHR.PATCH('/api/ApiSession/Kill',{'Data': listOfSessionIds},function(r){
                showAlert(r, reloadAfter2000)
            }); 
        });
    }
};

var JS_eService_MenuItem={
    "moveToMenu": function(list){
        GET('/Security/ApiMenu/All',function(menus){
            var msg = '<div class="list">'+
                        menus.map(function(menu){
                            return '<div class="item">'+
                                   '  <div class="ui radio checkbox">'+
                                   '    <input id="menu_'+menu.Id+'" name="MenuId" type="radio" value="'+ menu.Id +'">'+
                                   '    <label for="menu_'+menu.Id+'">'+
                                   '       <i class="'+ menu.Icon +' icon"></i>' + menu.DisplayName +
                                   '    </label>'+
                                   '  </div>'+
                                   '</div>';
                        }).join('\n') +
                      '</div>'
            var callback = function(model){
                model.MenuItems = list;
                POST('/Security/ApiMenuItem/MoveToMenu',model,showAlert);
            };
            return show.confirm({
                message: msg,
                onApprove: callback,
                size: 'tiny'
            });
        });
    }
}

var JS_Security_AgentDevice = {
    "changeStatus": function(id,listOfDevicesIds){
        if(!(typeof listOfDevicesIds === 'object' || Array.isArray(listOfDevicesIds)) || !listOfDevicesIds.any()) return;
        //GET('/Security/ApiAgent/Query',function(r){
            //if(!(typeof r.Status === 'string' && r.Status === 'success')) return;
            var options = ['Active | نشط','Store | مخزون','Damaged | تالف','Lost | مفقود','Off | مطفيء'].map(function(x){ return '<option value="'+x.split('|').first().trim()+'">'+x+'</option>'; }).join('');
            var message = '<div class="field">'+
                          ' <label>Change Status To:</label>'+
                          " <select name='Status' class='select2' required>"+
                          '   <option selected disabled value=""></option>'+
                            options+
                          ' </select>'+
                          '</div>';
            CONFIRM(message,function(model){
                model = {
                    "Id": id,
                    "DevicesStatus": model.Status,
                    "RegisteredDevices":  listOfDevicesIds.map(function(id){ return {"Id":id}; }) //[{Id:?},{Id:?},{Id:?}]
                };
                XHR.PATCH('/Security/ApiAgent/ChangeDevicesStatus',model,function(r){
                    showAlert(r,function(r){
                        JS_Security_AgentDevice.reload(model.Id);
                    });
                });
            });
        //});
    },
    "transfer": function(id,listOfDevicesIds){
        if(!(typeof listOfDevicesIds === 'object' || Array.isArray(listOfDevicesIds)) || !listOfDevicesIds.any()) return;
        GET('/Security/ApiAgent/Query',function(r){
            if(!(typeof r.Status === 'string' && r.Status === 'success')) return;
            var options = r.Data.map(function(x){ return '<option value="'+ x.SN +'">'+ x.SN +' | '+ x.Name +' | '+ x.IP +' | '+ x.Status +'</option>'; }).join('');
            var message = '<div class="field">'+
                          ' <label>Transfer to another PC / Agent:</label>'+
                          " <select name='SerialNumber' class='select2' required>"+
                          '   <option selected disabled value=""></option>'+
                            options+
                          ' </select>'+
                          '</div>';
            CONFIRM(message,function(model){
                model = {
                    "Id": id,
                    "SerialNumber": model.SerialNumber,
                    "ComputerName": r.Data.filter(function(x){ return x.SN === model.SerialNumber; }).first().Name,
                    "RegisteredDevices":  listOfDevicesIds.map(function(id){ return {"Id":id}; }) //[{Id:?},{Id:?},{Id:?}]
                };
                XHR.PATCH('/Security/ApiAgent/TransferDevices',model,function(r){
                    showAlert(r,function(r){
                        JS_Security_AgentDevice.reload(model.Id);
                    });
                });
            });
        });
    },
    "filterDeviceModels": function(manufacturer, deviceType, deviceModelsSelectElement){
        deviceModelsSelectElement.innerHTML = '<option selected>Unspecified</option>';
        GET('/Security/Agent/GetDeviceModels',{"Manufacturer":manufacturer,"DeviceType": deviceType},function(r){
            if(r.Data == null || isNullOrEmpty(r.Data) || !Array.isArray(r.Data) || typeof r.Data != 'object'){
                return;
            }
            r.Data.forEach(function( element ) {
                deviceModelsSelectElement.innerHTML += '<option value="'+ element.Name +'">'+ element.Name +'</option>';
            });
        });
    },
    "add": function (id) {
        return this.edit(id,0);
    },
    "edit": function(id,deviceId){
        GETCONFIRMEMBED({
            "url": '/Security/Agent/Device/'+id+'/'+deviceId,
            "api": '/Security/ApiAgent/SaveDevice',
            "callback": function(r){ JS_Security_AgentDevice.reload(id); },
            "onShown": function(){
                each('.modal-content input[name="SerialNumber"]',function(sn){
                    sn.onblur = function(){
                        sn.classList.remove('error');
                        GET('/Security/ApiAgent/QueryRegisteredDevice',{SerialNumber: sn.value},function(r){
                            if(r.Data != null && Array.isArray(r.Data) && r.Data.any()){
                                var frst = r.Data.first();
                                var currentId = getValue('.modal-content [name=Id]');
                                if(frst.Id == currentId) return;
                                /*
                                  {"Id":225,
                                   "AgentSerialNumber":"FXNJW53",
                                   "ComputerName":"02-01-0004",
                                   "Manufacturer":"Zebra",
                                   "DeviceModel":"GX420t (Black)",
                                   "SerialNumber":"123",
                                   "DeviceType":"Barcode Printer","Status":"Active","Notes":"test","History":null,"CreatedBy":"huabalmutawa","CreatedOn":"2022-11-16T13:58:32.5","UpdatedBy":"huabalmutawa","UpdatedOn":"2022-11-16T13:58:32.5","Manufacturers":[],"DeviceModels":[],"Agents":[],"DeviceTypes":[]}
                                */
                                var first = '(<b>Type:</b> {0}, <b>Status:</b> {1}, <b>Manufacturer:</b> {2}, <b>Model:</b> {3}, <b>Computer:</b> {4})'
                                             .replace('{0}',frst.DeviceType)
                                             .replace('{1}',frst.Status)
                                             .replace('{2}',frst.Manufacturer)
                                             .replace('{3}',frst.DeviceModel)
                                             .replace('{4}',frst.ComputerName);
                                ALERTS.WARNING('Serial Number ['+ sn.value +'] is already used by device : ' + first );
                                sn.classList.add('error');
                            }
                        });
                    };
                });
            }
        });
    },
    "delete": function(id,listOfDevicesIds){
        if(!(typeof listOfDevicesIds === 'object' || Array.isArray(listOfDevicesIds)) || !listOfDevicesIds.any()) return;
        var message = "Are you sure to delete the selected items?";
        CONFIRM(message,function(){
            var model = {
                "Id": id,
                "RegisteredDevices":  listOfDevicesIds.map(function(id){ return {"Id":id}; }) //[{Id:?},{Id:?},{Id:?}]
            };
            XHR.DELETE('/Security/ApiAgent/DeleteDevices',model,function(r){
                showAlert(r,function(r){
                    JS_Security_AgentDevice.reload(model.Id);
                });
            });
        });
    },
    "reload": function(id){
        GET('/Security/Agent/RegisteredDevices/'+id,function(r){
            if(isNullOrEmpty(r)) top.location.reload();
            else SETHTML('[data-agent-registered]',r);
        });
    }
};

var JS_Security_Staff = {
    "showDetails": function(id){
        return show.alert(TABULAR(SERIALIZE('#StaffForm')));
    },
	"confirmDelete": function(id){
		return CONFIRM('Are you sure to delete this record?',function(x){
			XHR.DELETE('/Security/ApiStaff/Delete/0'+id,SERIALIZE('#StaffForm'), alertThenGoBack);
		});
	},
	"pullFromDomain": function (domain){
		return XHR.POST('/Security/ApiStaff/PullFrom'+domain,SERIALIZE('#StaffForm'), function(r){ 
			showAlert(r, function(r){
				var model = { 
					"Username": (r.Data.E_MAIL+'@').split('@').first().toLowerCase(), 
                    "NameEn": r.Data.USER_NAME, 
					"NameAr": r.Data.USER_NAME_S, 
					"NationalId": r.Data.NATIONAL_NO, 
					"Mobile": r.Data.MOBILE,
                    "Email": r.Data.E_MAIL,
					"EmployeeId": r.Data.NOTES
				};
				var msg = '<div class="p-1"><div class="ui attached message">Confirmation</div><div class="ui attached segment"><p>'+
						   r.Message.split('[').first() + '<br><code>' + r.Message.split('[').last().replace(']','').split(',').join(', ') + '</code></p><hr>'+ TABULAR(model) +'<hr><em style="color:red">Do you want to proceed?</em></div></div>'
				CONFIRM( msg,function(x){  
					DESERIALIZE('#StaffForm',r.Data);  
				}) 
			}) 
		});
	}
};

var JS_Security_DomainComputer = {
    "delete": function(btn){
        var list = getValues('[data-domain-computer]:checked');
        if(!list.any()) return false;
        CONFIRM('Are you sure to delete the computers <ul><li>'+list.join('</li><li>')+'</li></ul>',function(){
            XHR.DELETE('/Security/ApiDomainComputer/DeleteList',{"Computers":list},function(r){
                showAlert(r,reloadAfter2000);
            });
        });
    },
    "synchronize" : function(btn){
        XHR.GET('/Security/ApiDomainComputer/Synchronize',function(r){showAlert(r,reloadAfter2000)});
    },
    "moveToOtherOU": function(btn){
        var list = getValues('[data-domain-computer]:checked');
        if(!list.any()) return;
        JS_Security_Department.all(function(departments){
            var form =  '<div class="ui form">' +
                        ' <div class="field">'+
                        '  <label>Selected Computers</label>'+
                        '  <textarea class="disabled" style="background-color:whitesmoke;font-weight:bold;font-size:larger" disabled name="Computers" rows="6" value="'+ list.join('\n') +'">'+ list.join('\n') +'</textarea>'+
                        ' </div>'+
                        ' <div class="field">' +
                        '  <label>Department</label>'+
                        '  <select class="select2" name="Department">'+
                        '    <option disabled selected value="">--- SELECT ---</option>'+
                        departments.map(function(x){ return '<option value="'+x.DomainGroupName+'">'+ x.DisplayName +'</option>' }).join('')+
                        '  </select>'+
                        ' </div>' +
                        '</div>'
            ;
            CONFIRM(form,function(model){
                XHR.PATCH('/Security/ApiDomainComputer/MoveToOtherOrganizationUnit',model,function(r){
                    showAlert(r, reloadAfter2000);
                });
            });
        });
    }
};

var JS_Security_InventoryRequest = {
    "moveItem": function(selector,delta){
        var options = QSA(selector);
        if(!options.any()) return;
        var option = options.first();
        var model = {
            UID: option.attributes["data-uid"].value,
            Id: Number(option.value),
            Delta: delta
        };
        
        XHR.PATCH('/Security/ApiInventoryRequest/MoveItem',model,function(r){
            move(QS('tr[data-row="'+ option.value +'"]'),delta);
        });
        
    },
    "progressHandle": 0,
    "submitTicket": function(uid,id){
        var model = SERIALIZE('#InventoryRequestForm[data-form-id="'+id+'"]');
        var dlg = show.progress({title:'Report Generation Progress ... '},function(){
            JS_Security_InventoryRequest.progressHandle = setInterval( function() {
                XHR.GET('/Security/ApiInventoryRequest/GetReportProgress/'+model.Id,function(p){
                    $('.ui.progress.show-dlg-progress').progress({"percent": 100*p });
                });
            }, 500);
        });
        XHR.PUT('/Security/ApiInventoryRequest/SubmitTicket',model,function(r){
            showAlert(r,function() {
                $('.ui.progress.show-dlg-progress').progress({"percent": 100 });
                clearInterval(JS_Security_InventoryRequest.progressHandle);
                setTimeout(function(){
                    dlg.modal('hide');
                    invoke(reloadAfter2000);
                },1000);
            });
        });
    },
    "downloadReport": function(uid,id,fileType){
        var dlg = show.progress({title:'Report Generation Progress ... '},function(){
            JS_Security_InventoryRequest.progressHandle = setInterval( function() {
                XHR.GET('/Security/ApiInventoryRequest/GetReportProgress/'+id,function(p){
                    $('.ui.progress.show-dlg-progress').progress({"percent": 100*p });
                });
            }, 500);
        });
        XHR.GET('/Security/ApiInventoryRequest/Get'+fileType+'InventoryRequestReport/'+uid,function(file){
            $('.ui.progress.show-dlg-progress').progress({"percent": 100 });
            clearInterval(JS_Security_InventoryRequest.progressHandle);
            setTimeout(function(){
                dlg.modal('hide');
                top.location.href='/Download/File?name='+encodeURIComponent(file);
            },1000);
        });
    },
    "editItem": function(id,uid,sn){
        GETCONFIRM('/Security/InventoryRequest/ItemForm/'+id+'?uid='+encodeURIComponent(uid)+'&sn='+sn+'&ispartial=true',function(model){ 
            XHR.POST('/Security/ApiInventoryRequest/SaveItem',model,function(r){
                showAlert(r,function(){ 
                    JS_Security_InventoryRequest.reloadItems(uid); 
                });
            }); 
        });
    },
    "reloadItems": function(uid){
        GETHTML('/Security/InventoryRequest/ItemList?IsPartial=true&UID='+uid,'[data-inventory-items-list]');
        GETHTML('/Security/InventoryRequest/ItemSummary?IsPartial=true&UID='+uid,'[data-inventory-items-summary]');
    },
    "addItem": function(uid){
        GETCONFIRM('/Security/InventoryRequest/ItemForm/0?isPartial=true&uid='+uid,function(model){
            XHR.POST('/Security/ApiInventoryRequest/SaveItem',model,function(r){showAlert(r,function(){ JS_Security_InventoryRequest.reloadItems(uid); })});
        });
    },
    "removeItem": function(uid,id){
        XHR.DELETE('/Security/ApiInventoryRequest/DeleteItem/'+id,function(r){showAlert(r,function(){ JS_Security_InventoryRequest.reloadItems(uid); })});
    },
    "removeItems": function(uid,snList){
        XHR.DELETE('/Security/ApiInventoryRequest/DeleteItems/'+uid+'/'+snList.join(','),function(r){showAlert(r,function(){ JS_Security_InventoryRequest.reloadItems(uid); })});
    }
};


var JS_Security_Menu = {
    "changeMenuItemOrder": function(menuId,id,delta){
        XHR.PATCH('/Security/ApiMenu/ChangeMenuItemOrder',{"MenuId":menuId,"Id":id,"MenuItemOrder":delta},function(r) {
            showAlert(r,function(){
                // var list = QS('.menu-items-list');
                // var item = QS('.menu-items-list [data-menu-item="'+id+'"]');
                // if(delta < 0){
                //     list.insertBefore(item, item.previousElementSibling);
                // }
                // if(delta > 0){
                //     list.insertBefore(item, item.nextElementSibling.nextElementSibling);
                // }
                GETHTML('/Security/Menu/MenuItems/'+menuId,'.menu-items-list-'+menuId);
            });
        });
    },
};

var JS_Security_Building = {
    //
    "reloadFloors": function (buildingSelector, floorSelector, departmentSelector, callback) {
        
        var BuildingId = QS(buildingSelector);
        var FloorId = QS(floorSelector);
        var DepartmentId = QS(departmentSelector);

        DepartmentId.disabled=true;
        FloorId.disabled=true;
        DepartmentId.innerHTML='<option disabled selected value="">--- SELECT ---</option>'; 
        FloorId.innerHTML='<option disabled selected value="">--- SELECT ---</option>';
        setValue(FloorId,''); 
        setValue(DepartmentId,''); 
        GET('/Security/ApiBuildingFloor/GetFloorsByBuildingId/0'+BuildingId.value,function(r){ 
            if(r.Status === 'error') {return;} 
            FloorId.disabled=false; 
            FloorId.innerHTML = '<option disabled selected value="">--- SELECT ---</option>' + r.Data.map(function (model) {
                return  ['<option value="' , model.Id , '">' , model.DisplayName , '</option>'].join("");
            }).join("\n");
            invoke(callback);
        });



        // if(+('0'+Building.value) < 1) return;
        // Department.disabled=true;
        // Floor.disabled=true;
        // Department.innerHTML='<option disabled selected value="">--- SELECT ---</option>'; 
        // Floor.innerHTML='<option disabled selected value="">--- SELECT ---</option>';
        // setValue(Department, null); 
        // setValue(Floor, null);
        // XHR.GET('/Security/ApiBuildingFloor/GetFloorsByBuildingId/0'+Building.value, function(r){ 
        //     if(typeof r.Status !== 'undefined' && !r.Status === 'success') {return;} 
        //     Floor.disabled=false; 
        //     Floor.innerHTML = '<option disabled selected value="">--- SELECT ---</option>' + r.Data.map(function (model) {
        //         return  ['<option value="' , model.Id , '">' , model.DisplayName , '</option>'].join("");
        //     }).join("\n");
        // });
    },

    // "reloadDepartments": function(floorSelector, departmentSelector){
    //     var FloorId = QS(floorSelector);
    //     var DepartmentId = QS(departmentSelector);
    //     DepartmentId.disabled=true;
        
    //     setValue(DepartmentId,'');

    //     GET('/Security/ApiBuildingFloorDepartment/GetDepartments?FloorId='+FloorId.value+'&BuildingId='+BuildingId.value,function(r){ 
    //         if(r.Status === 'error') {return;} 
    //         DepartmentId.disabled=false; 
            
    //         DepartmentId.innerHTML = '<option disabled selected value="">--- SELECT ---</option>' + r.Data.map(function (model) {
    //             return  ['<option value="' , model.Id , '">' , model.DisplayName , '</option>'].join("");
    //         }).join("\n");
    //     });
    // }
};
// [END] JS_Security_Building

var JS_Security_Floor = {
    "reloadDepartments": function (buildingSelector, floorSelector, departmentSelector, callback) {
        var Building, Floor, Department;
        Building = QS(buildingSelector);
        Floor = QS(floorSelector);
        Department = QS(departmentSelector);
        if(+('0'+Building.value) < 1 || +('0'+Floor.value) < 1) return;
        Department.disabled=true;
        Department.innerHTML='<option disabled selected value="">--- SELECT ---</option>';
        setValue(Department, '');
        XHR.GET('/Security/ApiBuildingFloorDepartment/GetDepartments',{"FloorId":Floor.value, "BuildingId":Building.value},function(r){ 
            if(typeof r.Status !== 'undefined' && !r.Status === 'success') {return;} 
            if(typeof r.Data !== 'object' || !Array.isArray(r.Data)) throw Error('the type of data fetched from "/Security/ApiBuildingFloorDepartment/GetDepartments" is "' + typeof(r.Data) + '" and is not accepted');
            Department.disabled=false; 
            Department.innerHTML = '<option disabled selected value="">--- SELECT ---</option>' + r.Data.map(function(model){ 
                return ['<option data-manager="', model.Head ,'" data-manager-name="', [model.HeadNameEn, model.HeadNameAr].join(' | ') ,'" value="',model.Id,'">', model.DisplayName, '</option>'].join("");
            });
            invoke(callback);
        });
    }
};
// [END] JS_Security_Floor

var JS_Security_Department = {
    "delete": function(id,callback){
        CONFIRM('You are about to delete this department, to proceed click OK !',function(){
            XHR.DELETE('/Security/ApiDepartment/Delete/'+id,callback);
        });
    },
    "addBuildingFloor": function(model,callback){
        XHR.PUT('/Security/ApiDepartment/AddBuildingFloor',model,callback);
    },
    "removeBuildingFloor": function(departmentId,bfId,callback){
        var model = {"DepartmentId":departmentId,"BuildingFloorId": bfId};
        XHR.DELETE('/Security/ApiDepartment/RemoveBuildingFloor',model,callback);
    },
    "deleteBuildingFloor": function(departmentBuildingFloorId,departmentId,callback){
        var model = {"Id":departmentBuildingFloorId,"DepartmentId":departmentId};
        XHR.DELETE('/Security/ApiDepartment/DeleteBuildingFloor',model, function(r){
            showAlert(r,callback);
        });
    },
    "reloadBuildingFloors": function(id, targetSelector){
        XHR.GET('/Security/Department/BuildingFloors/'+id,function(r){ SETHTML(targetSelector, r); });
    },
    "populateDropDownList": function (){
        XHR.GET('/Security/ApiDepartment/All'   , function(options){
            populateDDL(options,'Department','_Department',{keys: ['Code','NameEn'], delim: ' - '},['Code','NameEn','NameAr'],true);
        });
    },

    "get": function(id,callback){
        XHR.GET('/Security/ApiDepartment/Get/'+id,callback);
    },

    "updateFormFields": function(groupName, groups, targetSelector){

        var form = QS(targetSelector);
        var group = groups.filter(function(x){ return x.Name == groupName; }).first();
        
        form.querySelector('#HeadNameEn').value = form.querySelector('[data-head-name-en]').innerText = null;
        form.querySelector('#HeadNameAr').value = form.querySelector('[data-head-name-ar]').innerText = null;
        form.querySelector('#FQDN').value = form.querySelector('[data-fqdn]').innerText = null;
        form.querySelector('#Head').value = form.querySelector('[data-head]').innerText = null;

        if(group == null) return;
        
        form.querySelector('#NameEn').value = group.Name.split('-').last().trim();
        form.querySelector('#FQDN').value   = form.querySelector('[data-fqdn]').innerText = group.FQDN;
        form.querySelector('#Head').value   = form.querySelector('[data-head]').innerText = group.Owner;
        if(!isNullOrEmpty(group.Owner))
        {
            JS_Security_User.query(group.Owner, 'IAFH', function(user){
                form.querySelector('#HeadNameEn').value = form.querySelector('[data-head-name-en]').innerText = user.NameEn;
                form.querySelector('#HeadNameAr').value = form.querySelector('[data-head-name-ar]').innerText = user.NameAr;
            });
        }
    },
    
    "setManagerBasedOnDepartment": function(){
        
        // var option=QS('#Department option[data-code=\''+ getValue('#Department').split('-').first().trim() +'\']');
        // QS('#Manager').value = option.attributes['data-manager'].value; 
        // QS('[data-manager-name-div]').innerText = option.attributes['data-manager-name'].value;

        var model = SERIALIZE('#RegisterForm');
        GET('/Security/ApiDepartment/GetManager',{"Username": model.Username, "Department": model.Department}, function(r){
            setValue('#RegisterForm #Manager', r.Data.Manager);
            setInnerText('#RegisterForm [data-manager-name-div]', r.Data.ManagerName);
        });
    },

    // "changeManager": function(id){
    //     if(isNullOrEmptyOrZero(id)) id='0';
    //     DIALOG(null,'/Security/Department/ChangeManager/'+id+'?isPartial=true','Change Department Manager');
    // },

    // "submitChangeManager": function(model,callback){
    //     XHR.PUT('/Security/ApiDepartment/SubmitChangeManager',model,callback);
    // },

    "synchronize":function(button,model,callback){
        model.SyncOnly = true;
        XHR.POST('/Security/ApiDepartment/Save',model,function(r){
            showAlert(r, function(r){
                XHR.POST('/Security/ApiDepartment/SynchronizeWithDomain',model,function(r){
                    showAlert(r,callback);
                });
            });
        });
    },
	
	"synchronizeAll": function(button){
		XHR.GET('/Security/ApiDepartment/SynchronizeAll',{},showAlert);
	},

    "setManager": function (Department, managerSelector, managerNameSelector){
        var ManagerName = QS(managerNameSelector);
        var Manager = QS(managerSelector);
        setValue(Manager    ,null);
        setValue(ManagerName,null);
        each('#'+ Department.id +' option[data-manager][data-manager-name][value="' + Department.value + '"]', function(option){
            setValue(Manager    , option.attributes['data-manager'].value);
            setValue(ManagerName, option.attributes['data-manager-name'].value);
        });
    },

    "all": function(callback){
        XHR.GET('/Security/ApiDepartment/All',callback);
    }
};
// [END] JS_Security_Department

var JS_Security_JobTitle = {
    "checkDuplicate": function(input){
        hideAlert();
        var field = isNullOrEmpty(input.id) ? input.name : input.id;
        var jobtitles = QSA('option[data-jobtitle][data-'+ field +'="'+ input.value +'"]');
        if(jobtitles.length > 0){
            var option = jobtitles[0];
            var jobtitle = '[Id: "'+ option.attributes['value'].value +'", En: "'+ option.attributes['data-NameEn'].value +'", Ar: "'+ option.attributes['data-NameAr'].value +'" ]'
            ALERTS.WARNING('Same job title was entered before: <br>' + jobtitle);
        }
    },

    "addJobTitle": function(){
        JS_Security_JobTitle.showAddForm(function(r){
            var model = r.Data; 
            each('select[name="JobTitleId"]', function(x){ 
                x.innerHTML+='<option value="'+ model.Id +'" data-jobtitle data-NameEn="'+ model.NameEn +'" data-NameAr="'+ model.NameAr +'" >'+ model.NameEn +' | '+ model.NameAr +'</option>';
                setValue(x, model.Id); 
            });
        });
    },

    "showAddForm": function (callback) {
        var form = '<div class="ui form">' +
                   ' <div data-alert-box-view class="hide"></div>' +
                   '  <h4 class="header">Add Job Title</h4><hr>  ' +
                   '  <div class="field"><label>Name English</label>  ' +
                   '    <input name="NameEn" onblur="JS_Security_JobTitle.checkDuplicate(this)" autofocus></div>' +
                   '  <div class="field"><label>Name Arabic</label>   ' +
                   '    <input name="NameAr" onblur="JS_Security_JobTitle.checkDuplicate(this)"></div>         ' +
                   ' <input type="hidden" name="Id" value="0" data-type="numeric"/>'+
                   '</div>';

        show.dialog({
            size:'small',
            message: form,
            onApprove: function (model) {
                hideAlert();
                XHR.POST('/api/ApiCommon/AddJobTitle', model, function (r) {
                    showAlert(r, callback);
                });
            },
            onDeny: function () {
                
            }
        });
        setTimeout(function () {
            FOCUS('.DialogJobTitleForm [name=NameEn]');
        },100);
    }
};
// [END] JS_Security_JobTitle


var JS_Security_Area = {
    
    "save": function (selector) {
        var model = SERIALIZE(selector);
        XHR.POST('/Security/ApiArea/Save',model, function(r){ 
            showAlert(r, function(r){  
                each(selector+' img.AreaIcon', function(img){ img.src='/Public/AreaIcon/'+r.Data; }); 
            }); 
        });
    }    
};
//[END] JS_Security_Area


var JS_Security_User = {
    "validateUserRegistrationDates": function(model,callback){
        XHR.POST('/api/ApiUser/FixUserRegistrationDates',model,function(r){
            if(r.Status !== 'success'){ 
                r.Message += '<br><hr><br>' + TABULAR(r.Data);
                return dialogAlert(r); 
            }
            invoke(callback,r);
        },dialogAlert);
    },
    "query": function(username, domain, callback){
        XHR.GET('/api/ApiUser/Query/'+domain+'/'+username,function(r){ if(r.Status === 'success') callback(r.Data); });    
    },
    "showCreateUserForm": function(button){
        return DIALOG(button,'/Security/User/UserForm', 'New Domain User', function(){}, 'large', reloadAfter2000);
    },
    /**
     * 
     * @param {model:object,onshown:function,onsuccess:function,onfail:function,selector:string} options 
     * @returns 
     */
    "embedSendPIN": function(options){
        if(typeof options !== 'object') return false;
		//return options.onsuccess();

        GET('/api/apiuser/requiresotp/'+options.model.Username,function(r){
            if(parseInt("0"+r.Data) < 1)
            {
                JS_Security_User.showEmbedSendPIN(options);
            }else{
                invoke(options.onsuccess,{"Status": 'success', "Message": 'OTP is not required', "Data": null});
            }
        });
    },

    "showEmbedSendPIN": function(options){

        var html = '<div class="m-2 ui form">' +
        '  <div class="ui visible info icon message">'+
        '   <i class="ui info circle alternate blue icon"></i>'+
        '   <div class="content">'+
        '      <div class="ui grid">'+
        '          <div class="eight wide column">'+
        '              <div class="header">Identity Check</div>'+
        '              <hr>'+
        '              <p>In order to proceed with this action, you have to verify your identity. '+
        '              Kindly, check your e-mail and enter the 4 digits code sent to you.</p>'+
        // '              <p class="sms-down-alert" style="color:navy;font-weight:bold;"><em>Please note that SMS server might be temporarily down for the time being.</em></p>'+
        '          </div>'+
        '          <div dir="rtl" class="text-right rtl eight wide column">'+
        '              <div class="header">التحقق من الهوية</div>'+
        '              <hr>'+
        '              <p>نرجوا ادخال رمز التحقق من هويتك المرسل اليكم عبر البريد الالكتروني</p>'+
        // '              <p class="sms-down-alert" style="color:navy;font-weight:bold;"><em>الرجاء العلم ان خادم رسائل الجوال قد يكون معطلا أحيانا أو يتأخر بالارسال</em></p>'+
        '          </div>'+
        '      </div>'+
        '   </div>'+
        '  </div>'+
        '  <div class="field">'+
        '    <label class="text-center">PIN is sent to email | الرمز تم ارساله للبريد الالكتروني</label>'+
        '    <div class="input rb text-center">'+ options.username +'@moh.gov.sa</div>'+
        '  </div>'+        
        '  <div class="field">' +
        '    <label>PIN:</label>'+
        '    <input autofocus autocomplete="off" aria-autocomplete="none" name="pin_in_dialog" type="text" maxlength="4" data-type="numeric" required onkeyup="if(event.key === \'Enter\'){ event.preventDefault() ; QS(\'button[data-verify-button]\').onclick(); }">'+
        '  </div><hr>'+
        '  <div data-dlg-pin-alert></div>'+ 
        '  <button type="button" class="ui tiny teal button" data-verify-button>Verify</button>'+       
        // '  <input type="hidden" name="model" value="'+ encryption.base64.encode(JSON.stringify(options.model)) +'">'+    
        // '  <input type="hidden" name="rmodel" value="'+ encryption.base64.encode(JSON.stringify(options.model)) +'">'+                       
        '</div>';
        //DISABLE(options.selector + ' input,select,button,textarea');
        invoke(options.onshown);
        var pindiv = document.createElement('div');
        var div = QS(options.selector);
        //if(div == null || typeof div !== 'object') div = QS('body');
        if(div.getAttribute('data-has-pin-form') !== 'true'){
            pindiv.innerHTML = html;
            div.parentElement.appendChild(pindiv);// + div.innerHTML;
            HIDE(div);
            SHOW(pindiv);
            setTimeout(function(){
                FOCUS(pindiv.querySelector('[autofocus]'));
            },500);
        }else{
            pindiv = div.parentElement.children[div.parentElement.children.length-1];
        }
        div.setAttribute('data-has-pin-form','true');
        JS_Security_User.sendPIN(options.model,function(r){
            showAlert(r,function(){
                pindiv.querySelector('button[data-verify-button]').onclick = function(){
                    var alrt = pindiv.querySelector('[data-dlg-pin-alert]');
                    alrt.innerHTML='';
                    var model = options.model;
                    model.Id = r.Data.Id;
                    model.PIN = pindiv.querySelector('input[name="pin_in_dialog"]').value;
                    JS_Security_User.verifyPIN(model,function(r){
                        showAlert(r);
                        if(r.Status === 'success'){
                            // var pmodel = JSON.parse(encryption.base64.decode(pindiv.querySelector('[name="model"]').value));
                            // var prmodel = JSON.parse(encryption.base64.decode(pindiv.querySelector('[name="rmodel"]').value));
                            // console.log(pmodel);
                            // console.log('-------------');
                            // console.log(prmodel);
                            HIDE(pindiv);
                            if(typeof options.onsuccess === 'function') options.onsuccess(r);
                        }									
                    },function(r){
                        if(typeof options.onfail === 'function') options.onfail(r);
                        alrt.innerHTML = '<div class="ui visible icon error message">'+
                                            ' <i class="circle red times alternate icon"></i>'+
                                            ' <div class="content">' + r.Message + ' </div>'+
                                            '</div>';
                    });
                    return false;
                };
            });
        });
    },
    "promptForPIN": function(model,callback,onfail){
        //return callback();
        var loadingdlg = showLoading();

        JS_Security_User.sendPIN(model,function(r){
            HIDE(loadingdlg);
            showAlert(r,function(r){

                var dlg = show.dialog({
                    "title": r.Message,
                    "message": '<div class="m-2 ui form">' +
                               '  <div class="ui visible info icon message">'+
                               '   <i class="ui info circle alternate blue icon"></i>'+
                               '   <div class="content">'+
                               '      <div class="ui grid">'+
                               '          <div class="eight wide column">'+
                               '              <div class="header">Identity Check</div>'+
                               '              <hr>'+
                               '              <p>In order to proceed with this action, you have to verify your identity. '+
                               '              Kindly, check your e-mail and enter the 4 digits code sent to you.</p>'+
                               //'              <p class="sms-down-alert" style="color:navy;font-weight:bold;"><em>Please note that SMS server might be temporarily down for the time being.</em></p>'+
                               '          </div>'+
                               '          <div dir="rtl" class="text-right rtl eight wide column">'+
                               '              <div class="header">التحقق من الهوية</div>'+
                               '              <hr>'+
                               '              <p>نرجوا ادخال رمز التحقق من هويتك المرسل اليكم عبر البريد الالكتروني</p>'+
                            //    '              <p class="sms-down-alert" style="color:navy;font-weight:bold;"><em>الرجاء العلم ان خادم رسائل الجوال قد يكون معطلا أحيانا أو يتأخر بالارسال</em></p>'+
                               '          </div>'+
                               '      </div>'+
                               '   </div>'+
                               '  </div>'+
                               '  <div class="field">' +
                               '    <label>PIN:</label>'+
                               '    <input autofocus autocomplete="off" aria-autocomplete="none" name="pin_in_dialog" type="text" maxlength="4" data-type="numeric" required>'+
                               '  </div><hr>'+
                               '  <div data-dlg-pin-alert></div>'+                               
                               '</div>',
					"onShown": function(){ 
                        HIDE(loadingdlg);
				        setTimeout(function(){FOCUS('input[name="pin_in_dialog"]');},500);
					},
                    "onDeny": function(){

                    },
                    "size": 'small',
                    "onApprove": function(){
                        var alrt = QS('[data-dlg-pin-alert]');
                        alrt.innerHTML='';
                        model.Id = r.Data.Id;
                        model.PIN = getValue('input[name="pin_in_dialog"]');
                        JS_Security_User.verifyPIN(model,function(r){
                            if(r.Status === 'success'){
                                if(typeof callback === 'function') callback(r);
                                dlg.modal('hide');   
                            }									
                        },function(r){
                            if(typeof onfail === 'function') onfail(r);
                            alrt.innerHTML = '<div class="ui visible icon error message">'+
                                             ' <i class="circle red times alternate icon"></i>'+
                                             ' <div class="content">' + r.Message + ' </div>'+
                                             '</div>';
                        });
                        return false;
                    }
                });
				

            },onfail);
        },function(r){
            invoke(onfail,r);
            HIDE(loadingdlg);
        });
    },

    "sendPIN": function(model,callback,onfail){
        return XHR.POST('/api/ApiUser/SendPIN/'+model.NationalId+'/'+model.Username,model,function(r){
            showAlert(r,callback,onfail);
        },onfail);
    },

    "verifyPIN": function(model,callback,onfail){
        return XHR.POST('/api/ApiUser/VerifyPIN',model,function(r){
            showAlert(r,callback,onfail);
        },onfail);
    },

    "resetPassword": function(model,callback,onfail){
        XHR.POST('/api/ApiUser/ResetPassword',model,function(r){
            showAlert(r,callback,onfail);
        },onfail);
    },

    "transfterUser": function(username,fromGroup,toGroup,reassignManager,updateDepartment,callback){
        return XHR.PATCH('/Security/ApiUser/TransferUser',{
            //"Username": username,
            "FromGroup": fromGroup,
            "ToGroup": toGroup,
            "ReassignManager": reassignManager,
            "UpdateDepartment": updateDepartment
        },callback);
    },

    "showDepartmentTransfer": function(listOfUsernames){
        if (typeof (listOfUsernames) !== "object" || !Array.isArray(listOfUsernames) || !listOfUsernames.any()) {
            return ALERTS.ERROR("You have to select at least one user to transfer");
        }
        POST('/Security/User/DepartmentTransfer',{"UpdateDepartment":true,"ReassignManager":true,"UsersArray":listOfUsernames},function(message){
            show.dialog({
                "title": 'Transfer selected users from one department to another',
                "message": message,
                "size": 'large'                
            });
        })
    },

    "transferUsers": function(model,callback){
        return XHR.PATCH('/Security/ApiUser/TransferUser',model,callback);
    },
    
    "updateLocalUserInformationFromMOHDomain": function(username,callback){
        XHR.PATCH('/Security/ApiUser/UpdateLocalUserInformationFromMOHDomain',{"Username":username},function(r){
            if(r.Status === 'success'){
                XHR.GET('/Security/ApiUser/GetLocalUser/'+username, function(response){
                    DESERIALIZE('[data-user-form-root]',response.Data);
                    invoke(callback,r);
                });
            };
        });
    },

    "update": function(id,field,value){
        XHR.PATCH('/Security/ApiUser/Update',{Id:id,Field:field,Value:value}, function(r){
            showAlert(r);
            if(field === 'IsCertified' && r.Status === 'success') { //setTimeout(function(){ top.location.reload(); },1000);
                each('.certify-verification-'+ r.Data.Username,function(x){ x.innerHTML = ''; });
                if(r.Data.IsCertified) {
                    each('.certify-verification-'+ r.Data.Username,function(x){ x.innerHTML = '<i class="ui green big check icon"></i>'; });
                }
            }
        });
    },

    "loadUserFromMOH": function (selector, callback) {
        var model = SERIALIZE(selector);
        if(isNullOrEmpty(model.Username)) return;
        XHR.GET('/Security/ApiUser/GetMOHUser?username='+model.Username,function(r){
            if(r.Status === 'success'){
                // if(model.Id > 0) r.Data.Id = model.Id;
                // r.Data.Department = model.Department;
                DESERIALIZE(selector, r.Data, ['GivenNameAr','GivenNameEn','MiddleNameAr','MiddleNameEn','ThirdNameAr','MiddleNameEn','SurNameAr','SurNameEn','NameAr','NameEn','NationalId','EmployeeId','Mobile','Email']);

                // ALERTCONFIRM('Would you like to undo data SYNC?',function(r){
                //     DESERIALIZE(selector, model);
                // });
                //invoke(callback);
            }
        });
    },

    "openForm": function(username){
        if(isNullOrEmpty(username)) return;
        POPUP('/Security/User/Form/'+ username +'?isPartial=true','fullscreen',JS_Security_User.initializeUsersForm);
    },

    "showResetPasswordDialog": function(button,model,isSendPIN){
        JS_Security_UserResetPassword.canResetPassword(model.Username,model.NationalId,function(){
            model.isPartial=true;
            var url = '/User/Forgot?' + ['isPartial','Mobile','NationalId','Username'].map(function(p){ return [p,encodeURIComponent(model[p])].join('='); }).join('&');
            POPUP(url,'small',function(){ 
                if(!isSendPIN || getInnerText('[data-skipOTP]').toLowerCase() == 'true') activateStep('#step3'); 
                else JS_Security_UserResetPassword.initiateSendPIN(button,model); 
                setValue('[name=RaisedUsingBrowser]',GETBROWSER());
            });
        });
    },

    "synchronize": function (button) {
        button.disabled = true;
        button.classList.add('loading');
        XHR.POST('/Security/ApiUser/Synchronize', function(r){
            showAlert(r);
            setTimeout(function(){ top.location.reload(); }, 15*1000);
        });
    },

    "findMOHUser": function(username,nationalId,callback){
        if(isNullOrEmpty(username) || isNullOrEmpty(nationalId)) return ALERTS.ERROR('You must provide a valid Username and national Id to lookup a user from MOH domain!');
        XHR.POST('/api/ApiUser/FindMOHUser',{"Username": username,"NationalId": nationalId}, callback);
    },

    "updateEmployeeInformation": function(selector){
        if(!checkRequiredFields(selector)) return;
        var model = SERIALIZE(selector);
        // var checks = ['Gender',
        //               'MaritalStatus',
        //               'DateOfBirth',
        //               'Nationality',
        //               'EmployeeId',
        //               'Email',
        //               'Username',
        //               'NationalId',
        //               'Mobile',
        //               'JobClassification',
        //               'Agree2TCC',
        //               'Agree2IEHoL',
        //               'Agree2Accuracy',
        //               'Religion',
        //               'EmployeeCard',
        //               'IdentityCard',
        //               'ContractType'
        //              ].map(function(x){ return [x,isNullOrEmptyOrZero(model[x])]; })
        //               .filter(function(y){ return y[1]; })
        //             ;
        
        // if(checks.any()){
        //     dialogAlert({Status:'warning',Message:'Required fields: <ul><li>' + checks.map(function(x){ return x[0]; }).join('</li><li>') + '</li></ul>' });
        //     return;
        // }

        XHR.POST('/api/ApiUser/SubmitRegistration',model,function(r){
            if(r.Status === 'success') dialogAlert(r, function(){
                top.location.href='/';
            });
            else dialogAlert(r);
        });
    },

    "verifyMOHRequester": function(selector){
        XHR.POST('/api/ApiUser/VerifyMOHUser',{"Username":getValue('#Requester'),"NationalId":getValue('#NationalId')},function(r){
            showAlert(r,function (r) {
                setValue('#NameEn',r.Data.NameEn);
                SHOW('.form-contents');
            });
        });
    },

    "submitWebAccessRequestForm": function (button, selector) {
        if(!checkRequiredFields(selector)){return;} ; 
        XHR.POSTFORM(button,selector,'/api/ApiUser/SubmitWebAccessRequest', function(r){ 
            showAlert(r,  function(){ 
                show.dialog({
                    "title": '<h4 style="color:green"><i class="big check green icon"></i> Confirmation</h4>',
                    "message": '<div class="ui success message visible p-2"><div class="header">'+r.Status+'</div><hr>'+r.Message+'</div>',
                    "onApprove": function(){
                        each(selector+' button#ResetButton', function(resetButton){
                            resetButton.onclick();
                        });
                    } 
                });
            });
        });
    },

    "lookup": function(input, callback){
        if(typeof input.attributes['data-lookedup'] === 'undefined'){
            input.setAttribute('data-lookedup','false');
        }
        if(input.value === '' || input.attributes['data-lookedup'].value !== 'false') return;
        input.setAttribute('data-lookedup', 'lookup');
        each('.Username-Fullname',function(x){ x.innerText=''; });
        XHR.GET('/User/Lookup',{"query": input.value}, function(data){
            SHOWLOOKUP(data, function (r) {
                input.value=r.Username;
                each('.Username-Fullname',function(x){ x.innerText=r.NameEn; });
                invoke(callback,r);
            })
        })
    },

    "lookupDoctor": function(input, callback){
        if(typeof input.attributes['data-lookedup'] === 'undefined'){
            input.setAttribute('data-lookedup','false');
        }
        if(input.value === '' || input.attributes['data-lookedup'].value !== 'false') return;
        input.setAttribute('data-lookedup', 'lookup');
        each('.Username-Fullname',function(x){ x.innerText=''; });
        XHR.GET('/User/Lookup',{"query": input.value, "group":'Doctors'}, function(data){
            SHOWLOOKUP(data, function (r) {
                input.value=r.Username;
                each('.Username-Fullname',function(x){ x.innerText=r.NameEn; });
                invoke(callback,r);
            })
        })
    },

    "submitUsersToManagerAssignmentForm": function (selector) {
        var model = SERIALIZE(selector);
        if(isArrayEmptyOrNull(model.Users)){
            return ALERTS.WARNING('You will have to select at least one user from the list');
        }
        model.Users = model.Users.map(function(user){ return {"Username": user}; });
        XHR.PATCH('/Security/ApiUser/UsersToManagerAssignment',model,function(r){
            showAlert(r,closeDialogAfterSave);
        });
    },

    "resetLookup": function(Username){
        Username.setAttribute('data-lookedup',false);
        each('.Username-Fullname',function(x){ x.innerText=''; });
        setValue('[data-signatory-form] [name="Id"]',null);
    },

    "initializeUsersForm": function (){
        JS_Security_User.requeryGroups(getValue('#Username'),'[data-user-groups]');
        //JS_Security_Department.populateDropDownList();
        //JS_Security_DomainGroup.populateDropDownList();

        //XHR.GET('/Security/ApiJobTitle/All'     ,JS_Security_User.populateJobTitles);
        //XHR.GET('/eHR/ApiCountry/All'      ,JS_Security_User.populateNationalities);
        // var username = encodeURIComponent(getValue('[data-user-form-root] #Username'));
        // GETHTML('/ePolicy/Signature/Editor?isNotReload=true&isPartial=True&Username='+ username,'#userSignatureTab',prepareCroppie);
    },

    "checkRequiredFields": function(selector){
        var violations = each(selector + ' [required]', function(x){
            return {
                "id": x.id,
                "name": x.name,
                "value": x.value
            };
        }).filter(function(x){
            return isNullOrEmpty(x.value);
        });
        if(violations.any()) {
            dialogAlert({
                Status: 'warning',
                Message: 'Required fields: <ul><li class="nowrap" nowrap>' + violations.map(function(x){ return [x.name,x.id].distinct().join(' : ') }).join(' </li><li> ') + '</li></ul>',
                Data: null
            });
            return false;
        }
        return true;
    },

    "beforeRegisterFileUpload": function(rid,id,name){
        var model = SERIALISE('.user-registration-step-2');
        
        if(model.Gender === 'Female' && model.Religion === 'Muslim' && model.Nationality === 'Saudi Arabia' && name.toLowerCase().contains('photo') ) {
            return show.confirm({
                message: 'You may opt-out of uploading your photo <br>'+
                         'اذا لم ترغبي بارفاق صورة سيتم استخدام صورة محجبة'+
                         '<br><br><center>'+
                         '<img src="/img/Photo-women-on-veil.png" />'+
                         '</center><br>'+
                         'Click OK to use the above picture, or Cancel to upload your own photo.<br>'+
                         'لاستخدام صورة محجبة الرجاء الضغط على موافق او اضغطي على الغاء لتحميل صورتك',
                onDeny: function(){
                    QS('#'+rid).click();
                },
                onApprove: function(){
                    QS('[data-file="'+id+'"]').innerHTML = getTemplate('.attachment-list-template',{
                        "VALUE": '/img/Photo-women-on-veil.png',
                        "LABEL": 'Photo-women-on-veil.png',
                        "FIELD": name
                    });
                    setValue('input[name="FileAttachments"]#'+name,'/img/Photo-women-on-veil.png');
                },
                size: 'tiny'
            });
        }else{
            QS('#'+rid).click();
        }
    },

    "updateCategory": function(usernames){
        if(typeof usernames === 'undefined' || !Array.isArray(usernames) || !usernames.any()) return show.alert('You have to select a user first');
        TINYGETCONFIRM('/Security/User/UpdateCategory',function(model){
            model.Users = usernames;
            XHR.PATCH('/Security/ApiUser/UpdateCategory',model,function(r){
                showAlert(r,function(){
                    setTimeout(function(){
                        top.location.reload();
                    },1000);
                });
            });
        });
    },

    "registerFileUpload": function(file,id,name,notes){
        

        var _this=file; 
        if(_this.files.length < 1){return console.log('no file was selected');}; 
        var callback = function(r){ 
            var data = {
                "VALUE": r.Data,
                "LABEL": _this.files[0].name,
                "FIELD": name
            };
            console.log('test');
            QS('[data-file="'+id+'"]').innerHTML = getTemplate('.attachment-list-template',data); 
        };
        XHR.UPLOAD(_this,'input[name="FileAttachments"]#'+name,callback,showAlert, getValue('#RegisterForm #Username') + ' - ' + decodeURIComponent(notes))
    },

    "registerStep1": function(){
        try{ setValue('#RaisedUsingBrowser', GETBROWSER()); } catch(e) { }
		var model = SERIALIZE('.user-registration-step-1');
		// XHR.POST('/api/ApiUser/GetUserMobile',model,function(mobile){
        //     model.Mobile = (""+mobile).split('').filter(function(c){ return "0123456789".contains(c); }).take(16).join("");
        //     model.Justification = 'for Registration at IAFH ePolicy';
		//     JS_Security_User.promptForPIN(model,JS_Security_User.registerFindMOHUser,showAlert);
        // });

        XHR.POST('/api/apiuser/ValidateMOHUserInformation',model,function(r){
            showAlert(r,function(){ 
                if(r.Data != null && typeof r.Data === 'object'){
                    if(r.Data.NationalId != model.NationalId) return ALERTS.WARNING('Wrong National Id / Iqama');
                    model = r.Data;
                    model.Justification = 'for Registration at IAFH ePolicy';
                    //JS_Security_User.promptForPIN(model,JS_Security_User.registerFindMOHUser,showAlert);    
                    JS_Security_User.embedSendPIN({
                        "selector": '#RegisterForm .user-registration-step-1',
                        "model": model,
                        "rmodel": r.Data,
                        "onshown": function(){
                            //btn.disabled = true;
                        },
                        "onsuccess": function(res){
                            showAlert(res, function(){ JS_Security_User.registerFindMOHUser(model); });
                        },
                        "onfail": showAlert
                    });
                }
            });
        },showAlert);

        
	},
	"registerFindMOHUser": function(){

        var val = getValues('input[name="RequestedAccess"]:checked').join(' + ');
        // setValue('#RequestedAccess',val);
        setInnerText('.RequestedAccess',val);
        
        var alrt = function(r){ 
            show.alert( '<h4 style="color:red">'+ r.Message +'</h4><div class="ui icon warning message visible">' + QS('.ui.icon.warning.message.visible').innerHTML + '</div>' ); 
        };
        if(getValue('#RegisterForm #IsMOHUser')) {
            var model = SERIALIZE('.NationalIdAndUsername');
            JS_Security_User.findMOHUser(model.Username,model.NationalId,function(r){
                r.Message = (''+r.Message).replace('https://empupdate.moh.gov.sa/InfoUpdate.aspx','<a target="_blank" href="https://empupdate.moh.gov.sa/InfoUpdate.aspx">https://empupdate.moh.gov.sa/InfoUpdate.aspx</a>');
                showAlert(r, function(r){
                    if(isNullOrEmptyOrZero(r.Data.Username)) return ALERTS.WARNING('Username / National Id combination not found in MOH domain ... ');
                    if(isNullOrEmpty(r.Data.Email)) r.Data.Email = r.Data.Username + '@moh.gov.sa';
                    try{ r.Data.EmployeeId = r.Data.EmployeeId.toCharArray().filter(function(x){ return Char.isNumber(x); }).join('');} catch(e){}
                    DESERIALIZE('#RegisterForm',r.Data);
                    ['Username','NationalId','EmployeeId','NameAr','NameEn',
                     'Mobile','Email','FQDN','GivenNameAr','MiddleNameAr','ThirdNameAr',
                     'SurNameAr','GivenNameEn','MiddleNameEn','ThirdNameEn','SurNameEn'].forEach(function(x){ 
                    //    setValue('#'+x,r.Data[x]);
                        setInnerText('.'+x,r.Data[x]);
                    }); 
        
                    SETHTML('.UserInformation',getInnerHTML('.UserInformationTemplate'));
        
                    activateStep('.RegisterStep2');

                    XHR.GET('/api/apiuser/query/iafh/'+model.Username,function(x){ 
                        var result = x.Data;
                        if(!(typeof result === 'undefined' || isNullOrEmpty(result))){
                            try{ model.EmployeeId = model.EmployeeId.toCharArray().filter(function(x){ return Char.isNumber(x); }).join(''); } catch(e){}
                            var properties = ['Username','NationalId','EmployeeId','NameAr','NameEn',
                                              'Mobile','Email','FQDN','GivenNameAr','MiddleNameAr',
                                              'ThirdNameAr','SurNameAr','GivenNameEn','MiddleNameEn',
                                              'ThirdNameEn','SurNameEn'];
                            if(result !== null && typeof result === 'object' && Object.keys(result).intersect(properties).length === properties.length){
                                DESERIALIZE('#RegisterForm', result); // ????
                                
                                properties.forEach(function(x){ 
                                    setInnerText('.'+x,result[x]);
                                });
                            }
                        }
                    });
                });
            });
            // JS_Security_User.verifyMOHUser(this, function(r){
            //     if(isNullOrEmptyOrZero(r.Data.Mobile)){
            //         dialogAlert({"Status":'error',"Message":'You must update your information in MOH domain'}); 
            //     }
            // }, alrt);
        } else { 
            alrt(); 
        }
        
    },
        
    "requeryGroups": function (username, selector){
        GETHTML('/Security/User/Groups/'+username,selector);
    },
    
    "addUserToGroup": function (username,groupName,callback) {
        XHR.PUT('/Security/ApiUser/AssignUserToGroup', { "Principal": username, "GroupName": groupName } ,function(r){
            showAlert(r, function (r) {
                JS_Security_User.requeryGroups(username,'[data-user-groups]');
                invoke(callback,r);
            });
        });
    },
    
    
    "removeUserFromGroup": function (username,groupName) {
        CONFIRM("Are you sure to delete this association?",function(){

            XHR.DELETE('/Security/ApiUser/RemoveUserFromGroup',{"Principal": username, "GroupName": groupName},function(r){
                showAlert(r,function(){
                    JS_Security_User.requeryGroups(username,'[data-user-groups]');
                });
            });
            
        });
    },


    "assignUsersToManager": function (usersList){
        //return ALERTS.INFO('You should use the Department Transfer form');
        XHR.GET('/Security/User/ManagerTransfer',{"UsersList": usersList.join(',') }, function(form){
            show.dialog({
                "message": '<div class="bootbox-form">'+form+'</div>',
                "title": 'Assign Users to Manager'
            });
        });
    },

    "assignUsersToManagerOld":function(listOfSelectedUsers){
        if((false === (typeof listOfSelectedUsers === 'object' && Array.isArray(listOfSelectedUsers))) || listOfSelectedUsers.length === 0) return;
        var detailsOf = function(username){
            var user = QS('[value="'+ username +'"]');
            if(user != null){
                var tr = user.parentElement.parentElement.parentElement;
                return {
                    "username": username,
                    "nameen"  : tr.children[2].innerText,
                    "namear"  : tr.children[3].innerText,
                    "manager" : tr.children[6].innerText,
                };
            }
            return {
                "username": username,
                "nameen"  : '',
                "namear"  : '',
                "manager" : '',
            };
        };
        XHR.GET('/Security/ApiDomainGroup/GetUsers?groupName=Managers',function(listOfManagers){
            var form = "<form data-form class='ui form segment bootbox-assign-user-to-manager'>" +
                       " <div class='field'>"+
                       "  <label>Selected Users:</label>"+
                       "  <select class='hide'>" + listOfSelectedUsers.map(function(x){ return "<option>"+ x +"</option>"; }).join('') + "</select>" +
                       "  <table class='stats-table'>"+
                       "   <thead><tr>" +
                       "     <th>Username</th>"+
                       "     <th>Name (En)</th>"+
                       "     <th>Name (Ar)</th>"+
                       "     <th>Manager</th>"+
                       "   </tr></thead>"+
                       "   <tbody>"+
                       "   " + listOfSelectedUsers.map(function(x){ var dtl = detailsOf(x);return "<tr><td>"+ [dtl.username,dtl.nameen,dtl.namear,dtl.manager].join('</td><td>') +"</td></tr>"; }).join('') +
                       "   </tbody>"+
                       "  </table>" + 
                       " </div>"+
                       " <div class='field'>" +
                       "   <label>Manager</label>" +                   
                       "   <select class='select2' id='manager' name='manager'>"+ listOfManagers.map(function(x){ return "<option value='" + x.Username + "'>" + x.Username + " | " + x.NameEn  + " | " + x.NameAr + "</option>"; }).join("\n") +"</select>" +                   
                       " </div>" +                   
                       "</form>";
            show.dialog({
                "title": "Assign Selected Users to Manager",
                "message": form,
                "size": 'large',
                "onDeny": function(){},
                "onApprove": function(){
                    var manager = getValue('form[data-form] #manager');
                    var model = {
                        "Manager": manager,
                        "GroupsToAdd": [],
                        "GroupsToRemove": [],
                        "Users": listOfSelectedUsers
                    };
                    XHR.PATCH('/Security/ApiUser/AssignUsersToManager',model,showAlert);
                    return true;
                }
            });
        });
    },
    
    
    "deletePermenantly": function (username){
        CONFIRM('This will result in deleting the user from both Domain and local DB, are you sure to proceed to delete User ['+username+'] ?', function(){
            
            XHR.DELETE('/Security/ApiUser/DeletePermenantly', {Username:username}, function(r){
                showAlert(r,function(){
                    setTimeout(function(){
                        top.location.href='/Security/User?searchWord='+username;
                    },1000);
                });
            });
        
        });
    },

    "verifyMOHUser": function (button,onSuccess,onFail){
        XHR.POSTFORM(button,'#RegisterForm','/api/ApiUser/VerifyMOHUser',function(r){
            showAlert(r,function(r){ 
                //DESERIALIZE('#RegisterForm',r.Data);
                ['Username','NationalId','EmployeeId','NameAr','NameEn','Mobile','Email','FQDN','GivenNameAr','MiddleNameAr','ThirdNameAr','SurNameAr','GivenNameEn','MiddleNameEn','ThirdNameEn','SurNameEn'].forEach(function(x){ 
                    setValue('#'+x,r.Data[x]);
                    setInnerText('.'+x,r.Data[x]);
                }); 
    
                SETHTML('.UserInformation',getInnerHTML('.UserInformationTemplate'));
    
                activateStep('.RegisterStep2');
                if(typeof r.Status !== 'undefined' && r.Status === 'success') invoke(onSuccess,r);
                else invoke(onFail, r);
            },onFail);
        });
    },

    "submitRegistrationForm": function (button){
        XHR.POSTFORM(button,'#RegisterForm','/api/ApiUser/SubmitRegistration',function(r){
            if(typeof r.Status !== 'undefined' && r.Status === 'success') activateStep('.RegisterStep6');
            
            showAlert(r,function(r){ 
                var model = r.Data;
                model.IsPartial = true;
                GET('/User/RegistrationConfirmation', model, function(html){
                    SETHTML('.ConfirmationOfRequest', html);
                    SETHTML('[data-ticket-reference]','Ticket Reference # ' + model.UID + ' # رقم التذكرة المرجعي');
                });
            },dialogAlert);
        });
    },

    
    "searching": false,
    "searchDomain": function(selector){
        var tbody = QS('.domain-inquiry-results');
        tbody.innerHTML = '';
        each(selector + ' .button', function(x){ x.classList.add('loading'); x.disabled=true; });
        var model = SERIALIZE(selector);
        if(model.Domain === 'MOH' && ['EmployeeId','NameAr','NationalId'].contains(model.Property)){
            model.Property = 'MOH' + model.Property;
        }
        tbody.innerHTML = '<tr><td colspan="15" style="min-height:10em !important;height:10em !important"><i class="ui loading icon"></i>Loading ...</td></tr>'; 
        XHR.POST('/Security/ApiUser/SearchDomain',model,function(result){
            each(selector + ' .button', function(x){ x.classList.remove('loading'); x.disabled=false; });
            if(!Array.isArray(result.Data)) {
                if(isJSON(result)) tbody.innerHTML = '<tr><td colspan="15" style="">'+ result.Status + ' : ' + result.Message +'</td></tr>';
                else tbody.innerHTML = '<tr><td colspan="15" style="">'+ result +'</td></tr>';
                return;
            }
            QS('table#UserInformation thead').innerHTML = '<tr>' +
                                                          ' <th>Username   </th>'+
                                                          ' <th>Name (En)  </th>'+
                                                          ' <th>Name (Ar)  </th>'+
                                                          ' <th>National Id</th>'+
                                                          ' <th>Employee Id</th>'+
                                                          ' <th>Mobile     </th>'+
                                                          ' <th>FQDN       </th>'+
                                                          '</tr>';

            tbody.innerHTML = '';
            result.Data.forEach(function(record){
                tbody.innerHTML +=  '<tr data-search-username="' + record.Username.toLowerCase() + '">' +
                                    ' <td data-username-value="' + record.Username.toLowerCase() + '">' + record.Username + '</td>'+
                                    ' <td>' + record.NameEn     + '</td>'+
                                    ' <td>' + record.NameAr     + '</td>'+
                                    ' <td>' + record.NationalId + '</td>'+
                                    ' <td>' + record.EmployeeId + '</td>'+
                                    ' <td>' + record.Mobile     + '</td>'+
                                    ' <td><code>' + record.FQDN + '</code></td>'+
                                    '</tr>';
                var usersList = each('[data-username-value]',function (x) {
                    return x.attributes['data-username-value'].value;
                });
                XHR.POST('/Security/ApiUser/InquireIfInDomain',{"Domain":model.Domain,"UsersArray": usersList},function(r){
                    if(r.Data === null || typeof r.Data !== 'object' || !Array.isArray(r.Data)) return ALERTS.ERROR('users not found in the domain');
                    r.Data.forEach(function(x){
                        QS('[data-username-value="' +x.toLowerCase()+'"]').innerHTML = '<a href="javascript:void(JS_Security_User.openForm(\'' + x + '\'))">'+ x +'</a>';
                        QS('[data-search-username="'+x.toLowerCase()+'"]').style.backgroundColor = 'cornsilk';
                    });
                });
            });
        });
    },

    "logout": function(){
        XHR.GET('/api/ApiUser/Logout',function(r){ 
            if(r.Status === 'error') { top.location.href='/'; } 
            showAlert(r,function(r){ 
                setTimeout(function(){top.location.href='/';}, 100);
            });
        });
    },
    
    "loginanyway" : function(model){ 

        var performLogin = function(res){
            if(typeof res === 'object') showAlert(res);
            XHR.POST('/api/ApiUser/Login',model, function (r) {
            
                showAlert(r, function(r){

                    SETHTML('.html-main-login-form','');
                    
                    if((''+r.Data).toLowerCase().indexOf('user/logout') > -1){
                        r.Data = {RedirectTo:'/'};
                    }

                    // var sc = r.Data.ServerCommunication;
                    // if(typeof sc == 'object' && sc.Id > 0){
                    //     XHR[sc.Method](['',sc.Area,sc.Controller,sc.Action].join('/'),JSON.parse(sc.Arguments),function(r){
                    //         showAlert(r,function(){
                    //             if(typeof window.dialogs !== 'undefined' && Array.isArray(window.dialogs) && window.dialogs.any()){
                    //                 window.dialogs.last().modal('hide');
                    //             }else{
                    //                 top.location.reload();
                    //             }
                    //         });
                    //     });
                    // }else{
                        
                    // }

                    if(top.location.href.toLowerCase().indexOf('user/login') === -1 && top.location.href.toLowerCase().indexOf('user/logout') === -1){
                        top.location.href = '?q=welcome'; 
                    }else{
                        var requestedUrl = r.Data.RedirectTo;
                        
                        XHR.GET('/User/Notifications?ispartial=true',function(r){
                            if((''+r).superTrim() === 'NO NOTIFICATIONS'){
                                top.location.href = requestedUrl;
                            }else{
                                ALERTS.INFO('You have some requests pending your approval');
                                SETBODY(r);
                            }
                        });
                    }

                    
                });
                
                
            },dialogAlert);
        };
        
        //to enable SMS / OTP
        /*
            JS_Security_User.embedSendPIN({
                "selector": '.html-main-login-form',
                "model": model,
                "rmodel": model,
                "onshown": function(){
                    //btn.disabled = true;
                },
                "onsuccess": performLogin,
                "onfail": function(res){
                    if(typeof res === 'object') showAlert(res);
                }
            });
        */
        performLogin({Status:'success',Message:'no OTP is required',Data:model});
            
    },

    "obscure": function(selector){
        if(!getValue(selector).startsWith('^^^')) setValue(selector,'^^^'+encryption.base64.encode('~~~'+getValue(selector)));
    },

    "secureLogin": function(self,selector){
        //setValue('[data-pw-input]',makeid(12));
        var ru=getValue(selector + ' input[data-ru]');
        var un=getValue(selector + ' input[data-un]');
        var pw=getValue(selector + ' input[data-pw]');
        //var sc=getValue(selector + ' input[data-scid]');
        //each(selector + '[type="password"]',function(x){ x.value=[5,7,9].map(function(i){ return makeid(i); }).join('-'); });
        toggleButtonsLoading(self,true);
        var model = {'Username':un, 'Password': pw,'ReferringURL': ru}; //, 'ServerCommunicationId': sc };
        JS_Security_User.login(model,function(){ 
            toggleButtonsLoading(self,true);
            DISABLE(self);
            ['un','pw','pw-input'].forEach(function(x){ 
                setValue(selector + ' input[data-'+ x +']',''); 
                DISABLE(selector + ' input[data-'+ x +']'); 
            });
            },function(r){
                console.log('.... got here ....');
                showAlert(r);
                toggleButtonsLoading(self,false);
                ENABLE(self);
                ['un','pw'].forEach(function(x){ 
                    ENABLE(selector + ' input[data-'+ x +']'); 
                });
            }
        );
    },

    "login": function(model,onsuccess,onfail){
        if(typeof model !== 'object' || model == null) model = {"Username":null,"Password":null,"Agent":null};
        model.Agent = GETBROWSER();
        model.Username = ['',model.Username].join('').toLowerCase().split('@').first().trim();
        
        if(isNullOrEmpty(model.Username) || isNullOrEmpty(model.Password)){
            invoke(onfail,model);
            return ALERTS.ERROR('You will have to provide Username and password to proceed !');
        }

        var onsuccessCallback = function(r){
            if(typeof r.Data !== 'object' || isNullOrEmpty(r.Data)) r.Data = {};
            model.Mobile = r.Data.Mobile;
            model.NationalId = r.Data.NationalId;
            model.Justification = "to login to intranet IAFH ePolicy website";

            if(typeof r.Status !== 'undefined' && r.Status === 'success'){
                invoke(onsuccess,r);
                return JS_Security_User.loginanyway(model);
            }

            invoke(onfail,r);
            
            if((r.Message+'').contains('You must reset password')){ //return DIALOG(button,'/User/Forgot?isPartial=true', r.Message);
                r.Status = 'warning';
                return SETBODY('/User/Forgot?isPartial=true',function(){
                    setValue('[name=RaisedUsingBrowser]',model.Agent);
                });
            }
            
            if(typeof r.Data === 'object' && typeof r.Data.SessionId === 'string' && !isNullOrEmpty(r.Data.SessionId)) { //return showAlert(r);
                var message = '<div class="ui icon message attached ignored visible">'+
                            '<i class="ui triangle info orange icon"></i>'+
                            ' <div class="content header">Previous session exists</div>'+
                            '</div>'+
                            '<div class="ui segment attached">'+
                            ' <h4>You are already logged in from another browser session !</h4>'+
                            ' <p>'+r.Message+'</p>'+TABULAR(r.Data)+
                            '</div>';

                //invoke(onfail);
                return show.confirm({
                    "title": 'Confirmation !',
                    "message": message,
                    "size": 'mini',
                    "onApprove": function(){ invoke(onsuccess); JS_Security_User.loginanyway(model); }
                });

            }
        };


        XHR.POST('/api/ApiUser/GetOnlineSession/'+encodeURIComponent(model.Username), model, function(r){
            showAlert(r);
            invoke(onsuccessCallback,r);
        },onfail);
    },

    "formlogin": function(button, selector){
        try{ setValue('#Agent', GETBROWSER()); } catch(e) { }
        var model = SERIALIZE(selector);
		model.Username = ['',model.Username].join('').toLowerCase().split('@').first().trim();
        if(!checkRequiredFields(selector)) return;
        
        toggleButtonsLoading(button,true);

        var onfail = function(r){
            showAlert(r);
            toggleButtonsLoading(button,false);
        };

        var onsuccess = function(){
            DESERIALIZE(selector,{Username:null,Password:null});
        };

        return this.login(model,onsuccess,onfail);
    }
};
//[END] JS_Security_User

var JS_Security_UserResetPassword = {
    "initiate": function(model, callback){
        try{ setValue('#RaisedUsingBrowser', GETBROWSER()); } catch(e) { }
        JS_Security_UserResetPassword.canResetPassword(model.Username,model.NationalId,function(r){
            JS_Security_UserResetPassword.initiateSendPIN(this,r.Data);
        },callback);
    },
    "canResetPassword": function(username,nationalId,success,fail){
        XHR.POST('/api/apiuser/CanResetPassword',{Username:username,NationalId:nationalId},function(r){
            showAlert(r,success,function(){
                r.Status = 'warning';
                showAlert(r);
                invoke(fail);
            });
        },fail);
    },
    "initiateSendPIN": function (button, model){
        hideAlert();
        if(typeof model === 'object' && Object.keys(model).length === 0) return;
        if([model.NationalId,model.Username].map(isNullOrEmptyOrZero).or()) return dialogAlert ({"Status":'error', "Message":'User name and national id not set for password reset'});
        toggleButtonsLoading(button, true);
        
        model.Justification = 'for password reset, IAFH';
        // model.Justification = ' This message is sent via IAFH ePolicy to perform '+
        //                       ' Password reset, please ignore this message if you have '+
        //                       ' not initiated this process. \r\n'+
        //                       ' هذه الرسالة مرسلة من نظام الخدمات '+
        //                       ' الالكترونية بغرض إعادة تعيين '+
        //                       ' كلمة المرور من مستشفى الامام عبدالرحمن الفيصل، '+
        //                       ' اذا لم تقم بطلب الخدمة الرجاء تجاهل هذه الرسالة. ';
        JS_Security_User.sendPIN(model, function(r){
            
            HIDE('.user-forgot-password-step-1');
            SHOW('.user-forgot-password-step-2');
            DESERIALIZE('#ForgotForm', r.Data);
            activateStep('#step2');
            FOCUS('.user-forgot-password-step-2 #PIN');
            try{
                SETHTML('.UserForgotPasswordForm [data-mobile]','****'+(model.Mobile.split('').reverse().take(3).reverse().join('')));
                SETHTML('.UserForgotPasswordForm [data-name-en]',r.Data.NameEn);
            }catch(e){

            }
        },function(r){ showAlert(r),toggleButtonsLoading(button, false); });
    },

    "verifyPIN": function (button, model){
        hideAlert();
        var goback = function(r){ 
            showAlert(r);
            toggleButtonsLoading(button, false); 
        };
        
        JS_Security_User.verifyPIN(model,function(r){
            HIDE('.user-forgot-password-step-2');
            SHOW('.user-forgot-password-step-3');
            activateStep('#step3');
            FOCUS('.user-forgot-password-step-3 #Password');
        },goback);
    },

    "performPasswordReset": function (button, model){
        hideAlert();
        var goback = function(r){ 
            showAlert(r);
            toggleButtonsLoading(button, false); 
        };
        toggleButtonsLoading(button,true);
        JS_Security_User.resetPassword(model,function(r){
            HIDE('.user-forgot-password-step-3');
            SHOW('.user-forgot-password-step-4');
            activateStep('#step4');
            //ALERT('[data-alert-box]',r,function(){ SHOW('.password-reset-step4') });
        },goback);
    }

}
// [END] JS_Security_UserResetPassword

var JS_Security_Agent = {
    "save": function(id){
        XHR.POSTFORM(this,'.agent-data-'+id,'/Security/ApiAgent/Save',function(r){ 
            showAlert(r, function(){ 
                     if(top.location.href.toLowerCase().contains('/information')){ JS_Security_Agent.goback(); }
                else if(top.location.href.toLowerCase().contains('/form')){  top.location.href='/Security/Agent/Information/'+r.Data;  } 
            }); 
        });
    },
    "open": function(id){
        var queryString = '';
        try{
            queryString = encryption.base64.encode(top.location.href.split('?').last());
        }catch(e){

        }
        top.location.href='/Security/Agent/Information/'+id+'?back='+queryString;
    },
    "goback": function(){
        var queryString = '';
        try{
            queryString = encryption.base64.decode(top.location.href.split('back=').last());
        }catch(e){

        }
        top.location.href='/Security/Agent?' + queryString
    },
    "query": function(filter,callback){
        XHR.GET('/Security/ApiAgent/Query',filter,callback);
    },
    "delete": function(id){
        show.confirm({
            title: 'Confirmation to delete agent',
            message:  '<div class="ui icon warning message">'
                    + '<i class="ui big yellow exclamation triangle icon"></i><br>'
                    + '<div class="content"><div class="header">'
                    + 'Are you sure to delete this agent from the database ?'
                    + '</div></div>',
            size: 'mini',
            onApprove: function(){
                XHR.DELETE('/Security/ApiAgent/Delete/'+id,function(r){
                    showAlert(r,function(){
                        setTimeout(function(){
                            top.location.href='/Security/Agent/';
                        },2000);
                    })
                });
            }
        });
    }
};

var JS_Security_Authorization = {
    "version": 1.0,
    
    "modifyAssociation": function (method,child,id,childName) {
        var model = {Id:id};
        model[child+'List'] = [{AssociationId:id,Name:childName}];
        XHR[method]('/Security/ApiAuthorization/'+method+'Association',model,function (r) {
            showAlert(r,function () {
                GETHTML('/Security/Authorization/'+child+'s/'+id,'[data-selected-'+child+'s]');
            })
        });
    },

    "requeryRoleAuthorizations": function (whendone) {
        XHR.GET('/Security/ApiAuthorization/All', function (r) {
            invoke(whendone,r);
        });
    },

};
// [END] JS_Security_Authorization

var JS_Security_ScheduledTask = {
    "update": function(id,field,value){
        var model = {Id:id};
        model[field] = value;
        return XHR.PATCH('/Security/ApiScheduledTask/Update/'+field,model,showAlert);
    },
};

var JS_Security_DomainGroup = {
    "synchronizeAll": function(button,callback){
        toggleButtonsLoading(button,true);
        XHR.POST('/Security/ApiDomainGroup/SynchronizeAll',{},function(r){
            if(!isJSON(r) || typeof r.Data === 'undefined' || !Array.isArray(r.Data)) return showAlert(r);
            var failed = r.Data.filter(function(x){ x.Value < 1; });
            toggleButtonsLoading(button,false);
            if(failed.any()){
                r.Status = 'warning';
                r.Message = 'The following groups failed to sync: ' + JSON.stringify(failed.map(function(x){ return x.Key; })) ;
            }
            showAlert(r,callback);
        });
    },
    "getManager": function(group,callback){
        //return the username assigned as manager (owner of the given group)
        GET('/Security/ApiDomainGroup/GetManager?GroupName='+encodeURIComponent(group),callback);
    },
    "update": function(id,field,value){
        var model = {Id:id};
        model[field] = value;
        return XHR.PATCH('/Security/ApiDomainGroup/Update/'+field,model,showAlert);
    },
	"updateOwner" : function(groupName, targetSelector){
		JS_Security_DomainGroup.getManager(groupName, function(manager){
			setValue(targetSelector, (''+manager).toLowerCase());
		});
	},
    "addGroupFromDomain": function(callback){
        //function DIALOG(button,url, header, onShown, dialogsize, onClose)
		var loadingdlg = showLoading();
        GET('/Security/DomainGroup/Form/0?isPartial=True&isFormOnly=True',function(form){
			var dlg = CONFIRM('<div class="dlg-security-group-form ui form">'+form+'</div>', function(){
				XHR.POST('/Security/ApiDomainGroup/Save',SERIALIZE('.dlg-security-group-form'),function(r){
					showAlert(r,callback);
				});
			});
			
			dlg.on('shown.bs.modal',function(){
				HIDE(loadingdlg);
				FOCUS('.dlg-security-group-form #GroupName');
			});
			
        });
    },
    "populateDropDownList" : function(){
        XHR.GET('/Security/ApiDomainGroup/All', function(options){
            populateDDL(options,'DomainGroupName','DomainGroupName','Name','Name',true);
        });
    },

    "reloadGroupUsers": function (){
        // var pageSize = 10;
        // var groupName = getValue('#GroupName');
        // XHR.GET('/Security/ApiDomainGroup/Count?groupName='+encodeURIComponent(groupName),function(records) { 
        //     JS_Security_DomainGroup.gotoPage(1,Math.ceil(records/pageSize),pageSize);
        // });
    },

    "gotoPage": function (page,pages,pageSize){
        // showSpinner();
        // var groupName = getValue('#GroupName');
        // if(isNullOrEmpty(groupName)) return;
        // GETHTML(['/Security/DomainGroup/Users',encodeURIComponent(groupName),page,pages,pageSize].join('/'), '.GroupUsers');
    },

    "assignUsersToGroups": function (listOfSelectedUsers){
        if((false === (typeof listOfSelectedUsers === 'object' && Array.isArray(listOfSelectedUsers))) || listOfSelectedUsers.length === 0) return;
        XHR.GET('/Security/ApiDomainGroup/GetDomainGroups?parentGroup=',function(listOfGroups){
            var form = "<form data-form class='ui form segment assignUsersToGroups'>" +
                       " <div class='field'>"+
                       "  <label>Selected Users:</label>"+
                       "  <select Size = '5'>" + listOfSelectedUsers.map(function(x){ return "<option>"+ x +"</option>"; }).join('') + "</select>" +
                       " </div>"+        
                       " <div class='two fields'>" +
                       "   <select class='select2' id='groupNameToAdd' name='groupNameToAdd'>"+ listOfGroups.map(function(x){ return "<option>" + x + "</option>"; }).join("\n") +"</select>" +                   
                       "   <button type='button' class='ui compact positive tiny icon button' onclick='JS_Security_DomainGroup.addGroupToList(\"#groupNameListToAdd\",groupNameToAdd.value)'><i class='plus icon'></i></button>" +
                       " </div>" + 
                       " <div class='field'>" +
                       "    <label>Groups to add to:</label>"+
                       "    <select id='groupNameListToAdd' Size = '2'></select>" +
                       " </div>" +
                       " <div class='two fields'>" +
                       "   <select class='select2' id='groupNameToRemove' name='groupNameToRemove'>"+ listOfGroups.map(function(x){ return "<option>" + x + "</option>"; }).join("\n") +"</select>" +                   
                       "   <button type='button' class='ui compact negative tiny icon button' onclick='JS_Security_DomainGroup.addGroupToList(\"#groupNameListToRemove\",groupNameToRemove.value)'><i class='minus icon'></i></button>" +
                       " </div>" +             
                       " <div class='field'>" +       
                       "   <label>Groups to remove from:</label>"+
                       "   <select id='groupNameListToRemove' Size = '2'></select>" +
                       " </div>" +
                       "</form>";
            CONFIRM(form,function(model){
                var listOfSelectedGroupsToAdd    = getValues('#groupNameListToAdd option');
                var listOfSelectedGroupsToRemove = getValues('#groupNameListToRemove option');
                JS_Security_DomainGroup.assignSelectedGroupsToSelectedUsers(listOfSelectedGroupsToAdd,listOfSelectedGroupsToRemove,listOfSelectedUsers);
                return true;
            });
        });
    },
    
    "addGroupToList": function (groupNameListToAddSelector,groupName){
        var list = QS(groupNameListToAddSelector);
        if(list.querySelectorAll('option[value="'+groupName+'"]').length > 0) return;
        var item = document.createElement('option');
        item.value = item.innerText = groupName;
        list.appendChild(item);
    },
    
    "assignSelectedGroupsToSelectedUsers": function (listOfSelectedGroupsToAdd,listOfSelectedGroupsToRemove,listOfSelectedUsers){
        return XHR.PATCH('/Security/ApiUser/AssignUsersToGroups',{"GroupsToAdd":listOfSelectedGroupsToAdd,"GroupsToRemove":listOfSelectedGroupsToRemove,"Users":listOfSelectedUsers},showAlert);
    }

    
};

// [END] JS_Security_DomainGroup



var JS_Security_Role = {
    // function XHR.POSTFORM(button,selector, api, callback, onfail) {

    "link": function(roleId,authorizationId){
        if(isNullOrEmptyOrZero(authorizationId)) return;
        XHR.PUT('/Security/ApiRole/Link',{RoleId:roleId,AuthorizationId:authorizationId},function(r){
            showAlert(r,function(){
                GETHTML('/Security/Role/Authorizations/'+roleId,'#Authorizations');
            });
        });
    },

    "unlink": function(roleId,authorizationId){
        if(isNullOrEmptyOrZero(authorizationId)) return;
        XHR.DELETE('/Security/ApiRole/UnLink',{RoleId:roleId,AuthorizationId:authorizationId},function(r){
            showAlert(r,function(){
                GETHTML('/Security/Role/Authorizations/'+roleId,'#Authorizations');
            });
        });
    },

    "inquiry": function (selector, callback) {
        XHR.POSTFORM(null,selector,'/Security/ApiRole/Query',callback);
    },

    "addNew": function(selector,onsuccess, onfail){ 
        var callback = function(r){ showAlert(r, onsuccess, onfail) };
        XHR.POSTFORM(null,selector,'/Security/ApiRole/Save',callback);
    },

    "associateWithAdminAndEHAuthorizations": function (r) {
        JS_Security_Authorization.associateRolesToAuthorizations([2,7],[r.Data],closeDialogAfterSave);
    },

    "addAuthorizationRoleToAdminAndEH": function(selector){
        JS_Security_Role.inquiry(selector, function (r) {
            if(typeof r.Status !== 'undefined' && r.Status === 'success') JS_Security_Role.associateWithAdminAndEHAuthorizations(r);
            else                     JS_Security_Role.addNew(selector, JS_Security_Role.associateWithAdminAndEHAuthorizations);
        });
    }
    
};
// [END] JS_Security_Role