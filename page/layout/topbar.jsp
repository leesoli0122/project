<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%
String menuId = request.getParameter("menuId");
%>
<script type="text/javaScript">
$(document).ready(function() {
	cf_userInfoSet();
	lf_setUserInfo();
	lf_setTopCont();
	lf_initAlert();
	loadOTPData();
	
	var timer = setTimeout(function(){
    	checkPasswordHistory();
	}, 500);
});

var sync = 0;
function checkPasswordHistory() {
	if(!cf_getCookie("AUTHINFO")) return "";
	if(sync == 1) return; // 이미 조회 중
	
	if(cf_getCookie("PW_CHANGE")) { // 이미 조회 한적 있음(로그아웃 할 때 까지 유지)
		return;
	}
	
	sync = 1;
	var reqAsync,reqUrl,paramData;
	var callback = function(data) {
		var auditList = data.body.auditList
		if(auditList == null) return;
		
		if(auditList.length == 0) {
			$("a.modalLoad[rel='user_modal']").trigger("click");
			
			if(!$('.password_change_box').hasClass("on")) {
				$('.usr_password_change').trigger("click");
			}
			
			swal("비밀번호 변경","초기 패스워드를 변경하시기 바랍니다.", "./assets/images/icon_alert03.png", {
				buttons: "확인"
			});
		} else {
			console.log("init PW_CHANGE");
			cf_setCookie("PW_CHANGE", "" + auditList.length);
		}
	};
	var body = {};
	var reqTrid = _TR_N_PASSWORD_AUDIT_LIST;
	var Params={};
	
	if(!reqUrl) reqUrl = cf_getJsonUrl();
	if(typeof reqAsync == "undefined" ) reqAsync =  _ASYNC;
	if(!paramData) paramData = null;
	if(_IDPWSERVICE && _IDPWSERVICE[reqTrid]) {
		log("_IDPWSERVICE["+reqTrid+"]="+ _IDPWSERVICE[reqTrid]);
		if(!body.enc_userPasswd) {
			cf_certCheckDialogPopup(reqTrid,body,callback,reqAsync,reqUrl,paramData);
			return false;
		} else {
			Params['header'] = cf_jsonHeaderSet(reqTrid, body);
		}
	} else {
		Params['header'] = cf_jsonHeaderSet(reqTrid);
	}

	if(body) Params['body']= body;
	log('Params',Params);
	log('url',reqUrl);
	log('reqAsync',reqAsync);

	$.ajax({
	url :reqUrl,
	data : JSON.stringify(Params),
	async  : reqAsync ,
	type : "post",
	//dataType : "json",
	beforeSend : function(xhr) {
		xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
	},
	success:function(data, XMLHttpRequest, textStatus) {
		sync = 0;
		if("00000"!=data.header.rtnCode){ //서비스오류
			//cf_serviceCallError(data);
		} else {
			callback(data, body);
		}
	},
	error:function(XMLHttpRequest, textStatus, errorThrow) {
		sync = 0;
		//cf_alert('오류', "AJAX 요청 에러 메세지 : \n " + errorThrow);
	}
	});
}

function otpIssue() {
	var passwd = $('#otpPasswd').val();
	if(!passwd) {
		swal("QR 재발급","비밀번호를 입력해주세요","./assets/images/icon_alert03.png", {
	        icon: "error",
	        buttons:"확인"
	    });		
		return;
	}	
	
	swal("QR 재발급", "QR 재발급시 기존에 발행 된 OTP로 인증이 불가능해집니다. 진행하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons : [ "취소", "확인" ],
	}).then(function(will) {
		if(will) {   	
			var body = { "vender" : "totp" };
	    	body['userPasswd'] = Base64.encode(passwd);

	    	cf_requestServer(_TR_CURRENT_TOTPCODE_UPDATE, body, function(data) {
            	var body = data.body;
            	if(data.body['errorMsg']) {
	            	swal("QR 재발급", data.body['errorMsg'],"./assets/images/icon_alert03.png", {
				        icon: "error",
				        buttons:"확인"
				    });
            		return;
            	}
            	
            	loadOTPData();
            	            	
				swal("QR 재발급","정상적으로 처리되었습니다.","./assets/images/icon_alert02.png", {
			        icon: "success",
			        buttons:"확인"
			    });				    
			});
		} else {
	    	swal("QR 재발급", "취소하였습니다.", "./assets/images/icon_alert03.png", {
	    		buttons: "확인",
	    	});
	    }
	});
}

var timerId = null;
function lf_initAlert() {
	timerId = setInterval(lf_doConnect, 1000 * 1);
}

var wsocket = null;
function lf_doConnect() {
	if (wsocket != null)
		return;

	try {
		wsocket = new WebSocket((window.location.protocol == "http:" ? "ws" : "wss") + "://" + window.location.host + "/event.ws");
		wsocket.onopen = function() {
			clearInterval(timerId);
			console.log("연결");

			wsocket.onmessage = lf_onMessage;
			wsocket.onclose = lf_onClose;
			wsocket.onerror = lf_onError;

			lf_registTopic();
		};
	} catch (err) {
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

	if(wsocket != null) wsocket.send(JSON.stringify(json));
}


function lf_onMessage(evt) {
	//alert("onMessage->" + evt.data);
	var jsonData = JSON.parse(evt.data);
	if(Array.isArray(jsonData)) { // 실시간 이벤트 푸시
		var alertArray = lf_filter(jsonData, _TOPIC_ALERT);
		$.each(alertArray, function(idx, rowData) {
			if("EXPIRELICENSE" == rowData["kind"]) {
				swal("라이선스 위반", "라이선스가 만료되었습니다.\n" + "관리자에게 문의해주시기 바랍니다.\n", "./assets/images/icon_alert03.png", {
					buttons : "확인",
				});
			} else if ("NOTPROPERLICENSE" == rowData["kind"]) {
				swal("라이선스 위반", "라이선스가 올바르지 않습니다.\n" + "관리자에게 문의해주시기 바랍니다.\n", "./assets/images/icon_alert03.png", {
					buttons : "확인",
				});
			} else if ("AGENTFULLLICENSE" == rowData["kind"]) {
				swal("라이선스 위반", "사용 가능한 Agent를 초과했습니다.\n" + "관리자에게 문의해주시기 바랍니다.\n", "./assets/images/icon_alert03.png", {
					buttons : "확인",
				});
			} else if("LOCATION_HREF" == rowData["kind"]) {
    			swal("로그인 중복", "로그인이 해제됩니다.", "./assets/images/icon_alert03.png", {
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
	for(var i = 0; i < jsonArray.length; i++) {
		var jsonObj = jsonArray[i];
		var className = jsonObj['class'];

		if(className == TOPIC) rArray.push(jsonObj);
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

function lf_setUserInfo() {
	$('#currentUserId').attr('title', _USER.getUserId());
	$('#currentUserId').text(_USER.getUserKnm());
	$('.modal_cont #currentUserId').val(_USER.getUserId());
	$('.modal_cont #currentUserName').val(_USER.getUserKnm());
	$('.modal_cont #currentUserPhone').val(_USER.getUserPhone());
	$('.modal_cont #currentUserEmail').val(_USER.getUserEmail());
	$('.modal_cont #userPasswd').val('');
	$('.modal_cont #userPasswd1').val('');
	$('.modal_cont #userPasswd2').val('');
	
	if(_USER.getAuthKey() == _USERLEVEL_SUPER_ADMIN) {
		$('.modal_cont .current').text('SUPER ADMIN');
	} else if(_USER.getAuthKey() == _USERLEVEL_ADMIN) {
		$('.modal_cont .current').text('ADMIN');
	} else if(_USER.getAuthKey() == _USERLEVEL_OPERATOR) {
		$('.modal_cont .current').text('Operator');
	} else {
		$('.modal_cont .current').text('Viewer');
	}
}

function loadOTPData() {
	var body = { "vender" : "totp" };
	cf_requestServer(_TR_CURRENT_TOTPCODE_LIST, body, function(data) {
		var otpData = data.body.result;
		$('#otpQRCode').text(otpData['data']);
		$('#otpUserid').val(otpData['id']);
		$('#otpCompany').val(otpData['company']);
		$('#otpPasswd').val('');
		$('#otpCreatetime').val(otpData['createtime']);

		$("#otpQRImg").attr("src", "/otp/qrcode.do?" + new Date().getTime());
	});	
}

function updateCurrentUser() {
	var body = {};
	body['currentUserId'] = $('.modal_cont #currentUserId').val();
	body['currentUserName'] = $('.modal_cont #currentUserName').val();
	body['currentUserPhone'] = $('.modal_cont #currentUserPhone').val();
	body['currentUserEmail'] = $('.modal_cont #currentUserEmail').val();

	var password = $('.modal_cont #userPasswd').val();
	var password1 = $('.modal_cont #userPasswd1').val();
	var password2 = $('.modal_cont #userPasswd2').val();

	if(body['currentUserName'].length > 20) {
		swal("", "사용자 이름은 20글자 이내여야 합니다.", "", {
			buttons : "확인"
		});
		return;
	}

	if(!/[0-9]{2,3}-[0-9]{3,4}-[0-9]{3,4}$/.test(body['currentUserPhone'])) {
		swal("", "올바른 형식의 전화번호를 입력해주세요.(ex : 010-0000-0000)", "", {
			buttons : "확인"
		});
		return;
	}

	if(!/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i.test(body['currentUserEmail'])) {
		swal("", "올바른 형식의 이메일을 입력해주세요.(ex : aegis@sgacorp.kr)", "", {
			buttons : "확인"
		});
		return;
	}

	if(password.length < 1) {
		swal("", "비밀번호를 입력하세요", "", {
			buttons : "확인"
		});
		return false;
	}

	body['userPasswd'] = Base64.encode(password);
	if($('.password_change_box').hasClass('on')) {
		if(checkPassword(password, password1, password2)) {
			body['userNewPasswd'] = Base64.encode(password1);
		} else {
			return false;
		}
	}

	swal("사용자 정보 변경", "사용자정보를 변경하시겠습니까?", "./assets/images/icon_alert01.png", {
		buttons : [ "취소", "확인" ],
	}).then(function(will) {
		if(will) {
			cf_requestServer(_TR_CURRENT_USER_UPDATE, body, function(data) {
				lf_serviceCall500012CallBack(data);
			});
		} else {
	    	swal("사용자 정보 변경", "취소하였습니다.", "./assets/images/icon_alert03.png", {
	    		buttons: "확인",
	    	});
	    }
	});
}

function lf_serviceCall500012CallBack(data) {
	swal("사용자 정보 변경", "사용자 정보가 정상적으로 변경 되었습니다.", "./assets/images/icon_alert02.png", {
		buttons : "확인"
	});

	//_AUTHINFO = data.body.authToken;
	var _authinfo = cf_getCookie("AUTHINFO");
	_authinfo = Base64.decode(_authinfo);
	var authArray = _authinfo.split('|');

	cf_setCookie("AUTHINFO", Base64.encode(authArray[0] + "|"
			+ authArray[1] + "|" + authArray[2] + "|"
			+ data.body.currentUserName + "|" + authArray[4] + "|"
			+ authArray[5] + "|" + data.body.currentUserPhone + "|"
			+ data.body.currentUserEmail));
	cf_userInfoSet();
	lf_setUserInfo();
	
	closeUserModal();
}

function checkPassword(password, password1, password2) {
	var reg = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-`]).{9,20}$/;
	if(password1 == '') {
		swal("", "신규 비밀번호를 입력하여 주세요.", "", {
			buttons:"확인"
		});
		return false;   
	} else if(password1.length < 9 || password1.length > 20) { // 3. 비밀번호 길이
		swal("", "비밀번호는 9~20글자여야 하며, 숫자/알파벳/특수문자를 모두 포함해야 합니다.", "", {
			buttons:"확인"
		});
		return false;    
	} else if(!reg.test(password1)){   
		swal("", "비밀번호는 9~20글자여야 하며, 숫자/알파벳/특수문자를 모두 포함해야 합니다.", "", {
			buttons:"확인"
		});
		return false;
	} else if(password1.search(/\s/) != -1) { // 1. empty check 
		swal("", "비밀번호에 공백을 제거해주세요.", "", {
			buttons:"확인"
		});
		return false;
	} else if(password1 != password2) { // 2. 비밀번호 일치
		swal("", "입력한 비밀번호와 재입력 비밀번호가 일치하지 않습니다.", "", {
			buttons:"확인"
		});
		return false;
	} else if(password == password1) {
		swal("", "이전 비밀번호가 동일한 비밀번호는 사용 하실 수 없습니다.", "", {
			buttons:"확인"
		});
		return false;
	}

	var iter = /(.)\1{1,}/;
	if(iter.test(password1)) {
		swal("", "비밀번호에 동일한 문자를 연속해서 사용할 수 없습니다.", "", {
			buttons:"확인"
		});
		return false;
	} else if(checkSeq(password1)) {
		swal("", "비밀번호에 키보드 연속 된 문자를 사용 할 수 없습니다.", "", {
			buttons:"확인"
		});
		return false;
	}
	return true;    
}

function checkSeq(str) {
	var max = 3; // 3자리 이상 검사
	var i, j, k, x, y;
	var buff = [ "0123456789", "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "qwertyuiopasdfghjklzxcvbnm", "QWERTYUIOPASDFGHJKLZXCVBNM"];

	var scr, src2, ptn = "";
	for(i = 0; i < buff.length; i++) {
		src = buff[i];
		src2 = buff[i] + buff[i];

		for(j = 0; j < src.length; j++) {
			x = src.substr(j, 1);
			y = src2.substr(j, max);
			ptn += "[" + x + "]{" + max + ",}|";
			ptn += y + "|";

		}
	}
	ptn = new RegExp(ptn.replace(/.$/, ""));

	if(ptn.test(str)) return true;
	return false;
}

function closeUserModal() {
	removeUserDim();
	$('#user_modal').removeClass('open');
	$("#user_modal").hide();
	var isVisible = $('#user_modal').is(':visible');
	var modalLength = $('.modal:visible').length;

	if (isVisible) {
		if (modalLength > 1) {
			$('#user_modal').fadeOut(250);
		} else {
			$('.dim').fadeOut(250);
		}
	}
}

function removeUserDim(){
	$('.password_change_box').removeClass('on');

	$('.dim').fadeOut(250);
	if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
		$('body').css({
			overflow : 'inherit'
		}).bind('touchmove', function(e) {
			e.preventDefault();
		});
	}
	if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
		$('body').css({
			overflowX : 'auto'
		}).bind('touchmove', function(e) {
			e.preventDefault();
		});
	}

	var timer = setTimeout(function(){
		checkPasswordHistory();
	}, 1000);
}

function lf_setTopCont(){
	$('#topContList').empty();
<%
if(menuId.equals("dashboard")) {
%>
	$('#topCont').removeClass('disabled');
	$('#topCont > .top_dashboard_link').prop('disabled', false);
	
	if(_USER.getAuthKey() == USER_LEVEL_SUPERADMIN_CODE){
		//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_dashboardPublicDialog();">저장된 대시보드 보기</a></li>'));
		$('#topContList').append($('<li><a href="#" onclick="javascript: lf_saveEventFunc();">대시보드 저장</a></li>'));
		//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_serviceCall600103();">대시보드 삭제</a></li>'));
		//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_dashboardPublicSaveDialog();">공용 대시 보드 등록</a></li>'));
		//$('#topContList').append($('<li><a href="#" onclick="javascript: lf_dashboardAdminDialog();">모든 대시보드 보기</a></li>'));
	} else if(_USER.getAuthKey() == USER_LEVEL_ADMIN_CODE){
		//$('#topContList').append($('<li><a href="#">저장된 대시보드 보기</a></li>'));
		$('#topContList').append($('<li><a href="#">대시보드 저장</a></li>'));
		//$('#topContList').append($('<li><a href="#">대시보드 삭제</a></li>'));
	} else if(_USER.getAuthKey() == USER_LEVEL_OPERATOR_CODE){
		//$('#topContList').append($('<li><a href="#">저장된 대시보드 보기</a></li>'));
		$('#topContList').append($('<li><a href="#">대시보드 저장</a></li>'));
		//$('#topContList').append($('<li><a href="#">대시보드 삭제</a></li>'));
	} else{
		//$('#topContList').append($('<li><a href="#">저장된 대시보드 보기</a></li>'));
		$('#topContList').append($('<li><a href="#">대시보드 저장</a></li>'));
		//$('#topContList').append($('<li><a href="#">대시보드 삭제</a></li>'));
	}
<%
} else {
%>
	$('#topCont').addClass('disabled');
	$('#topCont > .top_dashboard_link').prop('disabled', true);
<%
}
%>
}
</script>

<article class="top_cont">
	<div class="location">
<%
// 대시보드
if(menuId.equals("dashboard")) out.print("<ul><li>Home</li><li>대시보드</li></ul><h2>대시보드</h2>");
// 이벤트 모니터링
else if(menuId.equals("eventMonitoring")) out.print("<ul><li>Home</li><li>이벤트 모니터링</li></ul><h2>이벤트 모니터링</h2>"); // 이벤트 모니터링(cAegis, vAegis)
// 이벤트 조회 > 호스트 이벤트
else if(menuId.equals("firewallEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>방화벽</li></ul><h2>방화벽</h2>");
else if(menuId.equals("ipsEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>침입방지시스템</li></ul><h2>침입방지시스템</h2>");
else if(menuId.equals("malwareEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li<li>호스트 이벤트</li><li>멀웨어</li></ul><h2>멀웨어</h2>");
else if(menuId.equals("fileIntEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>파일 무결성</li></ul><h2>파일 무결성</h2>");
else if(menuId.equals("fileCtlEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>실행 파일 통제</li></ul><h2>실행 파일 통제</h2>");
else if(menuId.equals("pamAclEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>서비스 제어</li></ul><h2>서비스 제어</h2>");
// 이벤트 조회 > 클러스터 이벤트
else if(menuId.equals("containerSecurityEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>클러스터 이벤트</li><li>컨테이너 이벤트</li></ul><h2>컨테이너 이벤트</h2>"); // 230609 이벤트 조회 > 컨테이너 이벤트 추가
else if(menuId.equals("workloadEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>클러스터 이벤트</li><li>컨테이너 워크로드 실행제어</li></ul><h2>컨테이너 워크로드 실행제어</h2>"); // 이벤트 조회 > 컨테이너 워크로드 실행제어 추가
else if(menuId.equals("containerImageControlEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>클러스터 이벤트</li><li>컨테이너 이미지 실행제어</li></ul><h2>컨테이너 이미지 실행제어</h2>"); // 230622 이벤트 조회 > 컨테이너 이미지 실행제어 추가
else if(menuId.equals("imageSecurityEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>클러스터 이벤트</li><li>컨테이너 이미지 스캔</li></ul><h2>컨테이너 이미지 스캔</h2>"); // 이벤트 조회 > 컨테이너 이미지 스캔 추가
else if(menuId.equals("complianceEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>클러스터 이벤트</li><li>클러스터 규정준수 스캔</li></ul><h2>클러스터 규정준수 스캔</h2>"); // 이벤트 조회 > 규정준수 추가
// 스캔
else if(menuId.equals("complianceScan")) out.print("<ul><li>Home</li><li>스캔</li><li>클러스터 규정 준수</li></ul><h2>클러스터 규정 준수</h2>"); // 스캔 > 클러스터 규정 준수 추가
else if(menuId.equals("imageScan")) out.print("<ul><li>Home</li><li>스캔</li><li>컨테이너 이미지</li></ul><h2>컨테이너 이미지</h2>"); // 스캔 > 컨테이너 이미지 스캔 추가
else if(menuId.equals("cloudScan")) out.print("<ul><li>Home</li><li>스캔</li><li>호스트 안티 멀웨어</li></ul><h2>호스트 안티 멀웨어</h2>");
else if(menuId.equals("vulnerabilityScan")) out.print("<ul><li>Home</li><li>스캔</li><li>호스트 취약성</li></ul><h2>호스트 취약성</h2>");
// 정책 관리 > 호스트 정책
else if(menuId.equals("policyManagement")) out.print("<ul><li>Home</li><li>정책관리</li><li>탐지룰 관리</li></ul><h2>탐지룰 관리</h2>"); // 정책관리 > 탐지 룰 관리(cAegis)
// 정책 관리 > 클러스터 정책
else if(menuId.equals("policyContainerSecurity")) out.print("<ul><li>Home</li><li>정책 관리</li><li>클러스터</li><li>컨테이너 이벤트</li></ul><h2>컨테이너 이벤트</h2>"); // 230629 정책관리 > 컨테이너 이벤트 정책관리 추가
else if(menuId.equals("policyWorkload")) out.print("<ul><li>Home</li><li>정책 관리</li><li>클러스터</li><li>컨테이너 워크로드 실행제어</li></ul><h2>컨테이너 워크로드 실행제어</h2>"); // 230629 정책관리 > 컨테이너 이벤트 정책관리 추가
else if(menuId.equals("policyImageSecurity")) out.print("<ul><li>Home</li><li>정책 관리</li><li>클러스터</li><li>컨테이너 이미지 스캔</li></ul><h2>컨테이너 이미지 스캔</h2>"); // 230629 정책관리 > 컨테이너 이벤트 정책관리 추가
else if(menuId.equals("policyComplianceScan")) out.print("<ul><li>Home</li><li>정책 관리</li><li>클러스터</li><li>클러스터 규정준수 스캔</li></ul><h2>클러스터 규정준수 스캔</h2>"); // 230629 정책관리 > 컨테이너 이벤트 정책관리 추가
// 정책관리 
else if(menuId.equals("cloudManager")) out.print("<ul><li>Home</li><li>정책관리</li><li>자산 관리</li></ul><h2>자산 관리</h2>");
else if(menuId.equals("userConfig")) out.print("<ul><li>Home</li><li>정책관리</li><li>사용자 관리</li></ul><h2>사용자 관리</h2>");
else if(menuId.equals("auditList")) out.print("<ul><li>Home</li><li>정책관리</li><li>감사 로그</li></ul><h2>감사 로그</h2>");
// 환경 설정
else if(menuId.equals("authConfig")) out.print("<ul><li>Home</li><li>환경설정</li><li>메뉴 권한 설정</li></ul><h2>메뉴 권한 설정</h2>");
else if(menuId.equals("siteConfig")) out.print("<ul><li>Home</li><li>환경설정</li><li>사이트 이용 설정</li></ul><h2>사이트 이용 설정</h2>");
// not used
else if(menuId.equals("malwareHistoryEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>멀웨어 스캔 이력</li></ul><h2>멀웨어 스캔 이력</h2>");
else if(menuId.equals("avEvent")) out.print("<ul><li>Home</li><li>이벤트 조회</li><li>호스트 이벤트</li><li>멀웨어 행위</li></ul><h2>멀웨어 행위</h2>");
else if(menuId.equals("cloudStatus")) out.print("<ul><li>Home</li><li>자산</li><li>자산 현황</li></ul><h2>자산 현황</h2>");
else if(menuId.equals("cloudManagerContainer")) out.print("<ul><li>Home</li><li>정책관리</li><li>자산 관리</li></ul><h2>자산 관리</h2>"); // 정책관리 > 자산관리(cAegis)
else if(menuId.equals("alertList")) out.print("<ul><li>Home</li><li>이벤트 모니터링</li></ul><h2>이벤트 모니터링</h2>");
else if(menuId.equals("securityPolicy")) out.print("<ul><li>Home</li><li>정책관리</li><li>탐지룰 관리</li></ul><h2>탐지룰 관리</h2>");
else if(menuId.equals("malwareScan")) out.print("<ul><li>Home</li><li>멀웨어</li><li>멀웨어 수동 검사</li></ul><h2>멀웨어 수동 검사</h2>");
else if(menuId.equals("malwareExcept")) out.print("<ul><li>Home</li><li>멀웨어</li><li>멀웨어 예외 설정</li></ul><h2>멀웨어 예외 설정</h2>");
else if(menuId.equals("systemAccount")) out.print("<ul><li>Home</li><li>탐지룰</li><li>계정 관리</li></ul><h2>계정 관리</h2>");
%>
	</div>
	<div class="user_box">
		<div class="user_info">
			<a href="#" class="user_info_link">
				<p class="user">Hello, <span id="currentUserId"></span></p>
			</a>
			<div class="user_info_list">
				<ul>
					<li><a href="#" rel="user_modal" class="modalLoad">내정보</a></li>
					<li><a href="#" rel="tf_modal" class="modalLoad">2차인증</a></li>
					<li class="logout"><a href="javascript:cf_serviceCall100002();">로그아웃</a></li>
				</ul>
			</div>
		</div>
		<div class="top_dashboard <%= menuId.equals("dashboard") ? "" : "disabled" %>">
			<a href="#" class="top_dashboard_link">
				<span class="linktext">사용자 정보 버튼</span>
			</a>
		</div>
		<div class="top_dashboard_list">
			<ul id="topContList">
				<!-- li><a href="javascript: lf_dashboardPublicSaveDialog();">공용 대시 보드 등록</a></li>
				<li><a href="javascript: lf_dashboardAdminDialog();">모든 대시보드 보기</a></li>
				<li><a href="javascript: lf_dashboardPublicDialog();">저장된 대시보드 보기</a></li>
				<li><a href="javascript: lf_saveEventFunc();">대시보드 저장</a></li>
				<li><a href="javascript: lf_serviceCall600103();">대시보드 삭제</a></li -->
			</ul>
		</div>
	</div>
</article>

<!--  modal :: 내정보 팝업  -->
<div class="modal small" id="user_modal">
	<div class="modal_header">
		<h3>내정보</h3>
	</div>
	<div class="modal_body">
		<div class="modal_cont">
			<dl>
				<dt>
					<span>사용자 권한</span>
				</dt>
				<dd>
					<div class="sel_box">
						<select class="popup_sel disabled" id="authKey">
							<option value="0000A399X999">SUPER ADMIN</option>
							<option value="0000A499X999">ADMIN</option>
							<option value="0000A599X999">Operator</option>
							<option value="0000A699X999">Viewer</option>
						</select>
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>User ID</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" readonly="" value="aptcastle"  id="currentUserId">
					</div>
				</dd>
			</dl>
			<dl>
				<dt>Password</dt>
				<dd>
					<div class="ipt_box password">
						<input class="no_radius" type="password" placeholder="기존 비밀번호를 입력해 주세요." id="userPasswd">
						<a href="#" class="btn usr_password_change password_change" style="height: 34px; line-height: 30px; border-radius: 17px; border: 2px solid #2e6fd4; color: #fff; font-size: 13px;">비밀번호변경</a>
					</div>
					<div class="password_change_box">
						<div class="ipt_box">
							<input class="no_radius" type="password" placeholder="신규 비밀번호를 입력해 주세요." id="userPasswd1">
						</div>
						<div class="ipt_box">
							<input class="no_radius" type="password" placeholder="신규 비밀번호를 다시한번 입력해 주세요." id="userPasswd2">
						</div>
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>User Name</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" placeholder="사용자의 이름을 입력해주세요." value="auditcastle Maker" id="currentUserName">
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>User Phone</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" placeholder="연락처를 입력해 주세요." value="010-0000-0000" id="currentUserPhone">
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>User Email</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" placeholder="이메일를 입력해 주세요." value="auditcastle@sgacorp.co.kr" id="currentUserEmail">
					</div>
				</dd>
			</dl>
		</div>
	</div>
	<div class="modal_footer">
		<div class="btn_wrap">
			<a href="javascript:closeUserModal();" class="btn grey">취소</a>
			<a href="javascript:updateCurrentUser();" class="btn">수정</a>
		</div>
	</div>
	<div class="modal_controller">
		<a href="#" class="close">close</a>
	</div>
</div>

<div class="modal small" id="tf_modal">
	<div class="modal_header">
		<h3>OTP 정보</h3>
	</div>
	<div class="modal_body">
		<div class="modal_cont">
			<dl>
				<dt>
					<span>QR Code</span>					
				</dt>
				<dd>
					<div class="ipt_box">
						<img id="otpQRImg" src="/otp/qrcode.do" width="120" height="120" loading="lazy"/>
						<span id="otpQRCode" class="qrcode super_bg">Unknown</span>
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>User ID</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" readonly="" value=""  id="otpUserid">
					</div>
				</dd>
			</dl>
			<dl>
				<dt>Password</dt>
				<dd>
					<div class="ipt_box password">
						<input class="no_radius" type="password" placeholder="비밀번호를 입력해 주세요." id="otpPasswd">
						&nbsp;<a href="javascript:otpIssue();" class="btn otp_change_box otp_change" style="height: 34px; line-height: 30px; border-radius: 17px; border: 2px solid #2e6fd4; color: #fff; font-size: 13px;">QR 재발급</a>
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>발급처</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" placeholder="" value="" id="otpCompany" readonly>
					</div>
				</dd>
			</dl>
			<dl>
				<dt>
					<span>발급일</span>
				</dt>
				<dd>
					<div class="ipt_box">
						<input class="no_radius" type="text" placeholder="" value="" id="otpCreatetime" readonly>
					</div>
				</dd>
			</dl>			
		</div>
	</div>
	<div class="modal_footer">
		<div class="btn_wrap">
			<a href="#" class="btn grey close">닫기</a>
		</div>
	</div>
	<div class="modal_controller">
		<a href="#" class="close">close</a>
	</div>
</div>