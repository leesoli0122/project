<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@ include file="/page/layout/header.jsp"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>메뉴 권한 관리 - Aegis</title>
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
	<%@ include file="/page/layout/common_sample.jsp"%>
	<script src="./js/service/configure/auth.js?v=${version}"></script>
	
	<script type="text/javascript">
	$(document).ready(function() {
		$('#authTable').DataTable({
			"autoWidth": false,
			"paging": false,
			"pagingType": "full_numbers",
			"ordering": false,
			"info": false,
			"filter": false,
			"lengthChange": false,
			"language": {
				"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
			},
			"buttons": [
				{
					tag: 'a',
					text: '저장',
					className: 'btn',
					action: function (e, dt, node, config) {
						saveAuthList();
					}
				},
			],
			"dom": '<"top"Blf>rt<"bottom"ip><"clear">',
			// "pageLength": '14',
		});
		$('.sel_box select').niceSelect();
	});
   </script>
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

<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="authConfig" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="authConfig" />
</jsp:include>

<section class="configuration_page mscrollbar">
	<div class="sub">
		<div class="configuration_box">
			<div class="configuration_btm_con">
				<div class="tbl">
					<table id="authTable" class="hover">
						<colgroup>
							<col width="16.66%">
							<col width="16.66%">
							<col width="16.66%">
							<col width="16.66%">
							<col width="16.66%">
							<col width="16.66%">
						</colgroup>
						<thead>
						<tr>
							<th>1차 메뉴</th>
							<th>2차 메뉴</th>
							<th>Super Admin</th>
							<th>Admin</th>
							<th>Operator</th>
							<th>Viewer</th>
						</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>

</body>
</html>