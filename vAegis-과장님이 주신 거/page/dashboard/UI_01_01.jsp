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
	<link rel="icon" href="../../assets/images/favicon.png" type="image/png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	<script src="../../js/common/page_common.js?v=${version}"></script>
    
	<script src="../../js/service/dashboards/dashboardChart.js?v=${version}"></script>
	<script src="../../js/service/dashboards/dashboard.js?v=${version}"></script>
	
	<!-- 230103 Image Security 추가 -->
	<script src="../../js/service/dashboards/imageSecurity/dashboardScanStatus.js?v=${version}"></script>
	<script src="../../js/service/dashboards/clusterCompliance/dashboardClusterComplianceChart.js?v=${version}"></script>
	
	<script type="text/javascript">
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
							<h3>Dashboard1</h3>
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
							<li class="w_100 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">컨테이너 이미지 스캔 Summary</h4>
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
										</div><!--//cont_btn_box-->
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>
											<div class="cont_btn_list">
												<ul>
													<li><a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a></li>
													<li><a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a></li>
													<li><a onclick="javascript: lf_removeChartEvent(this);">Delete</a></li>
												</ul>
											</div>
										</div><!--//cont_btn-->
									</div>
								</div><!--//dashboard_cont_top-->

								<div class="dashboard_chart_donut_box">
									<div id="cloudvm_chart_donut_2982" class="chart_box dashboard_chart_donut need_registry_select">
										<div class="graph-section">
											<!-- s : Malware 그래프-->
											<div class="graph" id="malware_cloudvm_chart_donut_2982" _echarts_instance_="ec_1695183320545" style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;" style="border:1px solid #fff;">
												<!--<div style="position: relative; width: 347px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
													<canvas data-zr-dom-id="zr_0" width="347" height="400" style="position: absolute; left: 0px; top: 0px; width: 347px; height: 400px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
												</div>
												<div class=""></div>-->

												<div class="donut-chart malware">
													<div class="chart">
														<div>
															<p class="malware-chart1"></p>
														</div>
													</div>
													<div class="chart_data">
														<dl>
															<dt class="tit">Malware</dt>
															<dd class="malware value" onclick="">Malware : <span>34</span></dd>
														</dl>
													</div>
												</div><!--//donut-chart-->
											</div>
											<!-- e : Malware 그래프-->


											<div class="graph">
												<!--<div style="position: relative; width: 347px; height: 400px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;">
													<canvas data-zr-dom-id="zr_0" width="347" height="400" style="position: absolute; left: 0px; top: 0px; width: 347px; height: 400px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
												</div>
												<div class="" style="position: absolute; display: block; border-style: solid; white-space: nowrap; z-index: 9999999; box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 10px; transition: opacity 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgb(255, 255, 255); border-width: 1px; border-radius: 4px; color: rgb(102, 102, 102); font: 14px / 21px &quot;Microsoft YaHei&quot;; padding: 10px; top: 0px; left: 0px; transform: translate3d(78px, 230px, 0px); border-color: rgb(244, 191, 114); visibility: hidden; opacity: 0;">심각도 : Medium</div>
												</div>
												<div class="graph" id="scan_cloudvm_chart_donut_2982" _echarts_instance_="ec_1695183320547" style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;">
												<div style="position: relative; width: 347px; height: 400px; padding: 0px; margin: 0px; border-width: 0px;">
													<canvas data-zr-dom-id="zr_0" width="347" height="400" style="position: absolute; left: 0px; top: 0px; width: 347px; height: 400px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
												</div>
												<div class=""></div>-->
												<div class="donut-chart vulnerabilities">
													<div class="chart">
														<!--<div class="low">
															<p class="low-chart">
															</p>
														</div>-->
														<div class="high">
															<p class="high-chart">
															</p>
														</div>
														<div class="medium">
															<p class="medium-chart">
															</p>
														</div>
														<!--<div class="critical">
															<p class="critical-chart">
															</p>
														</div>-->
													</div>
													<div class="chart_data">
														<dl>
															<dt class="tit">Vulnerabilities</dt>
															<dd class="high value" onclick="">Hight : <span>1</span></dd>
															<dd class="medium value" onclick="">medum : <span>5</span></dd>
														</dl>
													</div>
												</div><!--//donut-chart-->
											</div>
											
											<div class="graph" id="scanCompletion_cloudvm_chart_donut_2982" _echarts_instance_="ec_1695183320548" style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;">
												<!--<div style="position: relative; width: 347px; height: 400px; padding: 0px; margin: 0px; border-width: 0px;">
													<canvas data-zr-dom-id="zr_0" width="347" height="400" style="position: absolute; left: 0px; top: 0px; width: 347px; height: 400px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
												</div>
												<div class=""></div>-->
												<div class="donut-chart scan">
													<div class="chart">
														<div class="success">
															<p class="success-chart">
															</p>
														</div>
														<div class="fail">
															<p class="fail-chart">
															</p>
														</div>
														
													</div>
													<div class="chart_data">
														<dl>
															<dt class="tit">Scan</dt>
															<dd class="success value" onclick="">Success : <span>30</span></dd>
															<dd class="fail value" onclick="">Fail : <span>02</span></dd>
														</dl>
													</div>
												</div><!--//donut-chart-->
											</div>

											<div class="graph" id="scanCompletion_cloudvm_chart_donut_2982" _echarts_instance_="ec_1695183320549" style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;">
												<!--<div style="position: relative; width: 347px; height: 400px; padding: 0px; margin: 0px; border-width: 0px;">
													<canvas data-zr-dom-id="zr_0" width="347" height="400" style="position: absolute; left: 0px; top: 0px; width: 347px; height: 400px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); padding: 0px; margin: 0px; border-width: 0px;"></canvas>
												</div>
												<div class=""></div>-->
												<div class="donut-chart scan_completion">
													<div class="chart">
														<div class="sc-success">
															<p class="sc-success-chart">
															</p>
														</div>
														<div class="sc-scanning">
															<p class="sc-scanning-chart">
															</p>
														</div>
														<div class="sc-wait">
															<p class="sc-wait-chart">
															</p>
														</div>
														<div class="no-scan">
															<p class="no-scan-chart">
															</p>
														</div>
														
													</div>
													<div class="chart_data">
														<dl>
															<dt class="tit">Scan Completion</dt>
															<dd class="sc-success" onclick="">Scan Complete : <span>02</span></dd>
															<dd class="sc-scanning" onclick="">Scanning : <span>0</span></dd>
															<dd class="sc-waiting" onclick="">Waiting Scan : <span>0</span></dd>
															<dd class="no-scan" onclick="">No Scan : <span>0</span></dd>
														</dl>
													</div>
													
												</div><!--//donut-chart-->
											</div>

											<div class="graph" id="imageAssurance_cloudvm_chart_donut_2982" _echarts_instance_="ec_1695183320549" style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;">
												<div class="donut-chart image_assurance">
													<div class="chart">
														<div class="image">
															<p class="image-chart">
															</p>
														</div>
														<div class="assurance">
															<p class="assurance-chart">
															</p>
														</div>
														
													</div>
													<div class="chart_data">
														<dl>
															<dt class="tit">Image Assurance</dt>
															<dd class="image" onclick="">Image : <span>16</span></dd>
															<dd class="assurance" onclick="">Assurance : <span>0</span></dd>
														</dl>
													</div>
												</div><!--//donut-chart-->
												
											</div>

										</div>
									</div>
								</div>
							</li>
							
							
							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Malware Top5</h4>
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
									<div id="cloudvm_top5_2258" class="chart_box dashboard_top5 need_registry_select">
										<!-- s: jung 2023-10-06 : id값 확인 후 css 변경 필요 -->
										<div class="tbl">
											<div id="test" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
												<dl id="malware_Top5" class="list">
													<dt class="header">
														<p class="no">NO</p>
														<p class="malware">Malware Name</p>
														<p class="cnt">cnt</p>
													</dt>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>1</span></p>
														<p class="malware"><span>Multios.Coinminer.Miner-6781728-2</span></p>
														<p class="cnt"><span>10</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>2</span></p>
														<p class="malware"><span>Unix.Exploit.Drtycow-8011488-0</span></p>
														<p class="cnt"><span>7</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" >
														<p class="no"><span>3</span></p>
														<p class="malware"><span>Unix.Trojan.Gafgyt-674839-0</span></p>
														<p class="cnt"><span>6</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>4</span></p>
														<p class="malware"><span>Multios.Coinminer.Miner-6781728-2</span></p>
														<p class="cnt"><span>5</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>5</span></p>
														<p class="malware"><span>Unix.Exploit.Drtycow-8011488-0</span></p>
														<p class="cnt"><span>5</span></p>
													</dd>
												</dl>
												<div class="bottom"></div>
												<div class="clear"></div>
											</div>
										</div>
										<!-- e: jung 2023-10-06 -->
									</div>
								</div>
							</li>
							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Vulnerabilities  TOP 5</h4>
									<div class="cont_btn_box">
										<div class="sel_box fl" style="padding: 10px 10px 10px 10px;">
											<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small" style="display: none;">
												<option selected="selected" value="DAY">Day</option>
												<option value="WEEK">Weekly</option>
											</select>
											<div class="nice-select popup_sel small" tabindex="0">
												<span class="current">Day</span>
												<ul class="list">
													<li data-value="DAY" class="option selected">Day</li><li data-value="WEEK" class="option">Weekly</li>
												</ul>
											</div>
										</div>
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>
											<div class="cont_btn_list">
												<ul>
													<li><a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a></li>
													<li><a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a></li>
													<li><a onclick="javascript: lf_removeChartEvent(this);">Delete</a></li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="dashboard_top5_box">
									<div id="cloudvm_top5_6375" class="chart_box dashboard_top5 need_registry_select" style="display: block;">
										<div class="tbl">
											<div id="DataTables_Table_23_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
												<!-- 2023-10-06 jung table -> ul-li 변경 구조 변경
												<table class="click dataTable no-footer" id="DataTables_Table_23" role="grid">
													<colgroup>
														<col width="10%">
														<col width="55%">
														<col width="20%">
														<col width="15%">
													</colgroup>
													<thead>
														<tr role="row">
															<th class="sorting_disabled" rowspan="1" colspan="1">No</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">CVE ID</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Severity</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Cnt</th>
														</tr>
													</thead>
													<tbody>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" role="row" class="odd">
															<td class="long_w">1</td>
															<td class="long_w">CVE-2019-1010022</td>
															<td class="long_w">Critical</td>
															<td class="long_w">10</td>
														</tr>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" role="row" class="even">
															<td class="long_w">2</td>
															<td class="long_w">CVE-2019-8457</td>
															<td class="long_w">Critical</td>
															<td class="long_w">7</td>
														</tr>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" role="row" class="odd">
															<td class="long_w">3</td>
															<td class="long_w">CVE-2023-38408</td>
															<td class="long_w">Critical</td>
															<td class="long_w">6</td>
														</tr>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" role="row" class="even">
															<td class="long_w">4</td>
															<td class="long_w">CVE-2017-9117</td>
															<td class="long_w">Critical</td>
															<td class="long_w">5</td>
														</tr>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" role="row" class="odd">
															<td class="long_w">5</td>
															<td class="long_w">CVE-2020-27619</td>
															<td class="long_w">Critical</td>
															<td class="long_w">5</td>
														</tr>
													</tbody>
												</table>
												-->
												<dl id="DataTables_Table_23" class="list">
													<dt class="header">
														<p class="no">NO</p>
														<p class="cve">CVE ID</p>
														<p class="severity">severity</p>
														<p class="cnt">cnt</p>
													</dt>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>1</span></p>
														<p class="cve"><span>CVE-2019-1010022</span></p>
														<p class="severity"><span class="bc_critical">Critical</span></p><!-- Critical값고 동일한 클래스 추가.변경-->
														<p class="cnt">10</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>2</span></p>
														<p class="cve"><span>CVE-2019-8457</span></p>
														<p class="severity"><span class="bc_critical">Critical</span></p>
														<p class="cnt"><span>7</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');" >
														<p class="no"><span>3</span></p>
														<p class="cve"><span>CVE-2023-38408</span></p>
														<p class="severity"><span class="bc_critical">Critical</span></p>
														<p class="cnt"><span>6</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>4</span></p>
														<p class="cve"><span >CVE-2017-9117</span></p>
														<p class="severity"><span class="bc_critical">Critical</span></p>
														<p class="cnt"><span>5</span></p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspVulnerabilityTopN');">
														<p class="no"><span>5</span></p>
														<p class="cve"><span>CVE-2020-27619</span></p>
														<p class="severity"><span class="bc_critical">Critical</span></p>
														<p class="cnt"><span>5</span></p>
													</dd>
												</dl>
												<div class="bottom"></div>
												<div class="clear"></div>
											</div>
										</div>
									</div>
								</div>
							</li>
							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">Image Scan Status</h4>
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
													<li><a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a></li>
													<li><a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a></li>
													<li><a onclick="javascript: lf_removeChartEvent(this);">Delete</a></li>
												</ul>
											</div>
										</div>
									</div>
								</div><!--//dashboard_cont_top-->
								<div class="dashboard_table_box">
									<div id="cloudvm_table_3631" class="chart_box dashboard_table need_registry_select" style="display: block;">
										<div class="tbl">
											<div id="DataTables_Table_351_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
												<!--<table class="click dataTable no-footer" id="DataTables_Table_351" role="grid">
													<colgroup>
														<col width="5%">
														<col width="20%">
														<col width="20%">
														<col width="auto">
														<col width="13%">
														<col width="10%">
														<col width="12%">
													</colgroup>
													<thead>
														<tr role="row">
															<th class="sorting_disabled" rowspan="1" colspan="1">No</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Created At</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Finished At</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Tag</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Request User</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Result</th>
															<th class="sorting_disabled" rowspan="1" colspan="1">Re Scanned</th>
														</tr>
													</thead>
													<tbody>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspScanStatusTable');" role="row" class="odd">
															<td class="long_w">1</td>
															<td class="long_w">2023-10-06 12:24:44</td>
															<td class="long_w">2023-10-06 12:26:14</td>
															<td class="long_w">redis:none</td>
															<td class="long_w">ekshin</td>
															<td class="long_w">실패</td>
															<td class="long_w">NO</td>
														</tr>
														<tr onclick="javascript: lf_clkEventTable(this, 'cspScanStatusTable');" role="row" class="even">
															<td class="long_w">2</td>
															<td class="long_w">2023-10-06 11:35:48</td>
															<td class="long_w">2023-10-06 11:38:43</td>
															<td class="long_w">tomcat:8.5</td>
															<td class="long_w">ekshin</td>
															<td class="long_w">실패</td>
															<td class="long_w">NO</td>
														</tr>
													</tbody>
												</table>-->
												<!-- s :jung 2023-10-06 : 테이블 구조 변경-->
												<dl id="DataTables_Table_351" class="list image_Scan_Status">
													<dt class="header">
														<p>No</p>
														<p>Created At</p>
														<p>Finished At</p>
														<p>Tag</p>
														<p>Request User</p>
														<p>Result</p>
														<p>Re Scanned</p>
													</dt>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspScanStatusTable');">
														<p>1</p>
														<p>2023-10-06 12:24:44</p>
														<p>2023-10-06 12:26:14</p>
														<p>redis:none</p>
														<p>ekshin</p>
														<p><span class="bc_success ico">성공</span></p>
														<p>NO</p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspScanStatusTable');">
														<p>2</p>
														<p>2023-10-06 11:35:48</p>
														<p>2023-10-06 11:38:43</p>
														<p>tomcat:8.5</p>
														<p>ekshin</p>
														<p><span class="bc_fail ico">실패</span></p>
														<p>NO</p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspScanStatusTable');">
														<p>1</p>
														<p>2023-10-06 12:24:44</p>
														<p>2023-10-06 12:26:14</p>
														<p>redis:none</p>
														<p>ekshin</p>
														<p><span class="bc_ing ico">스캔중</span></p>
														<p>NO</p>
													</dd>
													<dd onclick="javascript: lf_clkEventTable(this, 'cspScanStatusTable');">
														<p>2</p>
														<p>2023-10-06 11:35:48</p>
														<p>2023-10-06 11:38:43</p>
														<p>tomcat:8.5</p>
														<p>ekshin</p>
														<p><span class="bc_erro ico">에러</span></p>
														<p>NO</p>
													</dd>
												</dl>
												<!-- e :jung 2023-10-06 : 테이블 구조 변경-->
											</div>
										</div>
									</div>
								</div><!--//dashboard_table_box-->
							</li>
							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
									<h4 class="cont_title">컨테이너 이미지 실행 제어 현황</h4>
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
													<li><a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a></li>
													<li><a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a></li>
													<li><a onclick="javascript: lf_removeChartEvent(this);">Delete</a></li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="dashboard_table_box">
									<div id="cloudvm_table_9194" class="chart_box dashboard_table need_registry_select">
										<div class="no_data"><p><span>No Data</span> 불러들일 데이터가 없습니다.</p></div>
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


<script>
	$(window).ready(function(){
		draw(101, '.malware-chart1', '#2ADB6B');

		draw(5, '.critical-chart','#E9676D');
		draw(20, '.high-chart', '#F7941F');
		draw(15, '.medium-chart', '#FFD52F');
		draw(60, '.low-chart','#39B549');

		
		draw(62, '.success-chart', '#4863FC' );
		draw(27, '.fail-chart','#FF4040');

		
		draw(27, '.sc-success-chart','#2ADB77');
		draw(62, '.sc-scanning-chart', '#79D2DE' );
		draw(27, '.sc-wait-chart','#DE798E');
		draw(10, '.no-scan-chart','#b2b2b2');

		draw(101, '.image-chart','#9821FF');
		draw(27, '.assurance-chart','#FF21AE')
			
	});

	function draw(max, classname, colorname){
	   var i=1;
		var func1 = setInterval(function(){
		  if(i<max){
			  color1(i,classname,colorname);
			  i++;
		  } else{
			clearInterval(func1);
		  }
		},10);
	}
	function color1(i, classname,colorname){
	   $(classname).css({
			"background":"conic-gradient("+colorname+" 0% "+i+"%, transparent "+i+"% 100%)"
	   });
	}



	</script>
</body>
</html>
