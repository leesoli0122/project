
var lvar_defaultChartConf = {
		'term': 'DAY',
		'interval': 60
};

// 대시보드 cluster, registry selectBox 관련 class name
var NEED_CLUSTER_SELECT = 'need_cluster_select';
var NEED_REGISTRY_SELECT = 'need_registry_select';
/**
 * 
 * @returns type 1: term, interval / type 2: interval
 * 
 */
function lf_getChartELConf(chartType){
	var returnData = {
			width: 0,
			height: 0,
			func: null
	};
	
	/****************************************************************************/
	/* Firewall */
	/****************************************************************************/
	if(chartType == 'firewallTrendList'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600001;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 이벤트 트렌드';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'date'
		}
		
	} 
	else if(chartType == 'firewallPolicyTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600002;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 정책 Top5';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'signature'
		}
	} 
	else if(chartType == 'firewallServerTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600003;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 자산 Top5';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'equiplist'
		}
	} 
	else if(chartType == 'firewallSrcIPTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600004;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 Src IP Top5';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'src_ip'
		}
	} 
	else if(chartType == 'firewallSrcPortTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600005;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 Src PORT Top5';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'src_port'
		}
	}
	else if(chartType == 'firewallDstIPTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600007;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 Dst IP Top5';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'dest_ip'
		}
	} 
	else if(chartType == 'firewallDstPortTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600008;
		returnData['params'] = ['term'];
		returnData['title'] = '방화벽 Dst PORT Top5';
		returnData['info'] = {
			'title': '방화벽 이벤트',
			'param': 'dest_port'
		}
	}
	else if(chartType == 'firewallRecentEventTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600006;
		returnData['params'] = [];
		returnData['title'] = '방화벽 최근 이벤트';
	}
	
	
	/****************************************************************************/
	/* IPS */
	/****************************************************************************/
	else if(chartType == 'ipsEventTrend'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600021;
		returnData['params'] = ['term'];
		returnData['title'] = '침입방지시스템 이벤트 트렌드';
		returnData['info'] = {
			'title': '침입방지시스템 이벤트',
			'event_type': 'alert',
			'param': 'date'
		}
	}
	else if(chartType == 'ipsCurrentPolictTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600022;
		returnData['params'] = ['term'];
		returnData['title'] = '침입방지시스템 정책 Top5';
		returnData['info'] = {
			'title': '침입방지시스템 이벤트',
			'event_type': 'alert',
			'param': 'signature_id'
		}
	} 
	else if(chartType == 'ipsCurrentComputerTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600023;
		returnData['params'] = ['term'];
		returnData['title'] = '침입방지시스템 최근 자산';
		returnData['info'] = {
			'title': '침입방지시스템 이벤트',
			'event_type': 'alert',
			'param': 'equiplist'
		}
	} 
	else if(chartType == 'ipsSrcIpActivityTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600024;
		returnData['params'] = ['term'];
		returnData['title'] = '침입방지시스템 SrcIP Top5';
		returnData['info'] = {
			'title': '침입방지시스템 이벤트',
			'event_type': 'alert',
			'param': 'src_ip'
		}
	}
	else if(chartType == 'ipsDstIpActivityTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600025;
		returnData['params'] = ['term'];
		returnData['title'] = '침입방지시스템 Dst IP Top5';
		returnData['info'] = {
			'title': '침입방지시스템 이벤트',
			'event_type': 'alert',
			'param': 'dest_ip'
		}
	}
	else if(chartType == 'ipsWebOccupation'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_treemap';
		returnData['func'] = lf_serviceCall600026;
		returnData['params'] = ['interval'];
		returnData['title'] = '침입방지시스템 웹 점유도';
		returnData['info'] = {
			'title': '침입방지시스템 이벤트',
			'param': 'hostname',
			'event_type': 'http',
			'param': 'url'
		}
	}
	else if(chartType == 'ipsCurrentEventTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600027;
		returnData['params'] = [];
		returnData['title'] = '침입방지시스템 최근 이벤트';
		returnData['info'] = {
			'title': '침입방지시스템 최근 이벤트',
			'event_type': 'alert'
		}
	}
	/****************************************************************************/
	/* AV */
	/****************************************************************************/
	else if(chartType == 'avTrendList'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600041;
		returnData['params'] = ['term'];
		returnData['title'] = '멀웨어 행위 탐지 이벤트 트렌드';
		returnData['info'] = {
			'title': '멀웨어 이벤트',
			'event_type': 'alert',
			'param': 'date'
		}
	}
	else if(chartType == 'avStatusList'){
		returnData['width'] = 25;
		returnData['chart'] = 'chart_pie';
		returnData['func'] = lf_serviceCall600042;
		returnData['params'] = ['term'];
		returnData['title'] = '멀웨어 행위 탐지 후 처리 상태';
		returnData['info'] = {
			'title': '멀웨어 이벤트',
			'event_type': 'alert',
			'param': 'action'
		}
	}
	else if(chartType == 'avCludListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600043;
		returnData['params'] = ['term'];
		returnData['title'] = '멀웨어 행위 탐지 된 자산 Top5';
		returnData['info'] = {
			'title': '멀웨어 이벤트',
			'event_type': 'alert',
			'param': 'equiplist'
		}
	}
	else if(chartType == 'avEventListTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600044;
		returnData['params'] = [];
		returnData['title'] = '멀웨어 최근 행위 탐지 된 바이러스';
		returnData['info'] = {
			'title': '멀웨어 최근 탐지된 바이러스',
			'event_type': 'alert'
		}
	}
	/****************************************************************************/
	/* Malware(ClamAV) */
	/****************************************************************************/
	else if(chartType == 'malwareTrendList'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600321;
		returnData['params'] = ['term'];
		returnData['title'] = '멀웨어 탐지 이벤트 트렌드';
		returnData['info'] = {
			'title': '멀웨어 이벤트',
			'event_type': 'alert',
			'param': 'date'
		}
	}
	else if(chartType == 'malwareStatusList'){
		returnData['width'] = 25;
		returnData['chart'] = 'chart_pie';
		returnData['func'] = lf_serviceCall600322;
		returnData['params'] = ['term'];
		returnData['title'] = '멀웨어 처리 상태';
		returnData['info'] = {
			'title': '멀웨어 이벤트',
			'event_type': 'alert',
			'param': 'action'
		}
	}
	else if(chartType == 'malwareCludListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600323;
		returnData['params'] = ['term'];
		returnData['title'] = '멀웨어 탐지 된 자산 Top5';
		returnData['info'] = {
			'title': '멀웨어 이벤트',
			'event_type': 'alert',
			'param': 'equiplist'
		}
	}
	else if(chartType == 'malwareEventListTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600324;
		returnData['params'] = [];
		returnData['title'] = '멀웨어 최근 스캔 탐지 된 바이러스';
		returnData['info'] = {
			'title': '멀웨어 최근 탐지된 바이러스',
			'event_type': 'alert'
		}
	}
	/****************************************************************************/
	/* FILEINT */
	/****************************************************************************/
	else if(chartType == 'fileIntTrendList'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600061;
		returnData['params'] = ['term'];
		returnData['title'] = '파일 무결성 이벤트 트렌드';
		returnData['info'] = {
			'title': '파일무결성 이벤트',
			'param': 'date'
		}
	}
	else if(chartType == 'fileIntFileListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600062;
		returnData['params'] = ['term'];
		returnData['title'] = '파일 무결성 위반 파일명 Top5';
		returnData['info'] = {
			'title': '파일무결성 이벤트',
			'param': 'path'
		}
	}
	else if(chartType == 'fileIntCludListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600063;
		returnData['params'] = ['term'];
		returnData['title'] = '파일 무결성 발생 자산 Top5';
		returnData['info'] = {
			'title': '파일무결성 이벤트',
			'param': 'equiplist'
		}
	}
	else if(chartType == 'fileIntEventListTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600064;
		returnData['params'] = [];
		returnData['title'] = '파일 무결성 최근 이벤트';
	}
	/****************************************************************************/
	/* APPCTL */
	/****************************************************************************/
	else if(chartType == 'appCtlTrendList'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600081;
		returnData['params'] = ['term'];
		returnData['title'] = '실행파일통제 이벤트 트렌드';
		returnData['info'] = {
			'title': '실행파일통제 이벤트',
			'param': 'date'
		}
	}
	else if(chartType == 'appCtlListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600082;
		returnData['params'] = ['term'];
		returnData['title'] = '실행파일통제 위반 파일명 Top5';
		returnData['info'] = {
			'title': '실행파일통제 이벤트',
			'param': 'path'
		}
	}
	else if(chartType == 'appCtlCludListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600083;
		returnData['params'] = ['term'];
		returnData['title'] = '실행파일통제 발생 자산 Top5';
		returnData['info'] = {
			'title': '실행파일통제 이벤트',
			'param': 'equiplist'
		}
	}
	else if(chartType == 'appCtlEventListTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600084;
		returnData['params'] = [];
		returnData['title'] = '실행파일통제 최근 이벤트';
	}
	/****************************************************************************/
	/* PAMACL */
	/****************************************************************************/
	else if(chartType == 'pamAclTrendList'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600301;
		returnData['params'] = ['term'];
		returnData['title'] = '서비스 제어 위반 이벤트 트렌드';
		returnData['info'] = {
			'title': '서비스 제어 이벤트',
			'param': 'date'
		}
	}
	else if(chartType == 'pamAclServiceListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600302;
		returnData['params'] = ['term'];
		returnData['title'] = '서비스 제어 위반 서비스 Top5';
		returnData['info'] = {
			'title': '서비스 제어 이벤트',
			'param': 'service'
		}
	}
	else if(chartType == 'pamAclUserListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600303;
		returnData['params'] = ['term'];
		returnData['title'] = '서비스 제어 위반 사용자 Top5';
		returnData['info'] = {
			'title': '서비스 제어 이벤트',
			'param': 'user'
		}
	}
	else if(chartType == 'pamAclIPListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600304;
		returnData['params'] = ['term'];
		returnData['title'] = '서비스 제어 위반 IP Top5';
		returnData['info'] = {
			'title': '서비스 제어 이벤트',
			'param': 'ip'
		}
	}
	else if(chartType == 'pamAclCludListTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600305;
		returnData['params'] = ['term'];
		returnData['title'] = '서비스 제어 위반 발생 자산 Top5';
		returnData['info'] = {
			'title': '서비스 제어 이벤트',
			'param': 'equiplist'
		}
	}
	else if(chartType == 'pamAclEventListTopN'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600306;
		returnData['params'] = [];
		returnData['title'] = '서비스 제어 최근 이벤트';
	}
	
	/****************************************************************************/
	/* IMAGE SECURITY */
	/****************************************************************************/
	
	else if(chartType == 'cspDashboardList'){
		returnData['width'] = 100; // css. w_100
		returnData['chart'] = 'chart_donut';
		returnData['func'] = lf_serviceCall600400;
		returnData['params'] = ['term']; // day / week 
		returnData['title'] = '컨테이너 이미지 스캔 Summary';
	}
	
	else if(chartType == 'cspMalwareTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600500;
		returnData['params'] = ['term'];
		returnData['title'] = '컨테이너 이미지 멀웨어 Top 5';
	} 
	
	else if(chartType == 'cspVulnerabilityTopN'){
		returnData['width'] = 25;
		returnData['chart'] = 'top5';
		returnData['func'] = lf_serviceCall600501;
		returnData['params'] = ['term'];
		returnData['title'] = '컨테이너 이미지 취약성 Top 5';
	} 
	
	else if(chartType == 'cspScanStatusTable'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600502;
		returnData['params'] = ['term'];
		returnData['title'] = '컨테이너 이미지 스캔 현황';
	}
	
	else if(chartType == 'cspDistributionControlStatusTable'){
		returnData['width'] = 50;
		returnData['chart'] = 'table';
		returnData['func'] = lf_serviceCall600503;
		returnData['params'] = ['term'];
		returnData['title'] = '컨테이너 이미지 실행 제어 현황';
	}
	
	/****************************************************************************/
	/* COMPLIANCE SCAN */
	/****************************************************************************/
	
	else if(chartType == 'complianceTotalRate'){
		returnData['width'] = 25;
		returnData['chart'] = 'chart_donut';
		returnData['func'] = lf_serviceCall600600;
		returnData['params'] = ['term'];
		returnData['title'] = '클러스터 규정 준수율';
	}
	
	else if(chartType == 'complianceRateForRegulations'){
		returnData['width'] = 25;
		returnData['chart'] = 'chart_bar';
		returnData['func'] = lf_serviceCall600601;
		returnData['params'] = ['term'];
		returnData['title'] = '프레임워크 별 규정 준수율';
	} 
	
	else if(chartType == 'complianceEvaluationTrend'){
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600602;
		returnData['params'] = ['term'];
		returnData['title'] = '클러스터 규정준수 평가 추이';
	} 
	
	else if(chartType == 'complianceScanDetailList'){
		returnData['width'] = 100;
		returnData['chart'] = 'table';
		returnData['func'] = initComplianceScanDetailList;
		returnData['params'] = ['term'];
		returnData['title'] = '클러스터 규정준수 스캔 상세 현황';
	}	
	/****************************************************************************/
	/* Container Event */
	/****************************************************************************/
	else if (chartType == 'cspContainerSecurityRisk') {
		returnData['width'] = 50;
		returnData['chart'] = 'chart_donut';
		returnData['func'] = lf_serviceCall600621;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container Security Risk';
	}
	else if (chartType == 'cspContainerEventsPolicyTop5') {
		returnData['width'] = 50;
		returnData['chart'] = ['table','chart_line'];
		returnData['func'] = containerEventsPolicy;
		returnData['params'] = ['term'];
		returnData['title'] = 'Top5 Container Events <span class=\'containerEvent dashboard_standard\'>(by policy)</span>';
		returnData['NChart'] = true;
		returnData['applyCSS'] = 'double_chart'; // N차트의 css중 차트 2개일때의 css를 적용	
	} 
/*	else if (chartType == 'cspContainerEventsPolicyCount') {// 현재 사용 x
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600611;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container Events Count <span class=\'containerEvent dashboard_standard\'>(by policy)</span>';
	}*/
	else if (chartType == 'cspContainerRuntimeEventsRuleTop5') {
		returnData['width'] = 50;
		returnData['chart'] = ['table','chart_line'];
		returnData['func'] = containerRuntimeEventsRule;
		returnData['params'] = ['term'];
		returnData['title'] = 'Top5 Container <span class=\'containerEvent dashboard_runtime\'>Runtime</span> Events <span class=\'containerEvent dashboard_standard\'>(by rule)</span>';
		returnData['NChart'] = true;
		returnData['applyCSS'] = 'double_chart'; // N차트의 css중 차트 2개일때의 css를 적용
	}
/*	else if (chartType == 'cspContainerRuntimeEventsRuleCount') {// 현재 사용 x
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600613;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container <span class=\'containerEvent dashboard_runtime\'>Runtime</span> Events Trend <span class=\'containerEvent dashboard_standard\'>(by rule)</span>';
	}*/
	else if (chartType == 'cspContainerRuntimeEventsSeverityTable') {
		returnData['width'] = 50;
		returnData['chart'] = ['table','chart_line'];
		returnData['func'] = containerRuntimeEventsSeverity;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container <span class=\'containerEvent dashboard_runtime\'>Runtime</span> Events <span class=\'containerEvent dashboard_standard\'>(by rule severity)</span>';
		returnData['NChart'] = true;
		returnData['applyCSS'] = 'double_chart'; // N차트의 css중 차트 2개일때의 css를 적용	
	}
/*	else if (chartType == 'cspContainerRuntimeEventsSeverityCount') { // 현재 사용 x
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600615;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container <span class=\'containerEvent dashboard_runtime\'>Runtime</span> Events Trend <span class=\'containerEvent dashboard_standard\'>(by rule severity)</span>';
	}*/
	else if (chartType == 'cspContainerBuildtimeEventsRuleTop5') {
		returnData['width'] = 50;
		returnData['chart'] = ['table','chart_line'];
		returnData['func'] = containerBuildtimeEventsRule;
		returnData['params'] = ['term'];
		returnData['title'] = 'Top5 Container <span class=\'containerEvent dashboard_buildtime\'>Buildtime</span> Events <span class=\'containerEvent dashboard_standard\'>(by rule)</span>';
		returnData['NChart'] = true;
		returnData['applyCSS'] = 'double_chart'; // N차트의 css중 차트 2개일때의 css를 적용
	}
/*	else if (chartType == 'cspContainerBuildtimeEventsRuleCount') { // 현재 사용 x
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600617;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container <span class=\'containerEvent dashboard_buildtime\'>Buildtime</span> Events Trend <span class=\'containerEvent dashboard_standard\'>(by rule)</span>';
	}*/
	else if (chartType == 'cspContainerBuildtimeEventsSeverityTable') {
		returnData['width'] = 50;
		returnData['chart'] = ['table','chart_line'];
		returnData['func'] = containerBuildtimeEventsSeverity;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container <span class=\'containerEvent dashboard_buildtime\'>Buildtime</span> Events <span class=\'containerEvent dashboard_standard\'>(by rule severity)</span>';
		returnData['NChart'] = true;
		returnData['applyCSS'] = 'double_chart'; // N차트의 css중 차트 2개일때의 css를 적용	
	}
/*	else if (chartType == 'cspContainerBuildtimeEventsSeverityCount') { // 현재 사용 x
		returnData['width'] = 50;
		returnData['chart'] = 'chart_line';
		returnData['func'] = lf_serviceCall600619;
		returnData['params'] = ['term'];
		returnData['title'] = 'Container <span class=\'containerEvent dashboard_buildtime\'>Buildtime</span> Events Trend <span class=\'containerEvent dashboard_standard\'>(by rule severity)</span>';
	}*/
	

	return returnData
}

function lf_setPieChart(chartData, elId, title, term){
	$('#'+elId).fadeOut(); // elId = chartId
	var $targetDIV = $('#'+elId);
	var pieChart = echarts.init(document.getElementById(elId));
	var colorArr = ['#4d67cc','#3faeb8','#da9527', '#9f9e9e', '#55a559', '#ddd']
	
	var legendData = [];
	var pieData = [];
	if(chartData.length > 0){
		for(var i = 0; i < chartData.length; i++){
			var pieRaw = chartData[i];
			legendData.push({
				name : pieRaw['caption'],
				code : pieRaw['code'],
				icon : 'circle',
				
			});
			
			pieData.push({
				value: pieRaw['cnt'],
				name : pieRaw['caption'],
				code : pieRaw['code'],
				itemStyle : {
					color : colorArr[i],
				},
				emphasis : {
					itemStyle : {
						color : colorArr[i],
						opacity : 1,
					},
				}
			});
			
		}
	
		var option = {
			title : {
				text : title,
				left : 'center',
				top : 'center',
				textStyle : {
					color : '#ddd',
					fontFamily: 'SpoqaHanSans',
					fontWeight: 400,
					fontSize : 18
				},
			},
			legend : {
				left : 'center',
				bottom : '0',
				data : legendData,
				textStyle: {
		      color: '#e5e5e5'
		    },
			},
			tooltip : {
				triggerOn : 'mousemove',
				backgroundColor : 'rgba(47,55,66,0.8)',
				transitionDuration : 0,
				textStyle : {
					color : '#bbbbbb',
					fontWeight : 400,
					fontSize : 11,
				},
				position : 'inside',
				renderMode : 'html',
				formatter: '{b} <span style="color: #ed960a">{d}%</span>',
			},
			series : [ {
				type : 'pie',
				radius : [ '30%', '60%' ],
				itemStyle: {
					emphasis: {
						shadowBlur : 4,
						shadowOffsetX : 1,
						shadowColor : 'rgba(0, 0, 0, 0.4)'
					}
				},
				label: {
					position: 'outer',
					alignTo: 'labelLine',
					bleedMargin: 5,
					color : '#bbbbbb',
					fontWeight: 400,
					fontSize : 11
				},
				data : pieData,
			} ]
		};
		pieChart.setOption(option);
		window.addEventListener('resize', function() {
			pieChart.resize();
		});
		pieChart.on('mouseover', 'series', function() {
			$(this).attr('rel', 'event_modal3');
		});
		pieChart.on('click', 'series', function(dot) {
			var $self = $(this);
			var $thisrel = $self.attr('rel');
			var $target = $('#' + $thisrel);
			
			var code = dot.data.code;
			var action = dot.name;
			var chartType = $targetDIV.data('chartType');
			var startTime = '';
			var endTime = '';
			if(term == 'DAY'){
				var m = moment(new Date());
				startTime = m.subtract(1, 'd').format('YYYY-MM-DD HH:00:00');
				endTime = moment(new Date()).format('YYYY-MM-DD HH:00:00');
			}
			else{
				var m = moment(new Date());					
				startTime = m.subtract(7, 'd').format('YYYY-MM-DD 00:00:00');
				endTime = moment(new Date()).format('YYYY-MM-DD 23:59:59');
			}
			
			if(code) action = code;
			
			var param = {
				'chartType': chartType,
				'body':{
					'starttime': startTime,
					'endtime': endTime,
					'parameters': {
						'name': 'action',
						'value': action,
						'operation': 1							
					}						
				}
			};

			if(chartType.indexOf('av') >= 0) cf_openDialog('DASHBOARD_CHART_AV_EVENT', null, param);
			else if(chartType.indexOf('malware') >= 0) cf_openDialog('DASHBOARD_CHART_MALWARE_EVENT', null, param);
			else console.log('chartType : ' + chartType);
			 
			
			$target.find(".close").on('keydown', function(e) {
				if (e.which == '9') {
					$target.attr('tabindex', '0').focus();
				}
			});
			$target.find(".close").on('click', function(e) {
				e.preventDefault();
				$target.fadeOut(250);
				removeDim();
				$self.focus();
				$(this).off('click');
				$target.removeClass('open');
				var isVisible = $target.is(':visible');
				var modalLength = $('.modal:visible').length;

				if (isVisible) {
					if (modalLength > 1) {
						$target.fadeOut(250);
					} else {
						$('.dim').fadeOut(250);
					}
				}
			});
			$target.find(".modalLoad").on('click', function(e) {
				e.preventDefault();
				$target.fadeOut(250);
				$self.focus();
				var isVisible = $target.is(':visible');
				var modalLength = $('.modal:visible').length;

				if (isVisible) {
					if (modalLength > 1) {
						$target.fadeOut(250);
					} else {
						$('.dim').fadeOut(250);
					}
				}
			});
			$(document).on("keyup", function(e) {
				if (e.which == '27') {
					$target.fadeOut(250);
					removeDim();
					$self.focus();
					$target.attr('class', 'modal');
				}
			});
			$target.parents('html body').find(".dim").click(function(e) {
				e.preventDefault();
				if (e.which == '9') {
					$target.attr('tabindex', '0').focus();
				}
				$target.fadeOut(250);
				removeDim();
				$self.focus();
				$(this).off('click');
				$target.removeClass('open');
				var isVisible = $target.is(':visible');
				var modalLength = $('.modal:visible').length;

				if (isVisible) {
					if (modalLength > 1) {
						$target.fadeOut(250);
					} else {
						$('.dim').fadeOut(250);
					}
				}
			});
		});
		
	}
	
	$('#'+elId).fadeIn();
}

/**
 * 
 * @param chartData
 * @param elId
 * @returns 개발 필요 (데이터 변경)
 */
function lf_setTreeMap(chartData, elId, term){
	$('#'+elId).fadeOut();
	var $targetDIV = $('#'+elId);
	
	if(chartData.length > 0){
		
		// 부모
		var parentObj = {};
		for(var i = 0; i < chartData.length; i++){
			var parent = chartData[i]['tree1'];
			var child = chartData[i]['tree2'];
			var value = chartData[i]['cnt'];
			
			if(parentObj[parent]){
				parentObj[parent]['value'] = parentObj[parent]['value'] + value;
			}
			else{
				parentObj[parent] = {
					'value': value,
					'children' : []
				}
			}
			
			parentObj[parent]['children'].push({
				'name' : child,
				'value' : value,
			})
			
		}
		
		if(Object.keys(parentObj).length > 0){
			var treemapData = [];
			
			for(var key in parentObj){
				var treemapObj = {};
				treemapObj['name'] = key;
				treemapObj['value'] = parentObj[key]['value'];
				
				if(parentObj[key]['children']){
					treemapObj['children'] = [];
					
					for(var j = 0; j < parentObj[key]['children'].length; j++){
						treemapObj['children'].push(parentObj[key]['children'][j]);
					}
					
				}
				
				treemapData.push(treemapObj);
			}
			
			var treemapChart = echarts.init(document.getElementById(elId));
			
			var option = {
				series : [ {
					itemStyle : {
						borderColor : '#2f3742'
					},
					type : 'treemap',
					width : '100%',
                    height: '100%',
					//height : 384,
					roam : false,
					breadcrumb : {
						show : false,
					},
					leafDepth : 10,
					nodeClick : false,
					visibleMin : 300,
					upperLabel : {
						show : true,
						position : 'inside',
						color : '#fff',
						formatter : '{b}',
					},
					levels : [
							{
								color: ['#4d67cc', '#4e98d2', '#3faeb8', '#d8a24d', '#6ea870'],
								colorMappingBy : 'id',
								colorAlpha : [ 1, 1 ],
								itemStyle : {
									borderWidth : 0,
									gapWidth : 3,
								},
							}, {
								colorMappingBy : 'value',
								colorAlpha : 1,
								colorSaturation: [0.35, 0.55],
								itemStyle : {
									gapWidth: 2,
									borderColorSaturation : 0.5,
								},
								emphasis : {
									upperLabel : {
										show : true,
										position : 'inside',
										color : '#ddd',
										formatter : '{b}',
									},
								},
							}, {
								colorMappingBy : 'value',
								colorAlpha : [1, 1],
								colorSaturation : [0,1],
								itemStyle : {
									gapWidth : 1,
									borderColorSaturation : 0.45,
								},
								emphasis : {
									upperLabel : {
										show : true,
										position : 'inside',
										color : '#ddd',
										formatter : '{b}',
									},
								},
							}, ],
					data : treemapData,
					tooltip : {
						triggerOn : 'mousemove',
						backgroundColor : 'rgba(47,55,66,0.8)',
						borderColor : "#515964",
						transitionDuration : 0,
						textStyle : {
							color : '#bbbbbb',
							fontWeight : 400,
							fontSize : 11,
						},
						position : 'top',
						renderMode : 'html',
						formatter : '2020.11.05 <span style="color: #fdfa01">{b}</span>',
					},
				} ],
			};
			treemapChart.setOption(option);
			window.addEventListener('resize', function() {
				treemapChart.resize();
			});
			treemapChart.on('mouseover', 'series', function() {
				$(this).attr('rel', 'event_modal2');
			});
			treemapChart.on('click', 'series', function(dot) {			
				var chartType = $targetDIV.data('chartType');
				var domain = dot.treePathInfo[1].name;
				var sub = dot.treePathInfo[2].name;
				var startTime = '';
				var endTime = '';
				if(term == 'DAY'){
					startTime = moment(new Date()).format('YYYY-MM-DD 00:00:00');
					endTime = moment(new Date()).format('YYYY-MM-DD 23:59:59');
				}
				else{
					var m = moment(new Date());					
					startTime = m.subtract(7, 'd').format('YYYY-MM-DD 00:00:00');
					endTime = moment(new Date()).format('YYYY-MM-DD 23:59:59');
				}

				var param = {
					'chartType': chartType,
					'body':{
						'starttime': startTime,
						'endtime': endTime,
						'event_type': 'http',
						'parameters': [
							{
							'name': 'hostname',
							'value': domain,
							'operation': 1							
							},
							{
							'name': 'url',
							'value': sub,
							'operation': 1							
							}
						]						
					}
				};

				cf_openDialog('DASHBOARD_CHART_IPS_EVENT', null, param);				
			});
			
		}
		
	}
	
	$('#'+elId).fadeIn();
	
}

/*******************************************************************************
 * Table
 ******************************************************************************/
function lf_setTable(chartData, elId){	
	$('#'+elId).fadeOut();
	var $targetDIV = $('#'+elId);
	
	var chartType = $targetDIV.data('chartType');
	
	$targetDIV.empty();
	$targetDIV.append($('<div class="tbl"></div>'));
	
	var table = $('<table class="click"></table>');
	
	if(chartData['colgroup']){
		var colgroupHTML = $('<colgroup></colgroup>');
		for(var i = 0; i < chartData['colgroup'].length; i++){
			colgroupHTML.append($('<col width="'+chartData['colgroup'][i]+'">'));
		}
		table.append(colgroupHTML);
	}
	
	if(chartData['header']){
		var headerHTML = $('<thead></thead>');
		var headerTR = $('<tr></tr>');
		for(var i = 0; i < chartData['header'].length; i++){
			headerTR.append($('<th>'+chartData['header'][i]+'</th>'));
		}
		headerHTML.append(headerTR);
		table.append(headerHTML);
	}
	
	if(chartData['data']){
		var tbodyHTML = $('<tbody></tbody>');
		for(var i = 0; i < chartData['data'].length; i++){
			var tr = $('<tr onclick="javascript: lf_clkEventTable(this, \''+chartType+'\');"></tr>');
			tr.data('rowData', chartData['realData'][i]);
			
			for(var j = 0; j < chartData['data'][i].length; j++){
				tr.append($('<td class="long_w">'+chartData['data'][i][j]+'</td>'));
			}
			
			tbodyHTML.append(tr);
		}
		table.append(tbodyHTML);
	}
	$targetDIV.find('.tbl').append(table);
	
	// 230105 테이블 페이징 표시 조건 추가
	if(chartData["paging"]){ 
		$targetDIV.find('.tbl > table').dataTable({
		"lengthMenu": [9],
		"autoWidth" : false,
		"paging" : "full_numbers",
		"ordering" : false,
		"info" : false,
		"filter" : false,
		"lengthChange" : true,
		"dom": 't<"table-bottom"p>',	
		});
	}
	else if(chartData["hideColumToolTip"]){	// 컬럼에서 숨기고 툴팁으로 보여줄 컬럼 번호(순서)
		$targetDIV.find('.tbl > table').dataTable({
		"autoWidth" : false,
		"paging" :  false,
		"ordering" : false,
		"info" : false,
		"filter" : false,
		"lengthChange" : true,
		"dom" : 'rt<"bottom"fip><"clear">',
		"columnDefs" : [
			{
			"targets": [ chartData["hideColumToolTip"] ],
            "visible": false
			},
		],
		"rowCallback": function(row, data) {
     		 $(row).attr('title','Description: ' + data[chartData["hideColumToolTip"]]);
     		 }
		});
	}
	else if(chartData["columToolTip"]){ // 툴팁으로 보여줄 컬럼 번호(순서)
		$targetDIV.find('.tbl > table').dataTable({
		"autoWidth" : false,
		"paging" :  false,
		"ordering" : false,
		"info" : false,
		"filter" : false,
		"lengthChange" : true,
		"dom" : 'rt<"bottom"fip><"clear">',
		"rowCallback": function(row, data) {
     		 $(row).attr('title','Description: ' + data[chartData["columToolTip"]]);
     		 }
		});
	}
	else{
		$targetDIV.find('.tbl > table').dataTable({
		"autoWidth" : false,
		"paging" :  false,
		"ordering" : false,
		"info" : false,
		"filter" : false,
		"lengthChange" : true,
		"dom" : 'rt<"bottom"fip><"clear">',
		});
	}
	
	$('#'+elId).fadeIn();
}

// 테이블 tr 태그 클릭 시 해당 데이터 상세보기 모달창 생성
function lf_clkEventTable(thiz, chartType){
	var param = {};
	var rowData = $(thiz).data('rowData');
	
	param['rowData'] = rowData;
	param['chartType'] = chartType;
	cf_openDialog('DASHBOARD_CHART_INFO', null, param);
}

// ComplianceTable
function lf_setComplianceTable(elId){
	$('#'+elId).fadeOut();
	$('#'+elId).addClass('dashboard_compliance_table mscrollbar');
	
	var $targetDIV = $('#'+elId);
	var chartType = $targetDIV.data('chartType');
	var complianceScanTable;
	
	$targetDIV.append($('<div class="tbl"></div>'));
	var table = `
		<input type="hidden" id="complianceTaskEventPaging_${elId}" value=""/>
		<input type="hidden" id="searchValue_${elId}" value=""/>
		<table id="event_complianceScan_${elId}" class="">
			<colgroup>
				<col width="5%">
				<col width="10%">
				<col width="7%">
				<col width="10%">
				<col width="10%">
			    <col width="12%">
				<col width="12%">
				<col width="10%">
				<col width="12%">
				<col width="12%">
			</colgroup>
			<thead>
				<tr>
					<th></th>
					<th>Framework</th>
					<th>Type</th>
					<th>ID</th>
					<th>Name</th>
					<th>Description</th>
					<th>Remediation</th>
					<th>Severity</th>
					<th>Result</th>
					<th>Date</th>
					<th style="display: none;">uuid</th>
					<th style="display: none;">result</th>
					<th style="display: none;">severity</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	`;
	$targetDIV.find('.tbl').append(table);
	
	//DataTable init
	complianceScanTable = $('#'+lvar_param_prefix+'_'+elId).DataTable({
		autoWidth : false,
		paging : true,
		pageLength: 5,
		pagingType : "full_numbers",
		ordering : true,
		order:[],
		info : false,
		filter : true,
		lengthChange : false,
		columnDefs : [{
			targets : [0, 8],
			orderable : false
		},{
			targets : [ 1, 2, 3, 4, 5, 6, 7, 9],
			createdCell : function(td, cellData, rowData, row, col) {
				$(td).attr('title', cellData); // tistle 속성에 데이터 추가
				// 스타일 속성 설정
				$(td).css({
					'white-space' : 'nowrap',
					'overflow' : 'hidden',
					'text-overflow' : 'ellipsis'
				});
			},
		}, {
			targets : [ 10, 11, 12 ], // uuid, result의 데이터 숨기기 위함
			createdCell : function(td, cellData, rowData, row, col) {
				$(td).css({
					'display' : 'none',
				});
			},
		}, {
			targets : [ 0 ],
			createdCell : function(td, cellData, rowData, row, col) {
				$(td).css({
					'display': 'flex',
					'align-items': 'center',
					'justify-content': 'center'
				});
			},
		}, {
			targets : [ 0, 1, 2, 3, 7, 8, 9],
			searchable : false
		},{ 
			targets: [ 7 ], // Severity가 들어가있는 테이블
			orderData:[ 12, 0 ]
		}],
		dom : 'rt<"bottom"ip><"clear">',
		createdRow : function(row, data, dataIndex) {
			$(row).attr('id', 'rowTaskTr_'+ data[10]+'_'+elId); // 하위 tree를 출력 하기 위한 tr 추가(data[9] = uuid)
		}
	});
	
	$('#'+elId).fadeIn();
	mscrollbarReset();
	
	return complianceScanTable;
}
/*******************************************************************************
 * top5
 ******************************************************************************/
function lf_setTop5(chartData, elId){
	$('#'+elId).fadeOut();
	var $tableDIV = $('#'+elId);
	var chartType = $tableDIV.data('chartType');
	$tableDIV.empty();
	var $tablecontentDIV = $('<div class="top5"></div>');
	var topData = chartData['data'];
	
	if(topData.length > 0){
		var $UL = $('<ul></ul>');
		for(var i = 0; i < topData.length; i++){
			var rowData = topData[i];
			var $LI = $('<li onclick="javascript: lf_clkTop5(this, \''+chartType+'\');"></li>');
			$LI.data('rowData', rowData);
			
			var $A = $('<a href="#"></a>');
			$A.append($('<div class="number fl"><span>0'+(i+1)+'</span></div>'))
			$A.append($('<div class="top5_text '+rowData[2]+' fl"><dl><dt>'+rowData[0]+'</dt><dd>'+rowData[1]+'</dd></dl></div>'))
			$LI.append($A);
			$UL.append($LI);
		}
		$tablecontentDIV.append($UL);
		$tableDIV.append($tablecontentDIV);
	}
	else{
		
	}
	
	$('#'+elId).fadeIn();
}

function lf_clkTop5(thiz, chartType){
	var rowData = $(thiz).data('rowData');
	var term = $(thiz).parent().parent().parent().parent().parent().find('.sel_box select').val();
	var nowDate = new Date();
	var hour = nowDate.getHours()+1;
	var endTime = nowDate.format('yyyy-MM-dd')+' '+hour+':00:00';
	
	if("WEEK" == term) {
		nowDate.setDate(nowDate.getDate() - 7);
	} else {
		nowDate.setDate(nowDate.getDate() - 1);
	}
	
	var startTime = nowDate.format('yyyy-MM-dd')+' '+hour+':00:00';
	
	var param = {
		'chartType': chartType,
		'body':{
			'starttime': startTime,
			'endtime': endTime
		}
	}
	
	var chartConf = lf_getChartELConf(chartType);
		
	if(chartConf['info']['event_type']) {
		param['body']['event_type'] = chartConf['info']['event_type'];
	}
	
	if(chartConf['info']['param'] == 'equiplist'){
		//param['body']['equiplist'] = [];
		//param['body']['equiplist'].push(rowData[3]);
		param['body']['equiplist'] = rowData[3];
	}
	else{
		param['body']['parameters'] = {
			'name': chartConf['info']['param'],
			'value': rowData[3],
			'operation': 1
		};
	}
	
	if(chartType.indexOf('firewall') >= 0) cf_openDialog('DASHBOARD_CHART_FIREWALL_EVENT', null, param);
	else if(chartType.indexOf('ips') >= 0) cf_openDialog('DASHBOARD_CHART_IPS_EVENT', null, param);
	else if(chartType.indexOf('av') >= 0) cf_openDialog('DASHBOARD_CHART_AV_EVENT', null, param);
	else if(chartType.indexOf('malware') >= 0) cf_openDialog('DASHBOARD_CHART_MALWARE_EVENT', null, param);
	else if(chartType.indexOf('fileInt') >= 0) cf_openDialog('DASHBOARD_CHART_FILEINT_EVENT', null, param);
	else if(chartType.indexOf('appCtl') >= 0) cf_openDialog('DASHBOARD_CHART_APPCTL_EVENT', null, param);
	else if(chartType.indexOf('pamAcl') >= 0) cf_openDialog('DASHBOARD_CHART_PAMACL_EVENT', null, param);
	
}

/*******************************************************************************
 * Line Chart
 ******************************************************************************/
function lf_setLineChart(chartData, elId, term){
	$('#'+elId).fadeOut();
	var chartType = $('#'+elId).data('chartType');
	var visualChartData = [];
	var xLabelData = [];
	
	var average = 0;
	
	if(chartData.length > 0){
		for(var i = 0; i < chartData.length; i++){
			visualChartData.push(chartData[i]['cnt']);
			average += chartData[i]['cnt'];
			xLabelData.push(chartData[i]['caption']);
		}
	}
	
	average = Math.round(average/chartData.length);
	var maxValue = Math.max.apply(null, visualChartData);
	var minValue = Math.min.apply(null, visualChartData)
	
	var chart = echarts.init(document.getElementById(elId));
	var option = {
		tooltip : {
			triggerOn : 'mousemove',
			backgroundColor : 'rgba(47,55,66,0.8)',
			borderColor : "#515964",
			transitionDuration : 0,
			textStyle : {
				color : '#bbbbbb',
				fontWeight : 400,
				fontSize : 11,
			},
			position : 'top',
			renderMode : 'html',
			formatter: '{b} <span style="color: #ed960a">{c}</span>',
		},
		grid : {
			height : '300',
			top : '70',
			bottom : '0',
			left : '100',
			right : '110'
		},
		xAxis : {
			type : 'category',
			name : '(시간)',
			nameTextStyle : {
				padding : [ 25, 0, 0, 0 ],
			},
			axisLine : {
				lineStyle : {
					color: '#565d68',
				}
			},
			data : xLabelData
		},
		yAxis : {
			type : 'value',
			name : '(개수)',
			nameTextStyle : {
				padding : [ 0, 45, 0, 0 ],
			},
			splitLine : {
				show : false
			},
			axisLine : {
				show: true,
				lineStyle : {
					color : '#adb0bc'
				}
			},
		},
		series : [ {
			data : visualChartData,
			type : 'line',
			showSymbol : true,
			showAllSymbol : true,
			markLine : {
				silent : true,
				data : [ {
					yAxis : average
				} ],
				symbol : 'none',
				label : {
					color : '#2196f3',
				},
				lineStyle : {
					color : '#2196f3',
				},
			},
			markPoint : {
				data : [ {
					type : 'max',
					symbolSize : [ 20, 30 ],
					itemStyle : {
						color : 'transparent',
					},
					label : {
						color : '#ddd',
					},
				} ],

			},
			symbol : 'circle',
			lineStyle : {
				width : 2,
				type : 'solid'
			},
		} ],
		visualMap : [ {
			show : false,
			seriesIndex : 0,
			min : minValue,
			max : maxValue,
			borderWidth : 5,
			inRange : {
				color : [ '#747b86', '#2195f2' ],
				symbolSize : 8,
			},
		} ],
		textStyle : {
			color : '#adb0bc',
			fontWeight : 100,
		},
	};
	chart.setOption(option);
	window.addEventListener('resize', function() {
		chart.resize();
	});
	
	chart.on('click', 'series', function (dot) {
		
		var startTime = '';
		var endTime = '';
		if(term == 'DAY'){
			startTime = dot.name;
			endTime = dot.name.substring(0, 13)+':59:59';
		}
		else{
			startTime = dot.name;
			endTime = dot.name.substring(0, 10)+' 23:59:59';
		}
		
		var param = {
			'chartType': chartType,
			'body':{
				'starttime': startTime,
				'endtime': endTime,
			}
		}
		
		if(!startTime || !endTime) {
			console.log('found not time');
			return;
		}
		
		if(chartType.indexOf('firewall') >= 0) cf_openDialog('DASHBOARD_CHART_FIREWALL_EVENT', null, param);
		else if(chartType.indexOf('ips') >= 0) cf_openDialog('DASHBOARD_CHART_IPS_EVENT', null, param);
		else if(chartType.indexOf('av') >= 0) cf_openDialog('DASHBOARD_CHART_AV_EVENT', null, param);
		else if(chartType.indexOf('malware') >= 0) cf_openDialog('DASHBOARD_CHART_MALWARE_EVENT', null, param);
		else if(chartType.indexOf('fileInt') >= 0) cf_openDialog('DASHBOARD_CHART_FILEINT_EVENT', null, param);
		else if(chartType.indexOf('appCtl') >= 0) cf_openDialog('DASHBOARD_CHART_APPCTL_EVENT', null, param);
		else if(chartType.indexOf('pamAcl') >= 0) cf_openDialog('DASHBOARD_CHART_PAMACL_EVENT', null, param);
		
	});
	
	
	$('#'+elId).fadeIn();

}

function lf_createNotDateView(elId, title){
	var viewObj = $('#'+elId);
	viewObj.empty();
	
	viewObj.append('<div class="no_data"><p><span>No Data</span> 불러들일 데이터가 없습니다.</p></div>');
	
}

/*******************************************************************************
 * Bar Chart
 ******************************************************************************/
function lf_setBarChart(chartData, elId, term){
	$('#'+elId).fadeOut();
	var chartType = $('#'+elId).data('chartType');
	var visualChartData = [];
	var xLabelData = [];
	
	var average = 0;
	
	if(chartData.length > 0){
		for(var i = 0; i < chartData.length; i++){
			visualChartData.push(chartData[i]['cnt']);
			//visualChartData.push(chartData[i]['caption']);
			average += chartData[i]['cnt'];
			xLabelData.push(chartData[i]['caption']);
		}
	}
	
	average = Math.round(average/chartData.length);
	var maxValue = Math.max.apply(null, visualChartData);
	var minValue = Math.min.apply(null, visualChartData)
	
	var chart = echarts.init(document.getElementById(elId));
	
	var option = {
		tooltip : {
			triggerOn : 'mousemove',
			backgroundColor : 'rgba(47,55,66,0.8)',
			borderColor : "#515964",
			transitionDuration : 0,
			textStyle : {
				color : '#bbbbbb',
				fontWeight : 400,
				fontSize : 11,
			},
			position : 'top',
			renderMode : 'html',
			formatter: '{b} <span style="color: #ed960a">{c}</span>',
		},
		grid : {
			height : '300',
			top : '70',
			bottom : '0',
			left : '100',
			right : '110'
		},
		xAxis : {
			type : 'category',
			name : '(일)',
			nameTextStyle : {
				padding : [ 25, 0, 0, 0 ],
			},
			axisLine : {
				lineStyle : {
					color: '#565d68'
				}
			},
			data : xLabelData
		},
		yAxis : {
			type : 'value',
			name : '(갯수)',
			nameTextStyle : {
				padding : [ 0, 45, 0, 0 ],
			},
			splitLine : {
				show : true,
				lineStyle : {
					color : '#565d68'
				}
			},
			axisLine : {
				lineStyle : {
					color: '#565d68'
				}
			},
		},
		series : [ {
			data : visualChartData,
			type : 'bar',
			showSymbol : true,
			barWidth: '45%',
			markLine : {
				silent : true,
				data : [ {
					yAxis : average
				} ],
				symbol : 'none',
				label : {
					color : '#2196f3',
				},
				lineStyle : {
					color : '#2196f3',
				},
			},
		} ],
		visualMap : {
			show : false,
			top : 10,
			right : 10,
			pieces : [ {
				gt : minValue,
				lte : average,
				color : '#4d5663'
			}, {
				gt : average,
				lte : maxValue,
				color : '#2196f3'
			}, ],
		},
		textStyle : {
			color : '#adb0bc',
			fontWeight : 100,
		},
	};
	chart.setOption(option);
	window.addEventListener('resize', function() {
		chart.resize();
	});
	
	chart.on('click', 'series', function (dot) {
		
		var startTime = '';
		var endTime = '';
		if(term == 'DAY'){
			startTime = dot.name;
			endTime = dot.name.substring(0, 13)+':59:59';
		}
		else{
			startTime = dot.name;
			endTime = dot.name.substring(0, 10)+' 23:59:59';
		}
		
		var param = {
			'chartType': chartType,
			'body':{
				'starttime': startTime,
				'endtime': endTime,
			}
		}
		
		if(!startTime || !endTime) {
			console.log('found not time');
			return;
		}
		
		if(chartType.indexOf('firewall') >= 0) cf_openDialog('DASHBOARD_CHART_FIREWALL_EVENT', null, param);
		else if(chartType.indexOf('ips') >= 0) cf_openDialog('DASHBOARD_CHART_IPS_EVENT', null, param);
		else if(chartType.indexOf('av') >= 0) cf_openDialog('DASHBOARD_CHART_AV_EVENT', null, param);
		else if(chartType.indexOf('malware') >= 0) cf_openDialog('DASHBOARD_CHART_MALWARE_EVENT', null, param);
		else if(chartType.indexOf('fileInt') >= 0) cf_openDialog('DASHBOARD_CHART_FILEINT_EVENT', null, param);
		else if(chartType.indexOf('appCtl') >= 0) cf_openDialog('DASHBOARD_CHART_APPCTL_EVENT', null, param);
		else if(chartType.indexOf('pamAcl') >= 0) cf_openDialog('DASHBOARD_CHART_PAMACL_EVENT', null, param);
		
	});
	
	
	$('#'+elId).fadeIn();
}


/******************************************************************************************
 *
 * FIREWALL SERVICE
 * 8 CHARTS
 * 
 *******************************************************************************************/

/* 방화벽 이벤트 트렌드 */
function lf_serviceCall600001(chartId, param){
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_FW_EVENT_TREND,body,lf_serviceCall600001_BarChart_CallBack);
	} else {
		cf_requestServer(_TR_DASHBOARD_FW_EVENT_TREND,body,lf_serviceCall600001CallBack);
	}
	
	
}

function lf_serviceCall600001CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($chartId);
	}
	
	
	lf_DashboardEventInit();
}

function lf_serviceCall600001_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($chartId);
	}
	
	
	lf_DashboardEventInit();
}

/* 방화벽 정책 TopN */
function lf_serviceCall600002(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();

	cf_requestServer(_TR_DASHBOARD_FW_POLICY_TOPN,body,lf_serviceCall600002CallBack);
	
}

function lf_serviceCall600002CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;

	cf_contPreloader(chartId);
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');

			obj.push(dataList[i].signature_id);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
	lf_DashboardEventInit();
}

/* 방화벽 장비 TopN */
function lf_serviceCall600003(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_FW_SERVER_TOPN,body,lf_serviceCall600003CallBack);
	
}

function lf_serviceCall600003CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;
	
	cf_contPreloader(chartId);
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	lf_DashboardEventInit();
}

/* 방화벽 IP TopN */
function lf_serviceCall600004(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_FW_SRC_IP_TOPN,body,lf_serviceCall600004CallBack);
	
}

function lf_serviceCall600004CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;
	
	cf_contPreloader(chartId);
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

/* 방화벽 PORT TopN */
function lf_serviceCall600005(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_FW_SRC_PORT_TOPN,body,lf_serviceCall600005CallBack);
	
}

function lf_serviceCall600005CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;
	
	cf_contPreloader(chartId);
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

/* 방화벽 Dst IP TopN */
function lf_serviceCall600007(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_FW_DST_IP_TOPN,body,lf_serviceCall600007CallBack);
	
}

function lf_serviceCall600007CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;
	
	cf_contPreloader(chartId);
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	lf_DashboardEventInit();
}

/* 방화벽 Dst PORT TopN */
function lf_serviceCall600008(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	
	cf_requestServer(_TR_DASHBOARD_FW_DST_PORT_TOPN,body,lf_serviceCall600008CallBack);
	
}

function lf_serviceCall600008CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;
	
	cf_contPreloader(chartId);
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	lf_DashboardEventInit();
}

/* 방화벽 최근 이벤트 TopN */
function lf_serviceCall600006(chartId, param){
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	cf_requestServer(_TR_DASHBOARD_FW_RECENT_EVENT_TOPN,body,lf_serviceCall600006CallBack);
	
}

function lf_serviceCall600006CallBack(data, body){
	var dataList = data.body.dataList;
	var chartId = body.chartId;
	
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		var chartData ={
			'header': ['자산', '출발지', '목적지', '프로토콜', '액션'],
			'colgroup': ['auto', '20%', '20%', '10%', '53px'],
			'data': [],
			'realData': [],
			'clickFunc': lf_firewallInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			var src = dataList[i].src_ip + ':' + dataList[i].src_port;
			row.push(src);
			var dst = dataList[i].dest_ip + ':' + dataList[i].dest_port;
			row.push(dst);
			var proto = dataList[i].proto;
			row.push(proto);
			
			if(dataList[i]['eve']){
				if(dataList[i]['eve']['alert']){
					var action = dataList[i]['eve']['alert']['action'];
					row.push(_ACTION_OBJ[action]);
				}
				else if(dataList[i]['eve']['http']){
					var action = dataList[i]['eve']['http']['action'];
					row.push(_ACTION_OBJ[action]);
				}
			}
			else{
				row.push('');
			}
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

/******************************************************************************************
*
* IPS SERVICE
* 7 CHARTS
* 
*******************************************************************************************/

/* IPS 이벤트 트렌드 */
function lf_serviceCall600021(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	
	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_IPS_EVENT_TREND,body,lf_serviceCall600021_BarChart_CallBack);
	} else {
		cf_requestServer(_TR_DASHBOARD_IPS_EVENT_TREND,body,lf_serviceCall600021CallBack);
	}
}

function lf_serviceCall600021CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

function lf_serviceCall600021_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

/* IPS 정책 TopN */
function lf_serviceCall600022(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_IPS_POLICY_TOPN,body,lf_serviceCall600022CallBack);
	
}

function lf_serviceCall600022CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(dataList[i].signature_id);
			
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
	
}

/* IPS 자산 TopN */
function lf_serviceCall600023(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_IPS_COMPUTER_TOPN,body,lf_serviceCall600023CallBack);
	
}

function lf_serviceCall600023CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* IPS SrcIP TopN */
function lf_serviceCall600024(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
		
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_IPS_SRCIP_TOPN,body,lf_serviceCall600024CallBack);
	
}

function lf_serviceCall600024CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* IPS DstIP TopN */
function lf_serviceCall600025(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_IPS_DSTIP_TOPN,body,lf_serviceCall600025CallBack);
	
}

function lf_serviceCall600025CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/**
 * 
 * @param 
 * @param 
 * @desc IPS 웹 점유도
 */
function lf_serviceCall600026(chartId, param){
	cf_contPreloader(chartId);
	
	var body = {
		'term': param['term'],
		'chartId': chartId,
		'topn': 10,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_IPS_WEB_OCCUPTION,body,lf_serviceCall600026CallBack);
}

function lf_serviceCall600026CallBack(data, body){
	var dataList = data.body.dataList;	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['cnt']).getTime();
			var bTime = new Date(b['cnt']).getTime();
			return aTime - bTime;
		});
		
		var chartData = dataList;
		var term = $('#'+chartId).parent().parent().find('.sel_box select').val();
		lf_setTreeMap(chartData, chartId, body['term']);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}


/* IPS 최근 이벤트 TopN */
function lf_serviceCall600027(chartId, param){
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	
	cf_requestServer(_TR_DASHBOARD_IPS_RECENT_EVENT_TOPN,body,lf_serviceCall600027CallBack);
	
}

function lf_serviceCall600027CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		var chartData ={
			'header': ['자산', '출발지', '목적지', '프로토콜', '액션', '탐지명', '위험도'],
			'data': [],
			'colgroup': ['10%', '20%', '20%', '10%', '10%', 'auto', '53px'],
			'realData': [],
			'clickFunc': lf_ipsInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			var src = dataList[i].src_ip;
			if(dataList[i].src_port) src += ':' + dataList[i].src_port;
			row.push(src);
			var dst = dataList[i].dest_ip;
			if(dataList[i].dest_port) src += ':' + dataList[i].dest_port;
			row.push(dst);
			var proto = dataList[i].proto;
			row.push(proto);
			
			var event = new SolipsEvent(dataList[i]);
			if(dataList[i]['eve']){
				if(dataList[i]['eve']['alert']){
					var action = dataList[i]['eve']['alert']['action'];
					row.push(_ACTION_OBJ[action]);
					var signature = event.getSignature();
					row.push(signature);
					var severity = event.getSeverityName();
					row.push(severity);
				}
				else if(dataList[i]['eve']['http']){
					var action = dataList[i]['eve']['http']['action'];
					row.push(_ACTION_OBJ[action]);
					var signature = event.getSignature();
					row.push(signature);
					var severity = event.getSeverityName();
					row.push(severity);
				}
			}
			else{
				row.push('');
				row.push('');
				row.push('');
			}
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/******************************************************************************************
*
* ANTI MALWARE SERVICE
* 4 CHARTS
* 
*******************************************************************************************/

/* ANTI MALWARE 트랜드 */
function lf_serviceCall600041(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	
	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_AV_EVENT_TREND,body,lf_serviceCall600041_BarChart_CallBack);		
	} else {
		cf_requestServer(_TR_DASHBOARD_AV_EVENT_TREND,body,lf_serviceCall600041CallBack);
	}
}

function lf_serviceCall600041CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

function lf_serviceCall600041_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

/* ANTI MALWARE 처리 상태 */
function lf_serviceCall600042(chartId, param){
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_AV_STATUS_LIST,body,lf_serviceCall600042CallBack);
}

function lf_serviceCall600042CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		var term = $('#'+chartId).parent().parent().find('.sel_box select').val();
		lf_setPieChart(dataList, chartId, 'Anti\n' + 'Malware', term);
		
		lf_DashboardEventInit();
	}
	else{
		lf_createNotDateView(chartId);
	}
	lf_DashboardEventInit();
}

/* ANTI MALWARE 최근 감염된 자산 TOP5 */
function lf_serviceCall600043(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_AV_RECENT_CLOUD_TOPN,body,lf_serviceCall600043CallBack);
	
}

function lf_serviceCall600043CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* ANTI MALWARE 최근 탐지된 바이러스 TOP5 */
function lf_serviceCall600044(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_AV_RECENT_EVENT_TOPN,body,lf_serviceCall600044CallBack);
	
}

function lf_serviceCall600044CallBack(data, body){

	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){

		var chartData ={
			'header': ['자산', '출발지', '목적지', '프로토콜', '액션', '탐지명', '위험도', '탐지시간'],
			'colgroup': ['10%', '15%', '15%', '10%', '10%', 'auto', '53px', '15%'],
			'data': [],
			'realData': [],
			'clickFunc': lf_avInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			var src = dataList[i].src_ip;
			if(dataList[i].src_port) src += ':' + dataList[i].src_port;
			row.push(src);
			var dst = dataList[i].dest_ip;
			if(dataList[i].dest_port) src += ':' + dataList[i].dest_port;
			row.push(dst);
			var proto = dataList[i].proto;
			row.push(proto);
			
			var event = new SolipsEvent(dataList[i]);
			
			if(dataList[i]['eve']){
				if(dataList[i]['eve']['alert']){
					var action = dataList[i]['eve']['alert']['action'];
					row.push(_ACTION_OBJ[action]);
					var signature = event.getSignature();
					row.push(signature);
					var severity = event.getSeverityName();
					row.push(severity);
				}
				else if(dataList[i]['eve']['http']){
					var action = dataList[i]['eve']['http']['action'];
					row.push(_ACTION_OBJ[action]);
					var signature = event.getSignature();
					row.push(signature);
					var severity = event.getSeverityName();
					row.push(severity);
				}
			}
			else{
				row.push('');
				row.push('');
				row.push('');
			}
			
			var createtime = dataList[i].createtime;
			row.push(createtime);
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
}

/******************************************************************************************
*
* ANTI MALWARE SERVICE(CLAMAV)
* 4 CHARTS
* 
*******************************************************************************************/

/* ANTI MALWARE 트랜드 */
function lf_serviceCall600321(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	
	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_MALWARE_EVENT_TREND,body,lf_serviceCall600321_BarChart_CallBack);		
	} else {
		cf_requestServer(_TR_DASHBOARD_MALWARE_EVENT_TREND,body,lf_serviceCall600321CallBack);
	}
}

function lf_serviceCall600321CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

function lf_serviceCall600321_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit(); 
}

/* ANTI MALWARE 처리 상태 */
function lf_serviceCall600322(chartId, param){
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_MALWARE_STATUS_LIST,body,lf_serviceCall600322CallBack);
}

function lf_serviceCall600322CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		var term = $('#'+chartId).parent().parent().find('.sel_box select').val();
		lf_setPieChart(dataList, chartId, 'Anti\n' + 'Malware', term);
		
		lf_DashboardEventInit();
	}
	else{
		lf_createNotDateView(chartId);
	}
	lf_DashboardEventInit();
}

/* ANTI MALWARE 최근 감염된 자산 TOP5 */
function lf_serviceCall600323(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_MALWARE_RECENT_CLOUD_TOPN,body,lf_serviceCall600323CallBack);
	
}

function lf_serviceCall600323CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* ANTI MALWARE 최근 탐지된 바이러스 TOP5 */
function lf_serviceCall600324(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_MALWARE_RECENT_EVENT_TOPN,body,lf_serviceCall600324CallBack);
	
}

function lf_serviceCall600324CallBack(data, body){

	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){

		var chartData ={
			'header': ['자산', '스캔 유형', '바이러스', '파일명', '탐지시간'],
			'colgroup': ['10%', '15%', '15%', 'auto', '15%'],
			'data': [],
			'realData': [],
			'clickFunc': lf_malwareInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var type = dataList[i].type;
			if(type == 1) type = "예약 검사";
			else if(type == 2) type = "수동 검사";
			else if(type == 3) type = "실시간 검사";
			else type = "Unknown";

			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			row.push(type);
			row.push(dataList[i].virusname);
			row.push(dataList[i].filename);
			row.push(dataList[i].revisetime);			
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
}

/******************************************************************************************
*
* 파일 무결성 SERVICE
* 4 CHARTS
* 
*******************************************************************************************/

/* 무결성 이벤트 트렌드 */
function lf_serviceCall600061(chartId, param){
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();

	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_FILEINT_EVENT_TREND,body,lf_serviceCall600061_BarChart_CallBack);
	} else {
		cf_requestServer(_TR_DASHBOARD_FILEINT_EVENT_TREND,body,lf_serviceCall600061CallBack);
	}
	
}

function lf_serviceCall600061CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

function lf_serviceCall600061_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}


/* 무결성 위반 파일명 TOP5 */
function lf_serviceCall600062(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_FILEINT_FILE_TOPN,body,lf_serviceCall600062CallBack);
	
}

function lf_serviceCall600062CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(dataList[i].caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 무결성 발생 자산 TOP5 */
function lf_serviceCall600063(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_FILEINT_CLOUD_TOPN,body,lf_serviceCall600063CallBack);
	
}

function lf_serviceCall600063CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');

			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 파일 무결성 최근 이벤트 10 */
function lf_serviceCall600064(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_FILEINT_RECENT_EVENT_TOPN,body,lf_serviceCall600064CallBack);
	
}

function lf_serviceCall600064CallBack(data, body){

	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		var chartData ={
			'header': ['자산', '탐지종류', '파일명'],
			'colgroup': ['20%', '70px', 'auto'],
			'data': [],
			'realData': [],
			'clickFunc': lf_fileIntInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			var type = dataList[i].type;
			var typeName;
			if(type == 1) typeName = "Create";
			else if(type == 2) typeName = "Permission";
			else if(type == 4) typeName = "User";
			else if(type == 8) typeName = "Group";
			else if(type == 16) typeName = "Size";
			else if(type == 32) typeName = "Hash";
			else if(type == 64) typeName = "Delete";
			else typeName = "?";
			row.push(typeName);
			var path = dataList[i].path;
			row.push(path);
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
}

/******************************************************************************************
*
* 실행파일통제 SERVICE
* 4 CHARTS
* 
*******************************************************************************************/

/* 실행파일통제 이벤트 트렌드 */
function lf_serviceCall600081(chartId, param){
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();

	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_APPCTL_EVENT_TREND,body,lf_serviceCall600081_BarChart_CallBack);
	} else {
		cf_requestServer(_TR_DASHBOARD_APPCTL_EVENT_TREND,body,lf_serviceCall600081CallBack);
	}	
}


function lf_serviceCall600081CallBack(data, body){
	var dataList = data.body.dataList;

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

function lf_serviceCall600081_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

/* 실행파일통제 파일명 TOP5 */
function lf_serviceCall600082(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_APPCTL_FILE_TOPN,body,lf_serviceCall600082CallBack);
	
}

function lf_serviceCall600082CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(dataList[i].caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 실행파일통제 발생 자산 TOP5 */
function lf_serviceCall600083(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_APPCTL_CLOUD_TOPN,body,lf_serviceCall600083CallBack);
	
}

function lf_serviceCall600083CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');

			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 실행파일통제 최근 이벤트 10 */
function lf_serviceCall600084(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_APPCTL_RECENT_EVENT_TOPN,body,lf_serviceCall600084CallBack);
	
}

function lf_serviceCall600084CallBack(data, body){

	var dataList = data.body.dataList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		var chartData ={
			'header': ['자산', '탐지종류', '파일명'],
			'colgroup': ['20%', '70px', 'auto'],
			'data': [],
			'realData': [],
			'clickFunc': lf_fileIntInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			
			var type = dataList[i].message;			
			if(type) {				
				row.push(type.indexOf('White')>=0 ? 'White' : 'Black');
			} else {
				row.push('Unknown');
			}
			
			var path = dataList[i].path;
			row.push(path);
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
}

/******************************************************************************************
*
* 서비스제어 SERVICE
* 6 CHARTS
* 
*******************************************************************************************/

/* 서비스제어 이벤트 트렌드 */
function lf_serviceCall600301(chartId, param){
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_contPreloader(chartId);
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();

	if(param['term'] == 'WEEK') {
		cf_requestServer(_TR_DASHBOARD_PAMACL_EVENT_TREND,body,lf_serviceCall600301_BarChart_CallBack);
	} else {
		cf_requestServer(_TR_DASHBOARD_PAMACL_EVENT_TREND,body,lf_serviceCall600301CallBack);
	}	
}


function lf_serviceCall600301CallBack(data, body){
	var dataList = data.body.dataList;

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setLineChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

function lf_serviceCall600301_BarChart_CallBack(data, body){
	var dataList = data.body.dataList;

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		
		var chartData = [];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = {};
			var caption = dataList[i].time;
			var cnt = dataList[i].cnt;
			obj['caption'] = caption;
			obj['cnt'] = cnt;
			chartData.push(obj);
		}
		
		lf_setBarChart(chartData, chartId, body.term);
	}
	else{
		lf_createNotDateView($ID);
	}
	
	lf_DashboardEventInit();
}

/* 서비스명 TOP5 */
function lf_serviceCall600302(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_PAMACL_SERVICE_TOPN,body,lf_serviceCall600302CallBack);
	
}

function lf_serviceCall600302CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(dataList[i].caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 사용자 TOP5 */
function lf_serviceCall600303(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_PAMACL_USER_TOPN,body,lf_serviceCall600303CallBack);
	
}

function lf_serviceCall600303CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(dataList[i].caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* IP TOP5 */
function lf_serviceCall600304(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_PAMACL_IP_TOPN,body,lf_serviceCall600304CallBack);
	
}

function lf_serviceCall600304CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');
			
			obj.push(dataList[i].caption);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 실행파일통제 발생 자산 TOP5 */
function lf_serviceCall600305(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_PAMACL_CLOUD_TOPN,body,lf_serviceCall600305CallBack);
	
}

function lf_serviceCall600305CallBack(data, body){
	var dataList = data.body.dataList;
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);

	if(dataList.length > 0){
		
		dataList.sort(function(a, b) { // 내름차순
			return b['cnt'] - a['cnt'];
		});
		
		var chartData =[];
		
		for(var i = 0; i < dataList.length; i++){
			var obj = [];
			var caption = dataList[i].caption;
			var cnt = dataList[i].cnt;
			obj.push(caption);
			obj.push(cnt);
			if(dataList[i].trend > 0 ) obj.push('up');
			else obj.push('down');

			obj.push([dataList[i].equip_id]);
			chartData.push(obj);
		}
		
		lf_setTop5({'data':chartData}, chartId);
		
	}
	else{
		lf_createNotDateView(chartId);
	}
}

/* 서비스제어 최근 이벤트 10 */
function lf_serviceCall600306(chartId, param){
	
	cf_contPreloader(chartId);
	
	var body = {
		'topn': '10',
		'chartId': chartId,
		'use_cache': param['use_cache']
	};
	
	cf_requestServer(_TR_DASHBOARD_PAMACL_RECENT_EVENT_TOPN,body,lf_serviceCall600306CallBack);
	
}

function lf_serviceCall600306CallBack(data, body){

	var dataList = data.body.dataList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(dataList.length > 0){
		
		var chartData ={
			'header': ['자산', '사용자', 'IP', '메시지'],
			'colgroup': ['20%', '70px', '10%', 'auto'],
			'data': [],
			'realData': [],
			'clickFunc': lf_pamAclInfoTableClickFunc
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			var dn = dataList[i].dn;
			row.push(dn);
			row.push(dataList[i].user);
			row.push(dataList[i].ip);
			row.push(dataList[i].message);
			
			chartData['data'].push(row);
			chartData['realData'].push(dataList[i]);
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
}

/******************************************************************************************
*
* IMAGE SECURITY SERVICE
* 작성 시간 : 2022-12-28
* 작성자 : 조준경
* 
*******************************************************************************************/

function showRegistrySelectedDiv(chartId){
	var targetDiv = $("#"+chartId).parent().parent().parent().parent().parent().find('.dashboard_box_registry');
	if(!$(targetDiv).is(":visible")){
		$(targetDiv).show();
	}
	$("#"+chartId).addClass(NEED_REGISTRY_SELECT);
	
	// 현재 선택된 레지스트리 uuid 값 반환	
	return $(targetDiv).find(".registryList option:selected").val();
	//return '4d842add-ad81-4e7d-a7fb-c39c836dabe2';
}

/* 컨테이너 이미지 스캔 현황 */
function lf_serviceCall600400(chartId, param){ 
	
	var selectedRegistryUuid = showRegistrySelectedDiv(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,  
		'registry_uuid' : param['registryUuid']  ? param['registryUuid'] : selectedRegistryUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
	};

	//추가. 현재 로딩화면이 동작 중인 경우 해당 함수를 호출하지 않음
	if ($('#' + chartId).find('.cont_loading').length == 0) {
		cf_contPreloader(chartId); // 로딩 화면
	}
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHOBOARD_DONUT_CHART_STATUS, body, lf_serviceCall600400CallBack); // sevice id, body, callback(createDonutCharts)

}

function lf_serviceCall600400CallBack(data,body){
	
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	if(!data){
		lf_createNotDateView(chartId);
	}
	else{
		var $targetDIV = $('#'+chartId);
	
		$targetDIV.empty();
		$targetDIV.append($(
		'<div class="graph-section">'+
					'<div class="graph" id="malware_'+chartId+'"></div>' +
					'<div class="graph" id="vulnerabilities_'+chartId+'"></div>' +
					'<div class="graph" id="scan_'+chartId+'"></div>' +
					'<div class="graph" id="scanCompletion_'+chartId+'"></div>' +
					'<div class="graph" id="imageAssurance_'+chartId+'"></div>' + 
		'</div>'
		));
		
		createDonutCharts(data,body,chartId);
	
		lf_DashboardEventInit();
	}
	
}

/* csp 멀웨어 스캔 TopN */
function lf_serviceCall600500(chartId, param){
	var selectedRegistryUuid = showRegistrySelectedDiv(chartId);
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), 
		'topn': '5',
		'chartId': chartId,
		'registry_uuid' : param['registryUuid']  ? param['registryUuid'] : selectedRegistryUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
	};
		
	//추가. 현재 로딩화면이 동작 중인 경우 해당 함수를 호출하지 않음
	if ($('#' + chartId).find('.cont_loading').length == 0) {
		cf_contPreloader(chartId); // 로딩 화면
	}
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHOBOARD_MALWARE_TOP5,body,lf_serviceCall600500CallBack);
	
}

function lf_serviceCall600500CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0){

		var chartData= {
			'header': ['No', 'Malware Name','Cnt'],
			'colgroup': ['10%', 'auto', '10%'],
			'data': [],
			'realData': [],
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];
			
			dataList[i].no = i+1;
			var no =  dataList[i].no;
			row.push(no);
			var signature = dataList[i].signature;
			row.push(signature);
			var cnt = dataList[i].cnt;
			row.push(cnt);
	
			chartData['data'].push(row);
			
			// 상세보기 페이지에 dn(자산명) 추가
			dataList[i].dn = "csp";
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}


/* csp 취약성 스캔 TopN */
function lf_serviceCall600501(chartId, param){
	var selectedRegistryUuid = showRegistrySelectedDiv(chartId);

	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'topn': '5',
		'chartId': chartId,
		'registry_uuid' : param['registryUuid']  ? param['registryUuid'] : selectedRegistryUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
	};
	//추가. 현재 로딩화면이 동작 중인 경우 해당 함수를 호출하지 않음
	if ($('#' + chartId).find('.cont_loading').length == 0) {
		cf_contPreloader(chartId); // 로딩 화면
	}
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHOBOARD_VULNERABILITY_TOP5,body,lf_serviceCall600501CallBack);
}

function lf_serviceCall600501CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0){

		var chartData= {
			'header': ['No', 'CVE ID', 'Severity','Cnt'],
			'colgroup': ['10%', '55%' ,'20%', '15%'],
			'data': [],
			'realData': [],
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];
			dataList[i].no = i+1;
			
			var no =  dataList[i].no;
			row.push(no);
			var cveid = dataList[i].cveid;
			row.push(cveid);
			var severity = dataList[i].severity;
			row.push(severity);
			var cnt = dataList[i].cnt;
			row.push(cnt);

			chartData['data'].push(row);
			
			// 상세보기 페이지에 dn(자산명) 추가
			dataList[i].dn = "csp";
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}

/* 이미지 스캔 히스토리 table  */
function lf_serviceCall600502(chartId, param){
	var selectedRegistryUuid = showRegistrySelectedDiv(chartId);

	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(),
		'chartId': chartId,
		'registry_uuid' : param['registryUuid']  ? param['registryUuid'] : selectedRegistryUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
	};
	
	//추가. 현재 로딩화면이 동작 중인 경우 해당 함수를 호출하지 않음
	if ($('#' + chartId).find('.cont_loading').length == 0) {
		cf_contPreloader(chartId); // 로딩 화면
	}
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHOBOARD_SCAN_HISTORY,body,lf_serviceCall600502CallBack);
}

function lf_serviceCall600502CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0){

		var chartData= {
			'header': ['No', 'Created At','Finished At','Tag','Request User', 'Result', 'Re Scanned'],
			'colgroup': ['5%', '20%' ,'20%', 'auto','13%','10%', '12%'],
			'data': [],
			'realData': [],
			'paging': true // 페이징 옵션 추가
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];
			dataList[i].no = i+1;
			
			var no =  dataList[i].no;
			row.push(no);
			
			var is_createdat =  dataList[i].is_createdat;
			row.push(is_createdat);

			var is_finishedat =  dataList[i].is_finishedat;
			row.push(is_finishedat);

			var tag =  dataList[i].tag;
			row.push(tag);

			var requestuser =  dataList[i].requestuser;
			row.push(requestuser);

			var scanresult =  dataList[i].scanresult;
			row.push(scanresult);

			var rescanned =  dataList[i].rescanned;
			row.push(rescanned);

			chartData['data'].push(row);
			
			// 상세보기 페이지에 dn(자산명) 추가
			dataList[i].dn = "csp";
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}
	
	lf_DashboardEventInit();
}


/* 이미지 실행 제어 상태 */
function lf_serviceCall600503(chartId, param){
	var selectedRegistryUuid = showRegistrySelectedDiv(chartId);

	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), // 주기 day/week
		'chartId': chartId,
		'registry_uuid' : param['registryUuid']  ? param['registryUuid'] : selectedRegistryUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
	};
	
	//추가. 현재 로딩화면이 동작 중인 경우 해당 함수를 호출하지 않음
	if ($('#' + chartId).find('.cont_loading').length == 0) {
		cf_contPreloader(chartId); // 로딩 화면
	}
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val(); // 해당 대시보드 데이터(chartConf)에 주기 설정 정보 업데이트
	
	cf_requestServer(_TR_DASHOBOARD_IMAGE_DISTRIBUTION_CONTROL_HISTORY,body,lf_serviceCall600503CallBack);
}

function lf_serviceCall600503CallBack(data, body){
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0){

		var chartData= {
			'header': ['No', 'Date','Tag','Request User', 'Message','Result'],
			'colgroup': ['5%', '20%' ,'20%', '20%', 'auto', '10%'],
			'data': [],
			'realData': [],
			'paging': true // 페이징 옵션 추가
		};
		
		for(var i = 0; i < dataList.length; i++){
			var row = [];
			dataList[i].no = i+1;
			
			var no =  dataList[i].no;
			row.push(no);
			var date =  dataList[i].date;
			row.push(date);
			var tag =  dataList[i].tag;
			row.push(tag);
			var requestuser =  dataList[i].requestuser;
			row.push(requestuser);
			var message =  dataList[i].message;
			row.push(message);
			var result =  dataList[i].actionresult;
			row.push(result);

			chartData['data'].push(row);
			
			// 상세보기 페이지에 dn(자산명) 추가
			dataList[i].dn = "csp";
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId); // 데이터가 없는 경우 표시하는 화면
	}
	
	lf_DashboardEventInit(); // 드래그 앤 드롭
}

/******************************************************************************************
*
* 클러스터 규정준수 스캔
* 작성 시간 : 2023-08-25
* 작성자 : 김성원
* 
*******************************************************************************************/
function showClusterSelectedDiv(chartId){
	var targetDiv = $("#"+chartId).parent().parent().parent().parent().parent().find('.dashboard_box_cluster');
	if(!$(targetDiv).is(":visible")){
		$(targetDiv).show();
	}
	$("#"+chartId).addClass(NEED_CLUSTER_SELECT);
	
	// 현재 선택된 클러스터 uuid 값 반환
	return $(targetDiv).find(".cluster_list option:selected").val();
}

/* 클러스터 규정 준수율 */
function lf_serviceCall600600(chartId, param){
	var selectedClusterUuid = showClusterSelectedDiv(chartId); 

	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), // 주기 day/week
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid'] ? param['clusterUuid'] : selectedClusterUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
		'is_user_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 유저 활성화 프레임 워크만 구하기
		'is_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 스캔 가능한 프레임 워크만 구하기
	};
	cf_contPreloader(chartId);  // 로딩
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val(); // 해당 대시보드 데이터(chartConf)에 주기 설정 정보 업데이트
	
	cf_requestServer(_TR_DASHBOARD_COMPLIANCE_TOTAL_RATE, body, lf_serviceCall600600CallBack);
}
function lf_serviceCall600600CallBack(data, body){
	var chartId = body.chartId;
	var CustomParam = {}; // 커스텀 차트 사용하기 위한 데이터
	cf_contPreloader(chartId);
	var dataList = data.body ? data.body.dataList : '';
	
	if(dataList.length > 0){
		CustomParam["targetFnc"] = "COMPLIANCE_TOTAL_RATE";
		CustomParam["param"] = {};
		if(data.body){
			if(body.is_user_scan_enable) CustomParam["param"]["is_user_scan_enable"] =body.is_user_scan_enable;
			if(body.is_scan_enable) CustomParam["param"]["is_scan_enable"] = body.is_scan_enable;
		}
		lf_setGaugeChart(dataList, chartId,CustomParam);
		$('#'+chartId).fadeIn();
	} else {
		lf_createNotDateView(chartId); // 데이터가 없는 경우 표시하는 화면
	}
	
	lf_DashboardEventInit(); // 드래그 앤 드롭
}

/* 프레임워크 별 규정 준수율 */
function lf_serviceCall600601(chartId, param){
	var selectedClusterUuid = showClusterSelectedDiv(chartId); 
	
	var body = {
			'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), // 주기 day/week
			'chartId': chartId,
			'clusterUuid' : param['clusterUuid'] ? param['clusterUuid'] : selectedClusterUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
			'is_user_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 유저 활성화 프레임 워크만 구하기
			'is_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 스캔 가능한 프레임 워크만 구하기
	};
	
	cf_contPreloader(chartId);  // 로딩
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val(); // 해당 대시보드 데이터(chartConf)에 주기 설정 정보 업데이트
	
	cf_requestServer(_TR_DASHBOARD_COMPLIANCE_RATE_FOR_REGULATIONS, body, lf_serviceCall600601CallBack);
}
function lf_serviceCall600601CallBack(data, body){
	var chartId = body.chartId;
	var CustomParam = {}; // 커스텀 차트 사용하기 위한 데이터
	cf_contPreloader(chartId);
	
	var dataList = data.body ? data.body.dataList : '';
	
	if(dataList.length > 0){
		CustomParam["targetFnc"] = "COMPLIANCE_RATE_FOR_REGULATIONS";
		CustomParam["param"] = {};
		if(data.body){
			if(body.is_user_scan_enable) CustomParam["param"]["is_user_scan_enable"] =body.is_user_scan_enable;
			if(body.is_scan_enable) CustomParam["param"]["is_scan_enable"] = body.is_scan_enable;
		}
		
		lf_setHorizontalBarChart(dataList, chartId,CustomParam);
	} else {
		lf_createNotDateView(chartId); // 데이터가 없는 경우 표시하는 화면
	}
	
	lf_DashboardEventInit(); // 드래그 앤 드롭
}

/* 클러스터 규정준수 평가 추이 */
function lf_serviceCall600602(chartId, param){
	var selectedClusterUuid = showClusterSelectedDiv(chartId); 
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), // 주기 day/week
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
		'is_user_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 유저 활성화 프레임 워크만 구하기
		'is_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 스캔 가능한 프레임 워크만 구하기
	};
	
	cf_contPreloader(chartId);  // 로딩
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val(); // 해당 대시보드 데이터(chartConf)에 주기 설정 정보 업데이트
	
	cf_requestServer(_TR_DASHBOARD_COMPLIANCE_EVALUATION_TREND, body, lf_serviceCall600602CallBack);
}
function lf_serviceCall600602CallBack(data, body){
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var passedDataList = data.body ? data.body.passedDataList : '';
	passedDataList.shift();
	var filedDataList = data.body ? data.body.filedDataList : '';
	filedDataList.shift();
	
	// 2023-09-11 이성호 수정 > 유저 활성화 및 스캔 가능 체크 플러그 추가
	var is_user_scan_enable = body.is_user_scan_enable ? body.is_user_scan_enable : null;
	var is_scan_enable = body.is_scan_enable ? body.is_scan_enable : null;
	var customParam = {
		'is_user_scan_enable': is_user_scan_enable,
		'is_scan_enable': is_scan_enable,
	};
	

	if(passedDataList.length > 0 && filedDataList.length > 0){
		lf_setMultipleLineChart(passedDataList, filedDataList , chartId,customParam);
	} else {
		lf_createNotDateView(chartId); // 데이터가 없는 경우 표시하는 화면
	}
	
	lf_DashboardEventInit(); // 드래그 앤 드롭
}

/* 쿨러스터 규정준수 스캔 상세 현황 */
function initComplianceScanDetailList(chartId, param) {
	page_object[chartId] = {
		lvar_event_pageNum : 0,
		lvar_event_totalCnt : 0,
		lvar_event_pageCnt : 10,
	}
	showClusterSelectedDiv(chartId);
	initComplianceScanOptionBox(chartId);
	
	var complianceScanTable =lf_setComplianceTable(chartId);
	selectFrameworkList(chartId,param);
	lf_serviceCall700019(chartId);
	lf_serviceCall700017(0, chartId);
	drawSubtaskListTree(chartId);
	
	//cf_contPreloader(chartId);  // 로딩
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val(); // 해당 대시보드 데이터(chartConf)에 주기 설정 정보 업데이트
	
	$('#searchKeyword_' + chartId).on('keyup', function (event) {
		if (event.keyCode === 13) { // enter
			executeSearch(chartId); // 검색 실행
		}
	});
	$('#searchBtn_' + chartId).on('click', function () {
		executeSearch(chartId); // 검색 실행
	});

	// 모든 테이블 redraw 시 drop down 메뉴 추가 (redraw 하면 테이블 이외의 사용자 커스텀 모두 날아가기 때문)
	complianceScanTable.on('draw', function () {
		drawSubtaskListTree(chartId);
		$('.view_hide_btn_icon').removeClass('view_hide_active');
	});
}

function initComplianceScanOptionBox(chartId) {
	var targetDIV = $('#'+chartId);
	targetDIV.empty();
	var optionBoxHtml = `
		<div class="compliance_option_box">
			<div id="frameworkSelectBox_${chartId}" class="sel_box framework_select">
			</div>
			<div class="sc_info_search_box">
				<div class="ipt_box">
					<input class="" type="text" placeholder="Name, Description, Remidiation 키워드를 입력해 주십시오." id="searchKeyword_${chartId}" name="searchKeyword">
				</div>
				<a id="searchBtn_${chartId}" href="#" class="btn serch">검색</a>
			</div>
		</div>
	`
	targetDIV.append(optionBoxHtml);
}

/**
 * 컨테이너 이벤트
 */ //lf_serviceCall600620
function containerEventsPolicy(chartId,param){	
	lf_serviceCall600610(chartId[0],param);
	lf_serviceCall600620(chartId[1],param);
}

function containerRuntimeEventsRule(chartId,param){
	// 차트 아이디와 파람
	lf_serviceCall600612(chartId[0],param);
	lf_serviceCall600613(chartId[1],param);
}

function containerBuildtimeEventsRule(chartId,param){
	lf_serviceCall600616(chartId[0],param);
	lf_serviceCall600617(chartId[1],param);
}

function containerRuntimeEventsSeverity(chartId,param){
	lf_serviceCall600614(chartId[0],param);
	lf_serviceCall600615(chartId[1],param);
}
function containerBuildtimeEventsSeverity(chartId,param){
	lf_serviceCall600618(chartId[0],param);
	lf_serviceCall600619(chartId[1],param);	
}


/**
 * 컨테이너 이벤트 정책 기준 Top 5
 */
function lf_serviceCall600610(chartId, param){
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), 
		'topn': '5',
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
	};
		
	cf_contPreloader(chartId); 
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_TOP5,body,lf_serviceCall600610CallBack);
	
}

function lf_serviceCall600610CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.top5List;
	
	if(dataList.length > 0){
		dataList.sort(function(a, b) {// 같은 카운트내 위험도 순
			if(a.cnt === b.cnt){
				var aSeverity = a.severity;
				var bSeverity = b.severity;
			if(aSeverity === bSeverity) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aSeverity==="CRITICAL") aSort=5;
				else if(aSeverity==="HIGH") aSort=4;
				else if(aSeverity==="MEDIUM") aSort=3;
				else if(aSeverity==="LOW") aSort=2;
				else if(aSeverity==="IGNORE") aSort=1;
				
				if(bSeverity==="CRITICAL") bSort=5;
				else if(bSeverity==="HIGH") bSort=4;
				else if(bSeverity==="MEDIUM") bSort=3;
				else if(bSeverity==="LOW") bSort=2;
				else if(bSeverity==="IGNORE") bSort=1;				
				return bSort - aSort;
			}
			}else{
				return b.cnt - a.cnt;
			}
		});
		var chartData= {
			'header': ['Action', 'Name', 'Severity' ,'Cnt'],
			'colgroup': ['10%', 'auto', 'auto','10%'],
			'data': [],
			'realData': [],
			'hideColumToolTip': 4,
			'displayTooltip': 1
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];  
			row.push(dataList[i].policy_action);
			row.push(dataList[i].name);
			row.push(dataList[i].severity);
			row.push(dataList[i].cnt);
			row.push(dataList[i].description);
			chartData['data'].push(row);
			
			chartData['realData'].push(dataList[i]);
			
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}	
	lf_DashboardEventInit();
}
/**
 * 컨테이너 이벤트 정책 기준 그래프
 */
function lf_serviceCall600611(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	var body = {
		'chartId': chartId,
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
	};
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_COUNT, body, lf_serviceCall600611CallBack);
}

function lf_serviceCall600611CallBack(data, body) {
	var countList = data.body.countList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	//$('#'+chartId).append("<div id=\""+chartId+"_policyTop5\"></div>"+"<div id=\""+chartId+"_policyCount\"></div>");
	//if (countList.length > 0) {
	if(countList!="noData"){
		lf_setNLineChart(countList, chartId, "policy_id",data.body.timeList);
	}
	else {
		lf_createNotDateView(chartId);
		//chartData = [];
		//lf_setNLineChart(null, chartId);
	}

	lf_DashboardEventInit();	
}

/**
 * 컨테이너 런타임 이벤트 룰 기준 Top 5
 */
function lf_serviceCall600612(chartId, param){
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), 
		'topn': '5',
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'RUNTIME'
	};
		
	cf_contPreloader(chartId); 
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_RULE_TOP5,body,lf_serviceCall600612CallBack);
	
}

function lf_serviceCall600612CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.top5List;
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) {// 같은 카운트내 위험도 순
			if(a.cnt === b.cnt){
				var aSeverity = a.severity;
				var bSeverity = b.severity;
			if(aSeverity === bSeverity) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aSeverity==="CRITICAL") aSort=5;
				else if(aSeverity==="HIGH") aSort=4;
				else if(aSeverity==="MEDIUM") aSort=3;
				else if(aSeverity==="LOW") aSort=2;
				else if(aSeverity==="IGNORE") aSort=1;
				
				if(bSeverity==="CRITICAL") bSort=5;
				else if(bSeverity==="HIGH") bSort=4;
				else if(bSeverity==="MEDIUM") bSort=3;
				else if(bSeverity==="LOW") bSort=2;
				else if(bSeverity==="IGNORE") bSort=1;				
				return bSort - aSort;
			}
			}else{
				return b.cnt - a.cnt;
			}
		});
		var chartData= {
			'header': ['Name', 'Cnt' ,'Severity'],
			'colgroup': ['auto%', '10%','20%'],
			'data': [],
			'realData': [],
			'hideColumToolTip': 3,
			'displayTooltip': 0
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];  
			row.push(dataList[i].name);
			row.push(dataList[i].cnt);
			row.push(dataList[i].severity);
			row.push(dataList[i].description);
			chartData['data'].push(row);
			
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}	
	lf_DashboardEventInit();
}
/**
 * 컨테이너 런타임 이벤트 위험도 기준 카운트
 */
function lf_serviceCall600613(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	var body = {
		'chartId': chartId,
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'RUNTIME'
	};
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_RULE_COUNT, body, lf_serviceCall600613CallBack);
}

function lf_serviceCall600613CallBack(data, body) {
	var countList = data.body.countList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	var legendSet = {
				top: '10%',
				left: '87%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#e5e5e5'
			}
		};
	var colorSet = ['#b32d33','#e14a42','#f4bf72'];
	var gridSet = {
			height: '95',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		};
	//if (countList.length > 0) {
	if(countList!="noData"){
		var policyActionCount=[0,0,0];
		$.each(countList, function(index, item){
			if(item.policy_action==="DENY") policyActionCount[0]++;
			else if(item.policy_action==="ALERT") policyActionCount[1]++;
			else if(item.policy_action==="LOGGING") policyActionCount[2]++;
		});
		$.each(policyActionCount, function(index, item){
			if(item===0){
				var insertObj = {
					cnt:0,
					time:data.body.timeList[0].time
				};
				if(index===0) insertObj["policy_action"] = "DENY";
				else if(index===1) insertObj["policy_action"] = "ALERT";
				else if(index===2) insertObj["policy_action"] = "LOGGING";
				countList.push(insertObj);
			}
		});
		countList.sort(function(a, b) { // 액션 순
			var aAction = a.policy_action;
			var bAction = b.policy_action;
			if(aAction === bAction) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aAction==="DENY") aSort=3;
				else if(aAction==="ALERT") aSort=2;
				else if(aAction==="LOGGING") aSort=1;
				
				if(bAction==="DENY") bSort=3;
				else if(bAction==="ALERT") bSort=2;
				else if(bAction==="LOGGING") bSort=1;			
				return bSort - aSort;
			}
		});
		lf_setNLineChart(countList, chartId, "policy_action",data.body.timeList,"policy_action",legendSet,colorSet,gridSet);
	}
	else {
		//lf_createNotDateView(chartId);
		chartData = [{
			policy_action:"DENY",
			cnt:0,
			time:data.body.timeList[0].time
		},
		{
			policy_action:"ALERT",
			cnt:0,
			time:data.body.timeList[0].time
		},
		{
			policy_action:"LOGGING",
			cnt:0,
			time:data.body.timeList[0].time
		}
		];	
		lf_setNLineChart(chartData, chartId,"policy_action",data.body.timeList,"policy_action",legendSet,colorSet,gridSet);
	}

	lf_DashboardEventInit();	
}
/**
 * 컨테이너 런타임 이벤트 위험도 기준 Top 5
 */
function lf_serviceCall600614(chartId, param){
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), 
		'topn': '5',
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'RUNTIME'
	};
		
	cf_contPreloader(chartId); 
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_SEVERITY_TABLE,body,lf_serviceCall600614CallBack);
	
}

function lf_serviceCall600614CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0){

		var chartData= {
			'header': ['Name', 'Cnt' ,'Severity'],
			'colgroup': ['auto%', '10%','20%'],
			'data': [],
			'realData': [],
			'hideColumToolTip': 3,
			'displayTooltip': 0
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];  
			row.push(dataList[i].name);
			row.push(dataList[i].cnt);
			row.push(dataList[i].severity);
			row.push(dataList[i].description);
			chartData['data'].push(row);
			
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}	
	lf_DashboardEventInit();
}
/**
 * 컨테이너 런타임 이벤트 위험도 기준 카운트
 */
function lf_serviceCall600615(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	var body = {
		'chartId': chartId,
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'RUNTIME'
	};
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_RUNTIME_DASHBOARD_BY_SEVERITY_COUNT, body, lf_serviceCall600615CallBack);
}

function lf_serviceCall600615CallBack(data, body) {
	var countList = data.body.countList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	var legendSet = {
				top: '10%',
				left: '87%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#e5e5e5'
			}
		};
	var colorSet = ['#b32d33','#e14a42','#f4bf72','#ebcb17','grey'];
	var gridSet = {
			height: '95',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		};
	//if (countList.length > 0) {
	if(countList!="noData"){
		var severityCount=[0,0,0,0,0];
		$.each(countList, function(index, item){
			if(item.severity==="CRITICAL") severityCount[0]++;
			else if(item.severity==="HIGH") severityCount[1]++;
			else if(item.severity==="MEDIUM") severityCount[2]++;
			else if(item.severity==="LOW") severityCount[3]++;
			else if(item.severity==="IGNORE") severityCount[4]++;
		});
		$.each(severityCount, function(index, item){
			if(item===0){
				var insertObj = {
					cnt:0,
					time:data.body.timeList[0].time
				};
				if(index===0) insertObj["severity"] = "CRITICAL";
				else if(index===1) insertObj["severity"] = "HIGH";
				else if(index===2) insertObj["severity"] = "MEDIUM";
				else if(index===3) insertObj["severity"] = "LOW";
				else if(index===4) insertObj["severity"] = "IGNORE";
				countList.push(insertObj);
			}
		});
		countList.sort(function(a, b) { // 위험도 순
			var aSeverity = a.severity;
			var bSeverity = b.severity;
			if(aSeverity === bSeverity) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aSeverity==="CRITICAL") aSort=5;
				else if(aSeverity==="HIGH") aSort=4;
				else if(aSeverity==="MEDIUM") aSort=3;
				else if(aSeverity==="LOW") aSort=2;
				else if(aSeverity==="IGNORE") aSort=1;
				
				if(bSeverity==="CRITICAL") bSort=5;
				else if(bSeverity==="HIGH") bSort=4;
				else if(bSeverity==="MEDIUM") bSort=3;
				else if(bSeverity==="LOW") bSort=2;
				else if(bSeverity==="IGNORE") bSort=1;				
				return bSort - aSort;
			}
		});
		lf_setNLineChart(countList, chartId, "severity",data.body.timeList,"severity",legendSet,colorSet,gridSet);
	}
	else {
		//lf_createNotDateView(chartId);
		chartData = [{
			"severity":"CRITICAL",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"HIGH",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"MEDIUM",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"LOW",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"IGNORE",
			"cnt":0,
			"time":data.body.timeList[0].time
			}];
		lf_setNLineChart(chartData, chartId, "severity",data.body.timeList,"severity",legendSet,colorSet,gridSet);
	}

	lf_DashboardEventInit();	
}
/**
 * 컨테이너 빌드타임 이벤트 룰 기준 Top 5
 */
function lf_serviceCall600616(chartId, param){
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), 
		'topn': '5',
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'BUILD'
	};
		
	cf_contPreloader(chartId); 
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_RULE_TOP5,body,lf_serviceCall600616CallBack);
	
}

function lf_serviceCall600616CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.top5List;
	
	if(dataList.length > 0){
		
		dataList.sort(function(a, b) {// 위험도 순
			if(a.cnt === b.cnt){
				var aSeverity = a.severity;
				var bSeverity = b.severity;
			if(aSeverity === bSeverity) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aSeverity==="CRITICAL") aSort=5;
				else if(aSeverity==="HIGH") aSort=4;
				else if(aSeverity==="MEDIUM") aSort=3;
				else if(aSeverity==="LOW") aSort=2;
				else if(aSeverity==="IGNORE") aSort=1;
				
				if(bSeverity==="CRITICAL") bSort=5;
				else if(bSeverity==="HIGH") bSort=4;
				else if(bSeverity==="MEDIUM") bSort=3;
				else if(bSeverity==="LOW") bSort=2;
				else if(bSeverity==="IGNORE") bSort=1;				
				return bSort - aSort;
			}
			}else{
				return b.cnt - a.cnt;
			}
		});

		var chartData= {
			'header': ['Name', 'Cnt' ,'Severity'],
			'colgroup': ['auto%', '10%','20%'],
			'data': [],
			'realData': [],
			'hideColumToolTip': 3,
			'displayTooltip': 0
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];  
			row.push(dataList[i].name);
			row.push(dataList[i].cnt);
			row.push(dataList[i].severity);
			row.push(dataList[i].description);
			chartData['data'].push(row);
			
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}	
	lf_DashboardEventInit();
}
/**
 * 컨테이너 빌드타임 이벤트 위험도 기준 카운트
 */
function lf_serviceCall600617(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	
	var body = {
		'chartId': chartId,
		//'term': param['term'].toString(),
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'BUILD'
	};

	//$('#' + chartId).data('chartConf')['term'] =param['term'];
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_RULE_COUNT, body, lf_serviceCall600617CallBack);
}

function lf_serviceCall600617CallBack(data, body) {
	var countList = data.body.countList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	var legendSet = {
				top: '10%',
				left: '87%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#e5e5e5'
			}
		};
	var colorSet = ['#b32d33','#e14a42','#f4bf72'];
	var gridSet = {
			height: '95',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		};
	//if (countList.length > 0) {
	if(countList!="noData"){
		var policyActionCount=[0,0,0];
		$.each(countList, function(index, item){
			if(item.policy_action==="DENY") policyActionCount[0]++;
			else if(item.policy_action==="ALERT") policyActionCount[1]++;
			else if(item.policy_action==="LOGGING") policyActionCount[2]++;
		});
		$.each(policyActionCount, function(index, item){
			if(item===0){
				var insertObj = {
					cnt:0,
					time:data.body.timeList[0].time
				};
				if(index===0) insertObj["policy_action"] = "DENY";
				else if(index===1) insertObj["policy_action"] = "ALERT";
				else if(index===2) insertObj["policy_action"] = "LOGGING";
				countList.push(insertObj);
			}
		});
		countList.sort(function(a, b) { // 액션 순
			var aAction = a.policy_action;
			var bAction = b.policy_action;
			if(aAction === bAction) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aAction==="DENY") aSort=3;
				else if(aAction==="ALERT") aSort=2;
				else if(aAction==="LOGGING") aSort=1;
				
				if(bAction==="DENY") bSort=3;
				else if(bAction==="ALERT") bSort=2;
				else if(bAction==="LOGGING") bSort=1;			
				return bSort - aSort;
			}
		});
		lf_setNLineChart(countList, chartId, "policy_action",data.body.timeList,"policy_action",legendSet,colorSet,gridSet);
	}
	else {
		//lf_createNotDateView(chartId);
		chartData = [{
			policy_action:"DENY",
			cnt:0,
			time:data.body.timeList[0].time
		},
		{
			policy_action:"ALERT",
			cnt:0,
			time:data.body.timeList[0].time
		},
		{
			policy_action:"LOGGING",
			cnt:0,
			time:data.body.timeList[0].time
		}
		];
		lf_setNLineChart(chartData, chartId,"policy_action",data.body.timeList,"policy_action",legendSet,colorSet,gridSet);
	}

	lf_DashboardEventInit();	
}
/**
 * 컨테이너 빌드타임 이벤트 위험도 기준 Top 5
 */
function lf_serviceCall600618(chartId, param){
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	
	cf_contPreloader(chartId);
	
	var body = {
		'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), 
		'topn': '5',
		'chartId': chartId,
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'BUILD'
	};
		
	cf_contPreloader(chartId); 
	$('#'+chartId).data('chartConf')['term'] = $('#'+chartId).parent().parent().find('.sel_box select').val();
	
	cf_requestServer(_TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_SEVERITY_TABLE,body,lf_serviceCall600618CallBack);
	
}

function lf_serviceCall600618CallBack(data, body){

	var chartId = body.chartId;
	cf_contPreloader(chartId);
	
	var dataList = data.body.dataList;
	
	if(dataList.length > 0){

		var chartData= {
			'header': ['Name', 'Cnt' ,'Severity'],
			'colgroup': ['auto%', '10%','20%'],
			'data': [],
			'realData': [],
			'hideColumToolTip': 3,
			'displayTooltip': 0
		};
		
		for(var i = 0; i < dataList.length; i++){				
			var row = [];  
			row.push(dataList[i].name);
			row.push(dataList[i].cnt);
			row.push(dataList[i].severity);
			row.push(dataList[i].description);
			chartData['data'].push(row);
			
			chartData['realData'].push(dataList[i]);
			
		}
		lf_setTable(chartData, chartId);
	}
	else{
		lf_createNotDateView(chartId);
	}	
	lf_DashboardEventInit();
}
/**
 * 컨테이너 빌드타임 이벤트 위험도 기준 카운트
 */
function lf_serviceCall600619(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	var body = {
		'chartId': chartId,
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid,
		'type': 'BUILD'
	};
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_BUILDTIME_DASHBOARD_BY_SEVERITY_COUNT, body, lf_serviceCall600619CallBack);
}

function lf_serviceCall600619CallBack(data, body) {
	var countList = data.body.countList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	var legendSet = {
				top: '10%',
				left: '87%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#e5e5e5'
			}
		};
	var colorSet = ['#b32d33','#e14a42','#f4bf72','#ebcb17','grey'];
	var gridSet = {
			height: '95',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		};
	//if (countList.length > 0) {
	if(countList!="noData"){
		var severityCount=[0,0,0,0,0];
		$.each(countList, function(index, item){
			if(item.severity==="CRITICAL") severityCount[0]++;
			else if(item.severity==="HIGH") severityCount[1]++;
			else if(item.severity==="MEDIUM") severityCount[2]++;
			else if(item.severity==="LOW") severityCount[3]++;
			else if(item.severity==="IGNORE") severityCount[4]++;
		});
		$.each(severityCount, function(index, item){
			if(item===0){
				var insertObj = {
					cnt:0,
					time:data.body.timeList[0].time
				};
				if(index===0) insertObj["severity"] = "CRITICAL";
				else if(index===1) insertObj["severity"] = "HIGH";
				else if(index===2) insertObj["severity"] = "MEDIUM";
				else if(index===3) insertObj["severity"] = "LOW";
				else if(index===4) insertObj["severity"] = "IGNORE";
				countList.push(insertObj);
			}
		});
		countList.sort(function(a, b) { // 위험도 순
			var aSeverity = a.severity;
			var bSeverity = b.severity;
			if(aSeverity === bSeverity) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aSeverity==="CRITICAL") aSort=5;
				else if(aSeverity==="HIGH") aSort=4;
				else if(aSeverity==="MEDIUM") aSort=3;
				else if(aSeverity==="LOW") aSort=2;
				else if(aSeverity==="IGNORE") aSort=1;
				
				if(bSeverity==="CRITICAL") bSort=5;
				else if(bSeverity==="HIGH") bSort=4;
				else if(bSeverity==="MEDIUM") bSort=3;
				else if(bSeverity==="LOW") bSort=2;
				else if(bSeverity==="IGNORE") bSort=1;				
				return bSort - aSort;
			}
		});
		lf_setNLineChart(countList, chartId, "severity",data.body.timeList,"severity",legendSet,colorSet,gridSet);
	}
	else {
		//lf_createNotDateView(chartId);
		chartData = [{
			"severity":"CRITICAL",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"HIGH",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"MEDIUM",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"LOW",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"IGNORE",
			"cnt":0,
			"time":data.body.timeList[0].time
			}];
		lf_setNLineChart(chartData, chartId, "severity",data.body.timeList,"severity",legendSet,colorSet,gridSet);
	}

	lf_DashboardEventInit();	
}

/**
 * 컨테이너 정책기준 위험도 카운트
 */
function lf_serviceCall600620(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	var body = {
		'chartId': chartId,
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid
	};
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_DASHBOARD_BY_POLICY_SEVERITY_COUNT, body, lf_serviceCall600620CallBack);
}

function lf_serviceCall600620CallBack(data, body) {
	var countList = data.body.countList;
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	var legendSet = {
				top: '10%',
				left: '87%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#e5e5e5'
			}
		};
	var colorSet = ['#b32d33','#e14a42','#f4bf72','#ebcb17','grey'];
	var gridSet = {
			height: '95',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		};
	//if (countList.length > 0) {
	if(countList!="noData"){
		var severityCount=[0,0,0,0,0];
		$.each(countList, function(index, item){
			if(item.severity==="CRITICAL") severityCount[0]++;
			else if(item.severity==="HIGH") severityCount[1]++;
			else if(item.severity==="MEDIUM") severityCount[2]++;
			else if(item.severity==="LOW") severityCount[3]++;
			else if(item.severity==="IGNORE") severityCount[4]++;
		});
		$.each(severityCount, function(index, item){
			if(item===0){
				var insertObj = {
					cnt:0,
					time:data.body.timeList[0].time
				};
				if(index===0) insertObj["severity"] = "CRITICAL";
				else if(index===1) insertObj["severity"] = "HIGH";
				else if(index===2) insertObj["severity"] = "MEDIUM";
				else if(index===3) insertObj["severity"] = "LOW";
				else if(index===4) insertObj["severity"] = "IGNORE";
				countList.push(insertObj);
			}
		});
		countList.sort(function(a, b) { // 위험도 순
			var aSeverity = a.severity;
			var bSeverity = b.severity;
			if(aSeverity === bSeverity) return 0;
			else{
				var aSort = 0;
				var bSort = 0;
				if(aSeverity==="CRITICAL") aSort=5;
				else if(aSeverity==="HIGH") aSort=4;
				else if(aSeverity==="MEDIUM") aSort=3;
				else if(aSeverity==="LOW") aSort=2;
				else if(aSeverity==="IGNORE") aSort=1;
				
				if(bSeverity==="CRITICAL") bSort=5;
				else if(bSeverity==="HIGH") bSort=4;
				else if(bSeverity==="MEDIUM") bSort=3;
				else if(bSeverity==="LOW") bSort=2;
				else if(bSeverity==="IGNORE") bSort=1;				
				return bSort - aSort;
			}
		});
		lf_setNLineChart(countList, chartId, "severity",data.body.timeList,"severity",legendSet,colorSet,gridSet);
	}
	else {
		//lf_createNotDateView(chartId);
		chartData = [{
			"severity":"CRITICAL",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"HIGH",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"MEDIUM",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"LOW",
			"cnt":0,
			"time":data.body.timeList[0].time
			},
			{
			"severity":"IGNORE",
			"cnt":0,
			"time":data.body.timeList[0].time
			}];
		lf_setNLineChart(chartData, chartId, "severity",data.body.timeList,"severity",legendSet,colorSet,gridSet);
	}

	lf_DashboardEventInit();	
}

/**
 * 컨테이너 보안 위험도
 */
function lf_serviceCall600621(chartId, param) {
	var selectedClusterUuid=showClusterSelectedDiv(chartId);
	cf_contPreloader(chartId);
	var body = {
		'chartId': chartId,
		'term': $('#' + chartId).parent().parent().find('.sel_box select').val(),
		'clusterUuid' : param['clusterUuid']  ? param['clusterUuid'] : selectedClusterUuid
	};
	$('#' + chartId).data('chartConf')['term'] = $('#' + chartId).parent().parent().find('.sel_box select').val();
	cf_requestServer(_TR_DASHBOARD_CE_RUNTIME_BUILDTIME_BY_COUNT, body, lf_serviceCall600621CallBack);
}

function lf_serviceCall600621CallBack(data, body){
	var countList = data.body.countList;
	var dounutChartData = [];
	var tooltips = {};
	var chartId = body.chartId;
	cf_contPreloader(chartId);
	if(countList!="noData"){
			$.each(countList,function(index,item){
		var insertObj = {
			value:countList[index]['cnt'],
			name: countList[index]['name']
		};
		dounutChartData.push(insertObj);
		var description = [];
		if(countList[index]['description'].length>50){
			description = countList[index]['description'].split('.');
			description.pop();
		}else{
			description.push(countList[index]['description']);
		}
		tooltips[countList[index]['name']] = 'NAME: '+countList[index]['name']+' <br/> '
		+'TYPE: '+countList[index]['type']+' TIME <br/> '
		+'SEVERITY: '+countList[index]['severity']+' <br/> '
		+'DESCRIPTION: ';
		
		$.each(description,function(desIndex,value){
			if(desIndex!==0)tooltips[countList[index]['name']]+='<br/>';
			tooltips[countList[index]['name']]+=value+'.';
		});
	});	
		createDonutChartForContainerEvent(chartId,'container security risk',['#b32d33','#0064FF','#e14a42','#ebcb17','#d2d2d2'],dounutChartData,tooltips);
	}else{
		createDonutChartForContainerEvent(chartId,null,['white'],[{value:0,name:'NoData'}],{'NoData':'데이터가 없습니다.'});
	}

	lf_DashboardEventInit();
}

/**
 * N개의 라인이 들어가는 차트
 * @param dataList : 리스트 전체 데이터
 * @param chartId : 차트 아이디
 * @param groupData : 한개의 라인그룹으로 묶을 컬럼 명
 * @param timeList : 카운트 0을 위한 시간 데이터만 있는 리스트
 * @param title : 라인의 이름으로 들어갈 컬럼 > 없을시 name으로 고정
 * @param legendSet : 레전드 세팅 object, null일시 defualt값 적용
 * @param colorSet : 라인 색상 세팅 arry, null defualt값 적용
 * @param gridSet: 높이 넓이등 세팅, null일시 default 값 적용
 */
function lf_setNLineChart(dataList, chartId, groupData, timeList, title,legendSet,colorSet,gridSet) {
	$('#' + chartId).fadeOut();
	var chartType = $('#' + chartId).data('chartType');
	$('#' + chartId).data('detailNum', 'dashboard');
	var option = {};
	var timeListData = [];
	var lineGroup = {};
	var lineTitle = [];
	var seriesData = [];
	if(!legendSet){
		legendSet = {
			top: '4%',
			textStyle: {
				color: '#e5e5e5'
			}
		};
	}
	if(!colorSet){
		colorSet = lvar_colorList;
	}
	
	if(!gridSet){
		gridSet = {
			//height: '95',
			height: '185',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		};
	}
	
	if(!title) title = "name";
	
	if(dataList){
		
	
	$.each(dataList, function(index, item){
		if(lineGroup[item[groupData]]){
			lineGroup[item[groupData]].push(item);
		}else{
			lineGroup[item[groupData]] = [];
			lineGroup[item[groupData]].push(item);
		}
	});
	
	

		for(var i=0; i<timeList.length; i++){
			timeListData.push(timeList[i].time);
		}
	
	$.each(timeListData, function(index, item){
		$.each(lineGroup, function(groupIndex, groupItem){
			// 여기서 index는 나눠진 라인의 집합
			var isInserting = true;
			var copyObj = {};
			
			$.each(groupItem, function(arrIndex, arrItem){
				if(arrIndex === 0) copyObj = ccf_isCopyObj(arrItem);
				if(arrItem.time === item)isInserting = false;
			});	
			
			if(isInserting){
				copyObj.cnt = 0;
				copyObj.time = item;
				groupItem.push(copyObj);
			}
		});
	});
	
	$.each(lineGroup, function(groupIndex, groupValue){
		groupValue.sort(function(a, b) { // 오름차순
			var aTime = new Date(a['time']).getTime();
			var bTime = new Date(b['time']).getTime();
			return aTime - bTime;
		});
		lineTitle.push(groupValue[0][title]);
	});
	legendSet["data"] =	lineTitle;
	
	var dataObj = [];
	
	$.each(lineGroup, function(index, item){	
		dataObj.push(refineTrendDataList(item));
	});
	var minValue = 0;
	var maxValue = 0;
	$.each(dataObj, function(index, item){
		if(index !==0) minValue = Math.min(minValue, item.minValue);
		else minValue = item.minValue;
		maxValue = Math.max(maxValue, item.maxValue);
		
		var seriesObj ={
			name:lineTitle[index],
			data:item.visualChartData,
			type: 'line',
			itemStyle: {
				// limit 11개 색상
				color:colorSet[index],
				//color: '#4e66dc',
			},
			showSymbol: true,
			showAllSymbol: true,
			markLine: {
				silent: true,
				data: [{
					yAxis: average
				}],
				symbol: 'none',
				label: {
					// limit 11개 색상
					color:colorSet[index],
					//color: '#2196f3',
				},
				lineStyle: {
					// limit 11개 색상
					color:colorSet[index],
					//color: '#2196f3',
				},
			},
			markPoint: {
				data: [{
					type: 'max',
					symbolSize: [20, 30],
					itemStyle: {
						color: 'transparent',
					},
					label: {
						color: '#ddd',
					},
				}],
			},
			symbol: 'circle',
			lineStyle: {
				width: 2,
				type: 'solid'
			}
		}
		seriesData.push(seriesObj);
	});
	var xLabelData = dataObj[0].xLabelData;
	var lineChart = echarts.init(document.getElementById(chartId));
	option = {
		tooltip: {
			triggerOn: 'mousemove',
			backgroundColor: 'rgba(47,55,66,0.8)',
			borderColor: "#515964",
			transitionDuration: 0,
			textStyle: {
				color: '#bbbbbb',
				fontWeight: 400,
				fontSize: 11,
			},
			position: 'top',
			renderMode: 'html',
			formatter: '{b} <span style="color: #ed960a">{c}</span>',
		},
		legend: legendSet,
		grid: gridSet,
		xAxis: {
			type: 'category',
			name: '(시간)',
			nameTextStyle: {
				padding: [25, 0, 0, 0],
			},
			axisLine: {
				lineStyle: {
					color: '#565d68',
				}
			},
			data: xLabelData
		},
		yAxis: {
			type: 'value',
			name: '(개수)',
			nameTextStyle: {
				padding: [0, 45, 0, 0],
			},
			splitLine: {
				show: false
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#adb0bc'
				}
			},
		},
		series: seriesData,
		visualMap: [{
			show: false,
			seriesIndex: 0,
			min: minValue,
			max: maxValue,
			borderWidth: 5,
			inRange: {
				//color: ['#747b86', '#2195f2'],
				symbolSize: 8,
			},
		}],
		textStyle: {
			color: '#adb0bc',
			fontWeight: 100,
		},
	};
	}else{
		// 데이터가 없을때
		
	}
	
	lineChart.setOption(option);
	window.addEventListener('resize', function () {
		lineChart.resize();
	});


	$('#' + chartId).fadeIn();
	
}
/**
 * 수평바 차트
 */
function lf_setHorizontalBarChart(dataList, chartId,defineCustom){
	// 2023-09-08 이성호 수정
	// 함수명과 내용이 달라 커스텀된 차트는 따로 호출하는 방식으로 수정
	if(defineCustom!=null){ // 따로 재정의한 수평 바차트가 존재할떄
		switch(defineCustom.targetFnc){
			case "COMPLIANCE_RATE_FOR_REGULATIONS": // 프레임워크 별 규정 준수율
				return lf_setHorizontalBarChartComplianceRateByFramework(dataList, chartId,defineCustom.param);
			default:
				break;
		}
	}
	// 2023-09-08 이성호 TODO default로 적용할 수 있는 차트는 추후 개발 
}
/**
 * 게이지 차트
 */
function lf_setGaugeChart(dataList, chartId,defineCustom){
		// 2023-09-08 이성호 수정
	// 함수명과 내용이 달라 커스텀된 차트는 따로 호출하는 방식으로 수정
	if(defineCustom!=null){ // 따로 재정의한 수평 바차트가 존재할떄
		switch(defineCustom.targetFnc){
			case "COMPLIANCE_TOTAL_RATE": // 프레임워크 별 규정 준수율	
				return lf_setGaugeChartComplianceTotalRate(dataList, chartId,defineCustom.param);
			default:
				break;
		}
	}
	// 2023-09-08 이성호 TODO default로 적용할 수 있는 차트는 추후 개발 
}

//2023-09-23 이성호 추가 > 대시보드 전체화면에서 데이터 출력을 위하여 로직 이동 > TODO 작업이 크기떄문에 추후 작업.
// is_registry 테이블 ROW 조회 
function lf_serviceCall600074(){
	cf_requestServer(_TR_CLOUD_CONTAINER_SERVER_STATUS, null, lf_serviceCall600074CallBack, false);
};
function lf_serviceCall600074CallBack(data) {
	var dataList = data.body.dataList;
	
	var registryList = ''; 
	// Registry select에 Option 추가
	dataList.forEach(function(data){
		registryList += "<option value='"+data.registry_uuid+"'>"+data.equipmarkname+"</option>\n";
	});
	registryTag = `
		<div style="display:none" class="dashboard_box_registry">
			<div class="registry_title">
	   			<p>Registry</p>
			</div>
	    	<div class="registry_select_box sel_box">
				<select class="popup_sel registryList" onChange="registryChangeEvent()">
					${registryList}
				</select>
			</div>
     	</div>
	`;
};
// registry 변경 시 chart 새로고침
function registryChangeEvent(){
	var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
	for(var i = 0; i < chartData.length; i++){
		lf_refreshChart(chartData[i]['chartId']);
		$("#dashboardScanCount").val(""); // 기존에 값 초기화
	}
	return true;
}

// cluster 조회
function lf_serviceCall800060(){
	cf_requestServer(_TR_POLICY_CLUSTER_INFO, null, lf_serviceCall800060CallBack, false);
};
function lf_serviceCall800060CallBack(data) {
	var dataList = data.body.clusterList;
	
	var clusterOption = ''; 
	// cluster select에 Option 추가
	dataList.forEach(function(data){
		clusterOption += "<option value='"+data.uuid+"'>"+data.name+"</option>\n";
	});
	clusterTag = `
		<div style="display:none" class="dashboard_box_cluster">
			<div class="cluster_title">
				<p>Cluster</p>
			</div>
			<div class="cluster_select_box sel_box">
				<select class="popup_sel cluster_list" onChange="clusterChangeEvent()">
					${clusterOption}
				</select>
			</div>
		</div>
		`;
};
// cluster 변경 시 chart 새로고침
function clusterChangeEvent(){
	var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
	for(var i = 0; i < chartData.length; i++){
		lf_refreshChart(chartData[i]['chartId']);
		$("#dashboardScanCount").val(""); // 기존에 값 초기화
	}
	return true;
}



// 임시로 들어가는 컨테이너 이벤트 도넛 차트 생성 
function createDonutChartForContainerEvent(id, title, colorPalette, data,tooltips) {	
	var dom = document.getElementById(id);
	var myChart = echarts.init(dom, null, {
		renderer: 'canvas',
		useDirtyRect: false
	});
	var labelShow = true;
	if(title===null)labelShow = false;
	
	var option = {
/*		title: {
			//text: title,
			left: 'center',
			textStyle: {
				color: 'white',
				fontStyle: 'oblique',
				fontSize: '17',
				fontWeight: '400',
				marginTop: '30',
				lineHeight: '56',
			}
		},*/
		tooltip: {
			triggerOn: 'mousemove',
			backgroundColor: 'rgba(47,55,66,0.8)',
			borderColor: "#515964",
			transitionDuration: 0,
			textStyle: {
				color: 'white',
				fontWeight: 400,
				fontSize: 11,
			},
			position: 'right',
			renderMode: 'html',
			formatter: function(params){
				return tooltips[params.data['name']];
			},
/*			formatter : function(params){
				// 도넛 차트 툴팁 형식 지정 
				return tooltips[params.data['name']];
			}*/
		},
		legend: {
				top: '30%',
				left: '50%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#white',
				fontSize: '12',
				},
				icon: 'circle',
			},
			 /*{
				top: '10%',
				left: '50%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#white',
				fontSize: '12',
				},
				icon: 'circle',
			},*/
/* 			{
				top: '10%',
				left: '87%',
				float: 'right',
				width:'50px',
				textStyle: {
				color: '#white',
				fontSize: '12',
				},
				icon: 'circle',
			},*/
/*		{
			bottom: 'bottom',
			left: 'left',
			textStyle: {
				color: 'white',
				fontSize: '12',
			},
			icon: 'circle',
		},*/

		series: [{
			 left:'-60%',
			//width:'200%;',
			//'vertical-align':'top',
			color: colorPalette,
			type: 'pie',
			radius: ['30%', '70%'],
			legendHoverLink: true,
			avoidLabelOverlap: true,
			data: data,
			label: {
				show: labelShow,
				position: 'inside',
				formatter: function(param) {
					return param.data.value;
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
	
/*	// Echarts 클릭 이벤트 처리
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
	});*/
}
