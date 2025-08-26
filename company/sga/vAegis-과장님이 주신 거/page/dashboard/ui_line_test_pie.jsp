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
	<style>
		svg g:nth-of-type(1){ display:none; }
		svg g:nth-of-type(2) path:first-child{  fill:url(#MyGradient) !important;  stroke-width:4px;
            stroke:red; offset-path:path("M246,1V247H1V1H246m1-1H0V248H247V0Z"); }
		
		
	</style>
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
			<div id="chart-container" class="gauge_box" style="padding:0;width:374px;height:45px;border:2px solid red;">
											<script>
											var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  renderer: 'svg',//
  useDirtyRect: false
});
var app = {};

var option;

option = {


  series: [
    {
	
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 240,
      splitNumber:1,
      itemStyle: {
        color: '#fff',
       /* shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2*/
      },
      progress: {
        show: false,
        roundCap: true,
        width: 30
      },
      pointer: {
        icon: 'path://M24.352 38.216A5.327 5.327 0 0 1 20 40.334a5.382 5.382 0 0 1-1.042-.123 5.253 5.253 0 0 1-1.885-.825 5.4 5.4 0 0 1-1.448-1.505 5.243 5.243 0 0 1-.749-1.915 5.347 5.347 0 0 1-.081-1.045c.011-.563.245-2.341.614-4.835s.873-5.7 1.423-9.133 1.148-7.074 1.705-10.44S19.608 4.062 20 1.757a.949.949 0 0 1 .022-.1.826.826 0 0 1 .032-.092.717.717 0 0 1 .042-.085.734.734 0 0 1 .052-.079.716.716 0 0 1 .165-.158.781.781 0 0 1 .206-.1.829.829 0 0 1 .23-.04.838.838 0 0 1 .239.028.784.784 0 0 1 .213.091.726.726 0 0 1 .17.145.74.74 0 0 1 .119.191.846.846 0 0 1 .062.23c.295 2.318.687 5.42 1.108 8.8s.873 7.05 1.286 10.5.788 6.675 1.056 9.183.431 4.295.42 4.86a5.349 5.349 0 0 1-.081.83 5.247 5.247 0 0 1-.536 1.552 5.335 5.335 0 0 1-.453.703Zm-6.316-4.751q-.072.1-.135.2t-.116.209q-.053.107-.1.219t-.076.229a2.58 2.58 0 0 0 .234 1.967 2.58 2.58 0 0 0 1.557 1.225 2.556 2.556 0 0 0 .773.095 2.623 2.623 0 0 0 1.439-.485 2.565 2.565 0 0 0 .559-.544q.073-.1.135-.2t.116-.209c.035-.071.067-.145.1-.219s.054-.151.076-.229a2.57 2.57 0 0 0 .077-1.024 2.6 2.6 0 0 0-2.645-2.268 2.561 2.561 0 0 0-1.431.482 2.62 2.62 0 0 0-.563.551Z',
        length: '78%',
        width: 13,
        offsetCenter: [0, '12%']
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 16,
		 /*color: [
			[0, '#55BC55'],
            [1, '#E01E5F']
		  ],*/
		  
        }
      },
      axisTick: {
        splitNumber: 2,
        lineStyle: {
          width: 0,
          color: '#999'
        }
      },
      splitLine: {
        length: 12,
        lineStyle: {
          width: 0,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 30,
        color: '#999',
        fontSize: 0
      },
      title: {
        show: false
      },
     detail: {
        /*backgroundColor: '#fff',
        borderColor: '#999',
        borderWidth: 2,
        width: '100%',
        lineHeight: 45,
        height: 45,
        borderRadius: 8,*/
        offsetCenter: [-80, 0],
        valueAnimation: true,
        formatter: function (value) {
          //return '{unit|Total Checks}{value|' + value.toFixed(0) + '}';
		   return '{unit|Total Checks}{value|3761}';
        },
        rich: {
          value: {
            fontSize: 10,
            fontWeight: 'bolder',
            color: '#fff'
          },
          unit: {
            fontSize:10,
            color: '#fff',
            padding: [0, 0, 0, 10]
          }
        }
      },
      data: [
        {
          value: 30,
		  fontSize: 0
        }
      ]
    }
  ]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);
											</script>

											<svg>
											<defs>
        <linearGradient id="MyGradient">
          <stop offset="0" stop-color="#55BC55" />
          <stop offset="100%" stop-color="#E01E5F" />
        </linearGradient>
      </defs>
											</svg>
										</div>
					<!-- e: jung 2023-10-24 : 컨텐츠 내용 -->
								

		</div>
		<!-- e:컨텐츠 내용-->
	</div>
</section>




</body>
</html>
