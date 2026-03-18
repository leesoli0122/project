<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>컨테이너 이벤트- Aegis</title>
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
	
	<script src="./js/service/event/eventContainerSecurity.js?v=${version}"></script>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; 
	
	// 이벤트 조회> 컨테이너 이벤트 테이블
	$(document).ready(function() {
		$('#event_containerSecurity_result_table').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
			"order":[],
			"columnDefs": [			
//			{  //  NO(넘버) 정렬 활성화로 인한 기존 코드 주석처리	
//				"targets": [0],
//				"orderable": false
//			},
			{ // message에 long_w 클래스 지정
				"targets": [4], // Message가 들어가있는 테이블
				className:"long_w"
			},
			{ //  Severity 정렬 기준 정의
				"targets": [5], // Severity가 들어가있는 테이블
				orderData:[7,0]
				
			},
			{	// Severity를 정렬시킨 기준열은 숨김
				"targets": [7],
				"visible": false
			}
			],
			"info": false,
			"filter": false,
			"lengthChange": true,
			"language": {
				"lengthMenu":
				'<span>show</span>'+
				'<div class="sel_box">'+
				'<select class="table_top" onchange="_fnLengthChange(this.value)">'+
				// 전체를 한페이지에 다 가져오는 옵션 주석처리
				// '<option value="-1">All</option>'+
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
	<jsp:param name="menuId" value="containerSecurityEvent" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="containerSecurityEvent" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input> 
<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="containerSecurityEventPaging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_containerSecuritySearchTypeField" class="sel_box">
							<select id="event_containerSecuritySearchType" class="wide event">
								<option value="searchtime">Date​</option>
								<option value="action">Action</option> 
								<option value="rulename">Rule Name</option> 
								<option value="cluster">Cluster</option>
								<option value="severity">Severity</option>
								<option value="message">Message​</option>
							</select>
						</div>
					</div>
					
					<!-- select option 에 따라 나타나는 ui. 각 클래스와 id에 css 도 적용 시켜줘야함(간격이 적용되어있지 않음) -->
										
					<!-- 탐지 시간 -->
					<div class="searchtime on">
						<div class="searchtime_box">
							<div id="event_containerSecurityDate" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_containerSecurityStartTime" type='text' class="form-control containerSecurityEventDate" placeholder="검색 시작 시간" />
									<span for="event_containerSecurityStartTime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_containerSecurityEndTime" type='text' class="form-control containerSecurityEventDate" placeholder="검색 끝나는 시간" />
									<span for="event_containerSecurityEndTime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Action(컬럼명은 Result) -->
					<div class="action">
						<div class="action_box">
							<div class="sel_box fl">
								<!-- #SearchOperation옵션이름 : ~의 선택 옵션-->
								<select id="event_containerSecuritySearchOperationaction" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_containerSecurityaction" class="wide">
									<option value="LOGGING" selected="selected">LOGGING</option>
									<option value="ALERT">ALERT</option>
									<option value="DENY">DENY</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Rule Name  -->
					<div class="rulename">
						<div class="rulename_box">
							<div class="sel_box fl">
								<select id="event_containerSecuritySearchOperationrulename" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerSecurityrulename" type="text" placeholder="rule name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Cluster  -->
					<div class="cluster">
						<div class="cluster_box">
							<div class="sel_box fl">
								<select id="event_containerSecuritySearchOperationcluster" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerSecuritycluster" type="text" placeholder="cluster name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- severity -->
					<div class="severity">
						<div class="severity_box">
							<div class="sel_box fl">
								<select id="event_containerSecuritySearchOperationseverity" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_containerSecurityseverity" class="wide">
									<option value="CRITICAL" selected="selected">CRITICAL</option>
									<option value="HIGH">HIGH</option>
									<option value="MEDIUM">MEDIUM</option>
									<option value="LOW">LOW</option>
									<option value="UNKNOWN">UNKNOWN</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- 이벤트 내용  -->
					<div class="message">
						<div class="message_box">
							<div class="sel_box fl">
								<select id="event_containerSecuritySearchOperationmessage" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerSecuritymessage" type="text" placeholder="message" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerSecurityClick();" class="btn">검색</a>
						</div>
					</div> 
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_containerSecurityQueryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_containerSecurity_result_table" class="click">
						<colgroup>
							<col width="3%">
							<col width="3%">
							<col width="3%">
							<col width="9%">
							<col width="18%">
							<col width="4%">
							<col width="5%">
						</colgroup>
						<thead>
							<tr>
								<th>No</th>
								<th>Action</th>
								<th>Cluster</th>
								<th>Rule Name</th>
								<th>Message</th>
								<th>Severity</th>
								<th>Date</th>
								<th style="display:none;">SeverityOrder</th>
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
