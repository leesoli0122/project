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
	<meta property="og:image" content="Aegis.png">
	<meta property="og:description" content="Aegis 홈페이지입니다.">
	
	<!-- TODO: favicon -->
	<link rel="icon" href="./assets/images/favicon.png" type="favicon.png" />
	
	<!-- TODO: import -->
	<%@ include file="/page/layout/common.jsp"%>
	
	<%--
	<script src="./js/service/event/eventEquip.js?v=${version}"></script> --%>
	<script src="./js/service/event/eventImageSecurity.js?v=${version}"></script>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; //로그인이 안되어 있다면 */
	
	// 이벤트 조회> 이미지 시큐리티 테이블
	$(document).ready(function() {
		$('#event_imageSecurity_result_table').DataTable({
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
	<jsp:param name="menuId" value="imageSecurityEvent" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="imageSecurityEvent" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input> 
<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="imageSecurity_paging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_imageSecurity_search_type_field" class="sel_box">
							<select id="event_imageSecurity_search_type" class="wide event">
								<option value="created_at">Create Date</option> 
								<option value="updated_at">Finished Date</option> 
								<option value="type">Type</option> 
								<option value="registry">Registry</option> 
								<option value="digest">Digest</option> 
								<option value="image_tag">Image Tag​</option> 
								<option value="result">Result​</option>
								<option value="message">Message​</option>
							</select>
						</div>
					</div>
					<!-- select option 에 따라 나타나는 ui. 각 클래스와 id에 css 도 적용 시켜줘야함(간격이 적용되어있지 않음) -->
					<!-- 생성 시간 -->
					<div class="created_at on">
						<div class="searchtime_box">
							<div id="event_imageSecurity_created_at" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_imageSecurity_starttime_created_at" type='text' class="form-control imageSecurity_date" placeholder="검색 시작 시간" />
									<span for="event_imageSecurity_starttime_created_at" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_imageSecurity_endtime_created_at" type='text' class="form-control imageSecurity_date" placeholder="검색 끝나는 시간" />
									<span for="event_imageSecurity_endtime_created_at" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- 종료 시간 : updated_at -->
					<div class="updated_at">
						<div class="searchtime_box">
							<div id="event_imageSecurity_updated_at" class="datetimepicker_box">
								<div class='input-group date datetimepicker_start_from'>
									<input id="event_imageSecurity_starttime_updated_at" type='text' class="form-control imageSecurity_date" placeholder="검색 시작 시간" />
									<span for="event_imageSecurity_starttime_updated_at" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_end_to'>
									<input id="event_imageSecurity_endtime_updated_at" type='text' class="form-control imageSecurity_date" placeholder="검색 끝나는 시간" />
									<span for="event_imageSecurity_endtime_updated_at" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Type -->
					<div class="type">
						<div class="type_box">
							<div class="sel_box fl">
								<!-- #_search_operation _~ : ~의 선택 옵션-->
								<select id="event_imageSecurity_search_operation_type" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_imageSecurity_type" class="wide">
									<option value="MANUAL" selected="selected">수동 스캔</option>
									<option value="AUTO">자동 스캔</option>
									<option value="POLICY_REEVALUATION">정책 재평가</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Registry  -->
					<div class="registry">
						<div class="registry_box">
							<div class="sel_box fl">
								<select id="event_imageSecurity_search_operation_registry" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_imageSecurity_registry" type="text" placeholder="registry name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Digest  -->
					<div class="digest">
						<div class="digest_box">
							<div class="sel_box fl">
								<select id="event_imageSecurity_search_operation_digest" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_imageSecurity_digest" type="text" placeholder="digest" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Image Tag -->
					<div class="image_tag">
						<div class="image_tag_box">
							<div class="sel_box fl">
								<select id="event_imageSecurity_search_operation_image_tag" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_imageSecurity_image_tag" type="text" placeholder="image_tag" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- Result -->
					<div class="result">
						<div class="result_box">
							<div class="sel_box fl">
								<select id="event_imageSecurity_search_operation_result" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_imageSecurity_result" class="wide">
									<option value="PASS" selected="selected">성공</option>
									<option value="NO_PASS">실패</option>
									<option value="ERROR">에러</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div>
					
					<!-- 이벤트 내용 -> id 값 수정 필요  -->
					<div class="message">
						<div class="message_box">
							<div class="sel_box fl">
								<select id="event_imageSecurity_search_operation_message" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_imageSecurity_message" type="text" placeholder="message" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventImageSecurityCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventImageSecurityClick();" class="btn">검색</a>
						</div>
					</div> 
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_imageSecurity_queryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_imageSecurity_result_table" class="click">
						<colgroup>
							<col width="3%">
							<col width="8%">
							<col width="8%">
							<col width="10%">
							<col width="10%">
							<col width="auto">
							<col width="8%">
							<col width="8%">
							<col width="10%">
							<col width="10%">
						</colgroup>
						<thead>
							<tr>
								<th>No</th>
								<th>Type</th>
								<th>Registry</th>
								<th>Digest</th>
								<th>Image Tag</th>
								<th>Message</th>
								<th>Result</th>
								<th>Request User</th>
								<th>Created Date</th>
								<th>Finished Date</th>
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
