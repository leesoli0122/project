<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<title>컨테이너 이미지 스캔 - Aegis</title>
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

	<script src="./js/service/scan/imageScanModal.js?v=${version}"></script>
	<script src="./js/service/scan/imageScan.js?v=${version}"></script>

</head>
<style>
.computer_box{
	padding: 10px 22px;
}

</style>
<body>
	<h1>Aegis ADMIN</h1>
	<div class="skip_navigation">
		<ul>
			<li><a href="#Content" class="go_content">본문 바로가기</a></li>
			<li><a href="#Gnb">메뉴 바로가기</a></li>
		</ul>
	</div>

	<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="imageScan" />
	</jsp:include>

	<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
		<jsp:param name="menuId" value="imageScan" />
	</jsp:include>

	<input type="hidden" id="detailNum" />
	<input type="hidden" id="detailData" />
	<input type="hidden" id="detailJson" value=""></input> 
	
	
	<section class="computer_page mscrollbar">
		<div class="sub">
			<div class="imagescan_box">
				<div class="imagescan_title_left">
					<p class="policy_title">Registry</p>
					<div class="sel_box">
						<select id="registryList" class="popup_sel"
							onChange="lf_serviceCall800401()">
						</select>
					</div>
					<div class="ipt_box">
						<input id="registryPolicyRulename" type="text" value=""
							placeholder="설정된 룰 이름을 표시합니다" class="no_radius" readonly>
					</div>
					<a id="policy_info" href="#" class="btn line"
						rel="registry_policy_info"
						style="border-radius: 4px; min-width: 50px;">...</a>
				</div>

				<div class="imagescan_title_right">
					<a href="javascript:searchRegistryScanStatus();"
						class="btn">Registry 스캔 현황</a><!-- 2024-01-19 :line blue 클래스 삭제-->
				</div>
			</div>
		</div>
		<div id="imageScanBody" class ="sub">
			<!-- 상황판 -->
			<!--s:2024-01-18 비교-->
				<!--비교-->
				<div class="computer_box">
					<div class="sc_info">
						<!-- 현황판 div -->
						<div class="sc_info_box image_scan">
							<div class="total totalCount" onclick="scanStatus(this.className)">
								<p class="total" id="totalCount">0</p>
								<p>Totals</p>
							</div>

							<div class="scannedCount" onclick="scanStatus(this.className)">
								<p
								class="scanned tooltip" id="scannedCount">0</p>
								<span class="tooltiptext">Scanned Image Counts</span>
								<p class="tit">Scanned Images</p>
							</div>

							<div class="scanstatus" style="pointer-events:none;max-width:250px;">
								<div>
									<div class="successCount" onclick="scanStatus(this.className)">
										<p class="success tooltip" id="successCount">0</p>
										<span class="tooltiptext">Scan Success Count</span>	
									</div>
							
									<div class="failCount" onclick="scanStatus(this.className)">
									<p class="fail tooltip" id="failCount">0</p>
									<span class="tooltiptext">Scan Fail Count</span>
									</div>
								</div>
								<p class="tit">Scan Status</p>
							</div>
							<div class="contentCount" onclick="scanStatus(this.className)" >
								<p class="content tooltip" id="contentCount">0</p>
								<span class="tooltiptext">Contents Counts</span>
								<p class="tit">Contents</p>
							</div>
							<div class="cveCount" onclick="scanStatus(this.className)" >
								<p onclick="scanStatus(this.id)" class="cve tooltip" id="cveCount">0</p>
								<span class="tooltiptext">CVE Counts</span>
								<p class="tit">CVE</p>
							</div>
							<div class="malCount" onclick="scanStatus(this.className)">
								<p class="malware tooltip" id="malCount">0</p>
							<span class="tooltiptext">Malware Counts</span>
								<p class="tit">Malware</p>
							</div>
							<div class="sensitiveCount" onclick="scanStatus(this.className)" >
								<p class="sensitive tooltip" id="sensitiveCount">0</p>
								<span class="tooltiptext">sensitive Data Counts</span>
								<p class="tit">Sensitive Datas</p>
							</div>
						</div>
					</div>
				</div>
				<!--비교-->
			<!--e:2024-01-18 비교 끝-->

			<!-- 상황판 -->
			<div id="imageScanCallBox" class="imagescan_box" style="height: 60px; padding: 5px 22px;">
				<!-- <div class="imagescan_title_left">
					<div class="sc_info_search_box">
						<div class="ipt_box">
							<input class="" type="text" placeholder="Image Tag 키워드를 입력해 주십시오." id="searchKeyword" name="searchKeyword">
						</div>
						<a id="searchBtn" href="#" class="btn serch">검색</a>
					</div>
				</div> -->
				<div class="imagescan_title_right">
					<a href="javascript:imageSecurityScan();" class="btn" style="margin-right:10px;">스캔</a> 
					<a href="javascript:imageSecurityEval();" class="btn">설정된 룰기반 재평가</a>
				</div>
			</div>

			<div id="imagescan_result_table" class="computer_box">
				<div class="computer_box_wrap">
					<script type="text/javascript">
						$(document).ready(function() {
							/* Formatting function for row details - modify as you need */
							$('#statusImageScanTable').DataTable({
								"autoWidth" : false,
								"paging" : true,
								"pagingType" : "full_numbers",
								"order":[],
								"info" : false,
								"filter" : true,
								"columnDefs": [{
									"targets": [0],
									"orderable": false
								},{
									"targets": [1,2,3,4,5,6,7,8], 
									"createdCell": function(td, cellData, rowData, row, col) {
										$(td).attr('title', cellData); // title 속성에 데이터 추가
										// 스타일 속성 설정
										$(td).css({
											'white-space': 'nowrap',
											'overflow': 'hidden',
											'text-overflow': 'ellipsis'
										}); 
									}
								},{
									"targets":[1,2,3,6,7,8],
									"searchable":false // imagetag, message 컬럼 외에는 검색대상에서 제외
								}],
								"lengthChange" : true,								
								"language" : {
									"lengthMenu" : '<span>show</span>'
											+ '<div class="sel_box">'
											+ '<select class="table_top">'
											+ '<option value="-1">All</option>'
											+ '<option value="10">10</option>'
											+ '<option value="25">25</option>'
											+ '<option value="50">50</option>'
											+ '<option value="100">100</option>'
											+ '</select>'
											+ '</div>'
											+ '<span>entries</span>',
									"info" : "<span>_PAGE_</span> - _PAGES_ / _MAX_",
								},
								//"dom" : '<"top"lf>rt<"bottom"ip><"clear">',
								"dom": 'rt<"bottom"ip><"clear">',
								"pageLength" : 10,
							});
							$('.sel_box select').niceSelect();
						});
					</script>
					<div class="event_cont" style="min-height: 0px;">
						<div class="tr">
							<div class="search_box"><!-- is_info_search_box -> search_box 로 교체-->
								<div class="ipt_box">
									<input class="" type="text" placeholder="Image Tag 혹은 Message 키워드를 입력해 주십시오." id="searchKeyword" name="searchKeyword" style="width:400px;">
								</div>
								<a id="searchBtn" href="#" class="btn serch">검색</a>
							</div>
						</div>
						<div class="tbl">
							<table id="statusImageScanTable" class="">
								<colgroup>
									<col width="2%">
									<col width="8%">
									<col width="8%">
									<col width="8%">
									<col width="8%">
									<col width="36%">
									<col width="8%">
									<col width="10%">
									<col width="10%">
								</colgroup>
								<thead>
									<tr>
										<th>
										<input type="checkbox" value=""> 
										<label for="allCheck"></label>
										</th>
										<th>Type</th>
										<th>Registry</th>
										<th>Digest</th>
										<th>Image Tag</th>
										<th>Message</th>
										<th>Result</th>
										<th>Created Date</th>
										<th>Finished Date</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
							<!--s 2024-01-17 : Progress bar 위치이동 -->
							<div class="progressbarBox relative" style="display:none;">			
								<div class="progressbar">	
									<div class="Loading">
										<span data-charge='100'></span>
									</div>
									<p>Scanning ..</p>	
								</div>	
							</div>
							<!--e 2024-01-17 : Progress bar 위치이동 -->
						</div>
					</div>
				</div>
			</div>
			
			
		</div>
	</section>
	

	<!-- 상세 정보 클릭 시 이미지 시큐리티 정책 Modal 출력 -->
	<div id="registry_policy_info"
		class="modal mid win_popup rec" style="height: 100%;"><!--//mscrollbar 제거-->
		<h4 id="title" data-type="">컨테이너 이미지 스캔 정책 정보</h4>
		<div class="popup_view_cont">
			<div class="securitypolicy_popup_box">
				<!-- policy header -->
				<div class="securitypolicy_top" style="padding-top: 0px">
					<div class="securitypolicy_top_info">
						<div class="policy_title_box" style="padding-top: 0px">
							<p class="policy_title">Rule Name</p>
							<div class="ipt_box">
								<input type="text" id="policy_rule_name" value="" placeholder=""
									class="no_radius" readonly>
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Description</p>
							<div class="ipt_box">
								<input type="text" id="policy_description" value=""
									placeholder="" class="no_radius" readonly>
							</div>
						</div>

						<div class="policy_title_box">
							<p class="policy_title">Registry</p>
							<div>
								<input type="text" id="policy_registry" value="" placeholder=""
									class="no_radius" readonly>
							</div>
							<p class="policy_title" style="padding-left: 20px;">Action</p>
							<div>
								<input type="text" id="policy_action" value="" placeholder=""
									class="no_radius" readonly>
							</div>
						</div>
					</div>
				</div>
				<!-- policy body -->
				<div class="securitypolicy_bottom" style="padding-top: 10px">
					<div class="securitypolicy_bottom_info"></div>
				</div>
			</div>
		</div>
		<div class="modal_controller"><!-- 2024-01-30 style 제거-->
			<a href="javascript:lf_closeRegistryPolicyInfoModal();" class="close">close</a>
		</div>
	</div>

</body>
</html>
