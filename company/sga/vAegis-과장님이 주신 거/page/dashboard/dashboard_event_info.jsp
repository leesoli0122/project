<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <title>방화벽 이벤트 - Aegis</title>
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
    
    <script src="./js/service/dashboards/dashboardEventInfoView.js?v=${version}"></script>
</head>
<body class="win_popup">
<section>
    <h4 id="dashboardInfoSubTitle"></h4>
    <div class="popup_view_cont">
        <div id="dashboardInfoContent" class="detail on">
        </div>
    </div>
</section>

</body>
</html>