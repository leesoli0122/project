<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>멀웨어 통합 검사 - Aegis</title>
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

	<script src="./js/common/datatables_export.js"></script>
	<script src="./js/common/xlsx.full.min.js"></script>
	<script src="./js/common/FileSaver.min.js"></script>
	
	<script src="./js/service/cloud/cloudScan.js?v=${version}"></script>
	<script src="./js/service/cloud/cloudSocket.js?v=${version}"></script>
	<script src="./js/service/cloud/cloudTabRecent.js?v=${version}"></script>
	<script src="./js/service/cloud/cloudTabStatus.js?v=${version}"></script>
<%--	<script src="./js/service/cloud/cloudTabSummary.js?v=${version}"></script>   --%>
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
	<jsp:param name="menuId" value="cloudScan" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="cloudScan" />
</jsp:include>

<input type="hidden" id="checkData" />
<input type="hidden" id="detailNum" />
<input type="hidden" id="detailData" />

<section class="computer_page"><!-- 2024-01-19: mscrollbar 삭제-->
	<div class="sub">
		<div class="content_wrap">
			<div class="computer_box">
					<div class="sc_info">
						<!-- 현황판 div -->
						<div class="sc_info_box cloudscan_box">
							<div class="gro">
								<p id="groupCount">0</p>
								<p class="tit">그룹</p>
							</div>
							<div class="equ">
								<p id="allCount">0</p>
								<p class="tit">장비</p>
							</div>
							<div class="nor">
								<p id="liveCount">0</p>
								<p class="tit">정상</p>
							</div>
							<div class="abn">
								<p id="deadCount">0</p>
								<p class="tit">비정상</p>
							</div>
						</div>
					</div>
				</div>

			<div class="computer_box"><!-- 2024-01-19 : 스타일제거-->
				<div class="securitypolicy_title">
					<div class="securitypolicy_title_left">
						<dl class="fl">
							<dd>
								<a id="btn_malware_scan" href="#" class="btn check">멀웨어 상황판</a><!--//2024-01-22 line-> check 클래스 변경-->
								<a id="btn_malware_recent" href="#" class="btn check">최근 멀웨어</a><!--//2024-01-22 line-> check 클래스 변경-->
								<!-- a id="btn_malware_summary" href="#" class="btn line">일일 트랜드</a -->
							</dd>
						</dl>
					</div>
					<div class="securitypolicy_title_right">
						<dl class="fl">
							<dd>
								<a id="btn_malware_scan_option" href="#" class="btn check">검사 옵션</a><!--//2024-01-22 line-> check 클래스 변경-->
								<a id="btn_scan" href="#" class="btn">검사 시작</a><!--//2024-01-22 퍼블 : line blue 클래스 삭제-->
							</dd>
						</dl>
						<dl class="fl">
							<dt>검색어</dt>
							<dd>
								<div class="ipt_box">
									<input class="" type="text" placeholder="장비명, IP를 입력하여 주십시오." id="searchKeyword" name="searchKeyword">
								</div>
								<a id="searchBtn" href="#" class="btn serch">검색</a>
							</dd>
						</dl>
					</div>
				</div>
			</div>
			<div id="malware_scan" class="computer_box" style="display: none;">
				<div class="computer_box_wrap">
					<script type="text/javascript">
						$(document).ready(function() {
							/* Formatting function for row details - modify as you need */
							$('#statusMalwareTable').DataTable({
								"autoWidth": false,
								"paging": true,
								"pagingType": "full_numbers",
								"ordering": false,
								//"order" : [[0, "desc"]],
								"info": true,
								"filter": false,
								"lengthChange": true,
								"language": {
									"lengthMenu":
										'<span>show</span>'+
										'<div class="sel_box">'+
										'<select class="table_top">'+
										'<option value="-1">All</option>'+
										'<option value="10">10</option>'+
										'<option value="25">25</option>'+
										'<option value="50">50</option>'+
										'<option value="100">100</option>'+
										'</select>'+
										'</div>'+
										'<span>entries</span>'
									,
									"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
								},
								"dom": '<"top"lf>rt<"bottom"ip><"clear">',
								"pageLength": 10,
							});
							$('.sel_box select').niceSelect();
						});
					</script>
					<div class="event_cont">
						<div class="tbl">
							<table id="statusMalwareTable" class="">
								<colgroup>
									<col width="auto">
									<col width="15%">
									<col width="40%">
									<col width="15%">
								</colgroup>
								<thead>
									<tr>
										<th>자산명</th>
										<th>상태</th>
										<th>검사 위치</th>
										<th>감염/검사 파일</th>
									</tr>
								</thead>
								<tbody>
		
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div id="malware_recent" class="computer_box" style="display: none;">
				<div class="computer_box_wrap">
					<script type="text/javascript">
						$(document).ready(function() {
							/* Formatting function for row details - modify as you need */
							$('#recentMalwareTable').DataTable({
								"autoWidth": false,
								"paging": true,
								"pagingType": "full_numbers",
								"ordering": true,
								"order" : [[0, "desc"]],
								"info": true,
								"filter": false,
								"lengthChange": true,
								"language": {
									"lengthMenu":
										'<span>show</span>'+
										'<div class="sel_box">'+
										'<select class="table_top">'+
										'<option value="-1">All</option>'+
										'<option value="10">10</option>'+
										'<option value="25">25</option>'+
										'<option value="50">50</option>'+
										'<option value="100">100</option>'+
										'</select>'+
										'</div>'+
										'<span>entries</span>'
									,
									"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
								},
								"dom": '<"top"lf>rt<"bottom"ip><"clear">',
								"pageLength": 10,
							});
							$('.sel_box select').niceSelect();
						});
					</script>
					<div class="event_cont">
						<div class="tbl">
							<table id="recentMalwareTable" class="">
								<colgroup>
									<col width="auto">
									<col width="20%">
									<col width="40%">
									<col width="20%">
								</colgroup>
								<thead>
									<tr>
										<th>자산명</th>
										<th>바이러스명</th>
										<th>파일명</th>
										<th>시간</th>
									</tr>
								</thead>
								<tbody>
		
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div id="malware_scan_option" class="computer_box" style="display: none;">
				<div class="computer_box_wrap">
					<div class="tit_wrap" style="height: 100%;">
							<table id="malware_scan_option_table">
								<colgroup>
									<col width="130">
									<col width="*">
								</colgroup>
								<tr>
									<td>감염 파일 처리</td>
									<td colspan="3">
										<div class="rdo_box action">
											<input type="radio" name="malwareAction" id="radiob01" value="0">
											<label for="radiob01" class="label_nohide">경고</label>
											<input type="radio" name="malwareAction" id="radiob02" value="4">
											<label for="radiob02" class="label_nohide">격리</label>
											<input type="radio" name="malwareAction" id="radiob03" value="8">
											<label for="radiob03" class="label_nohide">복사</label>
											<input type="radio" name="malwareAction" id="radiob04" value="16">
											<label for="radiob04" class="label_nohide">삭제</label>
										</div>
									</td>
								</tr>
								<tr>
									<td>하위 디렉토리</td>
									<td colspan="3">
										<div class="chk_box">
											<input type="checkbox" name="subcheck" id="subcheck" value="">
											<label for="subcheck" class="label_nohide">하위 디렉토리 포함</label>
										</div>
									</td>
								</tr>
								<tr>
									<td>검사 위치</td>
									<td>
										<div class="ipt_box" style="width: 500px;">
											<input type="text" id="filename" placeholder="파일의 전체 경로를 작성해주세요." name="filename" value="/home">
										</div>
										<a id="btn_filename_add" href="#" class="btn icon add">추가</a><!--//2024-01-22 policy_add -> icon add 클래스 변경-->
									</td>
								</tr>
															<tr>
																	<td>검사 위치</td>
																	<td>
																			<div class="ipt_box" style="width: 500px;">
																					<input type="text" id="filename" placeholder="파일의 전체 경로를 작성해주세요." name="filename" value="/tmp">
																			</div>
																	</td>
															</tr>
							</table>
						</div>
				</div>
			</div>
			<div class="computer_box">
				<div class="computer_box_wrap" id="groupList">
					<div class="over_data"></div>
				</div>
			</div>
		</div><!--//content_wrap-->
	</div>
</section>

</body>
</html>
