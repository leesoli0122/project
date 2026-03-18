<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
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
    <meta property="og:image" content="">
    <meta property="og:description" content="Aegis 홈페이지입니다.">

    <!-- TODO: favicon -->
    <link rel="icon" href="./assets/images/favicon.png" type="image/png" />

    <!-- TODO: import -->
    <link rel="stylesheet" href="./assets/css/lib/bootstrap.min.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/bootstrap-datetimepicker.min.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/datatables.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/select.dataTables.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/jquery.mCustomScrollbar.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/jquery.scrollbar.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/jstree.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/style.css?v=${version}">

	<script src="./assets/js/lib/jquery-1.12.4.min.js?v=${version}"></script>
	<!-- script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script -->
    <script src="./assets/js/lib/jquery-ui.js"></script>
	<script src="./assets/js/lib/jquery.min.js?v=${version}"></script>
	<script src="./assets/js/lib/moment.js?v=${version}"></script>
	<script src="./assets/js/lib/bootstrap.min.js?v=${version}"></script>
	<script src="./assets/js/lib/bootstrap-datetimepicker.js?v=${version}"></script>
	<script src="./assets/js/lib/echarts.js?v=${version}"></script>
	<script src="./assets/js/lib/jquery.nice-select.js?v=${version}"></script>
	<script src="./assets/js/lib/select.dataTables.js?v=${version}"></script>
    <script src="./assets/js/lib/datatables.js?v=${version}"></script>
    <script src="./assets/js/lib/dataTables.buttons.min.js?v=${version}"></script>
    <script src="./assets/js/lib/sweetalert.js"></script>
    <script src="./assets/js/lib/jquery.mCustomScrollbar.js"></script>
    <script src="./assets/js/lib/jquery.scrollbar.js"></script>
    <script src="./assets/js/lib/jstree.js?v=${version}"></script>
    <script src="./assets/js/scripts.js?v=${version}"></script>

    <script src="./js/common/define.js?v=${version}"></script>
    <script src="./js/common/basic_common.js?v=${version}"></script>
    <script src="./js/common/cf_common.js?v=${version}"></script>
    
    <script src="./js/service/configure/auditList.js?v=${version}"></script>
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
<header id="main_sidebar" class="header_box"></header>
<article id="main_topbar" class="top_cont"></article>

<section class="configuration_page">
    <div class="configuration_box">
        <div class="configuration_btm_con">
            <script type="text/javascript">
                $(document).ready(function() {
                    /* Formatting function for row details - modify as you need */
                    $('#testTb3').DataTable({
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
                        "dom": '<"top"Blf>rt<"bottom"ip><"clear">',
                        "pageLength": 14,
                    });
                    $('.sel_box select').niceSelect();
                });
            </script>
            <div class="tbl">
                <table id="testTb3" class="hover">
                    <colgroup>
                        <col width="15%">
                        <col width="15%">
                        <col width="15%">
                        <col width="40%">
                        <col width="15%">
                    </colgroup>
                    <thead>
                    <tr>
                        <th>주체</th>
                        <th>작업</th>
                        <th>내역</th>
                        <th>메시지</th>                       
                        <th>시간</th>
                    </tr>
                    </thead>
                    <tbody>             
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<div class="modal wide" id="audit_modal">
    <div class="modal_header">
        <h3 id="modal_title">감사 상세</h3>
    </div>
    <div class="modal_body">
        <div class="modal_cont">
            <div class="user_top_box">
                <div class="user_top_box_left">
                    <dl>
                        <dt>
                            <h4>
                                <span>이전 데이터</span>
                            </h4>
                        </dt>
                        <dd>
                            <div class="ipt_box">
                                <input type="text" placeholder="사용할 아이디를 입력해주세요." id="userid">
                            </div>
                        </dd>
                    </dl>                    
                </div>
                <div class="user_top_box_right">
                    <dl>
                        <dt><h4>Password*</h4></dt>
                        <dd>
                            <div class="ipt_box">
                                <input type="password" placeholder="신규 비밀번호를 입력해 주세요." id="password1">
                            </div>
                            <div class="ipt_box">
                                <input type="password" placeholder="비밀번호를 다시한번 입력해 주세요." id="password2">
                            </div>
                        </dd>
                    </dl>                    
                </div>
            </div>
            <div class="user_bottom_box">
                <div class="connect_box_wrap">
                    
                </div>
            </div>
        </div>
    </div>
    <div class="modal_footer">
        <div class="btn_wrap fr">
            <a href="#" class="btn grey close">취소</a>
            <a href="#" class="btn" id="confirm" onclick="javascript : confirm(this);">수정</a>
        </div>
    </div>
    <div class="modal_controller">
        <a href="#" class="close">close</a>
    </div>
</div>

</body>
</html>