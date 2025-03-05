/***************************************************************
* 업무 그룹명 : 
* 서브 업무명 : 
* 설       명 : 
* 작   성  자 : 
* 작   성  일 : 
* Copyright ⓒ 
* ======================================
* 변경자/변경일 : 
* 변경사유/내역 :  
* ======================================
***************************************************************/

$(document).ready(function() {
	cf_userInfoSet();
	cf_setSideMenu();
	cf_setTopBar();
	cf_mouse();
	$('.sel_box select').niceSelect();
});

function cf_openDialog(_DIALOG_TYPE, func, initParam) {
	console.log("initParam: ", initParam);
	var url = _DIALOG_HTML[_DIALOG_TYPE]['url'];
	var dialogId = _DIALOG_HTML[_DIALOG_TYPE]['id'];

	var mainDialogDIV = $('<div id="' + dialogId + '"></div>');

	if (initParam) mainDialogDIV.data('initParam', initParam);

	if ($('body').find('#' + dialogId).length > 0) {
		$('body').find('#' + dialogId).remove();
	}

	$('body').append(mainDialogDIV);

	var targetDIV = $('body > #' + dialogId);

	targetDIV.load(url, function() {

		var $target = $('#' + dialogId + ' .modal');

		$target.attr('tabindex', '0').fadeIn(250).focus();
		$target.css({ display: 'table' });
		$target.addClass('open');

		cf_createDim();

		// keydown focus repeat
		$target.find(".close").on('keydown', function(e) {
			if (e.which == '9') {
				$target.attr('tabindex', '0').focus();
			}
		});

		// close and focusout
		$target.find(".close").on('click', function(e) {
			e.preventDefault();
			$target.fadeOut(250);
			cf_removeDim();
			$(this).off('click');
			$target.removeClass('open');
			var isVisible = $target.is(':visible');
			var modalLength = $('.modal:visible').length;

			if (isVisible) {
				if (modalLength > 1) {
					$target.fadeOut(250);
				} else {
					$('.dim').fadeOut(250);
				}
			}

			$('#' + dialogId).remove();
		});

		$target.find(".modalLoad").on('click', function(e) {
			e.preventDefault();
			$target.fadeOut(250);
			var isVisible = $target.is(':visible');
			var modalLength = $('.modal:visible').length;

			if (isVisible) {
				if (modalLength > 1) {
					$target.fadeOut(250);
				} else {
					$('.dim').fadeOut(250);
				}
			}

			$('#' + dialogId).remove();
		});

		$(document).on("keyup", function(e) {
			if (e.which == '27') {
				$target.fadeOut(250);
				cf_removeDim();
				$target.attr('class', 'modal');

				$('#' + dialogId).remove();
			}
		});

		$target.parents('html body').find(".dim").click(function(e) {
			e.preventDefault();
			$target.fadeOut(250);
			cf_removeDim();
			$(this).off('click');
			$target.removeClass('open');
			var isVisible = $target.is(':visible');
			var modalLength = $('.modal:visible').length;

			if (isVisible) {
				if (modalLength > 1) {
					$target.fadeOut(250);
				} else {
					$('.dim').fadeOut(250);
				}
			}

			$('#' + dialogId).remove();
		});

		// confirm
		// close and focusout
		$target.find(".confirm").on('click', function(e) {

			var callbackFn = func;

			var flag = callbackFn();

			if (flag) {
				e.preventDefault();
				$target.fadeOut(250);
				cf_removeDim();
				$(this).off('click');
				$target.removeClass('open');
				var isVisible = $target.is(':visible');
				var modalLength = $('.modal:visible').length;

				if (isVisible) {
					if (modalLength > 1) {
						$target.fadeOut(250);
					} else {
						$('.dim').fadeOut(250);
					}
				}

				$('#' + dialogId).remove();
			}

		});

	});

}

function cf_createDim() {
	if (!$('.dim').length) {
		$('body').append('<div class="dim"></div>');
	}
	$('.dim').fadeIn(250);
	$('body').css({
		overflow: 'hidden'
	}).bind('touchmove', function(e) {
		e.preventDefault();
	});
}
function cf_removeDim() {
	$('.dim').fadeOut(250);
	$('body').css({
		overflow: 'inherit'
	}).unbind('touchmove');
}

// 툴팁 실행 스크립트
function cf_mouse() {
	$("*[title]").tooltip();
}


function cf_setTopBar() {
	if ($('#main_topbar').children().length > 0) {
		$('#main_topbar').hide();
		$('#main_topbar').empty()
	}

	$('#main_topbar').load('./page/layout/topbar.html', function() {

	});
}

function cf_setSideMenu() {
	if ($('#main_sidebar').children().length > 0) {
		$('#main_sidebar').hide();
		$('#main_sidebar').empty();
	}
	$('#main_sidebar').load('./page/layout/sidebar.html', function() {
	});
}

/*************************************************************************************
 * 메뉴에해당하는 page html 화면 로딩
 * @param menuID : 메뉴 아이디
 * @return lf_menuClick(contentsURL) 메뉴에따른 콘텐츠 페이즈 로딩 호출
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_getMenuIdByURL() {
	var contentsURL = window.location.pathname;
	var menuId;
	switch (contentsURL) {
		case '/':
			break;

		case '/dashboard.do':
			menuId = 'dashboard';
			break;

		case '/alertList.do':
			menuId = 'alertList';
			break;

		// 230118 이벤트 모니터링 추가
		case '/eventMonitoring.do':
			menuId = 'eventMonitoring';
			break;

		case '/userManager.do':
			menuId = 'userConfig';
			break;

		case '/authManager.do':
			menuId = 'authConfig';
			break;

		case '/siteManager.do':
			menuId = 'siteConfig';
			break;

		case '/auditList.do':
			menuId = 'auditList';
			break;

		// 이벤트 페이지 
		case '/eventFirewall.do':
			menuId = 'firewallEvent';
			break;

		case '/eventIPS.do':
			menuId = 'ipsEvent';
			break;

		case '/eventAV.do':
			menuId = 'avEvent';
			break;

		case '/eventMalware.do':
			menuId = 'malwareEvent';
			break;

		case '/eventMalwareHistory.do':
			menuId = 'malwareHistoryEvent';
			break;

		case '/eventFileInt.do':
			menuId = 'fileIntEvent';
			break;

		case '/eventFileCtl.do':
			menuId = 'fileCtlEvent';
			break;

		case '/eventPamAcl.do':
			menuId = 'pamAclEvent';
			break;

		case '/cloudStatus.do':
			menuId = 'cloudStatus';
			break;

		// 230620 cloudManagerContainer와 병합
		case '/cloudManager.do':
			menuId = 'cloudManager';
			break;

		case '/cloudScan.do':
			menuId = 'cloudScan';
			break;

		// 230109 이벤트 조회 > 하위 페이지 추가 
		case '/eventImageSecurity.do':
			menuId = 'imageSecurityEvent';
			break;
		case '/eventContainerSecurity.do':
			menuId = 'containerSecurityEvent';
			break;
		case '/eventWorkload.do':
			menuId = 'workloadEvent';
			break;
		case '/eventCompliance.do':
			menuId = 'complianceEvent';
			break;

		//보안 정책 설정
		case '/securityPolicy.do':
			menuId = 'securityPolicy';
			break;

		//230201 정책 관리 > 탐지룰 관리 (cAegis) 추가
		case '/policyManagement.do':
			menuId = 'policyManagement';
			break;

		//230712 정책관리 > 클러스터 정책 > 클러스터 규정준수 스캔 추가
		case '/policyComplianceScan.do':
			menuId = 'policyComplianceScan';
			break;

		case '/systemAccount.do':
			menuId = 'systemAccount';
			break;

		//230220 스캔 > 이미지 스캔(cAegis) 추가
		case './scanImage.do':
			menuId = 'imageScan';
			break;

		//230404 스캔 > 규정 준수 추가
		case './scanCompliance.do':
			menuId = 'complianceScan';
			break;

		default:
			break;
	}

	return menuId;
}
function cf_menuClick(menuID, param) {
	var contentsURL = "";

	switch (menuID) {

		case 'dashboard':
			contentsURL = './dashboard.do';
			break;

		case 'alertList':
			contentsURL = './alertList.do';
			break;

		// 230118 이벤트 모니터링 추가
		case 'eventMonitoring':
			contentsURL = './eventMonitoring.do';
			break;

		case 'userConfig':
			contentsURL = './userManager.do';
			break;

		case 'authConfig':
			contentsURL = './authManager.do';
			break;

		case 'siteConfig':
			contentsURL = './siteManager.do';
			break;

		case 'auditList':
			contentsURL = './auditList.do';
			break;

		// 이벤트 페이지 
		case 'firewallEvent':
			contentsURL = './eventFirewall.do';
			break;

		case 'ipsEvent':
			contentsURL = './eventIPS.do';
			break;

		case 'avEvent':
			contentsURL = './eventAV.do';
			break;

		case 'malwareEvent':
			contentsURL = './eventMalware.do';
			break;

		case 'malwareHistoryEvent':
			contentsURL = './eventMalwareHistory.do';
			break;

		case 'fileIntEvent':
			contentsURL = './eventFileInt.do';
			break;

		case 'fileCtlEvent':
			contentsURL = './eventFileCtl.do';
			break;

		case 'pamAclEvent':
			contentsURL = './eventPamAcl.do';
			break;


		case 'cloudStatus':
			contentsURL = './cloudStatus.do';
			break;

		case 'cloudScan':
			contentsURL = './cloudScan.do';
			break;

		// 230620 cloudManagerContainer와 병합		
		case 'cloudManager':
			contentsURL = './cloudManager.do';
			break;

		// 이벤트 조회 > 하위 페이지 추가
		case 'imageSecurityEvent':
			contentsURL = './eventImageSecurity.do';
			break;
		case 'containerSecurityEvent':
			contentsURL = './eventContainerSecurity.do';
			break;
		case 'workloadEvent':
			contentsURL = './eventWorkload.do';
			break;
		case 'complianceEvent':
			contentsURL = './eventCompliance.do';
			break;

		//보안 정책 설정
		case 'securityPolicy':
			contentsURL = './securityPolicy.do';
			break;

		//230201 정책 설정 > 탐지 룰 관리 (cAegis) 추가
		case 'policyManagement':
			contentsURL = './policyManagement.do';
			break;

		//230712 정책 설정 > 클러스터 정책 > 	클러스터 규정준수 스캔 추가
		case 'policyComplianceScan':
			contentsURL = './policyComplianceScan.do';
			break;
			
		case 'malwareScan':
			contentsURL = './scanMalware.do';
			break;

		case 'malwareExcept':
			contentsURL = './exceptMalware.do';
			break;

		case 'systemAccount':
			contentsURL = './systemAccount.do';
			break;

		//230220 스캔 > 이미지 스캔(cAegis) 추가
		case 'imageScan':
			contentsURL = './scanImage.do';

		//230404 스캔 > 규정 준수 추가
		case 'complianceScan':
			contentsURL = './scanCompliance.do';

		default:
			break;

	}

	var paramURL = '';
	if (param) {
		var paramCnt = 0;
		for (var key in param) {
			if (paramCnt == 0) paramURL += key + '=' + param[key];
			else {
				paramURL += '&' + key + '=' + param[key];
			}
			paramCnt++;
		}

		paramURL = Base64.encode(paramURL);

	}

	cf_setCookie("CURRMENUID", Base64.encode(menuID));
	location.href = contentsURL + ((paramURL != '') ? ('?' + paramURL) : '');
}

function cf_getMenuData(menuId) {
	var menuData = null;

	for (var i = 0; i < _MAIN_MENU.length; i++) {
		var category = _MAIN_MENU[i];
		var children = category['children'];
		if (children.length > 0) {
			for (var j = 0; j < children.length; j++) {
				var menuObj = children[j];
				if (menuObj['menuId'] == menuId) {
					menuData = menuObj;
				}

				if (menuObj['children']) {
					for (var v = 0; v < menuObj['children'].length; v++) {
						var subMenuObj = menuObj['children'][v];
						if (subMenuObj['menuId'] == menuId) {
							menuData = subMenuObj;
						}
					}
				}

			}
		}
	}
	return menuData;
}

function cf_currentMenuId() {
	var currentMenuId;
	var cookieMenuId = cf_getCookie('CURRMENUID');
	var urlMenuId = cf_getMenuIdByURL();

	/*
		우선순위 1 : URL 주소로 부터 변환한 MENUID
		우선순위 2 : 쿠키에 저장 된 MENUID
		우선순위 3 : dashboard
	*/
	if (urlMenuId != null) {
		currentMenuId = urlMenuId;
	} else {
		if (cookieMenuId == null) {
			currentMenuId = 'dashboard';
		} else {
			currentMenuId = Base64.decode(cookieMenuId);
		}
	}
	cf_setCookie("CURRMENUID", Base64.encode(currentMenuId));

	return currentMenuId;
}

function cf_removePreloader(elId) {
	var target = $('#' + elId);
	if (target.find('.cont_loading').length > 0) {
		target.find('.cont_loading').remove();
	}
}

function cf_contPreloaderForObject($target) {
	if ($target.find('.cont_loading').length > 0) {
		$target.find('.cont_loading').remove();
	}
	else {
		var contLoading = $('<div class="cont_loading">'
			+ '<div class="loading_box">'
			+ '<div class="img_box">'
			+ '<img src="assets/images/loading.gif">'
			+ '</div>'
			+ '<p class="loading04">'
			+ '<span>L</span>'
			+ '<span>o</span>'
			+ '<span>a</span>'
			+ '<span>d</span>'
			+ '<span>i</span>'
			+ '<span>n</span>'
			+ '<span>g</span>'
			+ '<span>.</span>'
			+ '<span>.</span>'
			+ '<span>.</span>'
			+ '</p>'
			+ '</div>'
			+ '</div>');
		$target.append(contLoading);
	}
}

function cf_contPreloader(elId) {
	var target = $('#' + elId);
	if (target.find('.cont_loading').length > 0) {
		target.find('.cont_loading').remove();
	}
	else {
		var contLoading = $('<div class="cont_loading">'
			+ '<div class="loading_box">'
			+ '<div class="img_box">'
			+ '<img src="assets/images/loading.gif">'
			+ '</div>'
			+ '<p class="loading04">'
			+ '<span>L</span>'
			+ '<span>o</span>'
			+ '<span>a</span>'
			+ '<span>d</span>'
			+ '<span>i</span>'
			+ '<span>n</span>'
			+ '<span>g</span>'
			+ '<span>.</span>'
			+ '<span>.</span>'
			+ '<span>.</span>'
			+ '</p>'
			+ '</div>'
			+ '</div>');
		target.append(contLoading);
	}
}

function cf_alert(title, contents) {
	if (!title) title = '';

	var icon = "";
	if (title == "성공") icon = "./assets/images/icon_alert02.png";
	else if (title == "오류") icon = "./assets/images/icon_alert03.png";
	else if (title == "경고") icon = "./assets/images/icon_alert04.png";

	swal(title, contents, icon, {
		buttons: "확인",
	});
}

function cf_confirm(title, contents, func) {
	if (!title) title = '알림';

	var callbackFn = func;

	swal(title, contents, "./assets/images/icon_alert01.png", {
		buttons: ["취소", "확인"],
	}).then(function(willDelete) {
		if (willDelete) {
			func();
			swal(title, "변경 되었습니다.", {
				icon: "./assets/images/icon_alert02.png",
				buttons: "확인"
			});
		} else {
			swal(title, "취소 되었습니다.", {
				icon: "./assets/images/icon_alert03.png",
				buttons: "확인"
			});
		}
	});
}

function cf_deleteConfirm(title, contents, func) {
	if (!title) title = '알림';

	var callbackFn = func;

	swal(title, contents, "info", {
		buttons: ["취소", "삭제"],
	}).then(function(willDelete) {
		if (willDelete) {
			func();
			swal(title, "삭제 되었습니다.", {
				icon: "./assets/images/icon_alert2.png",
				buttons: "확인"
			});
		} else {
			swal(title, "삭제 취소 되었습니다.", {
				icon: "./assets/images/icon_alert03.png",
				buttons: "확인"
			});
		}
	});
}

function cf_serverError() {
	swal("접속실패", "서버로 부터 정보를 가져올 수 없습니다.", "./assets/images/icon_alert03.png", {
		buttons: "확인",
	});
}

function cf_serverTimeError() {
	swal("허용시간 초과", "로그인후 시간이 경과되어 서버정보를 가져올 수 없습니다.\n" + "다시 로그인하여 주십시요.\n", "./assets/images/icon_alert03.png", {
		buttons: "확인",
	});
}



/*************************************************************************************
 * 로그인 서비스 호출
 * @param userId : 사용자아이디
 * @param userPasswd : 사용자패스워드
 * @return cf_requestServer(_TR_LOGIN,body,cf_loginCallBack) 호출
 * @author 
 * @date 
 * @update 
 *************************************************************************************/
function cf_login(userId, userPasswd) {
	cvUserId = userId;
	cf_delCookie("AUTHINFO");
	cf_delCookie("CURRMENUID");
	cf_delCookie("PW_CHANGE");
	var body = { "userId": userId, "userPasswd": userPasswd };
	cf_requestServer(_TR_LOGIN, body, cf_loginCallBack, false);
}

function cf_otp_login(otpnum) {
	var body = { "otpnum": otpnum };
	cf_requestServer(_TR_OTP_LOGIN, body, cf_loginOtpCallBack, false);
}

/*************************************************************************************
 * 로그인 서비스 콜백
 * @param cf_requestServer callBack DATA : 서비스호출후 콜백 데이터
 * @return 정상:cf_mainLoadPage()호출 패스워드변경시기도래 : cf_getPwdChgloadHtml() 호출
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_loginCallBack(data) {
	var loginOtp = data.body.loginOtp;
	var loginOtpTime = data.body.loginOtpTime;
	if ("true" == loginOtp) {
		otpOnLoad(loginOtpTime);
	} else {
		_AUTHINFO = data.body.authToken;
		cf_setCookie("AUTHINFO", Base64.encode(
			_AUTHINFO + "|"
			+ cvUserId + "|"
			+ data.body.authKey + "|"
			+ data.body.userName + "|"
			+ data.body.userLevel + "|"
			+ data.body.status + "|"
			+ data.body.phone + "|"
			+ data.body.email
		)
		);
		cf_mainLoadPage();
	}
}
function cf_loginOtpCallBack(data) {
	var loginState = data.body.loginState;
	var loginMsg = data.body.rtnMsg;

	if (loginState == 1) {
		_AUTHINFO = data.body.authToken;
		cf_setCookie("AUTHINFO", Base64.encode(
			_AUTHINFO + "|"
			+ cvUserId + "|"
			+ data.body.authKey + "|"
			+ data.body.userName + "|"
			+ data.body.userLevel + "|"
			+ data.body.status + "|"
			+ data.body.phone + "|"
			+ data.body.email
		)
		);
		cf_mainLoadPage();
	} else if (loginState == 0) {
		cf_alert('로그인 실패', data.body.rtnMsg);
		$("#userPw").val("");
	} else {
		cf_alert('로그인 실패', data.body.rtnMsg);
		$("#userPw").val("");
		otpOffLoad();
	}

}

/*************************************************************************************
 * _USER 값 저장
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_userInfoSet() {
	if (!cf_getCookie("AUTHINFO")) return "";
	var authinfoattr = Base64.decode(cf_getCookie("AUTHINFO")).split("|");
	_USER.setUserId(authinfoattr[1]);
	_USER.setAuthKey(authinfoattr[2]);
	_USER.setUserKnm(("undefined" == authinfoattr[3]) ? "" : authinfoattr[3]);
	_USER.setUserLevKnm(authinfoattr[4]);
	_USER.setUserStatus(authinfoattr[5]);
	_USER.setUserPhone(authinfoattr[6]);
	_USER.setUserEmail(authinfoattr[7]);
}


/*************************************************************************************
 * json URL
 * @return json 호출 URL
 * @author 
 * @date 
 * @update 
 *************************************************************************************/
function cf_getJsonUrl() {
	return _WEBCONTEXTURL + "/json.do";
}

/*************************************************************************************
 * 초기화면 로딩
 * @return 초기화면 로딩
 * @author 
 * @date 
 * @update 
 *************************************************************************************/
function cf_mainLoadPage() {
	location.href = "/dashboard.do";
}

/*************************************************************************************
 * 서버로부터 서비스호출후 데이타를 읽어오는 함수
 * @param reqTrid : 요청하는 업무코드(head 구성용)
 * @param body : 요청하는 body의 param array
 * @param callback : callback 함수명
 * @param reqAsync : true/false 비동기/동기화
 * @param reqUrl : ajax 요청 url(없으면 jsonURL)
 * @return callback(data) : callback(서비스호출후 데이타)함수호출
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_requestServer(reqTrid, body, callback, reqAsync, reqUrl, paramData) {
	var Params = {};

	if (!reqUrl) reqUrl = cf_getJsonUrl();
	if (typeof reqAsync == "undefined") reqAsync = _ASYNC;
	if (!paramData) paramData = null;
	if (_IDPWSERVICE && _IDPWSERVICE[reqTrid]) {
		log("_IDPWSERVICE[" + reqTrid + "]=" + _IDPWSERVICE[reqTrid]);
		if (!body.enc_userPasswd) {
			cf_certCheckDialogPopup(reqTrid, body, callback, reqAsync, reqUrl, paramData);
			return false;
		} else Params['header'] = cf_jsonHeaderSet(reqTrid, body);
	} else Params['header'] = cf_jsonHeaderSet(reqTrid);

	if (body) Params['body'] = body;
	log('Params', Params); log('url', reqUrl); log('reqAsync', reqAsync);

	$.ajax({
		url: reqUrl,
		data: JSON.stringify(Params),
		async: reqAsync,
		type: "post",
		//dataType : "json",
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		},
		success: function(data, XMLHttpRequest, textStatus) {
			if ("00000" != data.header.rtnCode) { //서비스오류
				cf_serviceCallError(data);
			} else {
				callback(data, body);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrow) {
			cf_alert('오류', "AJAX 요청 에러 메세지 : \n " + errorThrow);
		}

	});
}


/*******************************************************
 * @param reqTrid 사용안함
 * @param body
 * @param $ID
 * @returns
 ********************************************************/
function cf_requestServerDataTable(reqTrid, body, $ID) {
	var Params = {};

	var reqUrl = cf_getJsonUrl();

	Params['header'] = cf_jsonHeaderSet(reqTrid);
	if (body) Params['body'] = body;

	$('#' + $ID).DataTable({
		"autoWidth": false,
		"paging": true,
		"pagingType": "full_numbers",
		"ordering": false,
		"info": true,
		"filter": false,
		"lengthChange": false,
		"language": {
			"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
		},
		"dom": 'rt<"bottom"fip><"clear">',
		"pageLength": '5',
		"serverSide": true,
		"processing": true,
		"ajax": {
			"url": reqUrl,
			"type": "POST",
			"data": function(d) {
				debugger;
			},
			"dataSrc": function(json) {
				debugger;
				return json.data;
			}
		},
	});
}

/*************************************************************************************
 * 서비스호출후 오류콜백
 * @param data : 오류데이터
 * @return 오류 알림 팝업메시지
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_serviceCallError(data) {
	if (_NOTLOGINSP_150 == data.header.rtnCode || _NOTLOGINSP_107 == data.header.rtnCode) {
		cf_serverTimeError();
		cf_logoutSetCookie();
	} else {
		cf_alert('오류', data.body.rtnMsg);
	}
}

/*************************************************************************************
 * 서비스호출시 json Header 구성
 * @param trId : 서비스아이디
 * @return json Header DATA
 * @author 
 * @date 
 * @update 
 *************************************************************************************/
function cf_jsonHeaderSet(trId, body) {
	var header = new Object();
	header["trId"] = trId;
	header["authToken"] = cf_authInfo("authToken") ? cf_authInfo("authToken") : "";
	if (body) { header["enc_userPasswd"] = body.enc_userPasswd; delete body.enc_userPasswd; }
	else if ($("#logpw").val()) {
		var idpwSvcChk = false;
		for (var i = 0; i < _IDPWSERVICE_ARR.length; i++) {
			if (trId == _IDPWSERVICE_ARR[i]) {
				idpwSvcChk = true;
				break;
			}
		}
		if (idpwSvcChk) header["enc_userPasswd"] = Base64.encode($("#logpw").val());
	}

	return header;
}

/*************************************************************************************
 * 쿠키값 읽어오기
 * @param name : 쿠키 name
 * @return 쿠키 value
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_getCookie(name) {					//쿠키 읽기
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
	} else {
		begin += 2;
	}
	var end = document.cookie.indexOf(";", begin);
	if (end == -1) end = dc.length;
	return unescape(dc.substring(begin + prefix.length, end));
}

/*************************************************************************************
 * authInfo 값읽어오기
 * @param key : authInfo key
 * @return authInfo값
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_authInfo(key) {
	if (!cf_getCookie("AUTHINFO")) return "";
	var authinfoattr = Base64.decode(cf_getCookie("AUTHINFO")).split("|");
	if ("authMenu" == key) {
		return authinfoattr[2];
	} else if ("authId" == key) {
		return authinfoattr[1];
	} else if ("authToken" == key) {
		return authinfoattr[0];
	}
}

/*************************************************************************************
 * 쿠키값 저장
 * @param name : 쿠키 name
 * @param value : 쿠키 value
 * @param expires : 쿠키 유지시간
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_setCookie(name, value, expires) {	//쿠키 쓰기
	var curCookie;
	if (expires) {
		var today = new Date();
		today.setDate(today.getDate() + expires);
		/*curCookie = name + "=" + escape(value) + "; expires=" + today.toGMTString()+"; path=/"+_WEBCONTENTNAME+";";*/
		curCookie = name + "=" + escape(value) + "; expires=" + today.toGMTString() + "; path=/;";
	} else {
		/* curCookie = name + "=" + escape(value)+"; path=/"+_WEBCONTENTNAME+";";*/
		curCookie = name + "=" + escape(value) + "; path=/;";
	}
	document.cookie = curCookie;
}

/*************************************************************************************
 * 쿠키삭제
 * @param name : 쿠키 name
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_delCookie(name) {
	var expDate = new Date();
	expDate.setTime(expDate.getTime() - 1);
	var cookieVal = cf_getCookie(name);
	if (cookieVal != null) {
		cf_setCookie(name, "", expDate);
	}
}

/*************************************************************************************
 * 로그아웃 서비스호출
 * @return cf_requestServer(_TR_LOGOUT,body,cf_serviceCallBack500002)
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_serviceCall100002() {
	var body = { "userId": cf_authInfo("authId") };
	cf_requestServer(_TR_LOGOUT, body, cf_serviceCallBack500002);
}

/*************************************************************************************
 * 로그아웃서비스 콜백
 * @param data : 서비스콜백 DATA
 * @return cf_logoutSetCookie() 호출
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_serviceCallBack500002(data) {
	cf_logoutSetCookie();
}

/*************************************************************************************
 * 로그아웃 쿠키삭제
 * @return cf_mainLoadPage() : 메인페이지이동
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_logoutSetCookie() {
	cf_delCookie("AUTHINFO");
	cf_delCookie("CURRMENUID");
	cf_delCookie("PW_CHANGE");
	location.href = _WEBCONTEXTURL + '/login.do';
}

/*************************************************************************************
 * 패스워드 변경서비스호출
 * @param oldpw 기존패스워드
 * @param newpw 신규패스워드
 * @return cf_requestServer(_TR_PWCHANGE,body,cf_serviceCallBack500003)
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_pwchgService(oldpw, newpw) {

	var body = { "userId": cf_authInfo("authId"), "enc_userPasswd": Base64.encode(oldpw), "enc_userNewPasswd": Base64.encode(newpw) };
	cf_requestServer(_TR_PWCHANGE, body, cf_serviceCallBack500003);
}

/*************************************************************************************
 * 패스워드 변경서비스 콜백
 * @param data 콜백 DATA
 * @return cf_mainLoadPage() 매인페이지이동
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update 
 *************************************************************************************/
function cf_serviceCallBack500003(data) {
	alert("비밀번호 변경되었습니다.");
}

function cf_scaleData(value, limit) {
	var data;

	if (!limit) limit = 20;
	if (limit < 5) limit = 5;

	if (!value) data = "";
	else data = value;

	if (data.length > limit) data = data.substring(0, limit - 2) + "..";

	return data;
}

function cf_isIPv4(value) {
	if (!value) return false;

	try {
		return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g.test(value);
	} catch (error) {
		return false;
	}
}


function cf_isPort(value) {
	if (!value) return false;

	try {
		var port = value * 1;
		if (!port) return false;
		else if (port < 1) return false;
		else if (port > 65535) return false;
		return true;
	} catch (error) {
		return false;
	}
	//return /^(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|5\d{4}|\d\d{0,4})$/g.test(value);
}