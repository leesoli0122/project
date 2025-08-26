<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <title>대시보드 - Aegis</title>
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
    
    <script src="./js/service/dashboards/dashboardChart.js?v=${version}"></script>
    <script src="./js/service/dashboards/dashboardPopup.js?v=${version}"></script>
    
    <!-- 0807 추가. dashboarddonutchart 추가 로직 -->
    <script src="./js/service/dashboards/imageSecurity/dashboardScanStatus.js?v=${version}"></script>
    <!-- 23-09-23 이성호 추가> 규정준수 대시보드 -->
    <script src="./js/service/dashboards/clusterCompliance/dashboardClusterComplianceChart.js?v=${version}"></script>
    <!-- 23-09-24 이성호 추가> 규정준수 대시보드 로직중 paging 처리하는 로직이 있음 -->
    <script src="./js/common/page_common.js?v=${version}"></script>
    
</head>

<body class="win_popup2">
	<section class="sub">
		<div class="dashboard_box">
			<div class="dashboard_box_top">
				<div class="dashboard_title">
					<h3 id="dashboardViewTitle"></h3>
				</div>
			</div>
			<div class="dashboard_box_cont">
				<ul id="dashboardViewCont" class="dashboard_cont"></ul>
			</div>
		</div>
	</section>
	<!-- 0808 추가. 페이지 진입 시 이전 대시보드 정보 저장 -->
	<input id="dashboardCspData" type="hidden" />
	<input id="dashboardScanCount" type="hidden" />
</body>
</html>