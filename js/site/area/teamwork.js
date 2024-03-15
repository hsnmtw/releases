var JS_teamwork = {

    "Team": {
        "deleteMember": function (team,username,callback) {
            DELETE('/teamwork/apiteam/deletemember',{Team:team,Username:username,NameEn:null,NameAr:null},callback);
        }
    }
};