<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <title>침입방지시스템 이벤트 - Aegis</title>
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
    <link rel="icon" href="favicon.ico" type="favicon.ico" />

    <!-- TODO: import -->
    <link rel="stylesheet" href="./assets/css/lib/bootstrap.min.css">
    <link rel="stylesheet" href="./assets/css/lib/bootstrap-datetimepicker.min.css">
    <link rel="stylesheet" href="./assets/css/lib/datatables.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/lib/select.dataTables.css?v=${version}">
    <link rel="stylesheet" href="./assets/css/style.css?v=${version}">

    <script src="./assets/js/lib/jquery.min.js?v=${version}"></script>
	<script src="./assets/js/lib/bootstrap.min.js"></script>
	<script src="./assets/js/lib/moment.js"></script>
	<script src="./assets/js/lib/bootstrap-datetimepicker.js"></script>
    <script src="./assets/js/lib/jquery-ui.js?v=${version}"></script>
    <script src="./assets/js/lib/echarts.js?v=${version}"></script>
    <script src="./assets/js/lib/jquery.nice-select.js?v=${version}"></script>
    <script src="./assets/js/lib/select.dataTables.js?v=${version}"></script>
    <script src="./assets/js/lib/datatables.js?v=${version}"></script>
    <script src="./assets/js/lib/sweetalert.js"></script>
    
    <script src="./js/common/define.js?v=${version}"></script>
    <script src="./js/common/basic_common.js?v=${version}"></script>
    <script src="./js/common/cf_common.js?v=${version}"></script>
    
    <script src="./js/service/dashboards/dashboardChart.js?v=${version}"></script>
    <script src="./js/service/dashboards/dashboardEventIPSDialog.js?v=${version}"></script>
    
</head>
<body class="win_popup">
<section>
    <h3>IPS 이벤트</h3>
    <div class="popup_view_cont">
        <div class="view_title">
            <dl>
                <dt id="dashboardIPSEventSearchName"></dt>
                <dd id="dashboardIPSEventSearchValue"></dd>
            </dl>
        </div>
        <div class="tbl">
            <table id="dashboardIPSEventTable" class="click">
                <colgroup>
                    <col width="52px">
                    <col width="20%">
                    <col width="15%">
                    <col width="15%">
                    <col width="10%">
                    <col width="10%">
                    <col width="15%">
                </colgroup>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>자산</th>
                    <th>출발지</th>
                    <th>목적지</th>
                    <th>프로토콜</th>
                    <th>액션</th>
                    <th>탐지시간</th>
                </tr>
                </thead>
                <tbody>
                <tr onclick="javascript: lf_dashboardIPSTableClk(this);" style="display: none;">
                    <td class="long_w">20</td>
                    <td class="long_w">redhat78-96 (192.168.10.96)</td>
                    <td class="long_w">192.162.2.20</td>
                    <td class="long_w">192.168.10.96</td>
                    <td class="long_w">TCP</td>
                    <td class="long_w">blocked</td>
                    <td class="long_w">2020/10/23 14:02:56</td>
                </tr>
                </tbody>
            </table>
            <div class="tbl_bottom">
                 <div class="tbl_info fl">
                     <span id="dashboardIPSCurrentPage">1</span> / <span id="dashboardIPSTotPage">1</span> 
                 </div>
                 <ul id="dashboardIPSEventPagination" class="pagination fr">
                     <li class="first disabled">
                         <a href="#">First</a>
                     </li>
                     <li class="previous">
                         <a href="#">Prev</a>
                     </li>
                     <li class="active">
                         <a href="#">1</a>
                     </li>
                     <li class="next">
                         <a href="#">Next</a>
                     </li>
                     <li class="last">
                         <a href="#">Last</a>
                     </li>
                 </ul>
             </div>
        </div>
    </div>
</section>

</body>
</html>