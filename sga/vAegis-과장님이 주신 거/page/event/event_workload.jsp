<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>컨테이너 워크로드 실행제어- Aegis</title>
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
	
	<!-- test -->
	<script src="./js/common/page_common.js?v=${version}"></script>
	
	<script src="./js/service/event/eventWorkload.js?v=${version}"></script>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; 
	
	// 이벤트 조회> 컨테이너 워크로드 실행제어 테이블
	$(document).ready(function() {
		$('#event_workload_result_table').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			//"ordering": true,
			"order":[],
			"columnDefs": [{
				"targets": [0],
				"orderable": false
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
			// 2023-06-16 기능리뷰 회의 결과에 따른 info 기능 비활성화
			"info": false,
			"filter": false,
			"lengthChange": true,
			"language": {
				"lengthMenu":
				'<span>show</span>'+
				'<div class="sel_box">'+
				'<select class="table_top" onchange="_fnLengthChange(this.value)">'+
				// '<option value="-1">All</option>'+
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
			// "pageLength": '10',
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
	<jsp:param name="menuId" value="workloadEvent" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="workloadEvent" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input> 
<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="workload_paging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_workload_search_type_field" class="sel_box">
							<select id="event_workload_search_type" class="wide event">
								<option value="searchtime">Date​</option>
								<option value="action">Result</option> 
								<option value="rulename">Rule Name</option> 
								<option value="subject">Request By</option> 
								<option value="cluster">Cluster</option> 
								<option value="namespace">Namespace</option> 
								<option value="kind">kind</option> 
								<option value="operation">Operation</option>
								<option value="message">Message​</option>
							</select>
						</div>
					</div>
					
					<!-- select option 에 따라 나타나는 ui. 각 클래스와 id에 css 도 적용 시켜줘야함(간격이 적용되어있지 않음) -->
										
					<!-- 탐지 시간 -->
					<div class="searchtime on">
						<div class="searchtime_box">
							<div id="event_workload_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_workload_starttime" type='text' class="form-control workload_date" placeholder="검색 시작 시간" />
									<span for="event_workload_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_workload_endtime" type='text' class="form-control workload_date" placeholder="검색 끝나는 시간" />
									<span for="event_workload_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Action(컬럼명은 Result) -->
					<div class="action">
						<div class="action_box">
							<div class="sel_box fl">
								<!-- #_search_operation_옵션이름 : ~의 선택 옵션-->
								<select id="event_workload_search_operation_action" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_workload_action" class="wide">
									<option value="ACCEPT" selected="selected">ALLOW</option>
									<option value="REJECT">DENY</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Rule Name  -->
					<div class="rulename">
						<div class="rulename_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_rulename" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_rulename" type="text" placeholder="rule name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Request By(Subject)  -->
					<div class="subject">
						<div class="subject_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_subject" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_subject" type="text" placeholder="subject name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Cluster  -->
					<div class="cluster">
						<div class="cluster_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_cluster" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_cluster" type="text" placeholder="cluster name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
										
					<!-- Namespace -->
					<div class="namespace">
						<div class="namespace_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_namespace" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_namespace" type="text" placeholder="namespace name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Kind  -->
					<div class="kind">
						<div class="kind_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_kind" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_kind" type="text" placeholder="resource name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
				
					<!-- Operation  -->
					<div class="operation">
						<div class="operation_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_operation" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_operation" type="text" placeholder="operation" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- 이벤트 내용  -->
					<div class="message">
						<div class="message_box">
							<div class="sel_box fl">
								<select id="event_workload_search_operation_message" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_workload_message" type="text" placeholder="message" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventWorkloadCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventWorkloadClick();" class="btn">검색</a>
						</div>
					</div> 
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_workload_queryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_workload_result_table" class="click">
						<colgroup>
							<col width="3%">
							<col width="8%">
							<col width="10%">
							<col width="auto">
							<col width="8%">
							<col width="10%">
							<col width="10%">
							<col width="8%">
							<col width="auto">
							<col width="10%">
						</colgroup>
						<thead>
							<tr>
								<th>No</th>
								<th>Result</th>
								<th>Rule Name</th>
								<th>Request By</th>
								<th>Cluster</th>
								<th>Namespace</th>
								<th>Kind</th> <!-- Resource -->
								<th>Operation</th>
								<th>Message</th>
								<th>Date</th>
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
