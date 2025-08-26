<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@ include file="/page/layout/header.jsp"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>자산 현황 - Aegis</title>
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
    <script src="./js/service/cloud/cloudStatus.js?v=${version}"></script>
</head>
<body>

<h1>Aegis ADMIN</h1>
<div class="skip_navigation">
    <ul>
        <li>
            <a href="#Content" class="go_content">본문 바로가기</a>
        </li>
        <li>
            <a href="#Gnb">메뉴 바로가기</a>
        </li>
    </ul>
</div>

<jsp:include page="/page/layout/sidebar.jsp" flush="false">
	<jsp:param name="menuId" value="cloudStatus" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="cloudStatus" />
</jsp:include>

<section class="computer_page mscrollbar">
	<div class="sub">
		<div class="computer_box">
			<div class="computer_box_info_wrap">
				<div class="computer_info">
					<dl>
						<dt class="gro">그룹</dt>
						<dd class="gro" id="groupCount">0</dd>
					</dl>
					<dl>
						<dt class="equ">장비</dt>
						<dd class="equ" id="allCount">0</dd>
					</dl>
					<dl>
						<dt class="nor">정상</dt>
						<dd class="nor" id="liveCount">0</dd>
					</dl>
					<dl>
						<dt class="abn">비정상</dt>
						<dd class="abn" id="deadCount">0</dd>
					</dl>
				</div>
			</div>
		</div>
		<div class="computer_box">
			<div class="computer_box_wrap" id="groupList">
				<div class="over_data"></div>
			</div>
		</div>
	</div>
</section>

</body>
</html>