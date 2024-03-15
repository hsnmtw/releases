'use strict';

var JS_eSurvey_Survey = {

	"addQuestionAnswer": function(uid,questionId){
		GETCONFIRM('/eSurvey/Survey/AnswerForm/0?uid='+uid+'&questionId='+questionId,function(model){
			PUT('/eSurvey/ApiSurvey/AddQuestionAnswer',model,function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadQuestionAnswers(uid,questionId);
				})
			});
		});
	},

	"editQuestionAnswer": function(id,uid,questionId){ 
		GETCONFIRM('/eSurvey/Survey/AnswerForm/'+id,function(model){
			PATCH('/eSurvey/ApiSurvey/EditQuestionAnswer',model,function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadQuestionAnswers(uid,questionId);
				})
			});
		});
	 },

	"deleteQuestionAnswer": function(id,uid,questionId){ 
		CONFIRM('Are you sure to deleted the selected record?',function(){
			DELETE('/eSurvey/ApiSurvey/DeleteQuestionAnswer',{"Id":id,"UID":uid,"QuestionId":questionId},function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadQuestionAnswers(uid,questionId);
				})
			});
		});
	 },

	"reloadQuestionAnswers": function(uid,questionId){
		GETHTML('/eSurvey/Survey/Answers/'+questionId,'.survey-question-answers-'+uid+'-'+questionId);
	},

	"addQuestion": function(uid){
		GETCONFIRM('/eSurvey/Survey/QuestionForm/0?uid='+uid,function(model){
			PUT('/eSurvey/ApiSurvey/AddQuestion',model,function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadQuestions(uid);
				})
			});
		});
	},
	
	"editQuestion": function(id,uid){ 
		GETCONFIRM('/eSurvey/Survey/QuestionForm/'+id,function(model){
			PATCH('/eSurvey/ApiSurvey/EditQuestion',model,function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadQuestions(uid);
				})
			});
		});
	 },

	"deleteQuestion": function(id,uid){ 
		CONFIRM('Are you sure to deleted the selected record?',function(){
			DELETE('/eSurvey/ApiSurvey/DeleteQuestion',{"Id":id},function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadQuestions(uid);
				})
			});
		});
	 },

	"reloadQuestions": function(uid){
		GETHTML('/eSurvey/Survey/Questions/'+uid,'[data-selected-Questions]');
	},


	"addAudiance": function (uid,domainGroupName) {

        var model = {"UID":uid, "DomainGroupName": domainGroupName};
        
        XHR.PUT('/eSurvey/ApiSurvey/AddAudiance',model,function (r) {
            showAlert(r,function () {
                JS_eSurvey_Survey.reloadAudiance(uid);
            })
        });
    },

	"removeAudiance": function (uid,domainGroupName) {
		CONFIRM('Are you sure to deleted the selected record?',function(){
			var model = {"UID":uid, "DomainGroupName": domainGroupName};
        
			XHR.DELETE('/eSurvey/ApiSurvey/RemoveAudiance',model,function (r) {
				showAlert(r,function () {
					JS_eSurvey_Survey.reloadAudiance(uid);
				})
			});
		});
    },

	"reloadAudiance": function(uid){
		GETHTML('/eSurvey/Survey/Audiance/'+uid,'[data-selected-Audiance]');
	}
};

var JS_eSurvey_Response = {

	"show": function(id){
		top.location.href='/eSurvey/Open/UserResponse/'+id;
	},

	"gotoPage": function(current,page,pages,model){
		if(page<1) return;
		if(page>pages) return JS_eSurvey_Response.preview(model);
		if(VALIDATEFORM('.survey-page-'+current)) return;
		HIDE('.survey-page-'+current);
		SHOW('.survey-page-'+page);
	},

	"open": function(){
		SHOW('.eSurvey_Respnse .step2');
		HIDE('.eSurvey_Respnse .step1');
	},
	"next": function(model){
		if([model.Department,model.JobCategory,model.NationalId,model.Username].map(isNullOrEmpty).or()){
	  		return show.alert('National Id, Username, Department and Job Category fields are mandatory to fill survey');
		}
		var callback = function(response){
			if(response.Status !== 'success' || isNullOrEmpty(response.Data)) return dialogAlert(response);
			GET('/eSurvey/ApiResponse/Check/'+model.UID+'/'+model.Username,function(r){
				if(r.Status === 'success' && isNullOrEmpty(r.Data)){
					SHOW('.eSurvey_Respnse .step3');
					HIDE('.eSurvey_Respnse .step2');
				}else if(r.Data != null && typeof r.Data !== 'undefined'){
					return show.alert('You have already responded to this survey on<br/><br/> ['+ r.Data.CreatedOn.split('.').first().split('T').join(' @ ') +'] !');
				}else{
					return show.alert(r);
				}
			});
		};
		var username = model.Username;
		var nationalId = model.NationalId;
		JS_Security_User.findMOHUser(username,nationalId,callback);
	},

	"getModel": function(model){
		var questions = Object.keys(model).filter(function(q){ return q.startsWith('Q_') && q.endsWith('_SelectedAnswers'); });
		var answers = [];
		questions.forEach(function(question) {
			var qid = question.split('_')[1];
			
			if(typeof model[question] !== 'object'){
				model[question] = [model[question]];	
			}
			
			//if(typeof model[question] === 'undefined' || model[question] === null || 
			if(typeof model[question] === 'undefined' || model[question] === null || !Array.isArray(model[question]) || isArrayEmptyOrNull(model[question])){
				model[question]=[];
			}
			
			model[question].forEach(function(a) {
				answers.push ({Answer: a, QuestionId: qid});	
			});
		});
		model.AnswersJSON = JSON.stringify(answers);
		model.Answers = answers;
		model.Id = 0;

		return model;
	},

	"preview": function(model){
		//show.alert('NOT IMPLEMENTED YET !!!');
		if(!VALIDATEFORM('.eSurvey_Respnse')) return false;
		
		model = JS_eSurvey_Response.getModel(model);
		
		POST('/eSurvey/Response/Preview',model,function(res){
			// CONFIRM(res,function(){
			// 	JS_eSurvey_Response.submitSurvey(model);
			// });
			SETHTML('[data-survey-main-form] .step4 .content',res);
			SHOW('[data-survey-main-form] .step4');
			HIDE('[data-survey-main-form] .step3');
		});
	},

	"submitSurvey": function(model){
		model.Answers = JSON.parse(model.AnswersJSON);
		POST('/eSurvey/ApiResponse/Save',model,function(r){
			model.Id = Number(r.Data);
			showAlert(r,function(r){
				setTimeout(function(){
					GET('/eSurvey/Response/Success/0'+model.Id+'?ispartial=true',SETBODY);
				},250);
			});
		});
	}
	// "submit": function(model){
	// 	POST('/eSurvey/ApiResponse/Save',model,function(r){
    //         dialogAlert(r,function(){
    //             setTimeout(function(){
    //                 top.location.reload();
    //             },500);
    //         });
    //     })
	// }
};