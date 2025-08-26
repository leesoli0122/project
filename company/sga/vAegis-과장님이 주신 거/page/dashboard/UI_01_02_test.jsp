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
	

<section class="renewal dashboard mscrollbar">
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
			<div class="dashboardTabMgmt_1 tab_cont open">
				<div class="dashboard_box">
					<div class="dashboard_box_top">
						<div class="dashboard_title">
							<h3>클러스터 규정준수 스캔</h3>
						</div>
						<div class="dashboard_btn_box">
							<a href="#" onclick="javascript: lf_dashboardCreateChart();" class="btn bline" title="차트 &amp; 데이터 선택"><span>차트 &amp; 데이터</span></a>
							<a href="#" onclick="javascript: lf_dashboardAllConfiguration(this);" class="btn bline" title="자동 리로딩 설정"><span>리로딩설정</span></a>
							<a href="#" onclick="javascript:lf_removeChartAll();" class="btn del" title="전체 삭제"><span>삭제</span></a><!-- 2023-10-11 save -> del로 교체-->
						</div>
					</div>
					<div class="dashboard_option_select_box">

						<div class="dashboard_box_registry">
							<div class="registry_title">
								<p>Registry</p>
							</div>
							<div class="registry_select_box sel_box">
								<select class="popup_sel registryList" onchange="registryChangeEvent()">
									<option value="de71636f-7e48-4a79-914f-727dc0a8edb4">sga-solregistry2</option>
									<option value="4d842add-ad81-4e7d-a7fb-c39c836dabe2">sga-solregistry</option>
									<option value="4e1d4b15-a3ce-4358-9f34-28bdf9c8ee63">sga-solregistry3</option>
									<option value="887dc39c-401f-4ad3-857a-48bb39f10c34">63-regi-test</option>
								</select>
							</div>
						</div><!--//dashboard_box_registry-->
		
						<div style="display:none" class="dashboard_box_cluster">
							<div class="cluster_title">
								<p>Cluster</p>
							</div>
							<div class="cluster_select_box sel_box">
								<select class="popup_sel cluster_list" onchange="clusterChangeEvent()">
								<option value="4b761c20-030f-4b3c-89b2-08d58ebf0d8d">Cluster-61</option>
								<option value="2f4b443e-d0c4-455f-9664-c6f6fbe5f5d1">Cluster-67</option>
								<option value="a75a5634-7d01-4eb4-9c49-8ad8259bd937">dev-k8s</option>
								<option value="ddf01bce-f79c-4dfb-b1c8-777778e04ab7">K8S v1.19.14_Cluster</option>
								</select>
							</div>
						</div><!--//dashboard_box_cluster-->
					</div><!--//dashboard_option_select_box-->

					<div class="dashboard_box_cont">
						<ul class="dashboard_cont ui-sortable">
							<!-- s : 2023-10-24 jung 작업시작-->
							<li class="w_25 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Total Compliance rate</h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small" style="display: none;">
												<option selected="selected" value="DAY">Day</option>
												<option value="WEEK">Weekly</option>
											</select>
											<div class="nice-select popup_sel small" tabindex="0">
												<span class="current">Day</span>
												<ul class="list">
													<li data-value="DAY" class="option selected">Day</li>
													<li data-value="WEEK" class="option">Weekly</li>
												</ul>
											</div>
										</div>
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>
											<div class="cont_btn_list">
												<ul>
													<li>
														<a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a>
													</li>
													<li>
														<a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a>
													</li>
													<li>
														<a onclick="javascript: lf_removeChartEvent(this);">Delete</a>
													</li>
												</ul>
											</div><!--//cont_btn_list-->
										</div>
									</div>
								</div><!--//dashboard_cont_top-->
								<div>
									<div class="chart_box ui_01_02">
										<!-- s: jung : 컨텐츠 내용 -->
										<div class="gauge_box">
											<!-- s : e차트 그래프-->
											<div class="gauge_total_box">
												<div id="chart_gauge" class="chart_gauge">
													<script>
														var dom = document.getElementById('chart_gauge');
														var myChart = echarts.init(dom, null, {
														renderer: 'svg',//canvas
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
																	itemStyle: {
																	color: '#fff'
																},
																pointer: {
																	icon: 'path://M24.352 38.216A5.327 5.327 0 0 1 20 40.334a5.382 5.382 0 0 1-1.042-.123 5.253 5.253 0 0 1-1.885-.825 5.4 5.4 0 0 1-1.448-1.505 5.243 5.243 0 0 1-.749-1.915 5.347 5.347 0 0 1-.081-1.045c.011-.563.245-2.341.614-4.835s.873-5.7 1.423-9.133 1.148-7.074 1.705-10.44S19.608 4.062 20 1.757a.949.949 0 0 1 .022-.1.826.826 0 0 1 .032-.092.717.717 0 0 1 .042-.085.734.734 0 0 1 .052-.079.716.716 0 0 1 .165-.158.781.781 0 0 1 .206-.1.829.829 0 0 1 .23-.04.838.838 0 0 1 .239.028.784.784 0 0 1 .213.091.726.726 0 0 1 .17.145.74.74 0 0 1 .119.191.846.846 0 0 1 .062.23c.295 2.318.687 5.42 1.108 8.8s.873 7.05 1.286 10.5.788 6.675 1.056 9.183.431 4.295.42 4.86a5.349 5.349 0 0 1-.081.83 5.247 5.247 0 0 1-.536 1.552 5.335 5.335 0 0 1-.453.703Zm-6.316-4.751q-.072.1-.135.2t-.116.209q-.053.107-.1.219t-.076.229a2.58 2.58 0 0 0 .234 1.967 2.58 2.58 0 0 0 1.557 1.225 2.556 2.556 0 0 0 .773.095 2.623 2.623 0 0 0 1.439-.485 2.565 2.565 0 0 0 .559-.544q.073-.1.135-.2t.116-.209c.035-.071.067-.145.1-.219s.054-.151.076-.229a2.57 2.57 0 0 0 .077-1.024 2.6 2.6 0 0 0-2.645-2.268 2.561 2.561 0 0 0-1.431.482 2.62 2.62 0 0 0-.563.551Z',
																	length: '78%',
																	width: 18,
																	offsetCenter: [0, '12%']
																},
																axisLine: {
																	roundCap: true,
																	lineStyle: {
																		width: 20,

																		/*color: [
																		[0.5, '#55BC55'],
																		[1, '#E01E5F']
																		],*/
																		}
																},
																axisTick: {
																	show:false,
																},
																splitLine: {
																	show:false,
																},
																axisLabel: {
																	show:false,
																},
																detail: {
																	show:false,
																	formatter: '{value}'
																},
																data: [
																	{
																		value: 50,
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
														<linearGradient id="TotalCompliancerate">
															<stop offset="45%" stop-color="#74A729" />
															<stop offset="100%" stop-color="#E01E5F" />
														</linearGradient>
														</defs>
													</svg>
													
												</div>
											</div>
											<!-- e : e차트 그래프-->
											<div class="gauge_total">
												<span class="label">Total Checks</span>
												<span class="txt_figure">3796</span>
											</div>



											<dl class="graph_per">
												<dt class="label passed">Passed</dt>
												<dd>
													<p class="bar"><span style="width:84.1%"></span></p>
													<p class="txt_data">84.1%</p>
												</dd>
												<dt class="label failed">Failed</dt>
												<dd>
													<p class="bar"><span style="width:15.9%"></span></p>
													<p class="txt_data">15.9%</p>
												</dd>
											</dl>
										</div>
										<!-- e: jung : 컨텐츠 내용 -->
									</div>
								</div>
							</li>

							<li class="w_35 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Compliance rate for regulatios</h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small" style="display: none;">
												<option selected="selected" value="DAY">Day</option>
												<option value="WEEK">Weekly</option>
											</select>
											<div class="nice-select popup_sel small" tabindex="0">
												<span class="current">Day</span>
												<ul class="list">
													<li data-value="DAY" class="option selected">Day</li>
													<li data-value="WEEK" class="option">Weekly</li>
												</ul>
											</div>
										</div>
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>
											<div class="cont_btn_list">
												<ul>
													<li>
														<a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a>
													</li>
													<li>
														<a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a>
													</li>
													<li>
														<a onclick="javascript: lf_removeChartEvent(this);">Delete</a>
													</li>
												</ul>
											</div><!--//cont_btn_list-->
										</div>
									</div>
								</div><!--//dashboard_cont_top-->
								<div>
									<div class="chart_box ui_01_02">
										<!-- s: jung 2023-10-24 : 컨텐츠 내용 -->
										<div class="gauge_box">
											<div class="graph_per">
												<div>
													<p class="label">CIS abggyyhij</p>
													<p class="bar">
														<span>
															<span style="width:76.4%"></span>
														</span>
													</p>
													<p class="txt_data">76.4%</p>
												</div>
												<div>
													<p class="label">CIS Kubernetes</p>
													<p class="bar">
														<span>
															<span style="width:79.4%"></span>
														</span>
													</p>
													<p class="txt_data">79.4%</p>
												</div>
												<div>
													<p class="label">CIS Linux</p>
													<p class="bar">
														<span>
															<span style="width:81.2%"></span>
														</span>
													</p>
													<p class="txt_data">81.2%</p>
												</div>
												<div>
													<p class="label">NSA-CISA</p>
													<p class="bar">
														<span>
															<span style="width:86.4%"></span>
														</span>
													</p>
													<p class="txt_data">86.4%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
												<div>
													<p class="label">DEVOpt Best</p>
													<p class="bar">
														<span>
															<span style="width:98.1%"></span>
														</span>
													</p>
													<p class="txt_data">98.1%</p>
												</div>
											</div><!--//graph_per-->
										</div>
										<!-- e: jung 2023-10-24 : 컨텐츠 내용 -->
									</div>
								</div>
							</li>

							<li class="w_40 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Evaluation trend</h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small" style="display: none;">
												<option selected="selected" value="DAY">Day</option>
												<option value="WEEK">Weekly</option>
											</select>
											<div class="nice-select popup_sel small" tabindex="0">
												<span class="current">Day</span>
												<ul class="list">
													<li data-value="DAY" class="option selected">Day</li>
													<li data-value="WEEK" class="option">Weekly</li>
												</ul>
											</div>
										</div>
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>
											<div class="cont_btn_list">
												<ul>
													<li>
														<a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a>
													</li>
													<li>
														<a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a>
													</li>
													<li>
														<a onclick="javascript: lf_removeChartEvent(this);">Delete</a>
													</li>
												</ul>
											</div><!--//cont_btn_list-->
										</div>
									</div>
								</div><!--//dashboard_cont_top-->
								<div class="dashboard_top5_box">
									<div class="chart_box ui_01_02">
										<!-- s: jung 2023-10-24 : 컨텐츠 내용 -->
										<div id="chart-container" class="gauge_box line_chart">
											<script>
											var dom = document.getElementById('chart-container');
											var myChart = echarts.init(dom, 'dark', {
												renderer: 'canvas',
												useDirtyRect: false
											});
											
											var app = {};
											var option;
											option = {
												//color: ["#55BC55", "#E01E5F"],
												backgroundColor: "transparent",
												legend: {
													/*data: ['Email', 'Union Ads'],
												label: ['12', '12'],
												icon : 'none',
												textStyle : {
																color : '#fff',
																fontWeight: 500,
																fontSize : 12,
																padding:10,
																backgroundColor:['red','blue'],
																borderRadius: [30, 30, 30, 30],
															},*/

													icon: 'none',
													itemGap:0,
												date: ['FAIL', 'PASS'],
												/*formatter: function(name){
													 return name+'\n'+label2[name];
													 },*/
												
													//orient: 'vertical',

													 formatter:(name) => {
														var part1 = {'FAIL':'7.6K', 'PASS':'21.6K'};
														var part2 = {'FAIL':'(32%)', 'PASS':'(68%)'};
														 return '{first|' + name + '}\n{second|'+ part1[name] +'}{third|'+ part2[name] +'}';
														//return '{first|'+name+'}';
														
															},
												 
													/*textStyle: {
															color: "#fff",
													fontWeight: 500,
													fontSize : 12,
													padding:10,
													backgroundColor:['red','blue'],
													borderRadius: [30, 30, 30, 30]
												}*/
												/**새로추가**/
														textStyle: {
														fontFamily: 'S-CoreDream',
														color: '#fff',
														fontSize: 12,
														rich: {
															first: {
																color: '#fff',
																backgroundColor:["#55BC55", "#E01E5F"],
																padding:[7, 12],	
																borderRadius: [30, 30, 30, 30],
																width:60,
																align: 'center',
																verticalAlign: 'middle',
															},
															second: {
																color: '#fff',
																padding:[7, 0, 7, 0],
																margin:0,
																fontSize: 12,
																align: 'center',
																//width: 100,
															},
															third:{
																color:'#ffffff65',
																padding:[7, 0, 7, 5],
																 margin:0,
																 align: 'center'
																
																}
														 
														 }
													},
												
												/**새로추가끝**/

											},
											 
												grid: {
													left: '3%',
													right: '4%',
													top:'70',
													bottom: '10',
													containLabel: true
												},

												xAxis: {
													type: 'category',
													boundaryGap: false,
													data: ['wed5', 'Fri7', 'OCT9'],
													 axisLabel: {
														padding:[10, 0, 10, 0],
														color:'#fff'
													}
												},

												yAxis: {
													type: 'value',
													boundaryGap: [0, '100%'],
													axisLabel: {
														formatter: '{value}K',
														color:'#fff'
													}
												},
												series: [
													{
														name: 'FAIL',
														type: 'line',
														stack: 'Total',
														data: [15, 17, 18],
														symbolSize: 8,
														
														itemStyle:{
															color:'#E01E5F',
														}
														
													
													},
													{
														name: 'PASS',
														type: 'line',
														stack: 'Total',
														data: [5, 8, 9],
														symbolSize: 8,
														itemStyle:{
															color:'#55BC55'
														}
													}
												]
											};

											if (option && typeof option === 'object') {
												myChart.setOption(option);
											}

											window.addEventListener('resize', myChart.resize);
											</script>
										</div>
										<!-- e: jung 2023-10-24 : 컨텐츠 내용 -->
									</div>
								</div>
							</li>


							<!--2023-11-09-->
							<li class="w_100 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Evaluation trend</h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small" style="display: none;">
												<option selected="selected" value="DAY">Day</option>
												<option value="WEEK">Weekly</option>
											</select>
											<div class="nice-select popup_sel small" tabindex="0">
												<span class="current">Day</span>
												<ul class="list">
													<li data-value="DAY" class="option selected ui-sortable-handle">Day</li>
													<li data-value="WEEK" class="option ui-sortable-handle">Weekly</li>
												</ul>
											</div>
										</div>
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>
											<div class="cont_btn_list">
												<ul>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_removeChartEvent(this);">Delete</a>
													</li>
												</ul>
											</div><!--//cont_btn_list-->
										</div>
									</div>
								</div><!--//dashboard_cont_top-->
								<div class="dashboard_table_box">
									<div id="cloudvm_table_2908" class="chart_box dashboard_table need_cluster_select dashboard_compliance_table h_auto" style="display: block;"><!-- h_auto 클래스 추가-->
										<div class="compliance_option_box">
											<div id="frameworkSelectBox_cloudvm_table_2908" class="sel_box framework_select">
												<select id="frameworkSelect_cloudvm_table_2908" class="popup_sel" onchange="executeSearch('cloudvm_table_2908')" style="display: none;"><option value="c6a08d57-2ea1-4e6f-8ec4-f86d5025a0cc">CIS Docker Benchmark</option><option value="144d20c2-6522-4915-a414-0d8632c7223d">CIS Kubernetes Benchmark</option><option value="62c2da7d-a16c-46d1-bb85-1aa4a96d613d">CIS Linux Benchmark</option><option value="9f83a9f2-3491-4ae2-bb49-5bf0ca3cf141">DevOpsBest</option><option value="5d4c5fa4-5078-4440-a5c9-4f8dbee31b3b">Docker CIS 1.1.1</option><option value="4eaec06d-be73-4d78-a538-c4f6c3de04bb">NSA-CISA</option><option value="a5d8bb4a-45a6-4f0e-985c-ae68b7f66f0c">SearchSaveAsTest</option></select>
												<div class="nice-select popup_sel" tabindex="0">
													<span class="current">CIS Docker Benchmark</span>
													<ul class="list">
														<li data-value="c6a08d57-2ea1-4e6f-8ec4-f86d5025a0cc" class="option selected">CIS Docker Benchmark</li>
														<li data-value="144d20c2-6522-4915-a414-0d8632c7223d" class="option">CIS Kubernetes Benchmark</li>
														<li data-value="62c2da7d-a16c-46d1-bb85-1aa4a96d613d" class="option">CIS Linux Benchmark</li>
														<li data-value="9f83a9f2-3491-4ae2-bb49-5bf0ca3cf141" class="option">DevOpsBest</li>
														<li data-value="5d4c5fa4-5078-4440-a5c9-4f8dbee31b3b" class="option">Docker CIS 1.1.1</li>
														<li data-value="4eaec06d-be73-4d78-a538-c4f6c3de04bb" class="option">NSA-CISA</li>
														<li data-value="a5d8bb4a-45a6-4f0e-985c-ae68b7f66f0c" class="option">SearchSaveAsTest</li>
													</ul>
												</div>
											</div>
											<div class="search_box">
												<div class="ipt_box">
													<input class="" type="text" placeholder="Name, Description, Remidiation 키워드를 입력해 주십시오." id="searchKeyword_cloudvm_table_2908" name="searchKeyword" style="width:450px;">
												</div>
												<a id="searchBtn_cloudvm_table_2908" href="#" class="btn serch">검색</a>
											</div>
										</div><!--//compliance_option_box-->
										<div class="tbl">
											<input type="hidden" id="complianceTaskEventPaging_cloudvm_table_2908" value="24_5_0">
											<input type="hidden" id="searchValue_cloudvm_table_2908" value="">
											<div id="event_complianceScan_cloudvm_table_2908_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
												<table id="event_complianceScan_cloudvm_table_2908" class="dataTable no-footer" role="grid">
													<colgroup>
														<col width="50">
														<col width="12%">
														<col width="7%">
														<col width="7%">
														<col width="15%">
														<col width="15%">
														<col width="*">
														<col width="100">
														<col width="200">
														<col width="180">
													</colgroup>
													<thead>
														<tr role="row">
															<th class="sorting_disabled" rowspan="1" colspan="1" aria-label=""></th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Framework: activate to sort column ascending">Framework</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Type: activate to sort column ascending">Type</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="ID: activate to sort column ascending">ID</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Name: activate to sort column ascending">Name</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Description: activate to sort column ascending">Description</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Remediation: activate to sort column ascending">Remediation</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Severity: activate to sort column ascending">Severity</th>
															<th class="sorting_disabled" rowspan="1" colspan="1" aria-label="Result">Result</th>
															<th class="sorting" tabindex="0" aria-controls="event_complianceScan_cloudvm_table_3711" rowspan="1" colspan="1" aria-label="Date: activate to sort column ascending">Date</th>
														</tr>
													</thead>
													<tbody>
														<tr role="row" class="accordion odd">
															<td>
																<div class="view_hide_btn_icon" data-onoff="ee49530d-94c1-4dce-a043-fe5d696e4d5d_task_cloudvm_table_2908" onclick="onoffDisplay(this)"></div>
															</td>
															<td>CIS Docker Benchmark</td>
															<td>DEFAULT</td>
															<td>CIS-1.1</td>
															<td>Linux Hosts Specific Configuration</td>
															<td>This section contains recommendations that securing Linux Hosts running Docker Containers.</td>
															<td>-</td>
															<td><span class="bc_critical">Critical</span></td>
															<td class="severity">
																<span class="bc_passed">3</span>
																<span class="bc_failed">3</span>
																<span class="bc_erro">3</span>
																<span class="non">3</span>
															</td>
															<td title="2023-11-09 12:01:40" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2023-11-09 12:01:40</td>
														</tr>
														<tr class="subtask_bundle">
															<td colspan="10">
																<div class="row_subtask accordion">
																	<div class="subtask_name">
																		<p class="subtask_catagory_title">
																			<span class="view_hide_btn_icon"></span>
																		</p>
																		<p class="subtask_catagory_Result bc_failed">failed</p>
																		<p class="subtask_catagory_detail">
																			CIS-1.1.1. Ensure a separate partition for containers has been created (Automated)</p>
																	</div>
																	<div class="subtask_detail">
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Result:</div>
																			<div class="tc_failed subtask_catagory_detail">failed</div>
																		</div>
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Description: </div>
																			<div title="The Docker daemon currently requires access to the Docker socket which is, by default, owned by the user root and the group docker." class="subtask_catagory_detail">The Docker daemon currently requires access to the Docker socket which is, by default, owned by the user root and the group docker.</div>
																		</div>
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Remediation:</div>
																			<div title="For new installations, you should create a separate partition for the /var/lib/docker mount point. For systems that have already been installed, you should use the Logical Volume Manager (LVM) within Linux to create a new partition." class="subtask_catagory_detail">For new installations, you should create a separate partition for the /var/lib/docker mount point. For systems that have already been installed, you should use the Logical Volume Manager (LVM) within Linux to create a new partition.</div>
																		</div>
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Actual value:</div>
																			<div class="scroll-wrapper textarea-scrollbar scrollbar-outer scroll-textarea" style="position: relative;">
																				<div class="scroll-content" style="height: 66px; margin-bottom: 0px; margin-right: 0px; max-height: none;">
																					<textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)] failed: [k8s-worker(192.168.20.63)]</textarea>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>

																<div class="row_subtask accordion">
																	<div class="subtask_name">
																		<p class="subtask_catagory_title">
																			<span class="view_hide_btn_icon"></span>
																		</p>
																		<p class="subtask_catagory_Result bc_failed">failed</p>
																		<p class="subtask_catagory_detail">
																			CIS-1.1.1. Ensure a separate partition for containers has been created (Automated)</p>
																	</div>
																	<div class="subtask_detail">
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Result:</div>
																			<div class="tc_failed subtask_catagory_detail">failed</div>
																		</div>
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Description: </div>
																			<div title="The Docker daemon currently requires access to the Docker socket which is, by default, owned by the user root and the group docker." class="subtask_catagory_detail">The Docker daemon currently requires access to the Docker socket which is, by default, owned by the user root and the group docker.</div>
																		</div>
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Remediation:</div>
																			<div title="For new installations, you should create a separate partition for the /var/lib/docker mount point. For systems that have already been installed, you should use the Logical Volume Manager (LVM) within Linux to create a new partition." class="subtask_catagory_detail">For new installations, you should create a separate partition for the /var/lib/docker mount point. For systems that have already been installed, you should use the Logical Volume Manager (LVM) within Linux to create a new partition.</div>
																		</div>
																		<div class="subtask_catagory">
																			<div class="subtask_catagory_title">· Actual value:</div>
																			<div class="scroll-wrapper textarea-scrollbar scrollbar-outer scroll-textarea" style="position: relative;">
																				<div class="scroll-content" style="height: 66px; margin-bottom: 0px; margin-right: 0px; max-height: none;">
																					<textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)] failed: [k8s-worker(192.168.20.63)]</textarea>
																				</div>
																			</div>
																		</div>
																	</div>
																</div>
															</td>
														</tr>
													</tbody>
												</table>
											</div><!--//dataTables_wrapper-->
										</div><!--//tbl-->
									</div>
								</div>
							</li>
							<!--2023-11-09-->
							
							<!-- e : 2023-10-24 jung 작업시작-->
														
														
														
					</ul>
                </div><!--//dashboard_box_cont-->
				</div><!--//dashboard_box-->
			</div><!--//tab_cont-->
			
        </div>

</div>
		<!-- e:컨텐츠 내용-->
	</div>
</section>

<input id="dashboardData" type="hidden"></input>
<!-- 삭제 필요. dashboardCspData에 데이터 저장하도록 로직 수정 필요 -->
<input id="dashboardScanCount" type="hidden"/>
<!-- 0808 추가. 차트 상세보기 데이터 저장 -->
<input id="dashboardCspData" type="hidden"></input>
<input id="complianceDetailData" type="hidden"/>


<!-- s : 퍼블확인용 스크립트, 확인후 기존 스크립트로 교체 필요-->
<script>
    $(document).ready(function(){
 
        $('.accordion').on('click',  function() {
            $(this).toggleClass("tr_open");
        });
    });

</script>	
<!-- e : 퍼블확인용 스크립트, 확인후 기존 스크립트로 교체 필요-->


</body>
</html>
