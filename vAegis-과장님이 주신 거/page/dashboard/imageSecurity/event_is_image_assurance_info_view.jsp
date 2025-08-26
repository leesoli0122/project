<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>컨테이너 이미지 스캔 현황 상세 - Aegis</title>
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
 	<script src="./js/service/dashboards/imageSecurity/dashboardScanStatus.js?v=${version}"></script>
 	<script src="./js/service/dashboards/imageSecurity/eventImageAssuranceInfo.js?v=${version}"></script>
 	<script src="./js/service/dashboards/imageSecurity/eventDashboardInfo.js?v=${version}"></script> 	
 	
	<script type="text/javascript">
		$(document).ready(function() {
			/* Formatting function for row details - modify as you need */
			$('#event_image_assurance_detail_result_table').DataTable({	
				"autoWidth" : false,
				"paging" : true,
				"pagingType" : "full_numbers",
				"order":[],
				"info": true,
				"language": {
					"info": "다이제스트가 중복인 경우 제일 마지막 태그 기준으로 검색합니다.",
					"infoEmpty": "",
				},  
				"dom": 'rt<"bottom"ip><"clear">',
				"pageLength" : 10,
				"initComplete": function(settings, json) {
		            $('[data-toggle="tooltip"]').tooltip();
				},
				"columnDefs": [{
					"targets": "_all", 
					"createdCell": function(td, cellData, rowData, row, col) {
						$(td).attr('title', cellData); // title 속성에 데이터 추가
						// 스타일 속성 설정
						$(td).css({
							'white-space': 'nowrap',
							'overflow': 'hidden',
							'text-overflow': 'ellipsis'
						}); 
					}
				}],
				 "columns" :[
					{"data":"Type"},
					{"data":"Registry"},
					{"data":"Digest"},
					{"data":"Image Tag"}, 
					{"data":"Request User"},
					{"data":"Result"},
					{"data":"Created Date"},
					{"data":"Finished Date"},
				 ] 
			});
		});
	</script>
</head>
<input type="hidden" id="detail_info_paging" value="">
<body class="win_popup event ">
<input type="hidden" id="detailDataIS" value=""/> 
	<section style="background-color:#161b22;">
		<h4 id="cspInfoTitle">Image Assurance Detail</h4>
		<div class="popup_view_cont">
			<div class="top scan_top">
				<div class="is_info">
					<div class="is_info_box is_scan_count">
						<div style="color:#c8c8c8;" class="totals" onclick="cntClick(this.className)">
							<p id="totalsCnt">0</p>
							<p>Totals</p>
						</div>
						<div style="color:#4655ed;" class="assuranceImage" onclick="cntClick(this.className)">
							<p id="assuranceCnt">0</p>
							<p>Assuranced Images</p>
						</div>
						<div style="color: #bbb" class="unAssurance" onclick="cntClick(this.className)">
							<p id="unAssuranceCnt">0</p>
							<p>Unassuranced Images</p>
						</div>
						<div style="color: grey;" class="etc" onclick="cntClick(this.className)">
							<p id="etcCnt">0</p>
							<p>ETC</p>
						</div>
					</div>
					<div class="is_info_search_box">
						<div class="ipt_box">
							<input class="" type="text" placeholder="Image Tag 키워드를 입력해 주세요" id="searchKeyword" name="searchKeyword">
						</div>
						<a id="imageAssuranceSearchBtn" href="#" class="btn serch" onclick="searchBtnClick()">검색</a>
					</div>
				</div>
			</div>
			<div class="detail">
				<div class="tbl scan_detail_tbl">
					<table id="event_image_assurance_detail_result_table" class="">
						<colgroup>
							<col width="10%">
							<col width="10%">
							<col width="auto">
							<col width="10%">
							<col width="15%">
							<col width="10%">
							<col width="15%">
							<col width="15%">
						</colgroup>
						<thead>
							<tr>
								<th>Type</th>
								<th>Registry</th>
								<th>Digest</th>
								<th>Image Tag</th>
								<th>Request User</th> 
								<th>Result</th>
								<th>Created Date</th>
								<th>Finished Date</th>
							</tr>
						</thead>
						<tbody>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</section>
</body>
</body>
</html>