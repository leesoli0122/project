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
							<li class="w_25 ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">1</h4>
									</div>
							

									<div class="cont_btn_box">
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
									<div></div>
								</div>
							</li>
							<!--s:집중관리장비-->
							<li class="w_75 h_2n ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">집중관리장비</h4>
									</div>
							

									<div class="cont_btn_box">
										<div class="cont_btn fl">
											<a href="#" class="cont_btn_link"><span class="linktext">닫기</span></a>
										</div>
									</div>
								</div><!--//dashboard_cont_top-->
								<div class="intensivemanagement_box">
									<div>
										<!--bc_low, bc_medium, bc_high, bc_critical-->
										<table>
											<!--<colgroup>
												<col width="385px">
												<col width="auto">
												<col width="auto">
												<col width="auto">
											</colgroup>-->
											<thead>
												<tr>
													<th></th>
													<th class="time">11</th>
													<th class="time">12</th>
													<th class="time">13</th>
												</tr>
												<tr>
													<th></th>
													<th class="time">
														<div>
															<span>0</span>
															<span>05</span>
															<span>10</span>
															<span>15</span>
															<span>20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</th>

													<th class="time">
														<div>
															<span>0</span>
															<span>05</span>
															<span>10</span>
															<span>15</span>
															<span>20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</th>

													<th class="time">
														<div>
															<span>0</span>
															<span>05</span>
															<span>10</span>
															<span>15</span>
															<span>20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class="name">
														<p>EnterpriseCastle</p>
														<p>
															<span>정보보호_DEV_8</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_medium">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_critical">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_high">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_critical">50</span>
															<span class="bc_medium">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_medium">0</span>
															<span class="bc_high">05</span>
															<span class="bc_high">10</span>
															<span class="bc_critical">15</span>
															<span class="bc_critical">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>EnterpriseCastle</p>
														<p>
															<span>GroupWare_8</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_critical">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>EnterpriseCastle</p>
														<p>
															<span>DATA_Server_28</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_medium">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_critical">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>EnterpriseCastle</p>
														<p>
															<span>VOC_DB_Server</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_medium">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_critical">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>EnterpriseCastle</p>
														<p>
															<span>SMS_운영_02</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_high">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>EnterpriseCastle</p>
														<p>
															<span>SMS_DEV</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_high">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>ARS서버_4</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>E-MAIL서버_3</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_medium">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>WAS_01</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_high">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_medium">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>홈페이지관리…..</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>WebServer_05</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_medium">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>문서관리_서버…</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_critical">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_medium">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>vAegis</p>
														<p>
															<span>E-MAIL_DEV_8</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_medium">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>cluster_8k</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>cluster_dev_ksw</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>dev_test_cluster</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>registry_DEV_21</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>cluster_001</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>abcd-efgh-ijk…</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="name">
														<p>cAegis</p>
														<p>
															<span>cluster_test_se…</span>
															<span>(192.168.10.1)</span>
														</p>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">>25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span class="bc_low">25</span>
															<span class="bc_low">30</span>
															<span class="bc_low">35</span>
															<span class="bc_low">40</span>
															<span class="bc_low">45</span>
															<span class="bc_low">50</span>
															<span class="bc_low">55</span>
														</div>
													</td>
													<td class="time">
														<div>
															<span class="bc_low">0</span>
															<span class="bc_low">05</span>
															<span class="bc_low">10</span>
															<span class="bc_low">15</span>
															<span class="bc_low">20</span>
															<span>25</span>
															<span>30</span>
															<span>35</span>
															<span>40</span>
															<span>45</span>
															<span>50</span>
															<span>55</span>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</li>
							<!--e:집중관리장비-->
							<li class="w_25 ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">3</h4>
									</div>
							

									<div class="cont_btn_box">
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
									<div></div>
								</div>
							</li>

							<li class="w_25 ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">4</h4>
									</div>
							

									<div class="cont_btn_box">
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
									<div></div>
								</div>
							</li>

							<li class="w_25 ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">5</h4>
									</div>
							

									<div class="cont_btn_box">
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
									<div></div>
								</div>
							</li>

							<li class="w_50 ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">6</h4>
									</div>
							

									<div class="cont_btn_box">
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
									<div></div>
								</div>
							</li>

							<li class="w_25 ui-sortable-handle">
								<div class="dashboard_cont_top">
							
									<div class="cluster_select_box sel_box">
										<h4 class="cont_title">7</h4>
									</div>
							

									<div class="cont_btn_box">
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
									<div></div>
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
