<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>파일 무결성 - Aegis</title>
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
	
	<script src="./js/service/event/eventFileInt.js?v=${version}"></script>
	<script src="./js/service/event/eventEquip.js?v=${version}"></script>
	
	<script type="text/javascript">
	if((typeof cf_getCookie !='function')||(!cf_getCookie("AUTHINFO"))) location.href="/login.do"; //로그인이 안되어 있다면 */
	
	$(document).ready(function() {
		$('#event_fileInt_result_table').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
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
	<jsp:param name="menuId" value="fileIntEvent" />
</jsp:include>

<jsp:include page="/page/layout/topbar.jsp" flush="false">
	<jsp:param name="menuId" value="fileIntEvent" />
</jsp:include>

<input type="hidden" id="detailData" value=""/>
<input type="hidden" id="detailNum" value=""/>
<input type="hidden" id="fileint_paging" value=""/>

<section class="event_page mscrollbar">
	<div class="sub">
		<div class="event_search_box">
			<div class="event_search_top">
				<div class="event_search_warp fl">
					<div class="event_sel">
						<div id="event_fileInt_search_type_field" class="sel_box">
							<select id="event_fileInt_search_type" class="wide event">
								<option value="searchtime">탐지시간</option>
								<option value="path">전체 경로</option>
								<option value="message">이벤트 내용</option>
								<option value="type">무결성 위반 종류</option>
								<option value="perm">퍼미션</option>
								<option value="hash">해시</option>
								<option value="filesize">파일</option>
								<option value="uid">UID</option>
								<option value="gid">GID</option>
								<option value="equiplist">자산</option>
							</select>
						</div>
					</div>
					<div class="searchtime on">
						<div class="searchtime_box">
							<div id="event_fileInt_date" class="datetimepicker_box">
								<div class='input-group date datetimepicker_min_from'>
									<input id="event_fileInt_starttime" type='text' class="form-control fileInt_date" placeholder="검색 시작 시간" />
									<span for="event_fileInt_starttime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
								<div class="timemore">
									<span>-</span>
								</div>
								<div class='input-group date datetimepicker_min_to'>
									<input id="event_fileInt_endtime" type='text' class="form-control fileInt_date" placeholder="검색 끝나는 시간" />
									<span for="event_fileInt_endtime" class="input-group-addon">
										<span class="glyphicon glyphicon-calendar calender_ico"></span>
									</span>
								</div>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="path">
						<div class="path_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_path" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
								<%--	<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>	--%>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_path" type="text" placeholder="" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="type">
						<div class="type_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_type" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								<%--	<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>	--%>
								</select>
							</div>
							<div class="sel_box fl">
								<select id="event_fileInt_type" class="wide">
									<option value="1" selected="selected">Create</option>
									<option value="2">Permission</option>
									<option value="4">User</option>
									<option value="8">Group'</option>
									<option value="16">Size</option>
									<option value="32">HASH</option>
									<option value="64">Delete</option>
								</select>
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="perm">
						<div class="perm_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_perm" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_perm_old" class="fileInt_perm" type="text" placeholder="바뀌기 전 Permission ex)rwxrwxrwt" name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_perm_new" class="fileInt_perm" type="text" placeholder="바뀐 후 Permission ex)rwxrwxrwt" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="hash">
						<div class="hash_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_hash" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_hash_all" class="fileInt_hash" type="text" placeholder="모든 해싱키 ex)acdefg1229093..." name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_hash_old" class="fileInt_hash" type="text" placeholder="바뀌기 전 해싱키 ex)acdefg1229093..." name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_hash_new" class="fileInt_hash" type="text" placeholder="바뀐 후 해싱키 ex)acdefg1229093..." name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="filesize">
						<div class="filesize_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_filesize" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_filesize_all" class="fileInt_filesize" type="text" placeholder="모든 파일크기" name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_filesize_old" class="fileInt_filesize" type="text" placeholder="바뀌기 전 파일크기" name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_filesize_new" class="fileInt_filesize" type="text" placeholder="바뀐 후 파일크기" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="uid">
						<div class="uid_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_uid" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_uid_old" class="fileInt_uid" type="text" placeholder="바뀌기 전 UID" name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_uid_new" class="fileInt_uid" type="text" placeholder="바뀐 후 UID" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="gid">
						<div class="gid_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_gid" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
									<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_gid_old" class="fileInt_gid" type="text" placeholder="바뀌기 전 GID" name="required">
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_gid_new" class="fileInt_gid" type="text" placeholder="바뀐 후 GID" name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="message">
						<div class="message_box">
							<div class="sel_box fl">
								<select id="event_fileInt_search_operation_message" class="wide">
									<option value="1" selected="selected">equals(=)</option>
									<option value="11">not equals(!=)</option>
								<%--	<option value="2">like</option>
									<option value="12">not like</option>
									<option value="3">less than(&lt;)</option>
									<option value="4">less than or equals(&lt;=)</option>
									<option value="5">greater than(&gt;)</option>
									<option value="6">greater than or equals(&gt;=)</option>	--%>
								</select>
							</div>
							<div class="ipt_box fl">
								<input id="event_fileInt_message" type="text"
									placeholder="이벤트 내용을 적어 주십시오." name="required">
							</div>
						</div>
						<div class="btn_wrap fl">
							<a href="javascript:lf_addEventFileIntConditionValue();" class="btn bline"><span>쿼리 추가</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
					<div class="equiplist">
						<div class="btn_wrap fl">
							<a href="#" class="btn bline modalLoad" rel="equiplist_modal" onclick="javascript:lf_initEquipList();"><span>자산 선택</span></a>
							<a href="javascript:lf_eventFileIntClick();" class="btn">검색</a>
						</div>
					</div>
				</div>
			</div>
			<div class="event_search_bottom">
				<div id="event_fileInt_queryTable" class="fl mscrollbar">
					<ul></ul>
				</div>
			</div>
		</div>
		<div class="event_cont_box">
			<div class="event_cont">
				<div class="tbl">
					<table id="event_fileInt_result_table" class="click">
						<colgroup>
							<col width="8%">
							<col width="20%">
							<col width="10%">
							<col width="45%">
							<col width="15%">
						</colgroup>
						<thead class="thead-light">
							<tr>
								<th>번호</th>
								<th>자산</th>
								<th>무결성 위반 종류</th>
								<th>이벤트 내용</th>
								<th>탐지시간</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>

<!--  modal :: 자산 선택 팝업  -->
<div class="modal mid" id="equiplist_modal">
    <div class="modal_header">
        <h3>자산선택</h3>
    </div>
    <div class="modal_body">
        <div class="modal_cont">
            <div class="equiplist_search">
                <div class="search_cont">
                    <div id="event_equiplist_ips" class="sel_box fl">
                        <select class="wide">
                            <option selected="selected" value="equipIP">자산IP</option>
                            <option value="equipName">자산명</option>                                                       
                        </select>
                    </div>
                    <div class="ipt_box fl">
                        <input id="event_equiplist_name" type="text" placeholder="자산를 검색하여 주십시오" name="required">
                        <a href="#" onclick="javascript:lf_searchEquipList();">자산 검색</a>
                    </div>
                </div>
                <a href="#" class="btn grey" onclick="javascript:lf_initEquipList();">검색 초기화</a>
            </div>
            <script type="text/javascript">
                $(document).ready(function() {
                    $("#event_equiplist_table").dataTable({
                        "autoWidth": false,
                        "paging": true,
                        "pagingType" : "full_numbers",
                        "ordering": false,
                        "info": true,
                        "filter": false,
                        "lengthChange": true,
                        "language": {
                            "info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
                        },
                        "dom": 'rt<"bottom"fip><"clear">',
                        // "pageLength": '10',
                    });
                } );

            </script>
            <div class="tbl row10">
                <table id="event_equiplist_table" class="click">
                    <colgroup>
                        <col width="8%">
                        <col width="25%">
                        <col width="auto">
                        <col width="35%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th>
                            <div class="chk_box equip_all_select">
                                <input type="checkbox" name="all_checkbox" id="chk00" value="">
                                <label for="chk00"></label>
                            </div>
                        </th>
                        <th>자산IP</th>
                        <th>자산명</th>
                        <th>그룹</th>
                    </tr>
                    </thead>
                    <tbody>
                     
                    </tbody>
                </table>
            </div>
            <div class="equiplist_list">
                <div id="event_equiplist_box" class="fl equiplist_list_box mscrollbar">
                    <ul class="fl">
                       
                    </ul>
                </div>
                <p class="equiplist_choice_info">
                    <span>(<em>0</em>)</span> 개 선택
                </p>
            </div>
        </div>
    </div>
    <div class="modal_footer">
        <div class="btn_wrap fr">
            <a href="#" class="btn grey close">취소</a>
            <a href="#" class="btn close" onclick="javascript:lf_addEquipList();">확인</a>
        </div>
    </div>
    <div class="modal_controller">
        <a href="#" class="close">close</a>
    </div>
</div>

</body>
</html>
