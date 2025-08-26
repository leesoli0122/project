<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>컨테이너 이미지 실행제어 - Aegis</title>
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
	
	<script src="./js/service/event/eventContainerImageControl.js?v=${version}"></script>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; 
	
	// 이벤트 조회> 컨테이너 이미지 실행제어 테이블
	$(document).ready(function() {
		$('#event_containerImageControl_result_table').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
			"order":[],
			"columnDefs":[{
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
	<jsp:param name="menuId" value="containerImageControlEvent" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="containerImageControlEvent" />
</jsp:include>

<input type="hidden" id="detailJson" value=""></input> 
<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="containerImageControlEventPaging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_containerImageControl_search_type_field" class="sel_box">
							<select id="event_containerImageControl_search_type" class="wide event">
								<option value="searchtime">Date​</option>
								<option value="result">Result</option> 
								<option value="cluster">Cluster</option> 
								<option value="namespace">Namespace</option>
								<option value="kind">Kind</option>
								<option value="operation">Operation​</option>
								<option value="registry">Registry​</option>
								<option value="digest">Digest​</option>
								<option value="image_tag">Image Tag​</option>
								<option value="message">Message​</option>
								<option value="request_user">Request User​</option>
							</select>
						</div>
					</div>
					<!-- 탐지 시간 -->
					<div class="searchtime on">
						<div class="searchtime_box">
							<div id="event_containerImageControl_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_containerImageControl_starttime" type='text' class="form-control containerImageControlEvent_date" placeholder="검색 시작 시간" />
									<span for="event_containerImageControl_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_containerImageControl_endtime" type='text' class="form-control containerImageControlEvent_date" placeholder="검색 끝나는 시간" />
									<span for="event_containerImageControl_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Result -->
					<div class="result">
						<div class="result_box">
							<div class="sel_box fl">
								<!-- #SearchOperation옵션이름 : ~의 선택 옵션-->
								<select id="event_containerImageControl_search_operation_result" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_containerImageControl_result" class="wide">
									<option value="ACCEPT" selected="selected">ALLOW</option>
									<option value="REJECT">DENY</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Cluster -->
					<div class="cluster">
						<div class="cluster_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_cluster" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_cluster" type="text" placeholder="cluster name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div>
					<!-- Namespace -->
					<div class="namespace">
						<div class="namespace_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_namespace" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_namespace" type="text" placeholder="namespace name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Kind -->
					<div class="kind">
						<div class="kind_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_kind" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_kind" type="text" placeholder="resource name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Operation -->
					<div class="operation">
						<div class="operation_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_operation" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_operation" type="text" placeholder="operation" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Registry -->
					<div class="registry">
						<div class="registry_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_registry" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_registry" type="text" placeholder="registry name" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Digest -->
					<div class="digest">
						<div class="digest_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_digest" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_digest" type="text" placeholder="digest" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Image Tag -->
					<div class="image_tag">
						<div class="image_tag_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_image_tag" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_image_tag" type="text" placeholder="image tag" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Message -->
					<div class="message">
						<div class="message_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_message" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_message" type="text" placeholder="message" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
					<!-- Request User -->
					<div class="request_user">
						<div class="request_user_box">
							<div class="sel_box fl">
								<select id="event_containerImageControl_search_operation_request_user" class="wide"> 
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_containerImageControl_request_user" type="text" placeholder="request user" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventContainerImageControlCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventContainerImageControlClick();" class="btn">검색</a>
						</div>
					</div> 
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_containerImageControl_queryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_containerImageControl_result_table" class="click">
						<colgroup>
							<col width="4%">
							<col width="6%">
							<col width="6%">
							<col width="7%">
							<col width="6%">
							<col width="6%">
							<col width="10%">
							<col width="10%">
							<col width="15%">
							<col width="15%">
							<col width="10%">
							<col width="10%">
						</colgroup>
						<thead>
							<tr>
								<th>No</th>
								<th>Result</th>
								<th>Cluster</th>
								<th>Namespace</th>
								<th>Kind</th>
								<th>Operation</th>
								<th>Registry</th>
								<th>Image Tag</th>
								<th>Digest</th>
								<th>Message</th>
								<th>Request User</th>
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
