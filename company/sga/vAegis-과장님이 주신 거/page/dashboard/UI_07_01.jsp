<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<style>
.result_cnt_box {
	display: flex;
	align-items: center;
	justify-content: center;
}
.result_cnt_box div {
	width: 45px;
	height: auto;
	margin: 2px;
	border-radius: 6px;
	font-weight: 600;
}

.scroll-wrapper.textarea-scrollbar.scrollbar-outer.scroll-textarea {
	width: 100%
}
</style>
	<title>클러스터 규정준수 스캔 - Aegis</title>
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
	<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common_sample.jsp"%>
	
	<script src="./js/common/page_common.js?v=${version}"></script>
	<script src="https://cdn.jsdelivr.net/npm/progressbar.js@1.1.0/dist/progressbar.min.js"></script>
	<script defer src="./js/service/scan/complianceScan.js?v=${version}"></script>
	<script>
	var complianceScanTable;
		
	$(document).ready(function() {
			// DataTable init
			complianceScanTable = $('#statusComplianceScanTable').DataTable({
				autoWidth : false,
				paging : true,
				pagingType : "full_numbers",
				ordering : true,
				order:[],
				info : false,
				filter : true,
				lengthChange : false,
				columnDefs : [{
					targets : [0, 1], // 버튼 , 결과 테이블은 정렬 기능 x
					orderable : false
				},{
					targets : [ 2, 3, 4, 5, 6, 7 ],
					createdCell : function(td, cellData, rowData, row, col) {
						$(td).attr('title', cellData); // title 속성에 데이터 추가
						// 스타일 속성 설정(툴팁. 길이 추가 시 ...)
						$(td).css({
							'white-space' : 'nowrap',
							'overflow' : 'hidden',
							'text-overflow' : 'ellipsis'
						});
					},
				}, {
					targets : [ 8, 9, 10 ], // uuid, result의 데이터 숨기기 위함
					createdCell : function(td, cellData, rowData, row, col) {
						$(td).css({
							'display' : 'none',
						});
					},
				}, {
					targets : [ 0 ], // 0: 버튼 테이블
					createdCell : function(td, cellData, rowData, row, col) {
						$(td).css({
							'display': 'flex',
							'align-items': 'center',
							'justify-content': 'center'
						});
					},
				}, {
					targets : [ 0, 1, 2, 5, 6, 7], // 2: Name ,  3: Description
					searchable : false
				},{ 
					targets: [ 6 ], // 6: Severity가 들어가있는 테이블
					orderData:[ 10, 0 ]
				}],
				dom : 'rt<"bottom"ip><"clear">',
				createdRow : function(row, data, dataIndex) {
					$(row).attr('id', 'rowTaskTr_' + data[8]); // 하위 tree를 출력 하기 위한 tr 추가(data[8] = uuid)
				}
			});
	})
	</script>
</head>
<body>
	<h1>Aegis ADMIN</h1>
	<div class="skip_navigation">
		<ul>
			<li><a href="#Content" class="go_content">본문 바로가기</a></li>
			<li><a href="#Gnb">메뉴 바로가기</a></li>
		</ul>
	</div>

	<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="complianceScan" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="complianceScan" />
	</jsp:include>

	<input type="hidden" id="detailNum" />
	<input type="hidden" id="detailData" />
	<input type="hidden" id="detailJson" value="" />
	<section class="computer_page mscrollbar">
		<!-- TODO : css 수정, onChange, href function 수정 -->
		<div id="compliance_scan_select_box" class="compliance_box">
			<div class="compliance_title_left">
				<div>
					<div class="sel_box">
						<p class="compliance_title">Cluster</p>
						<select id="clusterList" class="popup_sel"
							onChange = "selectFrameworkList()">
							<option value="53596b7c-dde6-4a04-ada6-ffa143a9728a">Cluster-61</option><option value="2f4b443e-d0c4-455f-9664-c6f6fbe5f5d1">Cluster-67</option><option value="73f67fc0-949a-4527-9a27-ccf35ad2c527">K8S v1.19.14_Cluster</option><option value="e957fea2-1f6a-4ae2-931f-8a5ee1228c4d">Openshift-240</option>
						</select>
					</div>
				</div>
				<div> 
					<div class="sel_box">
						<p class="compliance_title">Framework</p>
						<select id="frameworkList" class="popup_sel">
								<option value="16874e2c-6745-407d-8002-3880bf6d5468">CIS Kubernetes Benchmark</option><option value="5ad82a92-d19f-47cd-99b3-458a01ea71ca">CIS RedHat OpenShift</option><option value="79c6af5f-e075-4887-96bb-ccbe9f23e3a8">DevOpsBest</option><option value="3c70e0c9-08f7-4e9e-a862-78941f19248e">NSA-CISA</option><option value="9cf51196-ee71-42c2-a0a8-6ddebc40bd74">RBAC_penny</option><option value="6a5866d2-e0f5-4c27-8a19-2431f04a1976">RBAC_penny-01</option><option value="66f54bb5-e9bf-460c-a21b-f4bdb4a5d19d">linux-test-compliance</option><option value="2999e08a-fa0a-4dba-9be9-79e693cfdc83">CIS Docker Benchmark</option><option value="bd82ccb6-fab0-4e0f-9673-6c16f640e12a">CIS Linux Benchmark</option>
						</select>
					</div>
				</div>
			</div>
			
			<div class="imagescan_title_right">
				<a id=clScanBtn href="javascript:selectComplianceScanResult();"
					class="btn">스캔</a><!--2024-01-17 : line blue 클래스 제거-->
			</div>
		</div>
		
		<div class="complianceScanStatusBox">
			<div class="computer_box">
				<div class="sc_info">
					<!-- 현황판 div -->
					<div class="sc_info_box">
						<div class="total" onclick="scanStatusRefresh(this.className)">
							<p id="totalCount">13</p>
							<p>Totals</p>
						</div>
						<div class="passed tc_passed" onclick="scanStatusRefresh(this.className)">
							<p id="passedCount">2</p>
							<p>Passed</p>
						</div>
						<div class="failed tc_failed" onclick="scanStatusRefresh(this.className)">
							<p id="failedCount">5</p>
							<p>Failed</p>
						</div>
						<div class="error tc_erro" onclick="scanStatusRefresh(this.className)">
							<p id="errorCount">0</p>
							<p>Error</p>
						</div>
						<div class="etc tc_non" onclick="scanStatusRefresh(this.className)">
							<p id="etcCount">6</p>
							<p>Etc</p>
						</div>
					</div>
					<!-- s : 부모클래스 한번더 감싸기-->
					<div class="form">
						<div class="sc_info_search_box">
							<div class="ipt_box">
								<input class="" type="text" placeholder="Name 혹은 Description 키워드를 입력해 주십시오." id="searchKeyword" name="searchKeyword">
							</div>
							<a id="searchBtn" href="#" class="btn serch">검색</a>
						</div>
					</div>
					<!-- e : 부모클래스 한번더 감싸기-->
				</div>
			</div>
	
			<div id="compliance_scan_result_table" class="computer_box">
				<div class="computer_box_wrap">
					<div class="event_cont" style="min-height: 0px;">
						<div class="tbl">
							<table id="statusComplianceScanTable" class="">
								<colgroup>
									<col width="4%">
									<col width="8%">
									<col width="12%">
									<col width="20%">
									<col width="20%">
									<col width="12%">
									<col width="12%">
									<col width="12%">
								</colgroup>
								<thead>
									<tr>
										<th></th>
										<th>Result</th>
										<th>Framework</th>
										<th>Name</th>
										<th>Description</th>
										<th>Remediation</th>
										<th>Severity</th> 
										<th>Date</th>
									</tr>
								</thead>
								<tbody>
								<tr id="rowTaskTr_c4cfecdb-1073-4785-b629-8ebd5bd80499" role="row" class="odd"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">18</div>	<div class="failed_cnt_box">1</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">2</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Control Plane Node Configuration Files" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Control Plane Node Configuration Files</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">c4cfecdb-1073-4785-b629-8ebd5bd80499</td><td style="display: none;">failed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_c4cfecdb-1073-4785-b629-8ebd5bd80499" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001132" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001132_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.1. Ensure that the API server pod specification file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001132_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the API server pod specification file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the API server pod specification file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/manifests/kube-apiserver.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/manifests/kube-apiserver.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/kube-apiserver.yaml; then stat -c permissions=%a /etc/kubernetes/manifests/kube-apiserver.yaml; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001133" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001133_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.2. Ensure that the API server pod specification file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001133_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the API server pod specification file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the API server pod specification file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/manifests/kube-apiserver.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/kube-apiserver.yaml; then stat -c %U:%G /etc/kubernetes/manifests/kube-apiserver.yaml; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001134" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001134_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.3. Ensure that the controller manager pod specification file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001134_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the controller manager pod specification file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the controller manager pod specification file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/manifests/kube-controller-manager.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/manifests/kube-controller-manager.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/kube-controller-manager.yaml; then stat -c permissions=%a /etc/kubernetes/manifests/kube-controller-manager.yaml; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001135" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001135_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.4. Ensure that the controller manager pod specification file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001135_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the controller manager pod specification file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the controller manager pod specification file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/manifests/kube-controller-manager.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/kube-controller-manager.yaml; then stat -c %U:%G /etc/kubernetes/manifests/kube-controller-manager.yaml; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001127" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001127_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.5. Ensure that the scheduler pod specification file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001127_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the scheduler pod specification file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the scheduler pod specification file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/manifests/kube-scheduler.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/manifests/kube-scheduler.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/kube-scheduler.yaml; then stat -c permissions=%a /etc/kubernetes/manifests/kube-scheduler.yaml; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001129" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001129_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.6. Ensure that the scheduler pod specification file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001129_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the scheduler pod specification file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the scheduler pod specification file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/manifests/kube-scheduler.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/kube-scheduler.yaml; then stat -c %U:%G /etc/kubernetes/manifests/kube-scheduler.yaml; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001130" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001130_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.7. Ensure that the etcd pod specification file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001130_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `/etc/kubernetes/manifests/etcd.yaml` file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the `/etc/kubernetes/manifests/etcd.yaml` file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/manifests/etcd.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/manifests/etcd.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/etcd.yaml; then find /etc/kubernetes/manifests/etcd.yaml -name '*etcd*' | xargs stat -c permissions=%a; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001131" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001131_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.8. Ensure that the etcd pod specification file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001131_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `/etc/kubernetes/manifests/etcd.yaml` file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the `/etc/kubernetes/manifests/etcd.yaml` file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/manifests/etcd.yaml

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/manifests/etcd.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/manifests/etcd.yaml; then find /etc/kubernetes/manifests/etcd.yaml -name '*etcd*' | xargs stat -c %U:%G; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001124" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001124_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.9. Ensure that the Container Network Interface file permissions are set to 644 or more restrictive (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001124_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the Container Network Interface files have permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the Container Network Interface files have permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 <path/to/cni/files>

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 &lt;path/to/cni/files&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]ps -ef | grep kubelet | grep -- --cni-conf-dir | sed 's%.*cni-conf-dir[= ]\([^ ]*\).*%\1%' | xargs -I{} find {} -mindepth 1 | xargs --no-run-if-empty stat -c permissions=%a
find /var/lib/cni/networks -type f 2&gt; /dev/null | xargs --no-run-if-empty stat -c permissions=%a
</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001213" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001213_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.10. Ensure that the Container Network Interface file ownership is set to root:root (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001213_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the Container Network Interface files have ownership set to `root:root`." class="subtask_catagory_detail">Ensure that the Container Network Interface files have ownership set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root <path/to/cni/files>

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root &lt;path/to/cni/files&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]ps -ef | grep kubelet | grep -- --cni-conf-dir | sed 's%.*cni-conf-dir[= ]\([^ ]*\).*%\1%' | xargs -I{} find {} -mindepth 1 | xargs --no-run-if-empty stat -c %U:%G
find /var/lib/cni/networks -type f 2&gt; /dev/null | xargs --no-run-if-empty stat -c %U:%G
</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001214" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001214_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.11. Ensure that the etcd data directory permissions are set to 700 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001214_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the etcd data directory has permissions of `700` or more restrictive." class="subtask_catagory_detail">Ensure that the etcd data directory has permissions of `700` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="On the etcd server node, get the etcd data directory, passed as an argument `--data-dir`, from the below command:

 
```
ps -ef | grep etcd

```
 Run the below command (based on the etcd data directory found above). For example,

 
```
chmod 700 /var/lib/etcd

```" class="subtask_catagory_detail">On the etcd server node, get the etcd data directory, passed as an argument `--data-dir`, from the below command:<br><br> <br>```<br>ps -ef | grep etcd<br><br>```<br> Run the below command (based on the etcd data directory found above). For example,<br><br> <br>```<br>chmod 700 /var/lib/etcd<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]DATA_DIR=''
for d in $(ps -ef | grep etcd | grep -- --data-dir | sed 's%.*data-dir[= ]\([^ ]*\).*%\1%'); do
  if test -d "$d"; then DATA_DIR="$d"; fi
done
if ! test -d "$DATA_DIR"; then DATA_DIR=/var/lib/etcd/default.etcd; fi
stat -c permissions=%a "$DATA_DIR"
permissions=700</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001215" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001215_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.12. Ensure that the etcd data directory ownership is set to etcd:etcd (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001215_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the etcd data directory ownership is set to `etcd:etcd`." class="subtask_catagory_detail">Ensure that the etcd data directory ownership is set to `etcd:etcd`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="On the etcd server node, get the etcd data directory, passed as an argument `--data-dir`, from the below command:

 
```
ps -ef | grep etcd

```
 Run the below command (based on the etcd data directory found above). For example,

 
```
chown etcd:etcd /var/lib/etcd

```" class="subtask_catagory_detail">On the etcd server node, get the etcd data directory, passed as an argument `--data-dir`, from the below command:<br><br> <br>```<br>ps -ef | grep etcd<br><br>```<br> Run the below command (based on the etcd data directory found above). For example,<br><br> <br>```<br>chown etcd:etcd /var/lib/etcd<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]DATA_DIR=''
for d in $(ps -ef | grep etcd | grep -- --data-dir | sed 's%.*data-dir[= ]\([^ ]*\).*%\1%'); do
  if test -d "$d"; then DATA_DIR="$d"; fi
done
if ! test -d "$DATA_DIR"; then DATA_DIR=/var/lib/etcd/default.etcd; fi
stat -c %U:%G "$DATA_DIR"
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001216" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001216_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.13. Ensure that the admin.conf file permissions are set to 600 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001216_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `admin.conf` file has permissions of `600`." class="subtask_catagory_detail">Ensure that the `admin.conf` file has permissions of `600`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/admin.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/admin.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/admin.conf; then stat -c permissions=%a /etc/kubernetes/admin.conf; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001219" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001219_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.14. Ensure that the admin.conf file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001219_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `admin.conf` file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the `admin.conf` file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/admin.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/admin.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/admin.conf; then stat -c %U:%G /etc/kubernetes/admin.conf; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001220" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001220_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.15. Ensure that the scheduler.conf file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001220_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `scheduler.conf` file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the `scheduler.conf` file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/scheduler.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/scheduler.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/scheduler.conf; then stat -c permissions=%a /etc/kubernetes/scheduler.conf; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001221" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001221_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.16. Ensure that the scheduler.conf file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001221_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `scheduler.conf` file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the `scheduler.conf` file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/scheduler.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/scheduler.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/scheduler.conf; then stat -c %U:%G /etc/kubernetes/scheduler.conf; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001222" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001222_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.17. Ensure that the controller-manager.conf file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001222_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `controller-manager.conf` file has permissions of 600 or more restrictive." class="subtask_catagory_detail">Ensure that the `controller-manager.conf` file has permissions of 600 or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod 600 /etc/kubernetes/controller-manager.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/controller-manager.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/controller-manager.conf; then stat -c permissions=%a /etc/kubernetes/controller-manager.conf; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001217" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001217_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.18. Ensure that the controller-manager.conf file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001217_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `controller-manager.conf` file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the `controller-manager.conf` file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown root:root /etc/kubernetes/controller-manager.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/controller-manager.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/controller-manager.conf; then stat -c %U:%G /etc/kubernetes/controller-manager.conf; fi'
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001218" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001218_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.19. Ensure that the Kubernetes PKI directory and file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001218_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the Kubernetes PKI directory and file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the Kubernetes PKI directory and file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chown -R root:root /etc/kubernetes/pki/

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chown -R root:root /etc/kubernetes/pki/<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]find /etc/kubernetes/pki/ | xargs stat -c %U:%G
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root
root:root</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001231" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001231_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.20. Ensure that the Kubernetes PKI certificate file permissions are set to 644 or more restrictive (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001231_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that Kubernetes PKI certificate files have permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that Kubernetes PKI certificate files have permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod -R 600 /etc/kubernetes/pki/*.crt

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod -R 600 /etc/kubernetes/pki/*.crt<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]find /etc/kubernetes/pki/ -name '*.crt' | xargs stat -c permissions=%a
permissions=644
permissions=644
permissions=644
permissions=644
permissions=644
permissions=644
permissions=644
permissions=644
permissions=644
permissions=644</textarea></div></div></div><div id="rowSubtask_c4cfecdb-1073-4785-b629-8ebd5bd80499_1001230" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001230_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.1.21. Ensure that the Kubernetes PKI key file permissions are set to 600 (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="c4cfecdb-1073-4785-b629-8ebd5bd80499_1001230_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that Kubernetes PKI key files have permissions of `600`." class="subtask_catagory_detail">Ensure that Kubernetes PKI key files have permissions of `600`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the Control Plane node. For example,

 
```
chmod -R 600 /etc/kubernetes/pki/*.key

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the Control Plane node. For example,<br><br> <br>```<br>chmod -R 600 /etc/kubernetes/pki/*.key<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]find /etc/kubernetes/pki/ -name '*.key' | xargs stat -c permissions=%a
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600
permissions=600</textarea></div></div></div></td></tr><tr id="rowTaskTr_182af269-465b-42a1-b312-ddc7f4ef8c00" role="row" class="even"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">18</div>	<div class="failed_cnt_box">6</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">7</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="API Server" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">API Server</td><td title="This section contains recommendations relating to API server configuration flags" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">This section contains recommendations relating to API server configuration flags</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">182af269-465b-42a1-b312-ddc7f4ef8c00</td><td style="display: none;">failed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_182af269-465b-42a1-b312-ddc7f4ef8c00" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001211" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001211_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.1. Ensure that the --anonymous-auth argument is set to false (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001211_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Disable anonymous requests to the API server." class="subtask_catagory_detail">Disable anonymous requests to the API server.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the below parameter.

 
```
--anonymous-auth=false

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the below parameter.<br><br> <br>```<br>--anonymous-auth=false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001207" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001207_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.2. Ensure that the --token-auth-file parameter is not set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001207_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not use token based authentication." class="subtask_catagory_detail">Do not use token based authentication.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the documentation and configure alternate mechanisms for authentication. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and remove the `--token-auth-file=<filename>` parameter." class="subtask_catagory_detail">Follow the documentation and configure alternate mechanisms for authentication. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and remove the `--token-auth-file=&lt;filename&gt;` parameter.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001209" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001209_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.3. Ensure that the --DenyServiceExternalIPs is not set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001209_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="This admission controller rejects all net-new usage of the Service field externalIPs." class="subtask_catagory_detail">This admission controller rejects all net-new usage of the Service field externalIPs.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and remove the `--DenyServiceExternalIPs'parameter

 or

 The Kubernetes API server flag disable-admission-plugins takes a comma-delimited list of admission control plugins to be disabled, even if they are in the list of plugins enabled by default.

 `kube-apiserver --disable-admission-plugins=DenyServiceExternalIPs,AlwaysDeny ...`" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and remove the `--DenyServiceExternalIPs'parameter<br><br> or<br><br> The Kubernetes API server flag disable-admission-plugins takes a comma-delimited list of admission control plugins to be disabled, even if they are in the list of plugins enabled by default.<br><br> `kube-apiserver --disable-admission-plugins=DenyServiceExternalIPs,AlwaysDeny ...`</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001203" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001203_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.4. Ensure that the --kubelet-https argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001203_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable certificate based kubelet authentication." class="subtask_catagory_detail">Enable certificate based kubelet authentication.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and set up the TLS connection between the apiserver and kubelets. Then, edit API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the kubelet client certificate and key parameters as below.

 
```
--kubelet-client-certificate=<path/to/client-certificate-file>
--kubelet-client-key=<path/to/client-key-file>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and set up the TLS connection between the apiserver and kubelets. Then, edit API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the kubelet client certificate and key parameters as below.<br><br> <br>```<br>--kubelet-client-certificate=&lt;path/to/client-certificate-file&gt;<br>--kubelet-client-key=&lt;path/to/client-key-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001205" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001205_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.5. Ensure that the --kubelet-client-certificate and --kubelet-client-key arguments are set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001205_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Verify kubelet's certificate before establishing connection." class="subtask_catagory_detail">Verify kubelet's certificate before establishing connection.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and setup the TLS connection between the apiserver and kubelets. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--kubelet-certificate-authority` parameter to the path to the cert file for the certificate authority.

 
```
--kubelet-certificate-authority=<ca-string>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and setup the TLS connection between the apiserver and kubelets. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--kubelet-certificate-authority` parameter to the path to the cert file for the certificate authority.<br><br> <br>```<br>--kubelet-certificate-authority=&lt;ca-string&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001197" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001197_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.6. Ensure that the --kubelet-certificate-authority argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001197_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not always authorize all requests." class="subtask_catagory_detail">Do not always authorize all requests.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--authorization-mode` parameter to values other than `AlwaysAllow`. One such example could be as below.

 
```
--authorization-mode=RBAC

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--authorization-mode` parameter to values other than `AlwaysAllow`. One such example could be as below.<br><br> <br>```<br>--authorization-mode=RBAC<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001200" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001200_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.7. Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001200_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Restrict kubelet nodes to reading only objects associated with them." class="subtask_catagory_detail">Restrict kubelet nodes to reading only objects associated with them.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--authorization-mode` parameter to a value that includes `Node`.

 
```
--authorization-mode=Node,RBAC

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--authorization-mode` parameter to a value that includes `Node`.<br><br> <br>```<br>--authorization-mode=Node,RBAC<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001193" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001193_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.8. Ensure that the --authorization-mode argument includes Node (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001193_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Turn on Role Based Access Control." class="subtask_catagory_detail">Turn on Role Based Access Control.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--authorization-mode` parameter to a value that includes `RBAC`, for example:

 
```
--authorization-mode=Node,RBAC

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--authorization-mode` parameter to a value that includes `RBAC`, for example:<br><br> <br>```<br>--authorization-mode=Node,RBAC<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001195" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001195_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.9. Ensure that the --authorization-mode argument includes RBAC (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001195_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Limit the rate at which the API server accepts requests." class="subtask_catagory_detail">Limit the rate at which the API server accepts requests.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and set the desired limits in a configuration file.

 Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` and set the below parameters.

 
```
--enable-admission-plugins=...,EventRateLimit,...
--admission-control-config-file=<path/to/configuration/file>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and set the desired limits in a configuration file.<br><br> Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` and set the below parameters.<br><br> <br>```<br>--enable-admission-plugins=...,EventRateLimit,...<br>--admission-control-config-file=&lt;path/to/configuration/file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001225" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001225_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.10. Ensure that the admission control plugin EventRateLimit is set (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001225_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not allow all requests." class="subtask_catagory_detail">Do not allow all requests.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and either remove the `--enable-admission-plugins` parameter, or set it to a value that does not include `AlwaysAdmit`." class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and either remove the `--enable-admission-plugins` parameter, or set it to a value that does not include `AlwaysAdmit`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001224" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001224_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.11. Ensure that the admission control plugin AlwaysAdmit is not set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001224_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Always pull images." class="subtask_catagory_detail">Always pull images.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--enable-admission-plugins` parameter to include `AlwaysPullImages`.

 
```
--enable-admission-plugins=...,AlwaysPullImages,...

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--enable-admission-plugins` parameter to include `AlwaysPullImages`.<br><br> <br>```<br>--enable-admission-plugins=...,AlwaysPullImages,...<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001223" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001223_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.12. Ensure that the admission control plugin AlwaysPullImages is set (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001223_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="The SecurityContextDeny admission controller can be used to deny pods which make use of some SecurityContext fields which could allow for privilege escalation in the cluster. This should be used where PodSecurityPolicy is not in place within the cluster." class="subtask_catagory_detail">The SecurityContextDeny admission controller can be used to deny pods which make use of some SecurityContext fields which could allow for privilege escalation in the cluster. This should be used where PodSecurityPolicy is not in place within the cluster.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--enable-admission-plugins` parameter to include `SecurityContextDeny`, unless `PodSecurityPolicy` is already in place.

 
```
--enable-admission-plugins=...,SecurityContextDeny,...

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--enable-admission-plugins` parameter to include `SecurityContextDeny`, unless `PodSecurityPolicy` is already in place.<br><br> <br>```<br>--enable-admission-plugins=...,SecurityContextDeny,...<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001229" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001229_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.13. Ensure that the admission control plugin SecurityContextDeny is set if PodSecurityPolicy is not used (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001229_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Automate service accounts management." class="subtask_catagory_detail">Automate service accounts management.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the documentation and create `ServiceAccount` objects as per your environment. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and ensure that the `--disable-admission-plugins` parameter is set to a value that does not include `ServiceAccount`." class="subtask_catagory_detail">Follow the documentation and create `ServiceAccount` objects as per your environment. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and ensure that the `--disable-admission-plugins` parameter is set to a value that does not include `ServiceAccount`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001228" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001228_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.14. Ensure that the admission control plugin ServiceAccount is set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001228_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Reject creating objects in a namespace that is undergoing termination." class="subtask_catagory_detail">Reject creating objects in a namespace that is undergoing termination.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--disable-admission-plugins` parameter to ensure it does not include `NamespaceLifecycle`." class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--disable-admission-plugins` parameter to ensure it does not include `NamespaceLifecycle`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001227" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001227_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.15. Ensure that the admission control plugin NamespaceLifecycle is set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001227_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Limit the `Node` and `Pod` objects that a kubelet could modify." class="subtask_catagory_detail">Limit the `Node` and `Pod` objects that a kubelet could modify.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and configure `NodeRestriction` plug-in on kubelets. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the `--enable-admission-plugins` parameter to a value that includes `NodeRestriction`.

 
```
--enable-admission-plugins=...,NodeRestriction,...

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and configure `NodeRestriction` plug-in on kubelets. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the `--enable-admission-plugins` parameter to a value that includes `NodeRestriction`.<br><br> <br>```<br>--enable-admission-plugins=...,NodeRestriction,...<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001226" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001226_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.16. Ensure that the admission control plugin NodeRestriction is set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001226_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not disable the secure port." class="subtask_catagory_detail">Do not disable the secure port.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and either remove the `--secure-port` parameter or set it to a different (non-zero) desired port." class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and either remove the `--secure-port` parameter or set it to a different (non-zero) desired port.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001141" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001141_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.17. Ensure that the --secure-port argument is not set to 0 (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001141_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Disable profiling, if not needed." class="subtask_catagory_detail">Disable profiling, if not needed.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the below parameter.

 
```
--profiling=false

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the below parameter.<br><br> <br>```<br>--profiling=false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001139" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001139_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.18. Ensure that the --profiling argument is set to false (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001139_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable auditing on the Kubernetes API Server and set the desired audit log path." class="subtask_catagory_detail">Enable auditing on the Kubernetes API Server and set the desired audit log path.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-path` parameter to a suitable path and file where you would like audit logs to be written, for example:

 
```
--audit-log-path=/var/log/apiserver/audit.log

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-path` parameter to a suitable path and file where you would like audit logs to be written, for example:<br><br> <br>```<br>--audit-log-path=/var/log/apiserver/audit.log<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001137" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001137_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.19. Ensure that the --audit-log-path argument is set (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001137_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Retain the logs for at least 30 days or as appropriate." class="subtask_catagory_detail">Retain the logs for at least 30 days or as appropriate.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-maxage` parameter to 30 or as an appropriate number of days:

 
```
--audit-log-maxage=30

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-maxage` parameter to 30 or as an appropriate number of days:<br><br> <br>```<br>--audit-log-maxage=30<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001163" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001163_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.20. Ensure that the --audit-log-maxage argument is set to 30 or as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001163_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Retain 10 or an appropriate number of old log files." class="subtask_catagory_detail">Retain 10 or an appropriate number of old log files.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-maxbackup` parameter to 10 or to an appropriate value.

 
```
--audit-log-maxbackup=10

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-maxbackup` parameter to 10 or to an appropriate value.<br><br> <br>```<br>--audit-log-maxbackup=10<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001160" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001160_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.21. Ensure that the --audit-log-maxbackup argument is set to 10 or as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001160_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Rotate log files on reaching 100 MB or as appropriate." class="subtask_catagory_detail">Rotate log files on reaching 100 MB or as appropriate.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-maxsize` parameter to an appropriate size in MB. For example, to set it as 100 MB:

 
```
--audit-log-maxsize=100

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--audit-log-maxsize` parameter to an appropriate size in MB. For example, to set it as 100 MB:<br><br> <br>```<br>--audit-log-maxsize=100<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001159" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001159_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.22. Ensure that the --audit-log-maxsize argument is set to 100 or as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001159_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Set global request timeout for API server requests as appropriate." class="subtask_catagory_detail">Set global request timeout for API server requests as appropriate.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` and set the below parameter as appropriate and if needed. For example,

 
```
--request-timeout=300s

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` and set the below parameter as appropriate and if needed. For example,<br><br> <br>```<br>--request-timeout=300s<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001158" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001158_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.23. Ensure that the --request-timeout argument is set as appropriate (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001158_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Validate service account before validating token." class="subtask_catagory_detail">Validate service account before validating token.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the below parameter.

 
```
--service-account-lookup=true

```
 Alternatively, you can delete the `--service-account-lookup` parameter from this file so that the default takes effect." class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the below parameter.<br><br> <br>```<br>--service-account-lookup=true<br><br>```<br> Alternatively, you can delete the `--service-account-lookup` parameter from this file so that the default takes effect.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001168" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001168_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.24. Ensure that the --service-account-lookup argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001168_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Explicitly set a service account public key file for service accounts on the apiserver." class="subtask_catagory_detail">Explicitly set a service account public key file for service accounts on the apiserver.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--service-account-key-file` parameter to the public key file for service accounts:

 
```
--service-account-key-file=<filename>

```" class="subtask_catagory_detail">Edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the Control Plane node and set the `--service-account-key-file` parameter to the public key file for service accounts:<br><br> <br>```<br>--service-account-key-file=&lt;filename&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001167" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001167_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.25. Ensure that the --service-account-key-file argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001167_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="etcd should be configured to make use of TLS encryption for client connections." class="subtask_catagory_detail">etcd should be configured to make use of TLS encryption for client connections.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and set up the TLS connection between the apiserver and etcd. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the etcd certificate and key file parameters.

 
```
--etcd-certfile=<path/to/client-certificate-file> 
--etcd-keyfile=<path/to/client-key-file>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and set up the TLS connection between the apiserver and etcd. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the etcd certificate and key file parameters.<br><br> <br>```<br>--etcd-certfile=&lt;path/to/client-certificate-file&gt; <br>--etcd-keyfile=&lt;path/to/client-key-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001166" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001166_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.26. Ensure that the --etcd-certfile and --etcd-keyfile arguments are set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001166_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Setup TLS connection on the API server." class="subtask_catagory_detail">Setup TLS connection on the API server.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and set up the TLS connection on the apiserver. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the TLS certificate and private key file parameters.

 
```
--tls-cert-file=<path/to/tls-certificate-file> 
--tls-private-key-file=<path/to/tls-key-file>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and set up the TLS connection on the apiserver. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the TLS certificate and private key file parameters.<br><br> <br>```<br>--tls-cert-file=&lt;path/to/tls-certificate-file&gt; <br>--tls-private-key-file=&lt;path/to/tls-key-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001165" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001165_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.27. Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001165_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Setup TLS connection on the API server." class="subtask_catagory_detail">Setup TLS connection on the API server.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and set up the TLS connection on the apiserver. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the client certificate authority file.

 
```
--client-ca-file=<path/to/client-ca-file>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and set up the TLS connection on the apiserver. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the client certificate authority file.<br><br> <br>```<br>--client-ca-file=&lt;path/to/client-ca-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001112" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001112_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.28. Ensure that the --client-ca-file argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001112_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="etcd should be configured to make use of TLS encryption for client connections." class="subtask_catagory_detail">etcd should be configured to make use of TLS encryption for client connections.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and set up the TLS connection between the apiserver and etcd. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the etcd certificate authority file parameter.

 
```
--etcd-cafile=<path/to/ca-file>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and set up the TLS connection between the apiserver and etcd. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the etcd certificate authority file parameter.<br><br> <br>```<br>--etcd-cafile=&lt;path/to/ca-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001111" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001111_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.29. Ensure that the --etcd-cafile argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001111_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Encrypt etcd key-value store." class="subtask_catagory_detail">Encrypt etcd key-value store.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and configure a `EncryptionConfig` file. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the `--encryption-provider-config` parameter to the path of that file:

 
```
--encryption-provider-config=</path/to/EncryptionConfig/File>

```" class="subtask_catagory_detail">Follow the Kubernetes documentation and configure a `EncryptionConfig` file. Then, edit the API server pod specification file `/etc/kubernetes/manifests/kube-apiserver.yaml` on the master node and set the `--encryption-provider-config` parameter to the path of that file:<br><br> <br>```<br>--encryption-provider-config=&lt;/path/to/EncryptionConfig/File&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001128" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001128_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.30. Ensure that the --encryption-provider-config argument is set as appropriate (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001128_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Where `etcd` encryption is used, appropriate providers should be configured." class="subtask_catagory_detail">Where `etcd` encryption is used, appropriate providers should be configured.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the Kubernetes documentation and configure a `EncryptionConfig` file. In this file, choose `aescbc`, `kms` or `secretbox` as the encryption provider." class="subtask_catagory_detail">Follow the Kubernetes documentation and configure a `EncryptionConfig` file. In this file, choose `aescbc`, `kms` or `secretbox` as the encryption provider.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_182af269-465b-42a1-b312-ddc7f4ef8c00_1001136" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001136_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.2.31. Ensure that encryption providers are appropriately configured (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="182af269-465b-42a1-b312-ddc7f4ef8c00_1001136_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the API server is configured to only use strong cryptographic ciphers." class="subtask_catagory_detail">Ensure that the API server is configured to only use strong cryptographic ciphers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml on the Control Plane node and set the below parameter.

 
```
--tls-cipher-suites=TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.

```" class="subtask_catagory_detail">Edit the API server pod specification file /etc/kubernetes/manifests/kube-apiserver.yaml on the Control Plane node and set the below parameter.<br><br> <br>```<br>--tls-cipher-suites=TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384.<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]ENCRYPTION_PROVIDER_CONFIG=$(ps -ef | grep kube-apiserver | grep -- --encryption-provider-config | sed 's%.*encryption-provider-config[= ]\([^ ]*\).*%\1%')
if test -e $ENCRYPTION_PROVIDER_CONFIG; then grep -A1 'providers:' $ENCRYPTION_PROVIDER_CONFIG | tail -n1 | grep -o "[A-Za-z]*" | sed 's/^/provider=/'; fi
</textarea></div></div></div></td></tr><tr id="rowTaskTr_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32" role="row" class="odd"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">5</div>	<div class="failed_cnt_box">1</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">1</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Controller Manager" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Controller Manager</td><td title="This section contains recommendations relating to Controller Manager configuration flags" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">This section contains recommendations relating to Controller Manager configuration flags</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">ab1b15a1-3c44-4d5f-9b4a-342d603cfc32</td><td style="display: none;">failed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001144" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001144_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.1. Ensure that the --terminated-pod-gc-threshold argument is set as appropriate (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001144_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Activate garbage collector on pod termination, as appropriate." class="subtask_catagory_detail">Activate garbage collector on pod termination, as appropriate.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--terminated-pod-gc-threshold` to an appropriate threshold, for example:

 
```
--terminated-pod-gc-threshold=10

```" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--terminated-pod-gc-threshold` to an appropriate threshold, for example:<br><br> <br>```<br>--terminated-pod-gc-threshold=10<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001146" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001146_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.2. Ensure that the --profiling argument is set to false (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001146_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Disable profiling, if not needed." class="subtask_catagory_detail">Disable profiling, if not needed.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the below parameter.

 
```
--profiling=false

```" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the below parameter.<br><br> <br>```<br>--profiling=false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001153" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001153_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.3. Ensure that the --use-service-account-credentials argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001153_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Use individual service account credentials for each controller." class="subtask_catagory_detail">Use individual service account credentials for each controller.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node to set the below parameter.

 
```
--use-service-account-credentials=true

```" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node to set the below parameter.<br><br> <br>```<br>--use-service-account-credentials=true<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001156" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001156_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.4. Ensure that the --service-account-private-key-file argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001156_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Explicitly set a service account private key file for service accounts on the controller manager." class="subtask_catagory_detail">Explicitly set a service account private key file for service accounts on the controller manager.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--service-account-private-key-file` parameter to the private key file for service accounts.

 
```
--service-account-private-key-file=<filename>

```" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--service-account-private-key-file` parameter to the private key file for service accounts.<br><br> <br>```<br>--service-account-private-key-file=&lt;filename&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001149" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001149_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.5. Ensure that the --root-ca-file argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001149_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Allow pods to verify the API server's serving certificate before establishing connections." class="subtask_catagory_detail">Allow pods to verify the API server's serving certificate before establishing connections.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--root-ca-file` parameter to the certificate bundle file`.

 
```
--root-ca-file=<path/to/file>

```" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--root-ca-file` parameter to the certificate bundle file`.<br><br> <br>```<br>--root-ca-file=&lt;path/to/file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001151" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001151_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.6. Ensure that the RotateKubeletServerCertificate argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001151_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable kubelet server certificate rotation on controller-manager." class="subtask_catagory_detail">Enable kubelet server certificate rotation on controller-manager.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--feature-gates` parameter to include `RotateKubeletServerCertificate=true`.

 
```
--feature-gates=RotateKubeletServerCertificate=true

```" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and set the `--feature-gates` parameter to include `RotateKubeletServerCertificate=true`.<br><br> <br>```<br>--feature-gates=RotateKubeletServerCertificate=true<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div><div id="rowSubtask_ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001161" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001161_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.3.7. Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="ab1b15a1-3c44-4d5f-9b4a-342d603cfc32_1001161_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not bind the Controller Manager service to non-loopback insecure addresses." class="subtask_catagory_detail">Do not bind the Controller Manager service to non-loopback insecure addresses.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and ensure the correct value for the `--bind-address` parameter" class="subtask_catagory_detail">Edit the Controller Manager pod specification file `/etc/kubernetes/manifests/kube-controller-manager.yaml` on the Control Plane node and ensure the correct value for the `--bind-address` parameter</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-controller-manager | grep -v grep
root      3243  3212  0 Jan15 ?        00:12:28 kube-controller-manager --allocate-node-cidrs=true --authentication-kubeconfig=/etc/kubernetes/controller-manager.conf --authorization-kubeconfig=/etc/kubernetes/controller-manager.conf --bind-address=127.0.0.1 --client-ca-file=/etc/kubernetes/pki/ca.crt --cluster-cidr=192.168.0.0/16 --cluster-name=kubernetes --cluster-signing-cert-file=/etc/kubernetes/pki/ca.crt --cluster-signing-key-file=/etc/kubernetes/pki/ca.key --controllers=*,bootstrapsigner,tokencleaner --kubeconfig=/etc/kubernetes/controller-manager.conf --leader-elect=true --port=0 --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --root-ca-file=/etc/kubernetes/pki/ca.crt --service-account-private-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --use-service-account-credentials=true</textarea></div></div></div></td></tr><tr id="rowTaskTr_e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d" role="row" class="even"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">1</div>	<div class="failed_cnt_box">1</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">0</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Scheduler" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Scheduler</td><td title="This section contains recommendations relating to Scheduler configuration flags" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">This section contains recommendations relating to Scheduler configuration flags</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d</td><td style="display: none;">failed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d" data-onoff="e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_1001181" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_1001181_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.4.1. Ensure that the --profiling argument is set to false (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_1001181_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Disable profiling, if not needed." class="subtask_catagory_detail">Disable profiling, if not needed.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Scheduler pod specification file `/etc/kubernetes/manifests/kube-scheduler.yaml` file on the Control Plane node and set the below parameter.

 
```
--profiling=false

```" class="subtask_catagory_detail">Edit the Scheduler pod specification file `/etc/kubernetes/manifests/kube-scheduler.yaml` file on the Control Plane node and set the below parameter.<br><br> <br>```<br>--profiling=false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-scheduler | grep -v grep
root      3177  3155  0 Jan15 ?        00:03:26 kube-scheduler --authentication-kubeconfig=/etc/kubernetes/scheduler.conf --authorization-kubeconfig=/etc/kubernetes/scheduler.conf --bind-address=127.0.0.1 --kubeconfig=/etc/kubernetes/scheduler.conf --leader-elect=true --port=0</textarea></div></div></div><div id="rowSubtask_e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_1001182" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_1001182_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-1.4.2. Ensure that the --bind-address argument is set to 127.0.0.1 (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="e79cf1e0-5f41-4af1-8eec-e70ada1bdb1d_1001182_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not bind the scheduler service to non-loopback insecure addresses." class="subtask_catagory_detail">Do not bind the scheduler service to non-loopback insecure addresses.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the Scheduler pod specification file `/etc/kubernetes/manifests/kube-scheduler.yaml` on the Control Plane node and ensure the correct value for the `--bind-address` parameter" class="subtask_catagory_detail">Edit the Scheduler pod specification file `/etc/kubernetes/manifests/kube-scheduler.yaml` on the Control Plane node and ensure the correct value for the `--bind-address` parameter</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-scheduler | grep -v grep
root      3177  3155  0 Jan15 ?        00:03:26 kube-scheduler --authentication-kubeconfig=/etc/kubernetes/scheduler.conf --authorization-kubeconfig=/etc/kubernetes/scheduler.conf --bind-address=127.0.0.1 --kubeconfig=/etc/kubernetes/scheduler.conf --leader-elect=true --port=0</textarea></div></div></div></td></tr><tr id="rowTaskTr_b07ae596-8bcc-43f2-9004-06a6a97be814" role="row" class="odd"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">7</div>	<div class="failed_cnt_box">0</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">0</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Etcd Node Configuration" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Etcd Node Configuration</td><td title="This section covers recommendations for etcd configuration.
This sections assumes you're running etcd in a Kubernetes pod. If you are running etcd 
externally the file paths, audit and remediation process my vary" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">This section covers recommendations for etcd configuration.
This sections assumes you're running etcd in a Kubernetes pod. If you are running etcd 
externally the file paths, audit and remediation process my vary</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">b07ae596-8bcc-43f2-9004-06a6a97be814</td><td style="display: none;">passed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_b07ae596-8bcc-43f2-9004-06a6a97be814" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001145" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001145_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.1. Ensure that the --cert-file and --key-file arguments are set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001145_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Configure TLS encryption for the etcd service." class="subtask_catagory_detail">Configure TLS encryption for the etcd service.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the etcd service documentation and configure TLS encryption.

 Then, edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameters.

 
```
--cert-file=</path/to/ca-file>
--key-file=</path/to/key-file>

```" class="subtask_catagory_detail">Follow the etcd service documentation and configure TLS encryption.<br><br> Then, edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameters.<br><br> <br>```<br>--cert-file=&lt;/path/to/ca-file&gt;<br>--key-file=&lt;/path/to/key-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
root     17332 17291  0  2023 ?        05:25:22 etcd --advertise-client-urls=https://192.168.20.61:2379 --cert-file=/etc/kubernetes/pki/etcd/server.crt --client-cert-auth=true --data-dir=/var/lib/etcd --initial-advertise-peer-urls=https://192.168.20.61:2380 --initial-cluster=k8s-master=https://192.168.20.61:2380 --key-file=/etc/kubernetes/pki/etcd/server.key --listen-client-urls=https://127.0.0.1:2379,https://192.168.20.61:2379 --listen-metrics-urls=http://127.0.0.1:2381 --listen-peer-urls=https://192.168.20.61:2380 --name=k8s-master --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt --peer-client-cert-auth=true --peer-key-file=/etc/kubernetes/pki/etcd/peer.key --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt --snapshot-count=10000 --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001157" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001157_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.2. Ensure that the --client-cert-auth argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001157_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable client authentication on etcd service." class="subtask_catagory_detail">Enable client authentication on etcd service.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameter.

 
```
--client-cert-auth=\" true\"="" ```"="" class="subtask_catagory_detail">Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameter.<br><br> <br>```<br>--client-cert-auth=\"true\"<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
root     17332 17291  0  2023 ?        05:25:22 etcd --advertise-client-urls=https://192.168.20.61:2379 --cert-file=/etc/kubernetes/pki/etcd/server.crt --client-cert-auth=true --data-dir=/var/lib/etcd --initial-advertise-peer-urls=https://192.168.20.61:2380 --initial-cluster=k8s-master=https://192.168.20.61:2380 --key-file=/etc/kubernetes/pki/etcd/server.key --listen-client-urls=https://127.0.0.1:2379,https://192.168.20.61:2379 --listen-metrics-urls=http://127.0.0.1:2381 --listen-peer-urls=https://192.168.20.61:2380 --name=k8s-master --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt --peer-client-cert-auth=true --peer-key-file=/etc/kubernetes/pki/etcd/peer.key --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt --snapshot-count=10000 --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001154" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001154_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.3. Ensure that the --auto-tls argument is not set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001154_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not use self-signed certificates for TLS." class="subtask_catagory_detail">Do not use self-signed certificates for TLS.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and either remove the `--auto-tls` parameter or set it to `false`.

 
```
--auto-tls=false

```" class="subtask_catagory_detail">Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and either remove the `--auto-tls` parameter or set it to `false`.<br><br> <br>```<br>--auto-tls=false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=k8s-master
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBE_DNS_SERVICE_PORT_DNS_TCP=53
KUBE_DNS_PORT_53_TCP_ADDR=10.96.0.10
KUBE_DNS_PORT_53_UDP_PROTO=udp
KUBE_DNS_PORT_53_UDP_PORT=53
KUBE_DNS_PORT_53_TCP_PORT=53
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBE_DNS_SERVICE_HOST=10.96.0.10
KUBE_DNS_SERVICE_PORT_METRICS=9153
KUBE_DNS_PORT=udp://10.96.0.10:53
KUBE_DNS_PORT_9153_TCP=tcp://10.96.0.10:9153
KUBE_DNS_PORT_9153_TCP_PROTO=tcp
KUBE_DNS_PORT_9153_TCP_PORT=9153
KUBE_DNS_PORT_9153_TCP_ADDR=10.96.0.10
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBE_DNS_SERVICE_PORT=53
KUBE_DNS_PORT_53_UDP=udp://10.96.0.10:53
KUBE_DNS_PORT_53_UDP_ADDR=10.96.0.10
KUBE_DNS_PORT_53_TCP_PROTO=tcp
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT_443_TCP_PORT=443
KUBE_DNS_SERVICE_PORT_DNS=53
KUBE_DNS_PORT_53_TCP=tcp://10.96.0.10:53
SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
HOME=/root</textarea></div></div></div><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001152" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001152_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.4. Ensure that the --peer-cert-file and --peer-key-file arguments are set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001152_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="etcd should be configured to make use of TLS encryption for peer connections." class="subtask_catagory_detail">etcd should be configured to make use of TLS encryption for peer connections.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the etcd service documentation and configure peer TLS encryption as appropriate for your etcd cluster.

 Then, edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameters.

 
```
--peer-client-file=</path/to/peer-cert-file>
--peer-key-file=</path/to/peer-key-file>

```" class="subtask_catagory_detail">Follow the etcd service documentation and configure peer TLS encryption as appropriate for your etcd cluster.<br><br> Then, edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameters.<br><br> <br>```<br>--peer-client-file=&lt;/path/to/peer-cert-file&gt;<br>--peer-key-file=&lt;/path/to/peer-key-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
root     17332 17291  0  2023 ?        05:25:22 etcd --advertise-client-urls=https://192.168.20.61:2379 --cert-file=/etc/kubernetes/pki/etcd/server.crt --client-cert-auth=true --data-dir=/var/lib/etcd --initial-advertise-peer-urls=https://192.168.20.61:2380 --initial-cluster=k8s-master=https://192.168.20.61:2380 --key-file=/etc/kubernetes/pki/etcd/server.key --listen-client-urls=https://127.0.0.1:2379,https://192.168.20.61:2379 --listen-metrics-urls=http://127.0.0.1:2381 --listen-peer-urls=https://192.168.20.61:2380 --name=k8s-master --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt --peer-client-cert-auth=true --peer-key-file=/etc/kubernetes/pki/etcd/peer.key --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt --snapshot-count=10000 --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001150" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001150_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.5. Ensure that the --peer-client-cert-auth argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001150_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="etcd should be configured for peer authentication." class="subtask_catagory_detail">etcd should be configured for peer authentication.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameter.

 
```
--peer-client-cert-auth=true

```" class="subtask_catagory_detail">Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameter.<br><br> <br>```<br>--peer-client-cert-auth=true<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
root     17332 17291  0  2023 ?        05:25:22 etcd --advertise-client-urls=https://192.168.20.61:2379 --cert-file=/etc/kubernetes/pki/etcd/server.crt --client-cert-auth=true --data-dir=/var/lib/etcd --initial-advertise-peer-urls=https://192.168.20.61:2380 --initial-cluster=k8s-master=https://192.168.20.61:2380 --key-file=/etc/kubernetes/pki/etcd/server.key --listen-client-urls=https://127.0.0.1:2379,https://192.168.20.61:2379 --listen-metrics-urls=http://127.0.0.1:2381 --listen-peer-urls=https://192.168.20.61:2380 --name=k8s-master --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt --peer-client-cert-auth=true --peer-key-file=/etc/kubernetes/pki/etcd/peer.key --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt --snapshot-count=10000 --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001164" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001164_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.6. Ensure that the --peer-auto-tls argument is not set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001164_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not use automatically generated self-signed certificates for TLS connections between peers." class="subtask_catagory_detail">Do not use automatically generated self-signed certificates for TLS connections between peers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and either remove the `--peer-auto-tls` parameter or set it to `false`.

 
```
--peer-auto-tls=false

```" class="subtask_catagory_detail">Edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and either remove the `--peer-auto-tls` parameter or set it to `false`.<br><br> <br>```<br>--peer-auto-tls=false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOSTNAME=k8s-master
KUBERNETES_SERVICE_HOST=10.96.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_PORT_443_TCP=tcp://10.96.0.1:443
KUBE_DNS_SERVICE_PORT_DNS_TCP=53
KUBE_DNS_PORT_53_TCP_ADDR=10.96.0.10
KUBE_DNS_PORT_53_UDP_PROTO=udp
KUBE_DNS_PORT_53_UDP_PORT=53
KUBE_DNS_PORT_53_TCP_PORT=53
KUBERNETES_PORT=tcp://10.96.0.1:443
KUBERNETES_PORT_443_TCP_PROTO=tcp
KUBE_DNS_SERVICE_HOST=10.96.0.10
KUBE_DNS_SERVICE_PORT_METRICS=9153
KUBE_DNS_PORT=udp://10.96.0.10:53
KUBE_DNS_PORT_9153_TCP=tcp://10.96.0.10:9153
KUBE_DNS_PORT_9153_TCP_PROTO=tcp
KUBE_DNS_PORT_9153_TCP_PORT=9153
KUBE_DNS_PORT_9153_TCP_ADDR=10.96.0.10
KUBERNETES_PORT_443_TCP_ADDR=10.96.0.1
KUBE_DNS_SERVICE_PORT=53
KUBE_DNS_PORT_53_UDP=udp://10.96.0.10:53
KUBE_DNS_PORT_53_UDP_ADDR=10.96.0.10
KUBE_DNS_PORT_53_TCP_PROTO=tcp
KUBERNETES_SERVICE_PORT_HTTPS=443
KUBERNETES_PORT_443_TCP_PORT=443
KUBE_DNS_SERVICE_PORT_DNS=53
KUBE_DNS_PORT_53_TCP=tcp://10.96.0.10:53
SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
HOME=/root</textarea></div></div></div><div id="rowSubtask_b07ae596-8bcc-43f2-9004-06a6a97be814_1001162" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001162_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-2.7. Ensure that a unique Certificate Authority is used for etcd (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b07ae596-8bcc-43f2-9004-06a6a97be814_1001162_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Use a different certificate authority for etcd from the one used for Kubernetes." class="subtask_catagory_detail">Use a different certificate authority for etcd from the one used for Kubernetes.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Follow the etcd documentation and create a dedicated certificate authority setup for the etcd service.

 Then, edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameter.

 
```
--trusted-ca-file=</path/to/ca-file>

```" class="subtask_catagory_detail">Follow the etcd documentation and create a dedicated certificate authority setup for the etcd service.<br><br> Then, edit the etcd pod specification file `/etc/kubernetes/manifests/etcd.yaml` on the master node and set the below parameter.<br><br> <br>```<br>--trusted-ca-file=&lt;/path/to/ca-file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -ef | /bin/grep etcd | /bin/grep -v grep
root     17332 17291  0  2023 ?        05:25:22 etcd --advertise-client-urls=https://192.168.20.61:2379 --cert-file=/etc/kubernetes/pki/etcd/server.crt --client-cert-auth=true --data-dir=/var/lib/etcd --initial-advertise-peer-urls=https://192.168.20.61:2380 --initial-cluster=k8s-master=https://192.168.20.61:2380 --key-file=/etc/kubernetes/pki/etcd/server.key --listen-client-urls=https://127.0.0.1:2379,https://192.168.20.61:2379 --listen-metrics-urls=http://127.0.0.1:2381 --listen-peer-urls=https://192.168.20.61:2380 --name=k8s-master --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt --peer-client-cert-auth=true --peer-key-file=/etc/kubernetes/pki/etcd/peer.key --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt --snapshot-count=10000 --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div></td></tr><tr id="rowTaskTr_4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc" role="row" class="even"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">0</div>	<div class="failed_cnt_box">0</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">2</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Logging" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Logging</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc</td><td style="display: none;">etc</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc" data-onoff="4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_1001198" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_1001198_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-3.2.1. Ensure that a minimal audit policy is created (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[WARN]</div></div><div class="subtask_detail" data-onoff="4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_1001198_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">WARN</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Kubernetes can audit the details of requests made to the API server. The `--audit-policy-file` flag must be set for this logging to be enabled." class="subtask_catagory_detail">Kubernetes can audit the details of requests made to the API server. The `--audit-policy-file` flag must be set for this logging to be enabled.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Create an audit policy file for your cluster." class="subtask_catagory_detail">Create an audit policy file for your cluster.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -ef | grep kube-apiserver | grep -v grep
root     17622 17599  3  2023 ?        20:36:53 kube-apiserver --advertise-address=192.168.20.61 --allow-privileged=true --authorization-mode=Node,RBAC --client-ca-file=/etc/kubernetes/pki/ca.crt --enable-admission-plugins=NodeRestriction --enable-bootstrap-token-auth=true --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key --etcd-servers=https://127.0.0.1:2379 --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key --requestheader-allowed-names=front-proxy-client --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt --requestheader-extra-headers-prefix=X-Remote-Extra- --requestheader-group-headers=X-Remote-Group --requestheader-username-headers=X-Remote-User --secure-port=6443 --service-account-issuer=https://kubernetes.default.svc.cluster.local --service-account-key-file=/etc/kubernetes/pki/sa.pub --service-account-signing-key-file=/etc/kubernetes/pki/sa.key --service-cluster-ip-range=10.96.0.0/12 --tls-cert-file=/etc/kubernetes/pki/apiserver.crt --tls-private-key-file=/etc/kubernetes/pki/apiserver.key</textarea></div></div></div><div id="rowSubtask_4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_1001201" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_1001201_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-3.2.2. Ensure that the audit policy covers key security concerns (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="4d22c8ab-9419-4dd8-afc0-2a2fd1422cfc_1001201_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the audit policy created for the cluster covers key security concerns." class="subtask_catagory_detail">Ensure that the audit policy created for the cluster covers key security concerns.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Consider modification of the audit policy in use on the cluster to include these items, at a minimum." class="subtask_catagory_detail">Consider modification of the audit policy in use on the cluster to include these items, at a minimum.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
</textarea></div></div></div></td></tr><tr id="rowTaskTr_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf" role="row" class="odd"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">10</div>	<div class="failed_cnt_box">0</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">0</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Worker Node Configuration Files" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Worker Node Configuration Files</td><td title="This section covers recommendations for configuration files on the worker nodes.
To Perform an Automated Audit utilizing CIS-CAT the following parameters must be set on 
each node being evaluated." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">This section covers recommendations for configuration files on the worker nodes.
To Perform an Automated Audit utilizing CIS-CAT the following parameters must be set on 
each node being evaluated.</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">dd1217b2-feaa-47e3-bbf4-76dc64a04bcf</td><td style="display: none;">passed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001210" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001210_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.1. Ensure that the kubelet service file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001210_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `kubelet` service file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the `kubelet` service file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the each worker node. For example,

 
```
chmod 600 /etc/systemd/system/kubelet.service.d/kubeadm.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the each worker node. For example,<br><br> <br>```<br>chmod 600 /etc/systemd/system/kubelet.service.d/kubeadm.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /lib/systemd/system/kubelet.service; then stat -c permissions=%a /lib/systemd/system/kubelet.service; fi'
permissions=644 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /lib/systemd/system/kubelet.service; then stat -c permissions=%a /lib/systemd/system/kubelet.service; fi'
permissions=644</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001208" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001208_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.2. Ensure that the kubelet service file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001208_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `kubelet` service file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the `kubelet` service file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the each worker node. For example,

 
```
chown root:root /etc/systemd/system/kubelet.service.d/kubeadm.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the each worker node. For example,<br><br> <br>```<br>chown root:root /etc/systemd/system/kubelet.service.d/kubeadm.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /lib/systemd/system/kubelet.service; then stat -c %U:%G /lib/systemd/system/kubelet.service; fi'
root:root 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /lib/systemd/system/kubelet.service; then stat -c %U:%G /lib/systemd/system/kubelet.service; fi'
root:root</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001206" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001206_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.3. If proxy kubeconfig file exists ensure permissions are set to 644 or more restrictive (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001206_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="If `kube-proxy` is running, and if it is using a file-based kubeconfig file, ensure that the proxy kubeconfig file has permissions of `600` or more restrictive." class="subtask_catagory_detail">If `kube-proxy` is running, and if it is using a file-based kubeconfig file, ensure that the proxy kubeconfig file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the each worker node. For example,

 
```
chmod 600 <proxy kubeconfig file>

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the each worker node. For example,<br><br> <br>```<br>chmod 600 &lt;proxy kubeconfig file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/proxy.conf; then stat -c permissions=%a /etc/kubernetes/proxy.conf; fi'
 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /etc/kubernetes/proxy.conf; then stat -c permissions=%a /etc/kubernetes/proxy.conf; fi'
</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001204" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001204_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.4. If proxy kubeconfig file exists ensure ownership is set to root:root (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001204_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="If `kube-proxy` is running, ensure that the file ownership of its kubeconfig file is set to `root:root`." class="subtask_catagory_detail">If `kube-proxy` is running, ensure that the file ownership of its kubeconfig file is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the each worker node. For example,

 
```
chown root:root <proxy kubeconfig file>

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the each worker node. For example,<br><br> <br>```<br>chown root:root &lt;proxy kubeconfig file&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/proxy.conf; then stat -c %U:%G /etc/kubernetes/proxy.conf; fi'
 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /etc/kubernetes/proxy.conf; then stat -c %U:%G /etc/kubernetes/proxy.conf; fi'
</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001202" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001202_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.5. Ensure that the --kubeconfig kubelet.conf file permissions are set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001202_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `kubelet.conf` file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the `kubelet.conf` file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the each worker node. For example,

 
```
chmod 600 /etc/kubernetes/kubelet.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the each worker node. For example,<br><br> <br>```<br>chmod 600 /etc/kubernetes/kubelet.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/kubelet.conf; then stat -c permissions=%a /etc/kubernetes/kubelet.conf; fi'
permissions=600 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /etc/kubernetes/kubelet.conf; then stat -c permissions=%a /etc/kubernetes/kubelet.conf; fi'
permissions=600</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001199" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001199_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.6. Ensure that the --kubeconfig kubelet.conf file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001199_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the `kubelet.conf` file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the `kubelet.conf` file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the below command (based on the file location on your system) on the each worker node. For example,

 
```
chown root:root /etc/kubernetes/kubelet.conf

```" class="subtask_catagory_detail">Run the below command (based on the file location on your system) on the each worker node. For example,<br><br> <br>```<br>chown root:root /etc/kubernetes/kubelet.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /etc/kubernetes/kubelet.conf; then stat -c %U:%G /etc/kubernetes/kubelet.conf; fi'
root:root 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /etc/kubernetes/kubelet.conf; then stat -c %U:%G /etc/kubernetes/kubelet.conf; fi'
root:root</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001196" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001196_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.7. Ensure that the certificate authorities file permissions are set to 644 or more restrictive (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001196_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the certificate authorities file has permissions of `600` or more restrictive." class="subtask_catagory_detail">Ensure that the certificate authorities file has permissions of `600` or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the following command to modify the file permissions of the `--client-ca-file`

 
```
chmod 600 <filename>

```" class="subtask_catagory_detail">Run the following command to modify the file permissions of the `--client-ca-file`<br><br> <br>```<br>chmod 600 &lt;filename&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]CAFILE=$(ps -ef | grep kubelet | grep -v apiserver | grep -- --client-ca-file= | awk -F '--client-ca-file=' '{print $2}' | awk '{print $1}')
if test -z $CAFILE; then CAFILE=/etc/kubernetes/pki/ca.crt; fi
if test -e $CAFILE; then stat -c permissions=%a $CAFILE; fi
permissions=644 
passed: [k8s-worker(192.168.20.63)]CAFILE=$(ps -ef | grep kubelet | grep -v apiserver | grep -- --client-ca-file= | awk -F '--client-ca-file=' '{print $2}' | awk '{print $1}')
if test -z $CAFILE; then CAFILE=/etc/kubernetes/pki/ca.crt; fi
if test -e $CAFILE; then stat -c permissions=%a $CAFILE; fi
permissions=644</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001194" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001194_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.8. Ensure that the client certificate authorities file ownership is set to root:root (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001194_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the certificate authorities file ownership is set to `root:root`." class="subtask_catagory_detail">Ensure that the certificate authorities file ownership is set to `root:root`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the following command to modify the ownership of the `--client-ca-file`.

 
```
chown root:root <filename>

```" class="subtask_catagory_detail">Run the following command to modify the ownership of the `--client-ca-file`.<br><br> <br>```<br>chown root:root &lt;filename&gt;<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]CAFILE=$(ps -ef | grep kubelet | grep -v apiserver | grep -- --client-ca-file= | awk -F '--client-ca-file=' '{print $2}' | awk '{print $1}')
if test -z $CAFILE; then CAFILE=/etc/kubernetes/pki/ca.crt; fi
if test -e $CAFILE; then stat -c %U:%G $CAFILE; fi
root:root 
passed: [k8s-worker(192.168.20.63)]CAFILE=$(ps -ef | grep kubelet | grep -v apiserver | grep -- --client-ca-file= | awk -F '--client-ca-file=' '{print $2}' | awk '{print $1}')
if test -z $CAFILE; then CAFILE=/etc/kubernetes/pki/ca.crt; fi
if test -e $CAFILE; then stat -c %U:%G $CAFILE; fi
root:root</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001212" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001212_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.9. Ensure that the kubelet --config configuration file has permissions set to 644 or more restrictive (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001212_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that if the kubelet refers to a configuration file with the `--config` argument, that file has permissions of 600 or more restrictive." class="subtask_catagory_detail">Ensure that if the kubelet refers to a configuration file with the `--config` argument, that file has permissions of 600 or more restrictive.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the following command (using the config file location identied in the Audit step)

 
```
chmod 600 /var/lib/kubelet/config.yaml

```" class="subtask_catagory_detail">Run the following command (using the config file location identied in the Audit step)<br><br> <br>```<br>chmod 600 /var/lib/kubelet/config.yaml<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /var/lib/kubelet/config.yaml; then stat -c permissions=%a /var/lib/kubelet/config.yaml; fi'
permissions=644 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /var/lib/kubelet/config.yaml; then stat -c permissions=%a /var/lib/kubelet/config.yaml; fi'
permissions=644</textarea></div></div></div><div id="rowSubtask_dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001155" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001155_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.1.10. Ensure that the kubelet --config configuration file ownership is set to root:root (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="dd1217b2-feaa-47e3-bbf4-76dc64a04bcf_1001155_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that if the kubelet refers to a configuration file with the `--config` argument, that file is owned by root:root." class="subtask_catagory_detail">Ensure that if the kubelet refers to a configuration file with the `--config` argument, that file is owned by root:root.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Run the following command (using the config file location identied in the Audit step)

 
```
chown root:root /etc/kubernetes/kubelet.conf

```" class="subtask_catagory_detail">Run the following command (using the config file location identied in the Audit step)<br><br> <br>```<br>chown root:root /etc/kubernetes/kubelet.conf<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/sh -c 'if test -e /var/lib/kubelet/config.yaml; then stat -c %U:%G /var/lib/kubelet/config.yaml; fi'
root:root 
passed: [k8s-worker(192.168.20.63)]/bin/sh -c 'if test -e /var/lib/kubelet/config.yaml; then stat -c %U:%G /var/lib/kubelet/config.yaml; fi'
root:root</textarea></div></div></div></td></tr><tr id="rowTaskTr_b3ba5022-0f44-4b96-8734-e5a985e86ddf" role="row" class="even"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">9</div>	<div class="failed_cnt_box">1</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">3</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Kubelet" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Kubelet</td><td title="This section contains recommendations for kubelet configuration.
Kubelet settings may be configured using arguments on the running kubelet executable, or 
they may be taken from a Kubelet config file. If both are specified, the executable argument 
takes precedence." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">This section contains recommendations for kubelet configuration.
Kubelet settings may be configured using arguments on the running kubelet executable, or 
they may be taken from a Kubelet config file. If both are specified, the executable argument 
takes precedence.</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">b3ba5022-0f44-4b96-8734-e5a985e86ddf</td><td style="display: none;">failed</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_b3ba5022-0f44-4b96-8734-e5a985e86ddf" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001122" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001122_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.1. Ensure that the --anonymous-auth argument is set to false (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001122_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Disable anonymous requests to the Kubelet server." class="subtask_catagory_detail">Disable anonymous requests to the Kubelet server.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `authentication: anonymous: enabled` to `false`.

 If using executable arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.

 
```
--anonymous-auth=false

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `authentication: anonymous: enabled` to `false`.<br><br> If using executable arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> <br>```<br>--anonymous-auth=false<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001120" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001120_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.2. Ensure that the --authorization-mode argument is not set to AlwaysAllow (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001120_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not allow all requests. Enable explicit authorization." class="subtask_catagory_detail">Do not allow all requests. Enable explicit authorization.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `authorization: mode` to `Webhook`.

 If using executable arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_AUTHZ_ARGS` variable.

 
```
--authorization-mode=Webhook

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `authorization: mode` to `Webhook`.<br><br> If using executable arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_AUTHZ_ARGS` variable.<br><br> <br>```<br>--authorization-mode=Webhook<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001117" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001117_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.3. Ensure that the --client-ca-file argument is set as appropriate (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001117_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable Kubelet authentication using certificates." class="subtask_catagory_detail">Enable Kubelet authentication using certificates.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `authentication: x509: clientCAFile` to the location of the client CA file.

 If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_AUTHZ_ARGS` variable.

 
```
--client-ca-file=<path/to/client-ca-file>

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `authentication: x509: clientCAFile` to the location of the client CA file.<br><br> If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_AUTHZ_ARGS` variable.<br><br> <br>```<br>--client-ca-file=&lt;path/to/client-ca-file&gt;<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001116" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001116_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.4. Ensure that the --read-only-port argument is set to 0 (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001116_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Disable the read-only port." class="subtask_catagory_detail">Disable the read-only port.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `readOnlyPort` to `0`.

 If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.

 
```
--read-only-port=0

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `readOnlyPort` to `0`.<br><br> If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> <br>```<br>--read-only-port=0<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001119" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001119_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.5. Ensure that the --streaming-connection-idle-timeout argument is not set to 0 (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001119_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not disable timeouts on streaming connections." class="subtask_catagory_detail">Do not disable timeouts on streaming connections.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `streamingConnectionIdleTimeout` to a value other than 0.

 If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.

 
```
--streaming-connection-idle-timeout=5m

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `streamingConnectionIdleTimeout` to a value other than 0.<br><br> If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> <br>```<br>--streaming-connection-idle-timeout=5m<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001118" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001118_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.6. Ensure that the --protect-kernel-defaults argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#B93C3C">[failed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001118_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#B93C3C">failed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Protect tuned kernel parameters from overriding kubelet default kernel parameter values." class="subtask_catagory_detail">Protect tuned kernel parameters from overriding kubelet default kernel parameter values.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `protectKernelDefaults: true`.

 If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.

 
```
--protect-kernel-defaults=true

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `protectKernelDefaults: true`.<br><br> If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> <br>```<br>--protect-kernel-defaults=true<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">failed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
failed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001114" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001114_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.7. Ensure that the --make-iptables-util-chains argument is set to true (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001114_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Allow Kubelet to manage iptables." class="subtask_catagory_detail">Allow Kubelet to manage iptables.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `makeIPTablesUtilChains: true`.

 If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and remove the `--make-iptables-util-chains` argument from the `KUBELET_SYSTEM_PODS_ARGS` variable.

 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `makeIPTablesUtilChains: true`.<br><br> If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and remove the `--make-iptables-util-chains` argument from the `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001113" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001113_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.8. Ensure that the --hostname-override argument is not set (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001113_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not override node hostnames." class="subtask_catagory_detail">Do not override node hostnames.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the kubelet service file `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` on each worker node and remove the `--hostname-override` argument from the `KUBELET_SYSTEM_PODS_ARGS` variable.

 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">Edit the kubelet service file `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` on each worker node and remove the `--hostname-override` argument from the `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
UID        PID  PPID  C STIME TTY          TIME CMD
root      5021     1  1  2023 ?        12:37:23 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --network-plugin=cni --pod-infra-container-image=k8s.gcr.io/pause:3.5 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
UID        PID  PPID  C STIME TTY          TIME CMD
root      5564     1  1  2023 ?        5-05:14:23 /usr/bin/kubelet --bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf --config=/var/lib/kubelet/config.yaml --network-plugin=cni --pod-infra-container-image=k8s.gcr.io/pause:3.5</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001115" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001115_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.9. Ensure that the --event-qps argument is set to 0 or a level which ensures appropriate event capture (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001115_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Security relevant information should be captured. The `--event-qps` flag on the Kubelet can be used to limit the rate at which events are gathered. Setting this too low could result in relevant events not being logged, however the unlimited setting of `0` could result in a denial of service on the kubelet." class="subtask_catagory_detail">Security relevant information should be captured. The `--event-qps` flag on the Kubelet can be used to limit the rate at which events are gathered. Setting this too low could result in relevant events not being logged, however the unlimited setting of `0` could result in a denial of service on the kubelet.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `eventRecordQPS:` to an appropriate level.

 If using command line arguments, edit the kubelet service file `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.

 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `eventRecordQPS:` to an appropriate level.<br><br> If using command line arguments, edit the kubelet service file `/etc/systemd/system/kubelet.service.d/10-kubeadm.conf` on each worker node and set the below parameter in `KUBELET_SYSTEM_PODS_ARGS` variable.<br><br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
WARN: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001192" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001192_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.10. Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001192_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Setup TLS connection on the Kubelets." class="subtask_catagory_detail">Setup TLS connection on the Kubelets.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set tlsCertFile to the location of the certificate file to use to identify this Kubelet, and tlsPrivateKeyFile to the location of the corresponding private key file.

 If using command line arguments, edit the kubelet service file /etc/kubernetes/kubelet.conf on each worker node and set the below parameters in KUBELET\\_CERTIFICATE\\_ARGS variable.

 --tls-cert-file=<path/to/tls-certificate-file> --tls-private-key-file=<path/to/tls-key-file>
Based on your system, restart the kubelet service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set tlsCertFile to the location of the certificate file to use to identify this Kubelet, and tlsPrivateKeyFile to the location of the corresponding private key file.<br><br> If using command line arguments, edit the kubelet service file /etc/kubernetes/kubelet.conf on each worker node and set the below parameters in KUBELET\\_CERTIFICATE\\_ARGS variable.<br><br> --tls-cert-file=&lt;path/to/tls-certificate-file&gt; --tls-private-key-file=&lt;path/to/tls-key-file&gt;<br>Based on your system, restart the kubelet service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
WARN: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001191" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001191_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.11. Ensure that the --rotate-certificates argument is not set to false (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001191_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable kubelet client certificate rotation." class="subtask_catagory_detail">Enable kubelet client certificate rotation.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to add the line `rotateCertificates: true` or remove it altogether to use the default value.

 If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and remove `--rotate-certificates=false` argument from the `KUBELET_CERTIFICATE_ARGS` variable.

 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to add the line `rotateCertificates: true` or remove it altogether to use the default value.<br><br> If using command line arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and remove `--rotate-certificates=false` argument from the `KUBELET_CERTIFICATE_ARGS` variable.<br><br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001184" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001184_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.12. Verify that the RotateKubeletServerCertificate argument is set to true (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:#4E66DC">[passed]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001184_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:#4E66DC">passed</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Enable kubelet server certificate rotation." class="subtask_catagory_detail">Enable kubelet server certificate rotation.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_CERTIFICATE_ARGS` variable.

 
```
--feature-gates=RotateKubeletServerCertificate=true

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">Edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the below parameter in `KUBELET_CERTIFICATE_ARGS` variable.<br><br> <br>```<br>--feature-gates=RotateKubeletServerCertificate=true<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">passed: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
passed: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div><div id="rowSubtask_b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001183" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001183_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-4.2.13. Ensure that the Kubelet only makes use of Strong Cryptographic Ciphers (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="b3ba5022-0f44-4b96-8734-e5a985e86ddf_1001183_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Ensure that the Kubelet is configured to only use strong cryptographic ciphers." class="subtask_catagory_detail">Ensure that the Kubelet is configured to only use strong cryptographic ciphers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="If using a Kubelet config file, edit the file to set `TLSCipherSuites:` to `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256` or to a subset of these values.

 If using executable arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the `--tls-cipher-suites` parameter as follows, or to a subset of these values.

 
```
 --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256

```
 Based on your system, restart the `kubelet` service. For example:

 
```
systemctl daemon-reload
systemctl restart kubelet.service

```" class="subtask_catagory_detail">If using a Kubelet config file, edit the file to set `TLSCipherSuites:` to `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256` or to a subset of these values.<br><br> If using executable arguments, edit the kubelet service file `/etc/kubernetes/kubelet.conf` on each worker node and set the `--tls-cipher-suites` parameter as follows, or to a subset of these values.<br><br> <br>```<br> --tls-cipher-suites=TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_AES_128_GCM_SHA256<br><br>```<br> Based on your system, restart the `kubelet` service. For example:<br><br> <br>```<br>systemctl daemon-reload<br>systemctl restart kubelet.service<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">WARN: [k8s-master(192.168.20.61)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s 
WARN: [k8s-worker(192.168.20.63)]/bin/ps -fC kubelet
apiVersion: kubelet.config.k8s.io/v1beta1
authentication:
  anonymous:
    enabled: false
  webhook:
    cacheTTL: 0s
    enabled: true
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
authorization:
  mode: Webhook
  webhook:
    cacheAuthorizedTTL: 0s
    cacheUnauthorizedTTL: 0s
cgroupDriver: systemd
clusterDNS:
- 10.96.0.10
clusterDomain: cluster.local
cpuManagerReconcilePeriod: 0s
evictionPressureTransitionPeriod: 0s
fileCheckFrequency: 0s
healthzBindAddress: 127.0.0.1
healthzPort: 10248
httpCheckFrequency: 0s
imageMinimumGCAge: 0s
kind: KubeletConfiguration
logging: {}
memorySwap: {}
nodeStatusReportFrequency: 0s
nodeStatusUpdateFrequency: 0s
rotateCertificates: true
runtimeRequestTimeout: 0s
shutdownGracePeriod: 0s
shutdownGracePeriodCriticalPods: 0s
staticPodPath: /etc/kubernetes/manifests
streamingConnectionIdleTimeout: 0s
syncFrequency: 0s
volumeStatsAggPeriod: 0s</textarea></div></div></div></td></tr><tr id="rowTaskTr_929b8235-58e6-4bc7-8541-8d97604bbc64" role="row" class="odd"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">0</div>	<div class="failed_cnt_box">0</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">7</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="RBAC and Service Accounts" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">RBAC and Service Accounts</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">929b8235-58e6-4bc7-8541-8d97604bbc64</td><td style="display: none;">etc</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_929b8235-58e6-4bc7-8541-8d97604bbc64" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001170" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001170_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.1. Ensure that the cluster-admin role is only used where required (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001170_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="The RBAC role `cluster-admin` provides wide-ranging powers over the environment and should be used only where and when needed." class="subtask_catagory_detail">The RBAC role `cluster-admin` provides wide-ranging powers over the environment and should be used only where and when needed.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Identify all clusterrolebindings to the cluster-admin role. Check if they are used and if they need this role or if they could use a role with fewer privileges.

 Where possible, first bind users to a lower privileged role and then remove the clusterrolebinding to the cluster-admin role :

 
```
kubectl delete clusterrolebinding [name]

```" class="subtask_catagory_detail">Identify all clusterrolebindings to the cluster-admin role. Check if they are used and if they need this role or if they could use a role with fewer privileges.<br><br> Where possible, first bind users to a lower privileged role and then remove the clusterrolebinding to the cluster-admin role :<br><br> <br>```<br>kubectl delete clusterrolebinding [name]<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001171" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001171_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.2. Minimize access to secrets (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001171_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="The Kubernetes API stores secrets, which may be service account tokens for the Kubernetes API or credentials used by workloads in the cluster. Access to these secrets should be restricted to the smallest possible group of users to reduce the risk of privilege escalation." class="subtask_catagory_detail">The Kubernetes API stores secrets, which may be service account tokens for the Kubernetes API or credentials used by workloads in the cluster. Access to these secrets should be restricted to the smallest possible group of users to reduce the risk of privilege escalation.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Where possible, remove `get`, `list` and `watch` access to `secret` objects in the cluster." class="subtask_catagory_detail">Where possible, remove `get`, `list` and `watch` access to `secret` objects in the cluster.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001172" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001172_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.3. Minimize wildcard use in Roles and ClusterRoles (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001172_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Kubernetes Roles and ClusterRoles provide access to resources based on sets of objects and actions that can be taken on those objects. It is possible to set either of these to be the wildcard \" \\*\"="" which="" matches="" all="" items.="" use="" of="" wildcards="" is="" not="" optimal="" from="" a="" security="" perspective="" as="" it="" may="" allow="" for="" inadvertent="" access="" to="" be="" granted="" when="" new="" resources="" are="" added="" the="" kubernetes="" api="" either="" crds="" or="" in="" later="" versions="" product."="" class="subtask_catagory_detail">Kubernetes Roles and ClusterRoles provide access to resources based on sets of objects and actions that can be taken on those objects. It is possible to set either of these to be the wildcard \"\\*\" which matches all items.<br><br> Use of wildcards is not optimal from a security perspective as it may allow for inadvertent access to be granted when new resources are added to the Kubernetes API either as CRDs or in later versions of the product.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Where possible replace any use of wildcards in clusterroles and roles with specific objects or actions." class="subtask_catagory_detail">Where possible replace any use of wildcards in clusterroles and roles with specific objects or actions.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001188" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001188_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.4. Minimize access to create pods (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001188_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="The ability to create pods in a namespace can provide a number of opportunities for privilege escalation, such as assigning privileged service accounts to these pods or mounting hostPaths with access to sensitive data (unless Pod Security Policies are implemented to restrict this access)

 As such, access to create new pods should be restricted to the smallest possible group of users." class="subtask_catagory_detail">The ability to create pods in a namespace can provide a number of opportunities for privilege escalation, such as assigning privileged service accounts to these pods or mounting hostPaths with access to sensitive data (unless Pod Security Policies are implemented to restrict this access)<br><br> As such, access to create new pods should be restricted to the smallest possible group of users.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Where possible, remove `create` access to `pod` objects in the cluster." class="subtask_catagory_detail">Where possible, remove `create` access to `pod` objects in the cluster.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001189" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001189_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.5. Ensure that default service accounts are not actively used. (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001189_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="The `default` service account should not be used to ensure that rights granted to applications can be more easily audited and reviewed." class="subtask_catagory_detail">The `default` service account should not be used to ensure that rights granted to applications can be more easily audited and reviewed.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Create explicit service accounts wherever a Kubernetes workload requires specific access to the Kubernetes API server.

 Modify the configuration of each default service account to include this value

 
```
automountServiceAccountToken: false

```" class="subtask_catagory_detail">Create explicit service accounts wherever a Kubernetes workload requires specific access to the Kubernetes API server.<br><br> Modify the configuration of each default service account to include this value<br><br> <br>```<br>automountServiceAccountToken: false<br><br>```</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001190" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001190_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.6. Ensure that Service Account Tokens are only mounted where necessary (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001190_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Service accounts tokens should not be mounted in pods except where the workload running in the pod explicitly needs to communicate with the API server" class="subtask_catagory_detail">Service accounts tokens should not be mounted in pods except where the workload running in the pod explicitly needs to communicate with the API server</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Modify the definition of pods and service accounts which do not need to mount service account tokens to disable it." class="subtask_catagory_detail">Modify the definition of pods and service accounts which do not need to mount service account tokens to disable it.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_929b8235-58e6-4bc7-8541-8d97604bbc64_1001187" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001187_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.1.8. Limit use of the Bind, Impersonate and Escalate permissions in the Kubernetes cluster (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="929b8235-58e6-4bc7-8541-8d97604bbc64_1001187_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Cluster roles and roles with the impersonate, bind or escalate permissions should not be granted unless strictly required. Each of these permissions allow a particular subject to escalate their privileges beyond those explicitly granted by cluster administrators" class="subtask_catagory_detail">Cluster roles and roles with the impersonate, bind or escalate permissions should not be granted unless strictly required. Each of these permissions allow a particular subject to escalate their privileges beyond those explicitly granted by cluster administrators</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Where possible, remove the impersonate, bind and escalate rights from subjects." class="subtask_catagory_detail">Where possible, remove the impersonate, bind and escalate rights from subjects.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div></td></tr><tr id="rowTaskTr_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f" role="row" class="even"><td style="display: flex; align-items: center; justify-content: center;"><div class="view_hide_btn_icon" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_task" onclick="onoffDisplay(this)"></div></td><td><div class="result_cnt_box">	<div class="passed_cnt_box">0</div>	<div class="failed_cnt_box">0</div>	<div class="error_cnt_box">0</div>	<div class="etc_cnt_box">13</div></div></td><td title="CIS Kubernetes Benchmark" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">CIS Kubernetes Benchmark</td><td title="Pod Security Standards" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Pod Security Standards</td><td title="Pod Security Standards (PSS) are recommendations for securing deployed workloads to 
reduce the risks of container breakout. There are a number of ways if implementing PSS, 
including the in-tre Pod Security Admission controller, or external policy control systems 
which integrate with Kubernetes via validating and mutating webhooks." style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Pod Security Standards (PSS) are recommendations for securing deployed workloads to 
reduce the risks of container breakout. There are a number of ways if implementing PSS, 
including the in-tre Pod Security Admission controller, or external policy control systems 
which integrate with Kubernetes via validating and mutating webhooks.</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="-" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</td><td title="2024-01-17 11:54:36" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">2024-01-17 11:54:36</td><td style="display: none;">bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f</td><td style="display: none;">etc</td><td style="display: none;">4</td></tr><tr id="rowSubtaskTr_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_task" data-scanner="undefined" class="subtask_bundle" style="display: none">	<td colspan="8"><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001169" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001169_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.1. Ensure that the cluster has at least one active policy control mechanism in place (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001169_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Every Kubernetes cluster should have at least one policy control mechanism in place to enforce the other requirements in this section. This could be the in-built Pod Security Admission controller, or a third party policy control system." class="subtask_catagory_detail">Every Kubernetes cluster should have at least one policy control mechanism in place to enforce the other requirements in this section. This could be the in-built Pod Security Admission controller, or a third party policy control system.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Ensure that either Pod Security Admission or an external policy control system is in place for every namespace which contains user workloads." class="subtask_catagory_detail">Ensure that either Pod Security Admission or an external policy control system is in place for every namespace which contains user workloads.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001176" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001176_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.2. Minimize the admission of privileged containers (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001176_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers to be run with the `securityContext.privileged` flag set to `true`." class="subtask_catagory_detail">Do not generally permit containers to be run with the `securityContext.privileged` flag set to `true`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of privileged containers." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of privileged containers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001175" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001175_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.3. Minimize the admission of containers wishing to share the host process ID namespace (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001175_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers to be run with the `hostPID` flag set to true." class="subtask_catagory_detail">Do not generally permit containers to be run with the `hostPID` flag set to true.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostPID` containers." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostPID` containers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001174" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001174_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.4. Minimize the admission of containers wishing to share the host IPC namespace (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001174_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers to be run with the `hostIPC` flag set to true." class="subtask_catagory_detail">Do not generally permit containers to be run with the `hostIPC` flag set to true.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostIPC` containers." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostIPC` containers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001173" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001173_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.5. Minimize the admission of containers wishing to share the host network namespace (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001173_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers to be run with the `hostNetwork` flag set to true." class="subtask_catagory_detail">Do not generally permit containers to be run with the `hostNetwork` flag set to true.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostNetwork` containers." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostNetwork` containers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001180" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001180_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.6. Minimize the admission of containers with allowPrivilegeEscalation (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001180_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers to be run with the `allowPrivilegeEscalation` flag set to true. Allowing this right can lead to a process running a container getting more rights than it started with.

 It's important to note that these rights are still constrained by the overall container sandbox, and this setting does not relate to the use of privileged containers." class="subtask_catagory_detail">Do not generally permit containers to be run with the `allowPrivilegeEscalation` flag set to true. Allowing this right can lead to a process running a container getting more rights than it started with.<br><br> It's important to note that these rights are still constrained by the overall container sandbox, and this setting does not relate to the use of privileged containers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of conatiners with `.spec.allowPrivilegeEscalation`set to `true`." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of conatiners with `.spec.allowPrivilegeEscalation`set to `true`.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001179" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001179_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.7. Minimize the admission of root containers (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001179_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers to be run as the root user." class="subtask_catagory_detail">Do not generally permit containers to be run as the root user.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Create a policy for each namespace in the cluster, ensuring that either `MustRunAsNonRoot` or `MustRunAs` with the range of UIDs not including 0, is set." class="subtask_catagory_detail">Create a policy for each namespace in the cluster, ensuring that either `MustRunAsNonRoot` or `MustRunAs` with the range of UIDs not including 0, is set.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001178" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001178_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.8. Minimize the admission of containers with the NET_RAW capability (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001178_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers with the potentially dangerous NET\\_RAW capability." class="subtask_catagory_detail">Do not generally permit containers with the potentially dangerous NET\\_RAW capability.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of containers with the `NET_RAW` capability." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of containers with the `NET_RAW` capability.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001177" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001177_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.9. Minimize the admission of containers with added capabilities (Automated)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001177_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers with capabilities assigned beyond the default set." class="subtask_catagory_detail">Do not generally permit containers with capabilities assigned beyond the default set.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Ensure that `allowedCapabilities` is not present in policies for the cluster unless it is set to an empty array." class="subtask_catagory_detail">Ensure that `allowedCapabilities` is not present in policies for the cluster unless it is set to an empty array.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001138" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001138_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.10. Minimize the admission of containers with capabilities assigned (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001138_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers with capabilities" class="subtask_catagory_detail">Do not generally permit containers with capabilities</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Review the use of capabilites in applications runnning on your cluster. Where a namespace contains applicaions which do not require any Linux capabities to operate consider adding a policy which forbids the admission of containers which do not drop all capabilities." class="subtask_catagory_detail">Review the use of capabilites in applications runnning on your cluster. Where a namespace contains applicaions which do not require any Linux capabities to operate consider adding a policy which forbids the admission of containers which do not drop all capabilities.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001140" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001140_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.11. Minimize the admission of Windows HostProcess containers (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001140_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit Windows containers to be run with the `hostProcess` flag set to true." class="subtask_catagory_detail">Do not generally permit Windows containers to be run with the `hostProcess` flag set to true.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostProcess` containers." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of `hostProcess` containers.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001142" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001142_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.12. Minimize the admission of HostPath volumes (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001142_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally admit containers which make use of `hostPath` volumes." class="subtask_catagory_detail">Do not generally admit containers which make use of `hostPath` volumes.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of containers which use `hostPath` volumes." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of containers which use `hostPath` volumes.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div><div id="rowSubtask_bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001143" class="row_subtask"><div class="subtask_name">	<div class="subtask_catagory_title">		<div class="view_hide_btn_icon_grey" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001143_subtask" onclick="onoffDisplay(this)"></div>	</div>	<div class="subtask_catagory_detail">CIS-5.2.13. Minimize the admission of containers which use HostPorts (Manual)</div><div style="margin-left: 10px; font-weight: bold; color:grey">[excepted]</div></div><div class="subtask_detail" data-onoff="bc5f47b6-0fd5-438b-8849-ab0c98c2fa5f_1001143_subtask" style="display: none"><div class="subtask_catagory">	<div class="subtask_catagory_title">· Result:</div>	<div class="subtask_catagory_detail" style="font-weight: bold; color:grey">excepted</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Description: </div>	<div title="Do not generally permit containers which require the use of HostPorts." class="subtask_catagory_detail">Do not generally permit containers which require the use of HostPorts.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Remediation:</div>	<div title="Add policies to each namespace in the cluster which has user workloads to restrict the admission of containers which use `hostPort` sections." class="subtask_catagory_detail">Add policies to each namespace in the cluster which has user workloads to restrict the admission of containers which use `hostPort` sections.</div></div><div class="subtask_catagory">	<div class="subtask_catagory_title">· Actual value:</div><textarea readonly="" class="textarea-scrollbar scrollbar-outer">excepted: [k8s-master(192.168.20.61)]
 
excepted: [k8s-worker(192.168.20.63)]
</textarea></div></div></div></td></tr></tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="progressbarBox" style="display:block;">			
			<div class="progressbar">	
				<div class="Loading">
					<span data-charge='100'></span>
				</div>
				<p>Scanning..</p>	
			</div>	
		</div>
	</section>
</body>
</html>