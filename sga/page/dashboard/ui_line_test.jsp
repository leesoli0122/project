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
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	<script src="./js/common/page_common.js?v=${version}"></script>
    
	<script src="./js/service/dashboards/dashboardChart.js?v=${version}"></script>
	<script src="./js/service/dashboards/dashboard.js?v=${version}"></script>
	
	<!-- 230103 Image Security 추가 -->
	<script src="./js/service/dashboards/imageSecurity/dashboardScanStatus.js?v=${version}"></script>
	<script src="./js/service/dashboards/clusterCompliance/dashboardClusterComplianceChart.js?v=${version}"></script>
	
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
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="dashboard" />
</jsp:include>
	

<section class="dashboard mscrollbar">
	<div class="dashboard_main">
		<div class="tab_box">
			<a href="#" class="prev-slide" style="display:none;">왼쪽으로</a>
			<div class="tab">
			<ul class="tab_lst" style="max-width: calc(100% - 42px);">
				<li onclick="javascript:lf_tabEventClickLoadDashboard(1);" ondblclick="javascript: lf_openTabEditDialog(this);" rel="dashboardTabMgmt_1" class="on open">
				<a href="#" class="tab_link" title="">Dashboard1</a>
				<a href="#" onclick="javascript: lf_openDashboardFullWindow();" class="full" title="새창열기">새창열기</a>
				<a href="#" onclick="javascript: lf_removeTab(1);" class="tab_cls">close</a>
				</li><li onclick="javascript: lf_tabEventClickLoadDashboard(2);" ondblclick="javascript: lf_openTabEditDialog(this);" rel="dashboardTabMgmt_2" class="on">
				<a href="#" class="tab_link" title="">Dashboard2</a>
				<a href="#" onclick="javascript: lf_openDashboardFullWindow();" class="full" title="새창열기">새창열기</a>
				<a href="#" onclick="javascript: lf_removeTab(2);" class="tab_cls">close</a>
				</li>
			</ul>
			<a href="#" class="tab_add" onclick="javascript: lf_tabadd();">
				<span>탭 추가</span>
			</a>
			</div>
			<a href="#" class="next-slide" style="display:none;">오른쪽으로</a>
			<%--<div class="tab_set">
				<a href="#" class="tab_set_btn">설정</a>
				<div class="tab_set_list">
					<ul>
						<li><a href="#" class="tab_cls_on">탭 삭제</a></li>
						<li><a href="#" class="tab_edit_on">탭 이름 변경</a></li>
					</ul>
				</div>
			</div>	--%>
		</div>
		<!-- s:컨텐츠 내용-->
		<div id="dashboardTabMgmt" class="tab_container">
			<!-- s: jung 2023-10-24 : 컨텐츠 내용 -->
			<div id="chart-container" class="gauge_box" style="height:350px">
											<script>
											var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  renderer: 'svg',
  useDirtyRect: false
});
var app = {};
/****/

var label2 = {'Category1':'7.6K (32%)', 'Category2':'32'};

  var option = {
color: ["#55BC55", "#E01E5F"], 
    tooltip: {
        trigger: 'item',
    },
    legend: {
		display: "block",
		show: true,
		data: [
		
		 { name: "Category1", icon:"none" /*icon:"image://https://192.168.20.61/assets/images/common/ico_image.png"*/},
		 { icon:"none", name: "Category2" }
		],
      
		 formatter: function(name){
		 return name+'\n'+label2[name];
		 },
		 textStyle: {
			color: "#fff",
			fontWeight: 500,
			fontSize : 12,
			padding:10,
		},
		rich: {
			 "<style_name>": {
			  color: 'red',
			  lineHeight: 10
			},
			b: {
			  backgroundColor: {
				image: 'xxx/xxx.jpg'
			  },
			  height: 40
			}
		}

    },
	
	
	 grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
	  },

	  xAxis: {
		type: 'category',
		boundaryGap: false,
		data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	  },
	  yAxis: {
		type: 'value'
	  },


	series: [
    {
      name: 'Category1',
      type: 'line',
	  symbolSize: 7,
		label: '120' ,
      data: [120, 132, 101, 134, 90, 230, 210],
		
    },
    {
      name: 'Category2',
      type: 'line',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]	
};
/****/



if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
											</script>
										</div>
					<!-- e: jung 2023-10-24 : 컨텐츠 내용 -->
								

		</div>
		<!-- e:컨텐츠 내용-->
	</div>
</section>




</body>
</html>
