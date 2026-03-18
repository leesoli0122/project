/**
 * 대시보드 > 이미지 시큐리티 > PIE CHART 화면 구성
 */
var chartId; 

//윈도우 자식 팝업창
var malwareWindow;
var vulnerabilitiesWindow;
var scanWindow;
var scanCompletionWindow;
var imageAssuranceWindow;

// 600400 요청 시 body 값 저장(term , chartId, registryUuid) 
var requestBody;

// 차트 구성 색상 
var chartColor = { 
	'Critical': '#C1282E', 'High': '#F7941F', 'Medium': '#FFD52F', 'Low': '#39B549',
	'malware-color':'#2ADB6B',
	'success-color':'#4863FC',
	'fail-color':'#E01E5F',
	'sc-success-color':'#2ADB77',
	'sc-scanning-color':'#79D2DE',
	'sc-wait-color':'#DE798E', 
	'no-scan-color': '#b2b2b2',
	'image-color':'#9821FF',
	'assurance-color':'#FF21AE'
};


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
		key: 'malware',
		value: malware,
		name: 'Malware'
	});
	colorPalette.push(chartColor['malware-color']);

	createDonutChart(id, title, colorPalette, data, malware); // div id값, 차트 제목, 색상 값, data , totalChartDataCnt
}

function getVulnerabilityCnt(result) {
	var id = "vulnerabilities_"+chartId;
	var title = "Vulnerabilities";
	
	var colorPalette = [];
	var data = [];
	var totalChartDataCnt = 0 ;
	
	var resultLength =  result.body.vulnerabilityCnt.length;
	
	if (resultLength == 0) {
		colorPalette.push(null);
		data.push({
			key:'vulnerabilities',
			value: 0,
			name: 'Vulnerability',
		});
	}
	else{
		$.each(result.body.vulnerabilityCnt, function(index,value){
			var severity = value.severity;
			colorPalette.push(chartColor[severity]);
			data.push({
				key:'vulnerabilities',
				value: value.count,
				name: severity
			});
			totalChartDataCnt +=  value.count; // 01-23 추가. 차트 css 영역 지정
		});
	}
	createDonutChart(id, title, colorPalette, data, totalChartDataCnt); // div id값, 차트 제목, 색상 값, data, totalChartDataCnt(01-23 추가. 차트 css 영역 지정)
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
	var totalChartDataCnt = scanSuccessCnt + scanFailCnt; 

	if (scanSuccessCnt == 0) {
		colorPalette.push(chartColor['success-color']);
	}
	else {
		colorPalette.push(chartColor['success-color']);
	}
	if (scanFailCnt == 0) { 
		colorPalette.push(chartColor['fail-color']);
	}
	else {
		colorPalette.push(chartColor['fail-color']);
	}

	data.push({
		key: 'scan',
		value: scanSuccessCnt,
		name: 'Success',
	});
	data.push({
		key: 'scan',
		value: scanFailCnt,
		name: 'Fail',
	});

	createDonutChart(id, title, colorPalette, data , totalChartDataCnt); // div id값, 차트 제목, 색상 값, data, totalChartDataCnt
}

// Scan Completion 도넛차트 데이터 
function createScanCompletionData(scanCnt, scanningCnt, watingScanCnt, noScanCnt) {
	var id = "scanCompletion_"+chartId;
	var title = "Scan Completion"
	var colorPalette = [];
	var totalChartDataCnt = scanCnt + scanningCnt + watingScanCnt + noScanCnt;
	var data = [{
		key: 'scan_completion',
		value: scanCnt,
		name: 'Scan Complete',
	}, 
	{
		key: 'scan_completion',
		value: scanningCnt,
		name: 'Scanning'
	}, 
	{
		key: 'scan_completion',
		value: watingScanCnt,
		name: 'Waiting Scan'
	},
	{
		key: 'scan_completion',
		value: noScanCnt,
		name: 'No Scan'
	}];
	
	
	 //Scan Complete
	if (scanCnt == 0) {
		colorPalette.push(chartColor['sc-success-color']);
	}
	else {
		colorPalette.push(chartColor['sc-success-color']);
	}
	//Scanning
	if (scanningCnt == 0) { 
		colorPalette.push(chartColor['sc-scanning-color']);
	}
	else {
		colorPalette.push(chartColor['sc-scanning-color']);
	}
	//Waiting Scan
	if (watingScanCnt == 0) { 
		colorPalette.push(chartColor['sc-wait-color']);
	}
	else {
		colorPalette.push(chartColor['sc-wait-color']);
	}
	//No Scan
	if (noScanCnt == 0) {
		colorPalette.push(chartColor['no-scan-color']);
	}
	else {
		colorPalette.push(chartColor['no-scan-color']);
	}
	createDonutChart(id, title, colorPalette, data , totalChartDataCnt); // div id값, 차트 제목, 색상 값, data, totalChartDataCnt
}

// Image Assurance 도넛차트 데이터
function createImageAssuranceData(registryImageCnt, assuranceCnt) {
	var id = "imageAssurance_"+chartId;
	var title = "Image Assurance";
	var colorPalette = [];
	var totalChartDataCnt = registryImageCnt;

	var data = [{
		key:'image_assurance',
		value: registryImageCnt,
		name: 'Images',
	}, {
		key:'image_assurance',
		value: assuranceCnt,
		name: 'Assurance'
	}];

	if (registryImageCnt == 0) {
		colorPalette.push(chartColor['image-color']);
	}
	else {
		colorPalette.push(chartColor['image-color']);

	}
	if (assuranceCnt == 0) {
		colorPalette.push(chartColor['assurance-color']);
	}
	else {
		colorPalette.push(chartColor['assurance-color']);
	}

	createDonutChart(id, title, colorPalette, data , totalChartDataCnt); // div id값, 차트 제목, 색상 값, data, totalChartDataCnt
}


var createChartTitle 
= {
	'malware': 'Malware',
	'vulnerabilities': 'Vulnerabilities',
	'scan': 'Scan',
	'scan_completion': 'Scan Completion',
	'image_assurance':  'Image Assurance',
}
var createClassName
= {
	'Malware' : 'malware',
	'Critical': 'critical',
	'High': 'high',
	'Medium': 'medium',
	'Low' : 'low',
	'Success' : 'success',
	'Fail': 'fail',
	'Scan Complete' : 'sc-success',
	'Scanning':'sc-scanning',
	'Waiting Scan':'sc-wait',
	'No Scan': 'sc-noscan',
	'Images' : 'image',
	'Assurance' : "assurance",
};
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
/**
 * 컨테이너 이미지 스캔 Summary 도넛 차트 생성 
 * 순서
 * 1. 기존 도넛차트 그래프 가져오기
 * 2. 기존 도넛차트 그래프 삭제 
 * 3. 차트를 표시하는 div 생성 : donut-chart + data.key 값 
 * 4. 새롭게 추가되는 차트 div 생성
 *	1) chart : 도넛 차트 생성 
 *	2) chart_data :  차트 데이터 생성 
 * 5. 데이터 추가
 * 	1) 도넛 차트에 데이터 추가
 *  2) 차트 데이터에 데이터 추가
 * 6. 최종 div 형태 구성
 * 
 * 툴팁 추가는 createDonutChartForContainerEvent() 참조
 */
function createDonutChart(id, title, colorPalette, data , totalChartDataCnt) {
	var dashboardChartId = id.replace(/^.*?_/, ''); // 정규식을 통해 실제 id값 찾음 .
	var chartKey = data[0].key;
	var chartTitle = createChartTitle[chartKey];

	// 1. 기존 도넛 차트 그래프 가져오기(graph 클래스의 id)
	var donutChartGraph =  $('#' + id);
	// 2. 기존 도넛 차트 그래프 삭제
	donutChartGraph.empty();
	// 3. 차르를 표시할 div 요소 생성
	var donutChartDIV = $('<div class="donut-chart ' + chartKey + '"></div>');
	// 4. 차트 클래스안에 생성 될 차트 데이터 div 객체
	// 도넛 차트 div
	var chartDIV = $('<div class="chart"></div>');
	// 차트 데이터 div 
	var chartDataDIV = $('<div class="chart_data"></div>');
    var chartDataDL = $('<dl></dl>');

    // 5. 데이터 추가 
    // 1) 도넛 차트 데이터 추가
    $.each(data, function(index, chartData) {
		var chartDataName = chartData.name;
		var chartClassName = createClassName[chartDataName]; 
		var chartToolTip = createTooltip[chartDataName]; 
		
		var addChartData = 
	    `<div class='${chartClassName}'>
	        <p class='${chartClassName}-chart tooltip' onclick='lf_eventCSPChartClick("${dashboardChartId}", "${data}", "${chartTitle}", "${chartDataName}")'></p>
	    	<span class="tooltiptext" style="border: 2px solid ${colorPalette[index]}">${chartToolTip}</span>
	    </div>`;
		chartDIV.append(addChartData);
	});
	
	// 2) 차트 데이터 추가
	$.each(data, function(index, chartData){
		if(index == 0) chartDataDL.append('<dt class="tit">'+chartTitle +'</dt>');
		
		var chartDataName = chartData.name;
		var chartDataValue = chartData.value;
		var chartClassName = createClassName[chartDataName]; 
		chartDataDL.append(`<dd class="${chartClassName} value"><span>${chartDataName} : ${chartDataValue}</span></dd>`);

		//total 값과 계산하여 css 비율 계산 후  draw 함수 호출 
		var cssArea = (chartDataValue / totalChartDataCnt) * 100;
   		draw(cssArea, '.'+chartClassName+'-chart', colorPalette[index]);
	});
	
	// 6. 최종 div 형태 구성
    chartDataDIV.append(chartDataDL);
    donutChartDIV.append(chartDIV);
    donutChartDIV.append(chartDataDIV);
    donutChartGraph.append(donutChartDIV);
    
   
}

/**
 * 차트 css 변경 함수
 */
function draw(max, classname, colorname){
	   var i=1;
		var func1 = setInterval(function(){
		  if(i<=max){ // 초과(<)로 설정하는 경우, 100일때 99에서 멈춤
			  color1(i,classname,colorname);
			  i++;
		  } else{
			clearInterval(func1);
		  }
		},10);
}
function color1(i, classname,colorname){
   $(classname).css({
		"background":"conic-gradient("+colorname+" 0% "+i+"%, transparent "+i+"% 100%)"
   });
}

function lf_eventCSPChartClick(dashboardChartId,data,seriesName,seletedSeriesName){
	var registryUuid = requestBody['registry_uuid'];
	var body = {
		"registryUuid" : registryUuid
	};
	var registryName;
	cf_requestServer(_TR_CLOUD_CONTAINER_REGISTRY_SERACH, body, function(data){
		registryName  =  data.body.registryName;
	},false);
	
	// 0808 추가. csp 데이터 저장.(dashboard.js / lf_openDashboardFullWindow() 참고)
	var newWindowName = dashboardChartId;
	
	// csp 데이터 조회 시 필요한 값을 하나의 객체에 저장
	var cspData = {
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


/**
 * 열려있는 팝업창 상태 체크 후 상태 초기화
 */
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
/**
 * 열려있는 상세보기 페이지 캐시 제거 함수
 */
function lf_serviceCall600403(pageCacheKey){
	var body = {
		"pageCacheKey" : pageCacheKey
	};
	cf_requestServer(_TR_DASHOBOARD_IS_DASHBOARD_CACHE_CLEAR, body, function(data,body){
		console.log("Cache Clear"); 
	});
}
