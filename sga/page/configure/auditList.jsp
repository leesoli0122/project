<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>감사 로그 - Aegis</title>
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
	
	<script src="./js/service/configure/auditList.js?v=${version}"></script>
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; //로그인이 안되어 있다면 */
	
	$(document).ready(function() {
		$('#event_audit_result_table').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
			"info": true,
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
	<jsp:param name="menuId" value="auditList" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="auditList" />
</jsp:include>

<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="fw_paging" value=""/>
<input type="hidden" id="_audit" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_audit_search_type_field" class="sel_box">
							<select id="event_audit_search_type" class="wide event">
								<option value="searchtime">검색 시간</option>
								<option value="message">메시지</option>
								<option value="type">대분류</option>
								<option value="topic_login">로그인 이벤트 감사</option>
								<option value="topic_manage">관리 이벤트 감사</option>
								<option value="topic_config">설정 이벤트 감사</option>
							</select>
						</div>
					</div>
					<div class="searchtime on">
						<div class="searchtime_box">
							<div id="event_audit_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_audit_starttime" type='text' class="form-control audit_date" placeholder="검색 시작 시간" />
									<span for="event_audit_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_audit_endtime" type='text' class="form-control audit_date" placeholder="검색 끝나는 시간" />
									<span for="event_audit_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventAuditCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventAuditClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="message">
						<div class="message_box">
							<div class="sel_box fl">
								<select id="event_audit_search_operation_message" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_audit_message" type="text" placeholder="내용" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventAuditCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventAuditClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="type">
						<div class="type_box">
							<div class="sel_box fl">
								<select id="event_audit_search_operation_type" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_audit_type" class="wide">
									<option value="SERVICE" selected="selected">서비스 감사</option>
									<option value="EVENT">주요 이벤트 감사</option>
									<option value="CONFIG">설정 이벤트 감사</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventAuditCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventAuditClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="topic_login">
						<div class="topic_login_box">
							<div class="sel_box fl">
								<select id="event_audit_search_operation_topic_login" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_audit_topic_login" class="wide">
									<option value="SESSIONDESTROY_DOUBLE_LOGIN" selected="selected">중복 로그인 세션 해제</option>
									<option value="LOGINSUCCESS">사용자 로그인</opation>
									<option value="LOGINDENY_LIMITOVER">로그인 거부(세션 초과)</opation>
									<option value="LOGINDENY_NOAUTHIP">로그인 거부(비인가 IP 접속)</opation>
									<option value="LOGINDENY_PASSWORD">로그인 거부(비밀번호 오류)</opation>
									<option value="LOGINDENY_BAN">로그인 거부(BAN)</opation>
									<option value="LOGINLOCKED_USER">사용자 ID Locked</opation>
									<option value="TWO_FACTOR_VALIDATION">2차 인증</opation>
	                       		</select>
	                    	</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventAuditCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventAuditClick();" class="btn">검색</a>
						</div>
	                </div>
	                <div class="topic_manage">
						<div class="topic_manage_box">
							<div class="sel_box fl">
		                        <select id="event_audit_search_operation_topic_manage" class="wide">
		                            <option value="1" selected="selected">equals(=)</option>
		                            <option value="11">not equals(!=)</option>
		                        </select>
		                    </div>
		                    <div class="sel_box fl">
		                        <select id="event_audit_topic_manage" class="wide">                        	
									<option value="AGENT_ADD">자산 추가</opation>
									<option value="AGENT_DELETE">자산 삭제</opation>
									<option value="AGENT_UPDATE">자산 수정</opation>
									<option value="GROUP_ADD">그룹 추가</opation>
									<option value="GROUP_DELETE">그룹 삭제</opation>
									<option value="GROUP_UPDATE">그룹 수정</opation>							
									<option value="USER_ADD">사용자 정보 추가</opation>
									<option value="USER_DELETE">사용자 정보 삭제</opation>
									<option value="USER_UPDATE">사용자 정보 수정</opation>
		                        </select>
		                    </div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventAuditCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventAuditClick();" class="btn">검색</a>
						</div>
	                </div>
	                <div class="topic_config">
						<div class="topic_config_box">
							<div class="sel_box fl">
		                        <select id="event_audit_search_operation_topic_config" class="wide">
		                            <option value="1" selected="selected">equals(=)</option>
		                            <option value="11">not equals(!=)</option>
		                        </select>
		                    </div>
		                    <div class="sel_box fl">
		                        <select id="event_audit_topic_config" class="wide">
									<option value="POLICY_ADD">정책 추가</opation>
									<option value="POLICY_EQUIP_DELETE">정책 해제</opation>
									<option value="POLICY_EQUIP_UPDATE">정책 배정</opation>
									<option value="SITECONFIG_UPDATE">사이트 설정 수정</opation>
									<option value="AUTHCONFIG_UPDATE">메뉴 권한 설정 수정</opation>
									<option value="AVPATTERN_ADD">멀웨어 패턴 배포(Agt)</opation>
									<option value="AVPATTERN_UPDATE">멀웨어 패턴 업데이트(Svr)</opation>
									<option value="TWO_FACTOR_ISSUE">2차인증 키 신규발급</opation>
									<option value="TWO_FACTOR_UPDATE">2차인증 키 업데이트</opation>
		                        </select>
		                    </div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventAuditCondition();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventAuditClick();" class="btn">검색</a>
						</div>
	                </div>
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_audit_queryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_audit_result_table" class="click">
						<colgroup>
							<col width="15%">
							<col width="15%">
							<col width="15%">
							<col width="40%">
							<col width="15%">
						</colgroup>
						<thead class="thead-light">
							<tr>
								<th>주체</th>
								<th>작업명</th>
								<th>변경사항</th>
								<th>메시지</th>
								<th>시간</th>
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
