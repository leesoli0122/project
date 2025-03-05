<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">


<head>
	<title>클러스터 규정 준수 스캔 상세 - Aegis</title>
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
<body class="win_popup event mscrollbar">
<input type="hidden" id="detailData" value=""/> 
<input type="hidden" id="complianceTaskEventPaging" value=""/>
<input type="hidden" id="resultValue" value=""/>
<input type="hidden" id="searchValue" value=""/>

	<section>
		<h4 id='complianceDetailTitle'>이벤트 상세 > 클러스터 규정 준수 스캔</h4>
		<div class="popup_view_cont">
			<div class="tab_box flex_lr">
				<div class="tab">
					<ul class="tab_lst">
						<li id="logInfo" value="tabMgmt_1" class="open"><a href="#" id="logInfoInner" class="tab_link">스캔 상세 정보 </a></li>
					</ul>
				</div>
				<div class="sc_info_search_box">
					<div class="ipt_box">
						<input class="" type="search" placeholder="Name, Description, Remidiation 키워드를 입력해 주십시오." id="searchKeyword" name="searchKeyword" style="width:400px;">
					</div>
					<a id="searchBtn" href="#" class="btn serch">검색</a>
				</div>
			</div>
			<div class="computer_box">
				<div class="sc_info">
					<!-- 현황판 div -->
					<div class="sc_info_box">
						<div class="total" onclick="scanStatusRefresh(this.className)">
							<p id="totalCount">060</p>
							<p>Total</p>
						</div>
						<div class="passed tc_passed" onclick="scanStatusRefresh(this.className)">
							<p id="passedCount">0</p>
							<p>Passed</p>
						</div>
						<div class="failed tc_failed" onclick="scanStatusRefresh(this.className)">
							<p id="failedCount">0</p>
							<p>Failed</p>
						</div>
						<div class="error tc_erro" onclick="scanStatusRefresh(this.className)">
							<p id="errorCount">0</p>
							<p>Error</p>
						</div>
						<div class="etc tc_non" onclick="scanStatusRefresh(this.className)">
							<p id="etcCount">0</p>
							<p>Etc</p>
						</div>
					</div>
					
				</div>
			</div>
			<div class="computer_box">
				<div id="frameworkSelectBox" class="sel_box framework_select">
					<select id="frameworkSelect" class="popup_sel" onchange="executeSearch()" style="display: none;"><option value="158c6611-b5fe-4e70-b2c6-6be5968674de">CIS Docker Benchmark</option><option value="265c4d2d-63d2-40c2-a826-37122caad9cc">CIS Kubernetes Benchmark</option><option value="f374d477-4b77-4142-9adb-ca817863d573">CIS RedHat OpenShift</option></select><div class="nice-select popup_sel" tabindex="0"><span class="current">CIS Docker Benchmark</span><ul class="list"><li data-value="158c6611-b5fe-4e70-b2c6-6be5968674de" class="option selected focus">CIS Docker Benchmark</li><li data-value="265c4d2d-63d2-40c2-a826-37122caad9cc" class="option">CIS Kubernetes Benchmark</li><li data-value="f374d477-4b77-4142-9adb-ca817863d573" class="option">CIS RedHat OpenShift</li></ul></div>
				</div>
				<div class="event_cont" style="min-height: 0px;">
						<div class="tbl">
							<div id="event_complianceScan_result_table_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">
							<table id="event_complianceScan_result_table" class="dataTable no-footer" role="grid">
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
										<th></th>
										<th>Framework</th>
										<th>Type</th>
										<th>ID</th>
										<th>Name</th>
										<th>Description</th>
										<th>Remediation</th>
										<th>Severity</th>
										<th>Result</th>
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
									<tr role="row" class="accordion">
										<td>
											<div class="view_hide_btn_icon" data-onoff="ee49530d-94c1-4dce-a043-fe5d696e4d5d_task_cloudvm_table_2908" onclick="onoffDisplay(this)"></div>
										</td>
										<td>CIS Docker Benchmark</td>
										<td>DEFAULT</td>
										<td> CIS-1.1</td>
										<td>Linux Hosts Specific Configuration</td>
										<td>This section contains recommendations that securing Linux Hosts running Docker Containers.</td>
										<td>-</td>
										<td>-</td>
										<td>
											<div class="result_cnt_box">
												<div class="passed_cnt_box">0</div>
												<div class="failed_cnt_box">10</div>
												<div class="error_cnt_box">0</div>
												<div class="etc_cnt_box">8</div>
											</div>
										</td>
										<td>2023-11-16 12:01:24</td>
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
									<tr role="row" class="accordion">
										<td>
											<div class="view_hide_btn_icon" data-onoff="ee49530d-94c1-4dce-a043-fe5d696e4d5d_task_cloudvm_table_2908" onclick="onoffDisplay(this)"></div>
										</td>
										<td>CIS Docker Benchmark</td>
										<td>DEFAULT</td>
										<td> CIS-1.1</td>
										<td>Linux Hosts Specific Configuration</td>
										<td>This section contains recommendations that securing Linux Hosts running Docker Containers.</td>
										<td>-</td>
										<td>-</td>
										<td>
											<div class="result_cnt_box">
												<div class="passed_cnt_box">0</div>
												<div class="failed_cnt_box">10</div>
												<div class="error_cnt_box">0</div>
												<div class="etc_cnt_box">8</div>
											</div>
										</td>
										<td>2023-11-16 12:01:24</td>
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
							<div class="bottom">
								<div class="dataTables_paginate paging_full_numbers" id="event_complianceScan_result_table_paginate">
									<ul class="pagination">
										<li class="paginate_button first disabled" id="event_complianceScan_result_table_first"><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="0" tabindex="0">First</a></li>
										<li class="paginate_button previous disabled" id="event_complianceScan_result_table_previous"><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="1" tabindex="0">Previous</a></li>
										<li class="paginate_button active"><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="2" tabindex="0">1</a></li>
										<li class="paginate_button "><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="3" tabindex="0">2</a></li>
										<li class="paginate_button "><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="4" tabindex="0">3</a></li>
										<li class="paginate_button "><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="5" tabindex="0">4</a></li>
										<li class="paginate_button "><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="6" tabindex="0">5</a></li>
										<li class="paginate_button disabled" id="event_complianceScan_result_table_ellipsis"><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="7" tabindex="0">…</a></li>
										<li class="paginate_button "><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="8" tabindex="0">15</a></li>
										<li class="paginate_button next" id="event_complianceScan_result_table_next"><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="9" tabindex="0">Next</a></li>
										<li class="paginate_button last" id="event_complianceScan_result_table_last"><a href="#" aria-controls="event_complianceScan_result_table" data-dt-idx="10" tabindex="0">Last</a></li>
									</ul>
								</div>
							</div><!--//bottom-->
							<div class="clear"></div>
						</div><!--//computer_box-->
						</div>
					</div>
			</div>
		</div>
	</section>
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