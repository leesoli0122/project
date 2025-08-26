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
							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Container Security Risk</h4>
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
											</div>
										</div>
									</div>
								</div>
								<div class="dashboard_chart_donut_box bt1">
									<div class="UI_01_03 donut-chart vulnerabilities">
										<div id="chart-pie" class="chart_box">
											<script>
											var dom = document.getElementById('chart-pie');
											var myChart = echarts.init(dom, 'dark', {
											  renderer: 'svg',
											  useDirtyRect: false
											});
											var app = {};

											var option;

											option = {
											 color: ["#C1282E", "#F7941F", "#FCEE21", "#39B549", "#b2b2b2"],	
											 backgroundColor: "transparent",
											  series: [
												{
												  name: 'Radius Mode',
												  type: 'pie',
												  radius: [15, 140],
												  center: ['50%', '50%'],
												  roseType: 'radius',
												  itemStyle: {
													borderRadius: 5,
													//shadowBlur:20,
													borderColor:'#242636',
													borderWidth:5
												  },
												  label: {
													show: false
												  },
												  emphasis: {
													label: {
													  show:false
													}
												  },
												  data: [
													{ value: 506, name: 'rose 1' },
													{ value: 506, name: 'rose 2' },
													{ value: 898, name: 'rose 3' },
													{ value: 898, name: 'rose 4' },
													{ value: 505, name: 'rose 5' }

												  ]
												},
											  ]
											};

											if (option && typeof option === 'object') {
											  myChart.setOption(option);
											}

											window.addEventListener('resize', myChart.resize);
											</script>
										</div>
										<div class="chart_data">
											<dl>
												<dd class="critical value" onclick=""><span>CPU Limits가 설정되어 있는지 확인</span></dd>
												<dd class="hight value" onclick=""><span>컨테이너가 AllowPrivilegeEscalation으로 실행되즌지 확인</span></dd>
												<dd class="medium value" onclick=""><span>루트 컨테이너 허용 최소화</span></dd>
												<dd class="low 
												value" onclick=""><span>CVE-2020-14386 NET_RAW 기능이 있는 컨테이너의 허용이 최소화 되도록 보장</span></dd>
												<dd class="ignore 
												value" onclick=""><span>호스트 충동을 피하기 위해 컨테이너가 높은 UIDI로 실행되는지 확인 </span></dd>
											</dl>
										</div>
										<!--툴팁모음-->
										<div id="tolltip_pop01" class="tolltip on">
											<dl>
												<dt>호스트 출동을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인</dt>
												<dd class="flex">
													<div>
														<p class="bc_critical">506</p><!--bc_critical, bc_high, bc_medium, bc_low, bc_ignore-->
													</div>
													<div>
														<p>
															<label>TYPE</label>
															BUILD TIME
														</p>
														<p>
															<label>SEVERITY</label>
															BUILD TIME
														</p>
													</div>
												</dd>
											</dl>
										</div>
										<!--툴팁모음-->
									</div><!--//donut-chart-->
									<script>

										$(document).ready(function(){

										
											$('.chart > div > p').mouseover( function() {
												var alert_id = $(this).attr('tolltip_pop');
												$("#"+alert_id).addClass('on');
											}).mouseout( function() {
												var alert_id = $(this).attr('tolltip_pop');
												$("#"+alert_id).removeClass('on');
											})

										})

										</script>
								</div>
														
							</li>
							
							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Top5 Container Events
										<span class="containerEvent dashboard_standard">(by policy)</span>
									</h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEventNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');" class="popup_sel small" style="display: none;">
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
														<a onclick="javascript: lf_dashboardConfigurationNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');">Configuration</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_refreshChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Refresh</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_removeChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Delete</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="group">
									<div class="dashboard_table_box double_chart nchart">
										<div id="cloudvm_table_3247" class="chart_box dashboard_table need_cluster_select" style="display: block;">
											<div class="tbl">
												<div id="DataTables_Table_9_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
													<table class="click dataTable no-footer" id="DataTables_Table_9" role="grid">
														<colgroup>
															<col width="100">
															<col width="auto">
															<col width="100">
															<col width="50">
														</colgroup>
														<thead>
															<tr role="row">
																<th>Action</th>
																<th>Name</th>
																<th>Severity</th>
																<th class="sorting_disabled">Cnt</th>
															</tr>
														</thead>
														<tbody>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">LOGGING</td>
																<td class="long_w">Privileged Container</td>
																<td class="long_w mw72">
																<span class="bc_medium">Medium</span></td>
																<td class="long_w">5</td>
															</tr>
															<tr onclick="javascript:lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="even">
																<td class="long_w">LOGGING</td>
																<td class="long_w">Overcommitting resources within container environments</td>
																<td class="long_w mw72"><span class="bc_medium">Medium</span></td>
																<td class="long_w">2</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">LOGGING</td>
																<td class="long_w">ARP poisoning and IP spoofing</td>
																<td class="long_w mw72"><span class="bc_medium">Medium</span></td>
																<td class="long_w">1</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">LOGGING</td>
																<td class="long_w">ARP poisoning and IP spoofing</td>
																<td class="long_w mw72"><span class="bc_medium">Medium</span></td>
																<td class="long_w">1</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">LOGGING</td>
																<td class="long_w">ARP poisoning and IP spoofing</td>
																<td class="long_w mw72"><span class="bc_medium">Medium</span></td>
																<td class="long_w">1</td>
															</tr>
														</tbody>
													</table>
													<div class="bottom"></div>
													<div class="clear"></div>
												</div>
											</div>
											
										</div>
									</div>
									
									<div class="dashboard_chart_line_box double_chart nchart">
										<div id="chart-containe" class="chart_box dashboard_chart_line">
										
										</div><!--chart_box-->

											<script>
											var dom = document.getElementById('chart-containe');
											var myChart = echarts.init(dom, 'dark', {
											  renderer: 'canvas',
											  useDirtyRect: false
											});
											var app = {};

											var option;

											option = {
											color: ["#C1282E", "#F7941F", "#FCEE21", "#39B549", "#b2b2b2"],	
											 backgroundColor: "transparent",

											  tooltip: {
									            show:false,
												trigger: 'axis'
											  },

											  legend: {
												
												orient: 'vertical',
												right: 20,
												top: 10,
												icon: 'path://"m14,0H5C2.24,0,0,2.24,0,5v9c0,2.76,2.24,5,5,5h9c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5Zm-1.22,8.28l-3.5,3.5c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2-2c-.29-.29-.29-.77,0-1.06s.77-.29,1.06,0l1.47,1.47,2.97-2.97c.29-.29.77-.29,1.06,0s.29.77,0,1.06Z"',
												itemWidth:15,
												itemHeight:15,
												inactiveColor: '#3D3D3D',
												data: ['Critcal', 'High', 'medium', 'Low', 'Ignore'],

												textStyle: {
														fontFamily: 'S-CoreDream',
														fontWeight:'400',
														fontSize: 11,
														
													},	
											  },


											  grid: {
												top:'30',
												left: '20',
												right: '130',
												bottom: '10',
												containLabel: true
											  },

											  xAxis: {
												type: 'category',
												boundaryGap: false,
												data: ['Mon4', 'Tue5', 'Wed6', 'Thu7', 'Fri8'],
												axisLabel: {
													padding:[5, 0, 5, 0],
												}
											  },
											  yAxis: {
												type: 'value',
												//boundaryGap: [0, '100%'],
												axisLabel: {
														formatter: '{value}K',
														//color:'#fff'
													}
											  },
											  series: [
												{
												  name: 'Critcal',
												  type: 'line',
												  //stack: 'Total',
												  symbolSize: 8,	
												  data: [0, 5, 10, 20, 13]
												},
												{
												  name: 'High',
												  type: 'line',
												  //stack: 'Total',
												symbolSize: 8,	
												  data: [10, 15, 15, 16, 0]
												},
												{
												  name: 'medium',
												  type: 'line',
												  //stack: 'Total',
												  symbolSize: 8,
												  data: [30, 0, 0, 0, 0]
												},
												{
												  name: 'Low',
												  type: 'line',
												  //stack: 'Total',
												  symbolSize: 8,
												  data: [30, 0, 0, 0, 0]
												},
												{
												  name: 'Ignore',
												  type: 'line',
												  //stack: 'Total',
													  symbolSize: 8,	
												  data: [20, 10, 10, 20, 12]
												}
											  ]
											};

											if (option && typeof option === 'object') {
											  myChart.setOption(option);
											}

											window.addEventListener('resize', myChart.resize);
											</script>
									</div>
								</div>
							</li>

							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">

									<h4 class="cont_title">Top5 Container <span class="containerEvent dashboard_buildtime">Buildtime</span> Events <span class="containerEvent dashboard_standard">(by rule)</span></h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEventNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');" class="popup_sel small" style="display: none;">
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
														<a onclick="javascript: lf_dashboardConfigurationNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');">Configuration</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_refreshChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Refresh</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_removeChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Delete</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="group">
									<div class="dashboard_table_box double_chart nchart">
										<div id="cloudvm_table_3247" class="chart_box dashboard_table need_cluster_select" style="display: block;">
											<div class="tbl">
												<div id="DataTables_Table_9_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
													<table class="click dataTable no-footer" id="DataTables_Table_9" role="grid">
														<colgroup>
															<col width="auto">
															<col width="100">
															<col width="50">
														</colgroup>
														<thead>
															<tr role="row">
																<th>Name</th>
																<th>Severity</th>
																<th class="sorting_disabled">Cnt</th>
															</tr>
														</thead>
														<tbody>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인</td>
																<td class="long_w mw72">
																<span class="bc_medium">Medium</span></td>
																<td class="long_w">5</td>
															</tr>
															<tr onclick="javascript:lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="even">
																<td class="long_w">컨테이너가 호스트 프로세스 ID 네임스페이스를 공유하지 않는지 확인</td>
																<td class="long_w mw72"><span class="bc_high">high</span></td>
																<td class="long_w">2</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">CPU limits이 설정되었는지 확인</td>
																<td class="long_w mw72"><span class="bc_low">Low</span></td>
																<td class="long_w">1</td>
															</tr>
														</tbody>
													</table>
													<div class="bottom"></div>
													<div class="clear"></div>
												</div>
											</div>
											
										</div>
									</div>
									
									<div class="dashboard_chart_line_box double_chart nchart">
										<div id="chart-containe2" class="chart_box dashboard_chart_line">
										
										</div><!--chart_box-->

											<script>
											var dom = document.getElementById('chart-containe2');
											var myChart = echarts.init(dom, 'dark', {
											  renderer: 'canvas',
											  useDirtyRect: false
											});
											var app = {};

											var option;

											option = {
											color: ["#C1282E", "#F7941F", "#FCEE21", "#39B549", "#b2b2b2"],	
											 backgroundColor: "transparent",

											  tooltip: {
									            show:false,
												trigger: 'axis'
											  },

											  legend: {
												
												orient: "vertical",
												right: 20,
												top: 10,
												icon: 'path://"m14,0H5C2.24,0,0,2.24,0,5v9c0,2.76,2.24,5,5,5h9c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5Zm-1.22,8.28l-3.5,3.5c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2-2c-.29-.29-.29-.77,0-1.06s.77-.29,1.06,0l1.47,1.47,2.97-2.97c.29-.29.77-.29,1.06,0s.29.77,0,1.06Z"',
												itemWidth:15,
												itemHeight:15,
												inactiveColor: "#3D3D3D",	
												data: ['Critcal', 'High', 'medium', 'Low', 'Ignore'],
												textStyle: {
													fontFamily: 'S-CoreDream',
													fontWeight:'400',
													fontSize: 11,
													
												},	
											  },



											  grid: {
												top:'30',
												left: '20',
												right: '130',
												bottom: '10',
												containLabel: true
											  },

											  xAxis: {
												type: 'category',
												boundaryGap: false,
												data: ['Mon4', 'Tue5', 'Wed6', 'Thu7', 'Fri8'],
												axisLabel: {
													padding:[5, 0, 5, 0],
												}
											  },
											  yAxis: {
												type: 'value',
												//boundaryGap: [0, '100%'],
												axisLabel: {
														formatter: '{value}K',
														//color:'#fff'
													}
											  },
											  series: [
												{
												  name: 'Critcal',
												  type: 'line',
												  stack: 'Total',
												  symbolSize: 8,	
												  data: [0, 5, 10, 20, 13]
												},
												{
												  name: 'High',
												  type: 'line',
												  stack: 'Total',
												symbolSize: 8,	
												  data: [10, 15, 15, 16, 0]
												},
												{
												  name: 'medium',
												  type: 'line',
												  stack: 'Total',
												  symbolSize: 8,
												  data: [30, 0, 0, 0, 0]
												},
												{
												  name: 'Low',
												  type: 'line',
												  stack: 'Total',
												  symbolSize: 8,
												  data: [30, 0, 0, 0, 0]
												},
												{
												  name: 'Ignore',
												  type: 'line',
												  stack: 'Total',
													  symbolSize: 8,	
												  data: [20, 10, 10, 20, 12]
												}
											  ]
											};

											if (option && typeof option === 'object') {
											  myChart.setOption(option);
											}

											window.addEventListener('resize', myChart.resize);
											</script>
									</div>
								</div>
							</li>

							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Container <span class="containerEvent dashboard_buildtime">Buildtime</span> Events <span class="containerEvent dashboard_standard">(by rule severity)</span></h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEventNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');" class="popup_sel small" style="display: none;">
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
														<a onclick="javascript: lf_dashboardConfigurationNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');">Configuration</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_refreshChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Refresh</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_removeChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Delete</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="group">
									<div class="dashboard_table_box double_chart nchart">
										<div id="cloudvm_table_3247" class="chart_box dashboard_table need_cluster_select" style="display: block;">
											<div class="tbl">
												<div id="DataTables_Table_9_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
													<table class="click dataTable no-footer" id="DataTables_Table_9" role="grid">
														<colgroup>
															<col width="auto">
															<col width="100">
															<col width="50">
														</colgroup>
														<thead>
															<tr role="row">
																<th>Name</th>
																<th>Severity</th>
																<th class="sorting_disabled">Cnt</th>
															</tr>
														</thead>
														<tbody>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">컨테이너가 AllowPrivilegeEscalation으로 실행되는지 확인</td>
																<td class="long_w mw72">
																<span class="bc_medium">Medium</span></td>
																<td class="long_w">5</td>
															</tr>
															<tr onclick="javascript:lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="even">
																<td class="long_w">루트 컨테이너 허용 최소화</td>
																<td class="long_w mw72"><span class="bc_medium">Medium</span></td>
																<td class="long_w">2</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">CPU limits이 설정되었는지 확인</td>
																<td class="long_w mw72"><span class="bc_low">Low</span></td>
																<td class="long_w">1</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">컨테이너 환경 내 CPU Overcommit 감지</td>
																<td class="long_w mw72"><span class="bc_low">Low</span></td>
																<td class="long_w">1</td>
															</tr>
															<tr onclick="javascript: lf_clkEventTable(this, 'cspContainerEventsPolicyTop5');" role="row" class="odd">
																<td class="long_w">호스트 충돌을 피하기 위해 컨테이너가 높은 UID로 실행되는지 확인</td>
																<td class="long_w mw72"><span class="bc_low">Low</span></td>
																<td class="long_w">1</td>
															</tr>
														</tbody>
													</table>
													<div class="bottom"></div>
													<div class="clear"></div>
												</div>
											</div>
											
										</div>
									</div>
									
									<div class="dashboard_chart_line_box double_chart nchart">
										<div id="chart-containe3" class="chart_box dashboard_chart_line">
										
										</div><!--chart_box-->

											<script>
											var dom = document.getElementById('chart-containe3');
											var myChart = echarts.init(dom, 'dark', {
											  renderer: 'canvas',
											  useDirtyRect: false
											});
											var app = {};

											var option;

											option = {
											color: ["#C1282E", "#F7941F", "#FCEE21", "#39B549", "#b2b2b2"],	
											 backgroundColor: "transparent",

											  tooltip: {
									            show:false,
												trigger: 'axis'
											  },

											  legend: {
												
												orient: "vertical",
												right: 20,
												top: 10,
												icon: 'path://"m14,0H5C2.24,0,0,2.24,0,5v9c0,2.76,2.24,5,5,5h9c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5Zm-1.22,8.28l-3.5,3.5c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-2-2c-.29-.29-.29-.77,0-1.06s.77-.29,1.06,0l1.47,1.47,2.97-2.97c.29-.29.77-.29,1.06,0s.29.77,0,1.06Z"',
												itemWidth:15,
												itemHeight:15,
												inactiveColor: "#3D3D3D",			
												data: ['Critcal', 'High', 'medium', 'Low', 'Ignore'],
												textStyle: {
													fontFamily: 'S-CoreDream',
													fontWeight:'400',
													fontSize: 11,
													
												},	
											  },



											  grid: {
												top:'30',
												left: '20',
												right: '130',
												bottom: '10',
												containLabel: true
											  },

											  xAxis: {
												type: 'category',
												boundaryGap: false,
												data: ['Mon4', 'Tue5', 'Wed6', 'Thu7', 'Fri8'],
												axisLabel: {
													padding:[5, 0, 5, 0],
												}
											  },
											  yAxis: {
												type: 'value',
												//boundaryGap: [0, '100%'],
												axisLabel: {
														formatter: '{value}K',
														//color:'#fff'
													}
											  },
											  series: [
												{
												  name: 'Critcal',
												  type: 'line',
												  stack: 'Total',
												  symbolSize: 8,	
												  data: [0, 5, 10, 20, 13]
												},
												{
												  name: 'High',
												  type: 'line',
												  stack: 'Total',
												symbolSize: 8,	
												  data: [10, 15, 15, 16, 0]
												},
												{
												  name: 'medium',
												  type: 'line',
												  stack: 'Total',
												  symbolSize: 8,
												  data: [30, 0, 0, 0, 0]
												},
												{
												  name: 'Low',
												  type: 'line',
												  stack: 'Total',
												  symbolSize: 8,
												  data: [30, 0, 0, 0, 0]
												},
												{
												  name: 'Ignore',
												  type: 'line',
												  stack: 'Total',
													  symbolSize: 8,	
												  data: [20, 10, 10, 20, 12]
												}
											  ]
											};

											if (option && typeof option === 'object') {
											  myChart.setOption(option);
											}

											window.addEventListener('resize', myChart.resize);
											</script>
									</div>
								</div>
							</li>


							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Top5 Container<span class="containerEvent dashboard_runtime">Runtime</span>Events<span class="containerEvent dashboard_standard">(by rule)</span></h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEventNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');" class="popup_sel small" style="display: none;">
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
														<a onclick="javascript: lf_dashboardConfigurationNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');">Configuration</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_refreshChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Refresh</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_removeChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Delete</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="group">
									<div class="dashboard_table_box double_chart nchart">
										<div class="no_data"><p><span>No Data</span> 불러들일 데이터가 없습니다.</p></div>
									</div>
									
									<div class="dashboard_chart_line_box double_chart nchart no_data">
										<div id="chart-containe4" class="chart_box dashboard_chart_line">
										
										</div><!--chart_box-->

										
									</div>
								</div>
							</li>


							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Top5 Container<span class="containerEvent dashboard_runtime">Runtime</span>Events<span class="containerEvent dashboard_standard">(by rule)</span></h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEventNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');" class="popup_sel small" style="display: none;">
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
														<a onclick="javascript: lf_dashboardConfigurationNChart(this,'cloudvm_table_9627,cloudvm_chart_line_5658');">Configuration</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_refreshChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Refresh</a>
													</li>
													<li class="ui-sortable-handle">
														<a onclick="javascript: lf_removeChartEventNChart('cloudvm_table_9627,cloudvm_chart_line_5658');">Delete</a>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="group">
									<div class="dashboard_table_box double_chart nchart">
										<div class="no_data"><p><span>No Data</span> 불러들일 데이터가 없습니다.</p></div>
									</div>
									
									<div class="dashboard_chart_line_box double_chart nchart no_data">
										<div id="chart-containe4" class="chart_box dashboard_chart_line">
										
										</div><!--chart_box-->

										
									</div>
								</div>
							</li>
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




</body>
</html>
