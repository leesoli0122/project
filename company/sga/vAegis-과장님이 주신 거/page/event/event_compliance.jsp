<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<style>
input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
</style>
<head>
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
	<meta property="og:image" content="Aegis.png">
	<meta property="og:description" content="Aegis 홈페이지입니다.">
	
	<!-- TODO: favicon -->
	<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common.jsp"%>
	
	<script src="./js/common/page_common.js?v=${version}"></script>
	
	<script src="./js/service/event/eventCompliance.js?v=${version}"></script>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; 
	
	// 이벤트 조회> 클러스터 규정준수 스캔 테이블
	$(document).ready(function() {
		$('#event_compliance_result_table').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
			"order":[],
			"columnDefs":[{
				"targets": [ 7 ],
				"createdCell": function(td, cellData, rowData, row, col) {
					var data;
					if(cellData == -1){
						data = rowData[11];
					} else {
						data = cellData;
					}
					$(td).attr('title', data); // title 속성에 데이터 추가
					// 스타일 속성 설정
					$(td).css({
						'white-space': 'nowrap',
						'overflow': 'hidden',
						'text-overflow': 'ellipsis'
					}); 
				}
			},{
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
			"info": false,
			"filter": false,
			"lengthChange": true,
			"language": {
				"lengthMenu":
				'<span>show</span>'+
				'<div class="sel_box">'+
				'<select class="table_top" onchange="_fnLengthChange(this.value)">'+
				'<option value="10">10</option>'+
				'<option value="25">25</option>'+
				'<option value="50">50</option>'+
				'<option value="100">100</option>'+
				'</select>'+
				'</div>'+
				'<span>entries</span>',
				"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
			},
			"dom": '<"top"lf>rt<"bottom"ip><"clear">',
		});
		$('.sel_box select').niceSelect();
	});
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

<jsp:include page="/page/layout/sidebar.jsp" flush="false">
	<jsp:param name="menuId" value="complianceEvent" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="complianceEvent" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input> 
<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="complianceEventPaging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_compliance_search_type_field" class="sel_box">
							<select id="event_compliance_search_type" class="wide event">
								<option value="created_searchtime">Created Date​</option>
								<option value="finished_searchtime">Finished Date​</option>
								<option value="type">Type​</option>
								<option value="cluster">Cluster</option>
								<option value="framework">Framework</option>
								<option value="total_controls">Total Controls</option>
								<option value="pass_controls">Passed Controls​</option>
								<option value="fail_controls">Failed Controls</option>
								<option value="error_controls">Error Controls​</option>
								<option value="etc_controls">ETC Controls​</option> <!-- 10-25 etc controls 추가 -->
								<option value="request_user">Request User​</option>
							</select>
						</div>
					</div>
					<!-- Created Date -->
					<div class="created_searchtime on">
						<div class="searchtime_box">
							<div id="event_compliance_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_compliance_created_starttime" type='text' class="form-control complianceEvent_date" placeholder="검색 시작 시간" />
									<span for="event_compliance_created_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_compliance_created_endtime" type='text' class="form-control complianceEvent_date" placeholder="검색 끝나는 시간" />
									<span for="event_compliance_created_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Finished Date -->
					<div class="finished_searchtime">
						<div class="searchtime_box">
							<div id="event_compliance_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_start_from'>
									<input id="event_compliance_finished_starttime" type='text' class="form-control complianceEvent_date" placeholder="검색 시작 시간" />
									<span for="event_compliance_finished_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_end_to'>
									<input id="event_compliance_finished_endtime" type='text' class="form-control complianceEvent_date" placeholder="검색 끝나는 시간" />
									<span for="event_compliance_finished_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Type -->
					<div class="type">
						<div class="type_box">
							<div class="sel_box fl">
								<!-- #SearchOperation옵션이름 : ~의 선택 옵션-->
								<select id="event_compliance_search_operation_type" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_compliance_type" class="wide">
									<option value="MANUAL" selected="selected">수동</option>
									<option value="AUTO">자동</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Cluster -->
					<div class="cluster">
						<div class="cluster_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_cluster" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_cluster" type="text" placeholder="cluster name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Framework -->
					<div class="framework">
						<div class="framework_box">
							<div class="sel_box fl">
								<!-- <select id="event_compliance_search_operation_framework" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select> -->
								<select id="event_compliance_search_operation_framework" class="wide" onChange = "selectFrameworkList()"></select>
							</div>
							<div class="sel_box fl">
								<select id="event_compliance_framework" class="wide"></select>
							</div>
							<!-- <div class="ipt_box fl">
								<input id="event_compliance_framework" type="text" placeholder="framework name" name="required">
							</div> -->
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Total Controls -->
					<div class="total_controls">
						<div class="total_controls_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_total_controls" class="wide"> 
									<option value="3" selected="selected">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_total_controls" type="number" placeholder="total_controls number" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Pass Controls -->
					<div class="pass_controls">
						<div class="pass_controls_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_pass_controls" class="wide"> 
									<option value="3" selected="selected">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_pass_controls" type="number" placeholder="pass_controls number" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Fail Controls -->
					<div class="fail_controls">
						<div class="fail_controls_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_fail_controls" class="wide"> 
									<option value="3" selected="selected">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_fail_controls" type="number" placeholder="fail_controls number" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- error Controls -->
					<div class="error_controls">
						<div class="error_controls_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_error_controls" class="wide"> 
									<option value="3" selected="selected">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_error_controls" type="number" placeholder="error_controls number" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Etc Controls -->
					<div class="etc_controls">
						<div class="etc_controls_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_etc_controls" class="wide"> 
									<option value="3" selected="selected">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_etc_controls" type="number" placeholder="etc_controls number" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Request User -->
					<div class="request_user">
						<div class="request_user_box">
							<div class="sel_box fl">
								<select id="event_compliance_search_operation_request_user" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_compliance_request_user" type="text" placeholder="request user" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventComplianceCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventComplianceClick();" class="btn">검색</a>
						</div>
					</div> 
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_compliance_queryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_compliance_result_table" class="click">
						<colgroup>
							<col width="4%">
							<col width="7%">
							<col width="7%">
							<col width="auto">
							<col width="9%">
							<col width="9%">
							<col width="9%">
							<col width="9%">
							<col width="9%">
							<col width="10%">
							<col width="10%">
							<col width="10%">
						</colgroup>
						<thead>
							<tr>
								<th>No</th>
								<th>Type</th>
								<th>Cluster</th>
								<th>Framework</th>
								<th>Total Controls</th>
								<th>Passed Controls</th>
								<th>Failed Controls</th>
								<th>Error Controls</th>
								<th>Etc Controls</th>
								<th>Request User</th>
								<th>Created Date</th>
								<th>FInished Date</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>
</body>
</html>
