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
	<section class="computer_page"><!-- 2024-01-19 : mscrollbar 삭제-->
		<!-- TODO : css 수정, onChange, href function 수정 -->
		<div id="compliance_scan_select_box" class="compliance_box">
			<div class="compliance_title_left">
				<div>
					<div class="sel_box">
						<p class="compliance_title">Cluster</p>
						<select id="clusterList" class="popup_sel"
							onChange = "selectFrameworkList()">
						</select>
					</div>
				</div>
				<div> 
					<div class="sel_box">
						<p class="compliance_title">Framework</p>
						<select id="frameworkList" class="popup_sel">
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
							<p id="totalCount">0</p>
							<p>Totals</p>
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
								</tbody>
							</table>
							<!--s:2024-01-17 위치이동-->
							<div class="progressbarBox" style="display:none">			
								<div class="progressbar">	
									<div class="Loading">
										<span data-charge='100'></span>
									</div>
									<p>Scanning..</p>	
								</div>	
							</div>
							<!--e:2024-01-17 위치이동-->
						</div>
					</div>
				</div>
			</div>
		</div>
		
	</section>
</body>
</html>