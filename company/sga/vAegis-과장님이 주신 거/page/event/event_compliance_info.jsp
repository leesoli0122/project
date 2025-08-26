<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<style>
.tab_box {
	float: none !important;
}
.tab_lst .open {
	width: auto !important;
}
.sc_info_box p:first-child {
	font-size: 30px !important; 
}
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
.passed_cnt_box {
	background: #4e66dc;
}
.failed_cnt_box {
	background: #B93C3C;
}
.error_cnt_box {
	background: grey;
}
.sc_info_box div {
	cursor: pointer;
}
.scroll-wrapper.textarea-scrollbar.scrollbar-outer.scroll-textarea {
	width: 100%
}
.error_subtask_message {
	font-weight: 600;
	color: #ddd;
}
.sc_info_box p {
	font-size: 14px !important;
}
.framework_select {
	width: 300px;
	padding-bottom: 26px;
}
</style>
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
	<meta property="og:image" content="Aegis.png">
	<meta property="og:description" content="Aegis 홈페이지입니다.">
	
	<!-- TODO: favicon -->
	<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common.jsp"%>
	
	<script src="./js/common/page_common.js?v=${version}"></script>
	<script defer src="./js/service/event/eventComplianceInfo.js?v=${version}"></script>
	<script>
	var complianceScanTable;

	$(document).ready(function() {
		// DataTable init
		complianceScanTable = $('#event_complianceScan_result_table').DataTable({
			autoWidth : false,
			paging : true,
			pagingType : "full_numbers",
			ordering : true,
			order:[],
			info : false,
			filter : true,
			lengthChange : false,
			columnDefs : [{
				targets : [0, 8],
				orderable : false
			},{
				targets : [ 1, 2, 3, 4, 5, 6, 7, 9],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).attr('title', cellData); // tistle 속성에 데이터 추가
					// 스타일 속성 설정
					$(td).css({
						'white-space' : 'nowrap',
						'overflow' : 'hidden',
						'text-overflow' : 'ellipsis'
					});
				},
			}, {
				targets : [ 10, 11, 12 ], // uuid, result의 데이터 숨기기 위함
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).css({
						'display' : 'none',
					});
				},
			}, {
				targets : [ 0 ],
				createdCell : function(td, cellData, rowData, row, col) {
					$(td).css({
						'display': 'flex',
						'align-items': 'center',
						'justify-content': 'center'
					});
				},
			}, {
				targets : [ 0, 1, 2, 3, 7, 8, 9],
				searchable : false
			},{ 
				targets: [ 7 ], // Severity가 들어가있는 테이블
				orderData:[ 12, 0 ]
			}],
			dom : 'rt<"bottom"ip><"clear">',
			createdRow : function(row, data, dataIndex) {
				$(row).attr('id', 'rowTaskTr_' + data[10]); // 하위 tree를 출력 하기 위한 tr 추가(data[8] = uuid)
			}
		});
	});
	</script>
	
</head>
<body class="win_popup event mscrollbar">
<input type="hidden" id="detailData" value=""/> 
<input type="hidden" id="complianceTaskEventPaging" value=""/>
<input type="hidden" id="resultValue" value=""/>
<input type="hidden" id="searchValue" value=""/>

	<section>
		<h4 id='complianceDetailTitle'>이벤트 상세 > 클러스터 규정 준수 스캔</h4>
		<div class="popup_view_cont">
			<div class="tab_box">
				<div class="tab">
					<ul class="tab_lst">
						<li id="logInfo" value="tabMgmt_1" class="open"><a href="#" id="logInfoInner" class="tab_link">스캔 상세 정보 </a></li>
					</ul>
				</div>
			</div>
			<div class="computer_box"  style="margin-bottom:20px;">
				<div class="sc_info">
					<!-- 현황판 div -->
					<div class="sc_info_box">
						<div style="color:#c8c8c8;" class="total" onclick="scanStatusRefresh(this.className)">
							<p id="totalCount">0</p>
							<p>Total</p>
						</div>
						<div style="color:#4e66dc;" class="passed" onclick="scanStatusRefresh(this.className)">
							<p id="passedCount">0</p>
							<p>Passed</p>
						</div>
						<div style="color: #B93C3C;" class="failed" onclick="scanStatusRefresh(this.className)">
							<p id="failedCount">0</p>
							<p>Failed</p>
						</div>
						<div style="color: #A5A5A5;" class="error" onclick="scanStatusRefresh(this.className)">
							<p id="errorCount">0</p>
							<p>Error</p>
						</div>
						<div style="color: grey;"  class="etc" onclick="scanStatusRefresh(this.className)">
							<p id="etcCount">0</p>
							<p>Etc</p>
						</div>
					</div>
					<div class="sc_info_search_box">
						<div class="ipt_box">
							<input class="" type="text" placeholder="Name, Description, Remidiation 키워드를 입력해 주십시오." id="searchKeyword" name="searchKeyword">
						</div>
						<a id="searchBtn" href="#" class="btn serch">검색</a>
					</div>
				</div>
			</div>
			<div class="computer_box">
				<div id="frameworkSelectBox" class="sel_box framework_select"></div>
				<div class="event_cont" style="min-height: 0px;">
						<div class="tbl">
							<table id="event_complianceScan_result_table" class="">
								<colgroup>
									<col width="5%">
									<col width="10%">
									<col width="7%">
									<col width="10%">
									<col width="10%">
									<col width="12%">
									<col width="12%">
									<col width="10%">
									<col width="12%">
									<col width="12%">
								</colgroup>
								<thead>
									<tr>
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
								</tbody>
							</table>
						</div>
					</div>
			</div>
		</div>
	</section>
</body>

</body>
</html>