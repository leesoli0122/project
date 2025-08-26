/**
 * 대시보드 > 이미지 시큐리티 > PIE CHART 화면 구성
 */
 
var chartId = ''; 

//윈도우 자식 팝업창
var malwareWindow;
var vulnerabilitiesWindow;
var scanWindow;
var scanCompletionWindow;
var imageAssuranceWindow;

// 추가. 600400 요청 시 body 값 저장(term , chartId, registryUuid) 
var requestBody;

// 차트 구성 시 필요한 데이터 값 저장
function createDonutCharts(result,body,cid) {
	chartId = cid;
	requestBody = body;
	getMalwareCnt(result); // Malware 
	getVulnerabilityCnt(result); // Vulnerabilities
	getScanStatusCnt(result); // SCAN / SCAN Completion / Image Assurance
}

function getMalwareCnt(result) {
	var id = "malware_"+chartId;
	var title = "Malware";
	var colorPalette = [];
	var data = [];
	var malware = result.body.malwareCnt[0].count;
	data.push({
		value: malware,
		name: 'Malware'
	});

	if (malware == 0) { // 결과 값에 따라 그래프 색상 변경
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#388E3C');
	}

	createDonutChart(id, title, colorPalette, data); // div id값, 차트 제목, 색상 값, data
}

function getVulnerabilityCnt(result) {
	var id = "vulnerabilities_"+chartId;
	var title = "Vulnerabilities";
	var vulnerabilityColor = { 'Critical': '#b32d33', 'High': '#e14a42', 'Medium': '#f4bf72', 'Low': '#ebcb17', 'No': '#d2d2d2' };
	
	var colorPalette = [];
	var data = [];
	
	var resultLength =  result.body.vulnerabilityCnt.length;
	if (resultLength == 0) {
		colorPalette.push(vulnerabilityColor['No']);
		data.push({
			value: 0,
			name: 'Vulnerability',
		});
	}
	else{
		for (i = 0; i < resultLength; i++) {
			var severity = result.body.vulnerabilityCnt[i].severity;
			colorPalette.push(vulnerabilityColor[severity]);
			
			data.push({
				value: result.body.vulnerabilityCnt[i].count,
				name: result.body.vulnerabilityCnt[i].severity,
			});
		}
	}

	createDonutChart(id, title, colorPalette, data); // div id값, 차트 제목, 색상 값, data
}

function getScanStatusCnt(result) {
	$('#dashboardScanCount').attr(chartId , ""); ;  // 기존 값 초기화
	$('#dashboardScanCount').attr(chartId ,JSON.stringify(result.body)); ; // 새롭게 해당 스캔 카운트 결과 추가
	
	var totalCnt = 0;
	var scanCnt = 0;
	var noScanCnt = 0; 
	
	var scanSuccessCnt = 0;
	var scanFailCnt = 0; 
	
	var scanningCnt = 0;
	var watingScanCnt = 0;
	var scanCompletedCnt = 0; 
	
	var assuranceImageCnt = 0;
	
	
	
	// 스캔 결과 카운트 정리 : 전체 이미지,스캔한 이미지,성공,실패,평가 실패, 스캔 미실행
	var scanResultCnt = result.body.scanResultCnt; 
	$.each(scanResultCnt, function(index, value){
		var resultCnt = value['count'];
		var scanStatus = value['scan_status'];
		var scanCompletionStatus = value['scan_completion_status'];
		var imageAssuranceStatus =  value['image_assurance_scan_status'];
		
		// 도커 레지스트리인 경우 resultCnt의 총 합 = 전체 스캔 갯수
		totalCnt += resultCnt; 
		
		// 스캔 결과
		if(scanStatus == "successed") scanSuccessCnt += resultCnt;
		else if (scanStatus == "failed") scanFailCnt += resultCnt;  
		
		// 스캔 completion 결과
		if(scanCompletionStatus == "scanning") scanningCnt += resultCnt;
		else if(scanCompletionStatus == "scanCompleted") scanCompletedCnt += resultCnt;
		else if(scanCompletionStatus == "watingScan") watingScanCnt += resultCnt;
		
		// 이미지 보증 결과 
		if(imageAssuranceStatus == "assurance") assuranceImageCnt += resultCnt;
	});
	
	if(result.body.registryImageCnt){ // 레지스트리 전체 이미지 갯수
		totalCnt = result.body.registryImageCnt; 
		noScanCnt = totalCnt-scanningCnt-scanCompletedCnt-watingScanCnt;

	} 
	
	// Scan 도넛 차트 데이터 
	createScanChartData(scanSuccessCnt, scanFailCnt); //스캔 성공 / 실패 
	// Scan Completion 도넛 차트 데이터
	createScanCompletionData(scanCompletedCnt, scanningCnt, watingScanCnt,  noScanCnt); // 스캔 완료 / 스캔중 / 스캔 대기 /스캔 미실행
	// Image Assurance 도넛 차트 
	createImageAssuranceData(totalCnt, assuranceImageCnt); // 전체 / 검증된 이미지
}

// Scan 도넛차트 데이터 
function createScanChartData(scanSuccessCnt, scanFailCnt) {
	var id = "scan_"+chartId;
	var title = "Scan";
	var colorPalette = [];
	var data = [];

	if (scanSuccessCnt == 0) {
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#6E9FED');

	}
	if (scanFailCnt == 0) { 
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#F58282');

	}

	data.push({
		value: scanSuccessCnt,
		name: 'Success',
	});

	data.push({
		value: scanFailCnt,
		name: 'Fail',
	});

	createDonutChart(id, title, colorPalette, data); // div id값, 차트 제목, 색상 값, data	
}

// Scan Completion 도넛차트 데이터 
function createScanCompletionData(scanCnt, scanningCnt, watingScanCnt, noScanCnt) {
	var id = "scanCompletion_"+chartId;
	var title = "Scan Completion"
	var colorPalette = [];
	var data = [{
		value: scanCnt,
		name: 'Scan Complete',
	}, 
	{
		value: scanningCnt,
		name: 'Scanning'
	}, 
	{
		value: watingScanCnt,
		name: 'Waiting Scan'
	},
	{
		value: noScanCnt,
		name: 'No Scan'
	}];
	
	
	 //Scan Complete
	if (scanCnt == 0) {
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#00008C');
	}
	//Scanning
	if (scanningCnt == 0) { 
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#0064FF');
	}
	//Waiting Scan
	if (watingScanCnt == 0) { 
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#7aabf7');
	}
	//No Scan
	if (noScanCnt == 0) {
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#96C7ED');
	}

	createDonutChart(id, title, colorPalette, data); // div id값, 차트 제목, 색상 값, data
}

// Image Assurance 도넛차트 데이터
function createImageAssuranceData(registryImageCnt, assuranceCnt) {
	var id = "imageAssurance_"+chartId;
	var title = "Image Assurance";
	var colorPalette = [];
	var data = [{
		value: registryImageCnt,
		name: 'Images',
	}, {
		value: assuranceCnt,
		name: 'Assurance'
	}];

	if (registryImageCnt == 0) {
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#00008C');

	}
	if (assuranceCnt == 0) {
		colorPalette.push('#d2d2d2');
	}
	else {
		colorPalette.push('#FF5A5A');
	}

	createDonutChart(id, title, colorPalette, data); // div id값, 차트 제목, 색상 값, data
}


var createTooltip 
= {
	'Malware' : '탐지된 멀웨어 갯수',
	'Critical': '심각도 : Critical',
	'High': '심각도 : High',
	'Medium': '심각도 : Medium',
	'Low' : '심각도 : Low',
	'Success' : '스캔 성공',
	'Fail': '스캔 실패',
	'Scan Complete' : '스캔 완료',
	'Scanning':'스캔 중',
	'Waiting Scan':'스캔 대기',
	'No Scan': '스캔 미실행',
	'Images' : '레지스트리 내 이미지 갯수',
	'Assurance' : "스캔 검증 된 이미지 갯수",
};

// 도넛 차트 생성 
function createDonutChart(id, title, colorPalette, data) {	
	var dom = document.getElementById(id);
	
	var myChart = echarts.init(dom, null, {
		renderer: 'canvas',
		useDirtyRect: false
	});
	var option = {
		title: {
			text: title,
			left: 'center',
			textStyle: {
				color: 'white',
				fontStyle: 'oblique',
				fontSize: '17',
				fontWeight: '400',
				marginTop: '30',
				lineHeight: '56',
			}
		},
		tooltip: {
			formatter : function(params){
				// 도넛 차트 툴팁 형식 지정 
				return createTooltip[params.data['name']];
			}
		},
		legend: {
			bottom: 'bottom',
			left: 'center',
			textStyle: {
				color: 'white',
				fontSize: '12',
			},
			icon: 'circle',
		},
		series: [{
			color: colorPalette,
			type: 'pie',
			radius: ['30%', '70%'],
			legendHoverLink: true,
			avoidLabelOverlap: true,
			data: data,
			label: {
				show: true,
				position: 'inside',
				formatter: function(param) {
					return param.value == 0 ? '' : param.value;
				},
				textStyle: {
					fontSize: '17',
					fontWeight: 'bold',
					textBorderWidth: '2',
					textBorderColor: 'black',
					color: 'white',
				}
			},
			labelLine: {
				show: false
			},
			name: title, 
		}]
	};
	
	// 위에서 설정한 속성을 차트에 반영합니다.
	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}
	
	// Echarts 클릭 이벤트 처리
	myChart.on('click', function(params) {
	  
	  // 클릭한 항목의 이름 가져오기
	  var seletedSeriesName = params.data.name;
	  // 클릭한 항목의 인덱스 가져오기(index 0 ~ )
	  var dataIndex = params.dataIndex;
	  // 클릭한 항목의 시리즈 이름 가져오기
	  var seriesName = params.seriesName; // 해당 테이터 출력	
	 
 	  // 추가. 도넛차트 id 가져오기
	  var donutChartId = id.replace(/^.*?_/, '');
	  
	  // 클릭 이벤트 처리
	  lf_eventCSPChartClick(donutChartId,data,seriesName,seletedSeriesName); // 상세보기 페이지 출력
	});
}

function lf_eventCSPChartClick(donutChartId,data,seriesName,seletedSeriesName){
	var term = $("#" + donutChartId).parent().parent().parent().find('.sel_box select').val();
	var registryUuid = requestBody['registry_uuid'];
	
	var body = {
		"registryUuid" : registryUuid
	};
	var registryName;
	cf_requestServer(_TR_CLOUD_CONTAINER_REGISTRY_SERACH, body, function(data){
			registryName  =  data.body.registryName;
	},false);
	// 0808 추가. csp 데이터 저장.(dashboard.js / lf_openDashboardFullWindow() 참고)
	var newWindowName = donutChartId;
	
	// csp 데이터 조회 시 필요한 값을 하나의 객체에 저장
	var cspData = {
		'term': term ,
		'registryUuid': registryUuid,
		'registryName': registryName,
		'selectedScanStatus' :seletedSeriesName,
	}
	$('#dashboardCspData').attr(newWindowName, JSON.stringify(cspData));

	// 열려있는 팝업창 상태 체크 후 닫기
	checkOpenStatusToChuldWindow(seriesName);
	
	// 자식 팝업창 생성
	if(seriesName=="Malware") malwareWindow = window.open('/dashboardEventIsMalwareView.do',newWindowName,'width=1600,height=700,location=no,status=no,scrollbars=yes');
	else if(seriesName == "Vulnerabilities") vulnerabilitiesWindow = window.open('dashboardEventIsVulnerabilityView.do',newWindowName,'width=1600,height=960,location=no,status=no,scrollbars=yes');
	else if(seriesName=="Scan") scanWindow = window.open('/dashboardEventIsScanView.do',newWindowName,'width=1600,height=766,location=no,status=no,scrollbars=yes');
	else if(seriesName=="Scan Completion") scanCompletionWindow = window.open('/dashboardEventIsScanCompletionView.do',newWindowName,'width=1600,height=766,location=no,status=no,scrollbars=yes');
	else if(seriesName=="Image Assurance") imageAssuranceWindow = window.open('/dashboardEventIsImageAssuranceView.do',newWindowName,'width=1600,height=766,location=no,status=no,scrollbars=yes');
}

// 열려있는 팝업창 상태 체크 후 상태 초기화
function checkOpenStatusToChuldWindow(seriesName){
	if(seriesName=="Malware" && malwareWindow) {
		malwareWindow.close(); 
		malwareWindow = null;
	}
	else if(seriesName=="Vulnerabilities" && vulnerabilitiesWindow != null) {
		vulnerabilitiesWindow.close();
		vulnerabilitiesWindow = null;
	}
	else if(seriesName=="Scan" && scanWindow != null){
		scanWindow.close();
		scanWindow = null;
	} 
	else if(seriesName=="Scan Completion" && scanCompletionWindow != null){
		scanCompletionWindow.close();
		scanCompletionWindow = null;
	} 
	else if(seriesName=="Image Assurance" && imageAssuranceWindow != null){
		imageAssuranceWindow.close();
		imageAssuranceWindow = null; 
	}
}
function sendStatusToChildWindow(refreshChartId) {
	if(refreshChartId === chartId){
		// 브라우저 생성 정의
		if (malwareWindow && !malwareWindow.closed) malwareWindow.postMessage(true, "*");
	    if (vulnerabilitiesWindow && !vulnerabilitiesWindow.closed) vulnerabilitiesWindow.postMessage(true, "*");
	    if (scanWindow && !scanWindow.closed) scanWindow.postMessage(true, "*");
	    if (scanCompletionWindow && !scanCompletionWindow.closed) scanCompletionWindow.postMessage(true, "*");
	    if (imageAssuranceWindow && !imageAssuranceWindow.closed) imageAssuranceWindow.postMessage(true, "*");
	};
}

function lf_serviceCall600403(pageCacheKey){
	var body = {
		"pageCacheKey" : pageCacheKey
	};
	cf_requestServer(_TR_DASHOBOARD_IS_DASHBOARD_CACHE_CLEAR, body, function(data,body){
		console.log("Cache Clear"); 
	});
}