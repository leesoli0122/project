var wsocket = null;
var timerId = null;
$(function(){
	cf_userInfoSet();
	lf_setUserInfo();
	lf_topcont();
	lf_setLocation();
	lf_setTopCont();
	lf_initAlert();
});

function lf_initAlert() {
	timerId = setInterval(lf_doConnect, 1000*1);
}

function lf_doConnect() {
	if(wsocket != null) return;
	
	try {	
		wsocket = new WebSocket(
			(window.location.protocol == "http:"? "ws":"wss") +
			"://" + window.location.host + "/event.ws"
		);
		wsocket.onopen = function() {
			clearInterval(timerId);
			console.log("연결");
			
		
			wsocket.onmessage = lf_onMessage;
	        wsocket.onclose = lf_onClose;
	        wsocket.onerror = lf_onError;
	
	        lf_registTopic();
	    };
	} catch(err) {
		console.log("연결실패");
		wsocket = null;
	}
	
}

function lf_registTopic() {
	var topicList = new Array();	
	topicList.push(_TOPIC_ALERT);
	
	var headerJson = new Object();
    headerJson.wsId = _WS_SET; // SET:100001, ADD:100002, DEL:100003, GET:100004
    
    var bodyJson = new Object();
    bodyJson.topicList = topicList;
    
	var json = new Object();
    json.header = headerJson;
    json.body = bodyJson;
    
	if(wsocket != null) {
		wsocket.send(JSON.stringify(json));
	}
}

function lf_onMessage(evt) {
    //alert("onMessage->" + evt.data);
    var jsonData = JSON.parse(evt.data);
    if (Array.isArray(jsonData)) {  // 실시간 이벤트 푸시
    	var alertArray = lf_filter(jsonData, _TOPIC_ALERT);
    	$.each(alertArray, function(idx, rowData) {    		
    		if("EXPIRELICENSE" == rowData["kind"]) {
    			swal("라이선스 위반", "라이선스가 만료되었습니다.\n" +
		            "관리자에게 문의해주시기 바랍니다.\n", "error", {
		            buttons: "확인",
		        });
    		} else if("NOTPROPERLICENSE" == rowData["kind"]) {
    			swal("라이선스 위반", "라이선스가 올바르지 않습니다.\n" +
		            "관리자에게 문의해주시기 바랍니다.\n", "error", {
		            buttons: "확인",
		        });
    		} else if("AGENTFULLLICENSE" == rowData["kind"]) {
    			swal("라이선스 위반", "사용 가능한 Agent를 초과했습니다.\n" +
		            "관리자에게 문의해주시기 바랍니다.\n", "error", {
		            buttons: "확인",
		        });
    		} else if("LOCATION_HREF" == rowData["kind"]) {
    			swal("로그인 중복", "로그인이 해제됩니다.", "error", {
		            buttons: "확인",
		        });
		        console.log(rowData);
		        location.href = '/login.do';
    		} else {
    			console.log(rowData);
    		}
    		
    		
    	});
    } 	
}

function lf_filter(jsonArray, TOPIC) {
	var rArray = new Array();
	for (var i=0; i<jsonArray.length; i++) {//for (var jsonObj of jsonArray) {
		var jsonObj = jsonArray[i];            
        var className = jsonObj['class'];
        
        if(className == TOPIC) {
        	rArray.push(jsonObj);
        } 
    }
    
    return rArray;
}

function lf_onClose(evt) {
    console.log("연결 끊김");
    wsocket = null;
    lf_initAlert();
}

function lf_onError(evt) {
    console.log("Error : " + evt);
}

function lf_setLocation(){
	var locationArr = [];
	var locationUrl = $(location).attr('pathname');
	var dom = $('.lnb li').find('a[href="' + locationUrl + '"]');
	
	var currentMenu = dom.text().trim();
	$('.location h2').text(currentMenu);
	locationArr.push(currentMenu);
	
	if(dom.parent().parent().hasClass('depth2')){
		locationArr.prepend(dom.parent().parent().parent().find('> a > span').text());
	}
	
	for(var i = 0; i < locationArr.length; i++){
		$('.location ul').append($('<li>'+locationArr[i]+'</li>'));
	}
}

function lf_setUserInfo(){
	$('#currentUserId').attr('title', _USER.getUserId());
	$('#currentUserId').text(_USER.getUserKnm());
	
	// 기본
	$('#currentUserMenu').empty();
	$('#currentUserMenu').append($('<li><a href="#" rel="user_modal" class="userModalLoad">내정보</a></li>'));	
	$('#currentUserMenu').append($('<li class="logout"><a href="#" class="logout">logout</a></li>'));
	
}

function lf_getLocationPath() {
	var menuId = cf_currentMenuId();
	var location = _MENU_PATH[menuId]
	
	if(location) return location;
	
	location = ['Home'];
	var menuName = _MENU_LABEL[menuId];
	if(!menuName) menuName = menuId;
	
	location.push(menuName);
	
	//console.log(menuId + " / " + location);
	return location;
}
function lf_setTopCont(){
	var menuId = cf_currentMenuId();
	var locationPath = lf_getLocationPath();
	
	$('#topContList').empty();
	//대시보드
	if(menuId == 'dashboard'){
		$('#topCont').removeClass('disabled');
		$('#topCont > .top_dashboard_link').prop('disabled', false);
		
		
		if(_USER.getAuthKey() == USER_LEVEL_SUPERADMIN_CODE){
			//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_dashboardPublicDialog();">저장된 대시보드 보기</a></li>'));
			$('#topContList').append($('<li><a href="#" onclick="javascript: lf_saveEventFunc();">대시보드 저장</a></li>'));
			//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_serviceCall600103();">대시보드 삭제</a></li>'));
			//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_dashboardPublicSaveDialog();">공용 대시 보드 등록</a></li>'));
			//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_dashboardAdminDialog();">모든 대시보드 보기</a></li>'));
		}
		else if(_USER.getAuthKey() == USER_LEVEL_ADMIN_CODE){
			//$('#topContList').append($('<li><a href="#">저장된 대시보드 보기</a></li>'));
			$('#topContList').append($('<li><a href="#">대시보드 저장</a></li>'));
			//$('#topContList').append($('<li><a href="#">대시보드 삭제</a></li>'));
		}
		else if(_USER.getAuthKey() == USER_LEVEL_OPERATOR_CODE){
			//$('#topContList').append($('<li><a href="#">저장된 대시보드 보기</a></li>'));
			$('#topContList').append($('<li><a href="#">대시보드 저장</a></li>'));
			//$('#topContList').append($('<li><a href="#">대시보드 삭제</a></li>'));
		}
		else{
			//$('#topContList').append($('<li><a href="#">저장된 대시보드 보기</a></li>'));
			$('#topContList').append($('<li><a href="#">대시보드 저장</a></li>'));
			//$('#topContList').append($('<li><a href="#">대시보드 삭제</a></li>'));
		}
	} else{
		$('#topCont').addClass('disabled');
		$('#topCont > .top_dashboard_link').prop('disabled', true);
	}

	var location_list = $("<ul></ul>");		
	locationPath.forEach(function(element){
		if(element) {
			location_list.append($('<li>' + element + '</li>'));
		}
	});
	
	$('#location').append(location_list);
	$('#location').append('<h2>' + locationPath[locationPath.length-1] + '</h2>');	
}

function lf_topcont() {
	$('.user_info_link').on('click', function(e) {
		e.preventDefault();
		$('.user_info_list').addClass('on');
	});
	$('.top_dashboard_link').on('click', function(e) {
		e.preventDefault();
		if($('#topContList').children().length > 0) {
        	$('.top_dashboard_list').addClass('on');
        }
	});
	
	$('html').click(function(e) {
		//e.preventDefault();
		if (!$('.user_info_link').has(e.target).length) {
			$('.user_info_list').removeClass('on');
		}
		if (!$('.top_dashboard').has(e.target).length) {
			$('.top_dashboard_list').removeClass('on');
		}
	});
}

function lf_openCurrentUserDialog() {
	// open
	// 호출
	modalUi();
}