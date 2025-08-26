<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>권한 - Aegis</title>
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
	<%@ include file="/page/layout/common.jsp"%>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))){	
		location.href="/login.do"; //로그인이 안되어 있다면 */
	}
	
	$(document).ready(function() {
		if(opener != null) {
			$("#backBtn").hide();
			$("#homeBtn").hide();
			$("#closeBtn").show();
		}
	});
	</script>
</head>
<body>
	<section class="container error">
		<article class="error_cont">
			<div class="icon">
				<img src="./assets/images/icon_error01.png" alt="">
			</div>
			<p class="dec">
				<em>해당 페이지에 대한 권한이 없습니다.</em>
				권한 설정을 변경 하신 후 다시 확인 부탁드립니다. <br>
				더 좋은 서비스 제공을 위해 최선을 다하겠습니다. <br>
				감사합니다.
			</p>
			<div class="btn_wrap">
				<a id="backBtn" href="javascript:history.back();" class="btn line">이전페이지</a>
				<a id="homeBtn" href="/dashboard.do" class="btn blue">홈으로</a>
				<a id="closeBtn" href="javascript:self.close();" class="btn blue" style="display: none;">창닫기</a>
			</div>
		</article>
	</section>

</body>
</html>