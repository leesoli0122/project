<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>로그인 - Aegis</title>
	<meta charset="UTF-8" http-equiv="Content-Type">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=3.0">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="format-detection" content="telephone=no" />
	
	<!-- TODO: search engine info -->
	<meta name="robots" content="Aegis" />
	<meta name="keywords" content="Aegis" />
	<meta name="title" content="Aegis" />
	<meta name="description" content="Aegis" />
	
	<!-- TODO: social url link image -->
	<meta property="og:url" content="">
	<meta property="og:title" content="Aegis">
	<meta property="og:type" content="website">
	<meta property="og:image" content="">
	<meta property="og:description" content="Aegis 홈페이지입니다.">
	
	<!-- TODO: favicon -->
	<link rel="icon" href="./assets/images/favicon.png" type="image/png" />
	
	<!-- TODO: import -->
	<link rel="stylesheet" href="./assets/css/lib/bootstrap.min.css">
	<link rel="stylesheet" href="./assets/css/lib/bootstrap-datetimepicker.min.css">
	<link rel="stylesheet" href="./assets/css/common.css?v=${version}">
	
	<script src="./assets/js/lib/jquery.min.js?v=${version}"></script>
	<script src="./assets/js/lib/bootstrap.min.js"></script>
	<script src="./assets/js/lib/moment.js"></script>
	<script src="./assets/js/lib/bootstrap-datetimepicker.js"></script>
	<script src="./assets/js/lib/jquery-ui.js?v=${version}"></script>
	<script src="./assets/js/lib/jquery.nice-select.js?v=${version}"></script>
	<script src="./assets/js/lib/sweetalert.js"></script>
	
	<script src="./js/common/define.js?v=${version}"></script>
	<script src="./js/common/basic_common.js?v=${version}"></script>
	<script src="./js/common/cf_common.js?v=${version}"></script>
	
	<script type="text/javascript">
    
    $(function(){
		$("#userPw").on("keypress", function(e){
			if(e.keyCode == "13") {
				if($('div.btn_wrap a').text() == "로그인") {
					login();
				} else {
					otp_login();
				}
				
			}
		});
	});
    
    $(document).ready(function(){
		var loginId = getCookie("cookie_va_login_id");
		if(loginId != "") {
			$("#userid").val(loginId);
			$("#loginIdCheck").prop("checked", true);
		}

		version();
	});

	function version() {
		var url = "https://" + window.location.hostname + ":7119" + "/sgasol/master/api/v1.0/rmc/version";
		var text = "Copyright 2022. SGASOL all rights reserved.";		
		$.ajax({
			url: '/enterproxy.do',
			async: false,
			type: 'POST',
			data: JSON.stringify({'url': url, 'method': 'get' }),
			dataType: "json",
			beforeSend: function(jqXHR) {}, 
			success: function(jqXHR) {
				$("#version").text("v" + jqXHR["returnData"][0]);
			}, 
			error: function(jqXHR) {
				console.log(jqXHR);
			}, 
			complete: function(jqXHR) {
				//console.log(jqXHR);
			}
		});
	}
	
	function login(){
		var userId = $("#userid").val();
		if(userId == "") {
			cf_alert(null, "사용자 ID를 입력하세요.");
			$("#userid").focus();
			return false;
		}
		
		var userPasswd = $("#userPw").val();
		if(userPasswd == "") {
			cf_alert(null, "사용자 패스워드를 입력하세요.");
			$("#userPw").focus();
			return false;
		}
		
		if($("#loginIdCheck").is(":checked")) setCookie("cookie_va_login_id", $("#userid").val(), 30);
		else deleteCookie("cookie_va_login_id");
		
		cf_login(userId, userPasswd);
	}

	function otp_login() {
		var otpnum = $("#userPw").val();
		if(otpnum == "") { cf_alert("OTP Number 를 입력하세요."); $("#userPw").focus(); return false; }

		cf_otp_login(otpnum);
	}

	var interval = null;
	function otpOnLoad(time) {
		$('div.btn_wrap a').attr("href", "javascript: otp_login();")
		$('div.btn_wrap a').text("OTP 인증");
		
		$('#userPw').val("");
		$('#userPw').focus();
		$('#userPw').attr("placeholder", "OTP Number");
		
		var sec = 60;
		if(time) sec = time*1;
		
		interval = setInterval(function() {
			sec--;
			if(sec > 0) {
				$('div.btn_wrap a').text("OTP 인증 " + sec + " sec");
			} else {				
				otpOffLoad();
				cf_alert("로그인 실패", "시간이 초과되었습니다");
			}
		}, 1000);
	}

	function otpOffLoad() {
		$('div.btn_wrap a').attr("href", "javascript: login();")
		$('div.btn_wrap a').text("로그인");

		$("#userPw").val("");
		$('#userPw').attr("placeholder", "비밀번호 6자 이상 ~ 20자 이하");

		if(interval) clearInterval(interval);
	}
	
	function setCookie(cookieName, value, exdays){
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
		document.cookie = cookieName + "=" + cookieValue;
	}
	
	function getCookie(cookieName) {
		cookieName = cookieName + '=';
		var cookieData = document.cookie;
		var start = cookieData.indexOf(cookieName);
		var cookieValue = '';
		if(start != -1) {
			start += cookieName.length;
			var end = cookieData.indexOf(';', start);
			if(end == -1)end = cookieData.length;
			cookieValue = cookieData.substring(start, end);
		}
		return unescape(cookieValue);
	}
	
	function deleteCookie(cookieName){
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() - 1);
		document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
	}
	
	</script>
	<style>
		.loginbox_bottom {
			color : #bbb;
			font-size: .6125rem;
			font-weight: 400;
			display: inline-block;
			margin: 0;			
		}
	</style>
</head>

<body class="login">
	<section>
		<div class="login_box">
			<img src="assets/images/common/svg/ico_logo.svg" class="logo" alt="AEGIS" />
			<ul>
				<li>
					<input id="userid" type="text" placeholder="아이디">
					<label class="id" for="id01">ID</label>
				</li>
				<li>
					<input id="userPw" type="password" placeholder="비밀번호 6자 이상 ~ 20자 이하" value=""> 
					<label class="password" for="password">password</label>
				</li>
				<li class="chk_box">
					<input type="checkbox" id="loginIdCheck" name="loginIdCheck">
					<label for="loginIdCheck" class="label_nohide">아이디 저장</label>
				</li>
			</ul>
			<div class="btn_wrap">
				<a class="btn" href="javascript: login();">로그인</a>				
			</div>
			
			<!--<div class="loginbox_bottom">Copyright 2022. SGASOL all rights reserved.</div>
			<br/>
			<div class="loginbox_bottom" id="version">v1.0</div>-->
		</div>
	</section>
</body>

</html>