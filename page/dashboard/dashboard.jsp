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
	<!-- 2024-01-05 디자인 적용 -->
	<%-- <%@ include file="/page/layout/common.jsp"%> --%>
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	
	<script src="./js/common/page_common.js?v=${version}"></script>
    
	<script src="./js/service/dashboards/dashboardChart.js?v=${version}"></script>
	<script src="./js/service/dashboards/dashboard.js?v=${version}"></script>
	
	<!-- 230103 Image Security 추가 -->
	<script src="./js/service/dashboards/imageSecurity/dashboardScanStatus.js?v=${version}"></script>
	<script src="./js/service/dashboards/clusterCompliance/dashboardClusterComplianceChart.js?v=${version}"></script>
	<script src="./js/service/dashboards/containerEvent/dashbordEventContainerChart.js?v=${version}"></script>
	
	<script type="text/javascript">
	const DUAP = ${webOption};
    function createDim(){
        if (!$('.dim').length) {
            $('body').append('<div class="dim"></div>');
        }
        $('.dim').fadeIn(250);
        if (window.matchMedia('(min-width: 1340px) and (max-width: 1920px)').matches){
            $('body').css({
                overflow : 'hidden'
            }).bind('touchmove', function(e) {
                e.preventDefault();
            });
        }
        if (window.matchMedia('(min-width: 0) and (max-width: 1340px)').matches){
            $('body').css({
                overflowX : 'scroll'
            }).bind('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
    function removeDim(){
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
    }
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

<!-- 2024-01-05 레이아웃 디자인 적용 -->
<%-- <jsp:include page="/page/layout/sidebar.jsp" flush="false">
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="dashboard" />
</jsp:include> --%>
<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>	

<section class="renewal dashboard mscrollbar">
	<div class="dashboard_main">
		<div class="tab_box">
			<a href="#" class="prev-slide">왼쪽으로</a>
			<div class="tab">
			<ul class="tab_lst">
				<%-- <li rel="tabMgmt_1">
				<a href="#" class="tab_link" title="Tab style1Tab style1Tab style1Tab style1">Tab style1 style1 style1</a>
				<a href="#" class="tab_cls">close</a>
				<a href="#" class="tab_edit">edit</a>
				</li>
				<li rel="tabMgmt_2">
				<a href="#" class="tab_link" title="Tab">Tab style2</a>
				<a href="#" class="tab_cls">close</a>
				<a href="#" class="tab_edit">edit</a>
				</li> --%>
			</ul>
			<a href="#" class="tab_add" onclick="javascript: lf_tabadd();">
				<span>탭 추가</span>
			</a>
			</div>
			<a href="#" class="next-slide">오른쪽으로</a>
		<%--	<div class="tab_set">
				<a href="#" class="tab_set_btn">설정</a>
				<div class="tab_set_list">
					<ul>
						<li><a href="#" class="tab_cls_on">탭 삭제</a></li>
						<li><a href="#" class="tab_edit_on">탭 이름 변경</a></li>
					</ul>
				</div>
			</div>	--%>
		</div>
		<div id="dashboardTabMgmt" class="tab_container"></div>
	</div>
</section>

<input id="dashboardData" type="hidden"></input>
<!-- 삭제 필요. dashboardCspData에 데이터 저장하도록 로직 수정 필요 -->
<input id="dashboardScanCount" type="hidden"/>
<!-- 0808 추가. 차트 상세보기 데이터 저장 -->
<input id="dashboardCspData" type="hidden"></input>
<input id="complianceDetailData" type="hidden"/>
<input id="detailDataInfo" type="hidden"/>
</body>
</html>
