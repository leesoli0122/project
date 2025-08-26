<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@ include file="/page/layout/header.jsp"%>
<!DOCTYPE html>
<html lang="ko">

<head>
	<title>사용자 관리 - Aegis</title>
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
	<script src="./js/service/configure/userList.js?v=${version}"></script>
	<script type="text/javascript">
	$(document).ready(function() {
		$('#userTable').DataTable({
			"autoWidth": false,
			"paging": true,
			"pagingType": "full_numbers",
			"ordering": true,
			"order" : [[1, "desc"]],
			"columnDefs": [
				{ orderable: false, targets: 0 },
				{ orderable: true, targets: '_all' }
			],
			"info": true,
			"filter": true,
			"lengthChange": false,
			"language": {
				"info": "<span>_PAGE_</span> - _PAGES_ / _MAX_",
			},
			"buttons": [
				{
					tag: 'a',
					text: '추가',                                
					className: 'btn modalLoad',
					attr: {
					    rel: 'user_modal01'
					},
					action: function ( e, dt, node, config ) {
						initInsertUser();
					}
				},
				{
					tag: 'a',
					text: '삭제',
					className: 'btn line',/*2024-01-31 grey -> line로 교체*/
					action: function ( e, dt, node, config ) {
						deleteUser();
					}
				},
			],
			"dom": '<"top"Blf>rt<"bottom"ip><"clear">',
			"pageLength": 14,
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

<jsp:include page="/page/layout/sidebar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="userConfig" />
</jsp:include>

<jsp:include page="/page/layout/topbar_sample.jsp" flush="false">
	<jsp:param name="menuId" value="userConfig" />
</jsp:include>

<section class="configuration_page mscrollbar">
	<div class="sub">
		<div class="configuration_box">
			<div class="configuration_btm_con">
				<div class="tbl">
					<table id="userTable" class="hover">
						<colgroup>
							<col width="8%">
							<col width="16%">
							<col width="16%">
							<col width="16%">
							<col width="16%">
							<col width="16%">
						</colgroup>
						<thead>
						<tr>
						<th>
							<div class="chk_box">
								<input type="checkbox" name="all_checkbox" id="chk00" value="">
								<label for="chk00"></label>
							</div>
						</th>
							<th>사용자</th>
							<th>전화번호</th>
							<th>이메일</th>
							<th>Level</th>
							<th>변경일자</th>
						</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>

<!--  modal :: 사용자 관리 추가 팝업  -->
<div class="modal small" id="user_modal01">
	<div class="modal_header">
		<h3>사용자 관리</h3>
	</div>
	<div class="modal_body">
		<div class="modal_cont">
			<div class="user_top_box">
				<div class="connect_box_tit">
					<span>사용자 정보<a href="" id="qrCode">&nbsp;QR Code</a></span>					
				</div>
				<div class="connect_box_wrap">
					<dl>
						<dt>
							<span>사용자 권한</span>
						</dt>
						<dd>
							<div class="sel_box">
								<select class="popup_sel" id="authkey">
									<option value="0000A399X999">SUPER ADMIN</option>
									<option value="0000A499X999">ADMIN</option>
									<option value="0000A599X999">Operator</option>
									<option value="0000A699X999">Viewer</option>
								</select>
							</div>
						</dd>
					</dl>
					<dl>
						<dt>
							<span>User ID</span>
						</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="text" placeholder="아이디를 입력하세요" id="userid">								
							</div>
						</dd>
					</dl>
					<dl>
						<dt>Password</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="password" placeholder="기존 비밀번호를 입력해 주세요." id="password">
							</div>
							<div class="ipt_box">
								<input class="no_radius" type="password" placeholder="신규 비밀번호를 입력해 주세요." id="password1">
							</div>
							<div class="ipt_box">
								<input class="no_radius" type="password" placeholder="신규 비밀번호를 다시한번 입력해 주세요." id="password2">
							</div>
						</dd>
					</dl>
					<dl>
						<dt>
							<span>User Name</span>
						</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="text"
									placeholder="사용자의 이름을 입력해주세요." id="username">
							</div>
						</dd>
					</dl>
					<dl>
						<dt>
							<span>User Phone</span>
						</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="text" placeholder="연락처를 입력해 주세요." id="phone">
							</div>
						</dd>
					</dl>
					<dl>
						<dt>
							<span>User Email</span>
						</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="text" placeholder="이메일를 입력해 주세요." id="email">
							</div>
						</dd>
					</dl>
					<dl>
						<dt>
							<span>Company</span>
						</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="text" placeholder="회사명을 입력해 주세요." id="postname">
							</div>
						</dd>
					</dl>
					<dl>
						<dt>
							<span>Address</span>
						</dt>
						<dd>
							<div class="ipt_box">
								<input class="no_radius" type="text" placeholder="주소를 입력해주세요." id="address">
							</div>
							<div class="ipt_box">
								<input class="no_radius" type="text" placeholder="상세주소를 입력하세요." id="addressDesc">
							</div>
						</dd>
					</dl>
				</div>
			</div>
			<!-- div class="user_bottom_box">
				<div class="connect_box_tit">
					<span>그룹 권한 설정</span>
				</div>
				<div class="connect_box_wrap">
					<div class="connect_box all mscrollbar" id="connect_menu">
						<ul class="connect_box_lst all">
							<li><span rel="count00">전체</span></li>
						</ul>
					</div>
					<div class="connect_box_btn">
						<a href="#" class="btn line alladd">전체 추가</a>
						<a href="#" class="btn line add">추가</a>
						<a href="#" class="btn line del">삭제</a>
						<a href="#" class="btn line alldel">전체삭제</a>
					</div>
					<div class="connect_box result mscrollbar" id="connect_sel">
						<ul class="connect_box_lst result"></ul>
					</div>
				</div>
			</div -->
		</div>
	</div>
	<div class="modal_footer">
		<div class="btn_wrap">
			<a href="#" class="btn line close">취소</a><!-- 2024-01-31 : 버튼 grey->line으로 교체-->
			<a href="#" class="btn" id="confirm" onclick="javascript:confirm(this);">저장</a>
		</div>
	</div>
	<div class="modal_controller">
		<a href="#" class="close">close</a>
	</div>
</div>

</body>
</html>
