/******************************************************************************************
*
* 클러스터 규정준수 스캔 관련 함수
* 작성 시간 : 2023-08-29
* 작성자 : 김성원
* 
*******************************************************************************************/

/*var FRAMEWORK_NAME_OBJECT = {
	'kubernetes': "Kubernetes",
	'docker': "Docker",
	'linux': "Linux",
	'devops': "DevOps",
	'nsa-cisa': "NSA-CISA"
}
*/

// BASE 프레임워크 이름 (CUSTOM 프레임워크의 경우에만, 컨트롤 ID 값에 따라 추가해 준다)
var FRAMEWORK_NAME_OBJECT = {
	'clf_0001': "Kubernetes",
	'clf_0002': "Docker",
	'clf_0004': "DevOps",
	'clf_0003': "NSA-CISA",
	'clf_0005': "Linux"
}

// 컨트롤에서 변경할 이름들
var controlChangeNameLabel = ['K', 'D', 'L'];

// 변경할 컨트롤 이름
var controlChangeNameLabelFromFrameworkId = {
	"clf_0003": {
		"rename": "NSA-"	// 새로 붙일 네임
	},
	"clf_0004": {
		"rename": "DevOps-"	// 새로 붙일 네임
	}
}

var COLOR_OF_RESULT = {
	passed: '#4E66DC',
	failed: '#B93C3C',
	WARN:'grey', excepted:'grey', skipped:'grey'
}

var lvar_param_prefix = 'event_complianceScan';
var lvar_param_trid = '700017';
var lvar_param_service = lf_serviceCall700017;
var page_object ={};
var selectFramework_object ={};

var taskLogDataList = [];
var subtaskLogDataList = [];
var taskLogDataResultCount = [];





/******************************************************************************************
 * 클러스터 규정 준수율
*******************************************************************************************/
function lf_setGaugeChartComplianceTotalRate(dataList, chartId,enabledData) {
	$('#' + chartId).fadeOut();
	var passedCnt = dataList[0].pass_controls;
	var failedCnt = dataList[0].fail_controls;
	var totalCnt = passedCnt + failedCnt;
	var passedRatio = ((passedCnt / totalCnt)).toFixed(2);
	
	var gaugeChart = echarts.init(document.getElementById(chartId));
	var option;

	option = {
		series: [
			{
				width: '100%',
				height: '100%',
				type: 'gauge',
				startAngle: 180,
				endAngle: 0,
				center: ['50%', '70%'],
				radius: '90%',
				min: 0,
				max: 1,
				splitNumber: 10,
				axisLine: {
					lineStyle: {
						width: 10,
						color: [
							[passedRatio, '#4e66dc'],
							[1, '#B93C3C'],
						]
					}
				},
				pointer: {
					width: 0,
				},
				axisTick: {
					length: 10,
					lineStyle: {
						color: 'auto',
						width: 1
					}
				},
				splitLine: {
					length: 15,
					lineStyle: {
						color: 'auto',
						width: 2
					}
				},
				axisLabel: {
					color: '#adb0bc',
					fontSize: 20,
					distance: -40,
					formatter: function (value) {
						if (value === 1) {
							return '\n\n\n{a|' + (!isNaN(passedRatio) ? Math.round(100 - passedRatio * 100) : 0) + '%}\n{a|Failed}';
						} else if (value === 0) {
							return '\n\n\n{b|' + (!isNaN(passedRatio) ? Math.round(passedRatio * 100) : 0) + '%}\n{b|Passed}';
						}
						return '';
					},
					rich: {
						a: {
							color: '#adb0bc',
							align: 'center',
							fontSize: 15
						},
						b: {
							color: '#adb0bc',
							align: 'center',
							fontSize: 15
						}
					}
				},
				title: {
					offsetCenter: [0, '-50%'],
					fontSize: 20,
					color: '#adb0bc',
				},
				detail: {
					fontSize: 30,
					offsetCenter: [0, '-35%'],
					valueAnimation: true,
					color: 'inherit'
				},
				data: [
					{
						value: totalCnt,
						name: 'Total checks'
					}
				]
			}
		]
	};
	
	
	gaugeChart.setOption(option);
	
	// 차트에 직접 이벤트 리스너를 추가하는것에 제한사항이 있기 때문에 canvas 이벤트 리스너 추가
	var gaugeChartCanvas = '#'+chartId+' canvas';
	
	$(gaugeChartCanvas).css('cursor', 'pointer');
	$(gaugeChartCanvas).off('click');
	$(gaugeChartCanvas).on('click', function(data) {
		var term = $('#' + chartId).parents().find(".popup_sel.small").val();
		var clusterUuid = $('.popup_sel.cluster_list').val();
		
		var param = {
			'body': {
				'term': term,
				'chartId': chartId,
				'clusterUuid': clusterUuid,
				'is_user_scan_enable':enabledData.is_user_scan_enable,
				'is_scan_enable':enabledData.is_scan_enable,
			}
		}
		
		lf_eventComplianceTableClick(param);
	});
	
	window.addEventListener('resize', function () {
		gaugeChart.resize();
	});
}


/******************************************************************************************
 * 프레임워크 별 규정 준수율
*******************************************************************************************/
function lf_setHorizontalBarChartComplianceRateByFramework(dataList, chartId,enabledData) {
	$('#' + chartId).fadeOut();
	var barChart = echarts.init(document.getElementById(chartId));
	var option;
	var passedObject = {
		name: 'Passed',
		type: 'bar',
		itemStyle: {
			color: '#4e66dc',
		},
		stack: 'Total',
		label: {
			show: true,
			color: '#e5e5e5',
			formatter: function(params) {
				return params.value + '%';
			}
		},
		emphasis: {
			focus: 'series'
		},
		data: []
	};
	var failedObject = {
		name: 'Failed',
		type: 'bar',
		itemStyle: {
			color: '#B93C3C',
		},
		stack: 'Total',
		label: {
			show: true,
			color: '#e5e5e5',
			formatter: function(params) {
				return params.value + '%';
			}
		},
		emphasis: {
			focus: 'series'
		},
		data: []
	};
	var yAxisData = [];
	var seriesData = [];

	if (dataList != 'noData') {
		$.each(dataList, function (idx, rowData) {
			if(rowData.framework_name){
				var frameworkName = rowData.framework_name;
				var passCnt =(rowData.pass_controls)  ? rowData.pass_controls : 0;
				var failCnt = (rowData.fail_controls) ? rowData.fail_controls : 0;
				var totalCnt = passCnt + failCnt;
				
				yAxisData.push(frameworkName);
				passedObject.data.push(((passCnt / totalCnt) * 100).toFixed(1));
				failedObject.data.push(((failCnt / totalCnt) * 100).toFixed(1));
			}
		});
	}

	seriesData.push(passedObject);
	seriesData.push(failedObject);

	option = {
		tooltip: {
			backgroundColor: 'rgba(0, 0, 0, 0)',
			borderColor: 'rgba(0, 0, 0, 0)',
			shadowColor: 'rgba(0, 0, 0, 0)',
			formatter: '<span style="display:none"></span>',
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			top: '4%',
			data: ['Passed', 'Failed'],
			textStyle: {
				color: '#e5e5e5'
			},
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'value',
				min: 0,
	      max: 100,
				axisLine: {
					show: true,
					lineStyle: {
						color: '#adb0bc'
					}
				},
			}
		],
		yAxis: [
			{
				type: 'category',
				axisTick: {
					show: false
				},
				data: yAxisData,
				axisLine: {
					show: true,
					lineStyle: {
						color: '#adb0bc'
					}
				},
			}
		],
		series: seriesData
	};
	barChart.setOption(option);
	window.addEventListener('resize', function () {
		barChart.resize();
	});

	barChart.off('click'); // 기존 이벤트 리스너 삭제
	barChart.on('click', function (data) {
		var term = $('#' + chartId).parents().find(".popup_sel.small").val();
		var clusterUuid = $('.popup_sel.cluster_list').val();
		var param = {
			'body': {
				'term': term,
				'chartId': chartId,
				'clusterUuid': clusterUuid,
				'frameworkName': data.name,
				'needFrameworkSelect' : true,
				'is_user_scan_enable':enabledData.is_user_scan_enable,
				'is_scan_enable':enabledData.is_scan_enable,
			}
		}

		lf_eventComplianceTableClick(param);
	});

	$('#' + chartId).fadeIn();
}


/******************************************************************************************
 * 클러스터 규정준수 평가 추이
*******************************************************************************************/
function refineTrendDataList(dataList) {
	var chartDataObject = {
		visualChartData: [],
		xLabelData: [],
		average: 0,
		maxValue: 0,
		minValue: 0
	};

	if (dataList.length > 0) {
		for (var i = 0; i < dataList.length; i++) {
			chartDataObject.visualChartData.push(dataList[i]['cnt']);
			chartDataObject.average += dataList[i]['cnt'];
			chartDataObject.xLabelData.push(dataList[i]['time']);
		}
	}

	average = Math.round(chartDataObject.average / dataList.length);
	chartDataObject.maxValue = Math.max.apply(null, chartDataObject.visualChartData);
	chartDataObject.minValue = Math.min.apply(null, chartDataObject.visualChartData);

	return chartDataObject;
}

function lf_setMultipleLineChart(passedDataList, filedDataList, chartId,customParam) {
	$('#' + chartId).fadeOut();
	var chartType = $('#' + chartId).data('chartType');
	$('#' + chartId).data('detailNum', 'dashboard');

	var passedDataObj = refineTrendDataList(passedDataList);
	var filedDataObj = refineTrendDataList(filedDataList);

	var minValue = Math.min(passedDataObj.minValue, filedDataObj.minValue);
	var maxValue = Math.max(passedDataObj.maxValue, filedDataObj.maxValue);
	var xLabelData = passedDataObj.xLabelData ? passedDataObj.xLabelData : filedDataObj.xLabelData;
	
	// 2023-09-11 이성호 수정 > 유저 활성화 및 스캔 가능 체크 플러그 추가
	var is_user_scan_enable = customParam.is_user_scan_enable ? customParam.is_user_scan_enable : null;
	var is_scan_enable = customParam.is_scan_enable ? customParam.is_scan_enable : null;
		
	var lineChart = echarts.init(document.getElementById(chartId));
	var option = {
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
		legend: {
			top: '4%',
			data: ['Passed', 'Failed'],
			textStyle: {
				color: '#e5e5e5'
			},
		},
		grid: {
			height: '300',
			top: '70',
			bottom: '0',
			left: '100',
			right: '110'
		},
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
		series: [{
			name: 'Passed',
			data: passedDataObj.visualChartData,
			type: 'line',
			itemStyle: {
				color: '#4e66dc',
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
					color: '#2196f3',
				},
				lineStyle: {
					color: '#2196f3',
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
			},
		}, {
			name: 'Failed',
			data: filedDataObj.visualChartData,
			type: 'line',
			itemStyle: {
				color: '#B93C3C',
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
					color: '#2196f3',
				},
				lineStyle: {
					color: '#2196f3',
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
			},
		}],
		visualMap: [{
			show: false,
			seriesIndex: 0,
			min: minValue,
			max: maxValue,
			borderWidth: 5,
			inRange: {
				color: ['#747b86', '#2195f2'],
				symbolSize: 8,
			},
		}],
		textStyle: {
			color: '#adb0bc',
			fontWeight: 100,
		},
	};
	lineChart.setOption(option);
	window.addEventListener('resize', function () {
		lineChart.resize();
	});

	lineChart.off('click'); // 기존 이벤트 리스너 삭제
	lineChart.on('click', function (dot) {
		var term = $('#' + chartId).parents().find(".popup_sel.small").val();
		var clusterUuid = $('.popup_sel.cluster_list').val();

		var startTime = '';
		var endTime = '';
		if (term == 'DAY') {
			startTime = dot.name;
			endTime = dot.name.substring(0, 13) + ':59:59';
		}
		else {
			startTime = dot.name;
			endTime = dot.name.substring(0, 10) + ' 23:59:59';
		}

		var param = {
			'body': {
				'starttime': startTime,
				'endtime': endTime,
				'chartId': chartId,
				'clusterUuid': clusterUuid,
				// 2023-09-11 이성호 수정 > 유저 활성화 및 스캔 가능 체크 플러그 추가
				'is_user_scan_enable':is_user_scan_enable,
				'is_scan_enable':is_scan_enable
			}
		}

		if (!startTime || !endTime) {
			console.log('found not time');
			return;
		}
		lf_eventComplianceTableClick(param);
	});

	$('#' + chartId).fadeIn();
}

function lf_eventComplianceTableClick(param) {
	$('#complianceDetailData').val('');
	$('#complianceDetailData').val(JSON.stringify(param.body));

	var popup = window.open('/eventComplianceInfo.do', '', 'width=1300,height=810,location=no,status=no,scrollbars=yes');
}


/******************************************************************************************
 * 쿨러스터 규정준수 스캔 상세 현황
*******************************************************************************************/
//700019
function lf_serviceCall700019(chartId) {
	var searchValue = $('#searchValue_'+chartId).val();
	var clusterUuid = $('.popup_sel.cluster_list').val();
	var frameworkIdValue = $('#frameworkSelect_'+chartId).val();
	
	var body = {
			'trId': lvar_param_trid,
			'term' : $('#'+chartId).parent().parent().find('.sel_box select').val(), // 주기 day/week
			'chartId': chartId,
			'clusterUuid' : clusterUuid, // 따로 registryUuid 값을 가져오게 되면 해당 값 사용
			'searchValue' : searchValue,
			'frameworkId': frameworkIdValue,
			'is_user_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 유저 활성화 프레임 워크만 구하기
			'is_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 스캔 가능한 프레임 워크만 구하기
		};
	
	cf_requestServer(_TR_EVENT_CSP_PAGEINFO_SEARCH, body, lf_serviceCall700019Callback, false);
}
function lf_serviceCall700019Callback(data, body) {
	var chartId = body.chartId;
	var complianceScanTable = $('#'+lvar_param_prefix+'_'+chartId).DataTable();
	var dataInfo = data.body.info[0]; // totalCnt
	var totalCnt = dataInfo['totalcnt'];
	page_object[chartId].lvar_event_totalCnt = totalCnt;
	var page = page_object[chartId].lvar_event_pageNum ? page_object[chartId].lvar_event_pageNum : 0;
	var len = complianceScanTable.page.len();
	page_object[chartId].lvar_event_pageCnt = len;
	var pagingValue = totalCnt + '_' + len + '_' + page;
	var info = {
		'start': 0,
		'page': page,
		'pages': Math.ceil(totalCnt / len),
		'length': len,
		'recordsTotal': totalCnt,
		'recordsDisplay': totalCnt,
		'all': false
	};
	var api = complianceScanTable.columns.adjust();
	var settings = api.settings()[0];
	_fnUpdatePaginate(settings, info, lvar_param_service);

	$('#complianceTaskEventPaging_'+chartId).val(pagingValue);
}

//700017
function lf_serviceCall700017(pageNum, chartId) {
	var searchValue = $('#searchValue_'+chartId).val();
	var clusterUuid = $('.popup_sel.cluster_list').val();
	var frameworkIdValue = $('#frameworkSelect_'+chartId).val();

	if (!pageNum && pageNum != 0) {
		pageNum = page_object[chartId].lvar_event_pageNum; // default = 0 
	} else {
		switch (pageNum) {
			case 'first': pageNum = 0; break;
			case 'previous': pageNum = page_object[chartId].lvar_event_pageNum - 1; break;
			case 'next': pageNum = page_object[chartId].lvar_event_pageNum + 1; break;
			case 'last': pageNum = Math.ceil(page_object[chartId].lvar_event_totalCnt / page_object[chartId].lvar_event_pageCnt) - 1; break;
		}
	}
	page_object[chartId].lvar_event_pageNum = pageNum; // 페이지 넘버 재정의
	var body = {
		page: page_object[chartId].lvar_event_pageNum * page_object[chartId].lvar_event_pageCnt,
		topn: page_object[chartId].lvar_event_pageCnt,
		chartId: chartId,
		term: $('#'+chartId).parent().parent().find('.sel_box select').val(),
		clusterUuid: clusterUuid,
		frameworkId: frameworkIdValue,
		'is_user_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 유저 활성화 프레임 워크만 구하기
		'is_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 스캔 가능한 프레임 워크만 구하기
	}

	if(searchValue) body['searchValue'] = searchValue;
	
	cf_requestServer(_TR_EVENT_COMPLIANCE_INFO, body, lf_serviceCall700017Callback, false);
}
function lf_serviceCall700017Callback(data, body) {
	var chartId = body.chartId;
	if (!data.body) {
		var complianceScanTable = $('#'+lvar_param_prefix+'_'+chartId).DataTable();
		complianceScanTable.clear().draw();
		return false;
	}
	
	taskLogDataList = data.body.taskLogDataList;
	subtaskLogDataList = data.body.subtaskLogDataList;
	taskLogDataResultCount = data.body.taskLogDataResultCount;

	drawComplianceScanTable(data, body);
}

//페이징 버튼 클릭
function lf_serviceButtonDataCallback(chartId) {
	var complianceScanTable = $('#'+lvar_param_prefix+'_'+chartId).DataTable();
	var pageArr = $('#complianceTaskEventPaging_'+chartId).val().split('_');
	var totalCnt = pageArr[0] ? pageArr[0] : page_object[chartId].lvar_event_totalCnt;
	var page = page_object[chartId].lvar_event_pageNum ? page_object[chartId].lvar_event_pageNum : 0;
	var len = pageArr[1];
	var pagingValue = totalCnt + '_' + len + '_' + page;
	var info = {
		'start': 0,
		'page': page,
		'pages': Math.ceil(totalCnt / len),
		'length': len,
		'recordsTotal': totalCnt,
		'recordsDisplay': totalCnt,
		'all': false
	};
	var api = complianceScanTable.columns.adjust();
	var settings = api.settings()[0];
	if (totalCnt > 0) {
		_fnUpdatePaginate(settings, info, lvar_param_service, chartId);
	}

	$('#complianceTaskEventPaging_'+chartId).val(pagingValue);
}


//null에 대한 처리
function transformDataOfNull(item) {
	var transformData = typeof item !== 'undefined' && item !== null && item !== 'null' && item !== '' ? item : '-';
	return transformData;
}

/*
// taskId 변환
function transformTaskId(data) {
	if (!data) {
		data = '-';
	}
	if (data.startsWith('G_')) {
		data = data.replace('G_', '');
		var hyphenIndex = data.indexOf("-");
		if (hyphenIndex >= 0) {
			data = data.substring(hyphenIndex + 1);
		}
	}

	return data;
}
// frameworkName 변환
function transformFrameworkName(frameworkName) {
	var data = '-';
	$.each(FRAMEWORK_NAME_OBJECT, function (key, value) {
		if (frameworkName.toLowerCase().indexOf(key) !== -1) {
			data = value;
		}
	});
	
	return data;
}
*/

// taskId 변환
function transformTaskId(target,baseId) { // target : task_id, baseId : framework_id
	if (!target) {
		target = '-'; // task_id가 없는 경우에는 -로 치환
	}
	// 10-27 로직 변경 
	if (target[1] == "-") { //target[0] == "K" || target[0] == "D" || target[0] == "L"
		if (controlChangeNameLabel.includes(target[0])) {
			target = target.substr(2); // target 문자열이 2번째 부터 시작(ex: K-CIS-1.1 -> CIS-1.1)
		}
	} else {
		target = target.substr(4); //  4번쨰 index 부터 substr  ~  / (ex: G_K-CIS-1.2 ->  "" + "CIS-1.2" -> CIS-1.2) 
		if (controlChangeNameLabelFromFrameworkId[baseId]) { // clf_0003 또는 clf_0004 가 존재하는 경우
			target = controlChangeNameLabelFromFrameworkId[baseId].rename + target; // rename(새로 붙일 이름) + substr된 target 이름
			//  (ex: clc_0004 ->  "DevOps-" + "0004" -> DevOps-0004)
		}
	}
	return target;
}

// frameworkName 변환
function transformFrameworkName(frameworkType, frameworkId) {
	if(frameworkType == "DEFAULT") {
		return ""; // 
	}
	$.each(FRAMEWORK_NAME_OBJECT, function (key, value) {
		if (frameworkId.toLowerCase().indexOf(key) !== -1) { // frameworkId 값이 정의된 객체의 key값과 같은 경우
			data = value; // data는 해당 value 값으로 
			return false; // 반복 종료 
		}
	});
	return data;
}

// 테이블 출력
function drawComplianceScanTable(data, body) {
	var chartId= body.chartId;
	var complianceScanTable = $('#'+lvar_param_prefix+'_'+chartId).DataTable();
	var style_html = '"white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"';
	
	complianceScanTable.clear();
	
	$.each(taskLogDataList, function (idx, rowData) {

		var severityOrdering = 0;
		switch (rowData['severity']) {
			case "CRITICAL":
				severityOrdering = 0;
				break;
			case "HIGH":
				severityOrdering = 1;
				break;
			case "MEDIUM":
				severityOrdering = 2;
				break;
			case "LOW":
				severityOrdering = 3;
				break;
			default: //unknown, '-'
				severityOrdering = 4;
				break;
		}

		var btnIcon_html = '';
		btnIcon_html += '<div class="view_hide_btn_icon" data-onoff="' + rowData["uuid"] + '_task_'+chartId+'" onclick="onoffDisplay(this)"></div>';
		var result_html = '';

		result_html += '<div class="result_cnt_box">';
		result_html += '	<div class="passed_cnt_box">' + rowData["passed_subtask_count"] + '</div>';
		result_html += '	<div class="failed_cnt_box">' + rowData["failed_subtask_count"] + '</div>';
		result_html += '	<div class="error_cnt_box">' + rowData["error_subtask_count"] + '</div>';
		result_html += '	<div class="etc_cnt_box">' + rowData["etc_subtask_count"] + '</div>';  // etc count 추가
		result_html += '</div>';
		console.log("data: ", rowData);
		var row = complianceScanTable.row.add([
			btnIcon_html,
			transformDataOfNull(rowData["active_framework_name"]),
			transformDataOfNull(rowData["framework_type"]),
			//10-27 ID 값 수정 : CUSTOM 인 경우에만 framework_id 값에 따른 BASE FRAMEWORK name 추가. 아닌경우에는 ID만 추가
			transformFrameworkName(rowData["framework_type"], rowData["framework_id"])+' '+transformTaskId(rowData["task_id"],rowData["framework_id"]),
			transformDataOfNull(rowData["task_name"]),
			transformDataOfNull(rowData["description"]),
			transformDataOfNull(rowData["remediation"]),
			transformDataOfNull(rowData["severity"]),
			result_html,
			transformDataOfNull(rowData["date"]),
			rowData["uuid"],
			rowData["result"],
			severityOrdering
		]);
	});
	complianceScanTable.draw();
	
	//cf_contPreloader(chartId);
	
	lf_serviceButtonDataCallback(chartId);
}

//drop down 메뉴 관리
function onoffDisplay(thiz) {
	var dataOnoff = $(thiz).data('onoff');
	var hasClassActive = $(thiz).hasClass('view_hide_active');
	if (hasClassActive) {
		// 클릭시 숨기기
		$('.subtask_bundle[data-onoff="' + dataOnoff + '"]').css('display', 'none');
		$('.subtask_detail[data-onoff="' + dataOnoff + '"]').slideUp();
		$('.view_hide_btn_icon[data-onoff="' + dataOnoff + '"]').removeClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onoff="' + dataOnoff + '"]').removeClass('view_hide_active');
	} else {
		// 클릭시 보이기
		$('.subtask_bundle[data-onoff="' + dataOnoff + '"]').css('display', 'table-row');
		$('.subtask_detail[data-onoff="' + dataOnoff + '"]').slideDown();
		$('.view_hide_btn_icon[data-onoff="' + dataOnoff + '"]').addClass('view_hide_active');
		$('.view_hide_btn_icon_grey[data-onoff="' + dataOnoff + '"]').addClass('view_hide_active');
	}
}

// drop down 메뉴 하위 카테고리 출력
function getCategoryHtml(category) {
	var html = ''

	html += '<div class="subtask_catagory">';
	html += '	<div class="subtask_catagory_title">' + transformDataOfNull(category.title) + '</div>';

	if ((category.title).includes('Result')) {
		html += '	<div class="subtask_catagory_detail" style="font-weight: bold; color:' + COLOR_OF_RESULT[category.detail] + '">' + transformDataOfNull(category.detail) + '</div>';
	} else if ((category.title).includes('Description') || (category.title).includes('Remediation')) {
		var detail = transformDataOfNull(category.detail);
		var formattedDetail = detail.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/\\n/g, '<br/>');
		var formattedTitle = detail.replace(/\\n/g, '\n');
		html += '	<div title="' + formattedTitle + '" class="subtask_catagory_detail">' + formattedDetail + '</div>';
	} else if ((category.title).includes('Actual value')) {
		var detail = '';
		if (!category.detail) {
			detail = '-';
		} else {
			// jkcho 문자 개행 수정
			detail = transformDataOfNull(category.detail).replace(/\|\|\|/g, ' \n');
		}
		html += '<textarea readonly="" class="textarea-scrollbar scrollbar-outer">'
		html += detail
		html += '</textarea>'
	} else {
		html += '	<div class="subtask_catagory_detail">' + transformDataOfNull(category.detail) + '</div>';
	}

	html += '</div>';

	return html;
}

// drop down 메뉴 출력
function drawSubtaskListTree(chartId) {
	// 10-24 추가. taskLogDataList null 체크
	if(!taskLogDataList){
		return false;
	}
	taskLogDataList.forEach((task) => { // task 하위에 subtaskTr
		var rowSubtaskElementHtml = '';
		rowSubtaskElementHtml += '<tr id="rowSubtaskTr_'+task.uuid+'_'+chartId+'" data-onoff="'+task.uuid+'_task_'+chartId+'" data-scanner=' + task.scanner + ' class="subtask_bundle" style="display: none">'; // 룰 묶음
		rowSubtaskElementHtml += '	<td colspan="10"></td>';
		rowSubtaskElementHtml += '</tr>';

		var rowTaskId = '#rowTaskTr_' + task.uuid + '_' + chartId;
		$(rowTaskId).after(rowSubtaskElementHtml);
	});

	subtaskLogDataList.forEach((subtask) => {
		var rowSubtaskElementHtml = $('#rowSubtaskTr_' + subtask.task_detail_uuid + '_' + chartId + ' td');
		var rowSubtaskDiv = $('#rowSubtaskTr_' + subtask.task_detail_uuid + '_' + chartId + ' td div.row_subtask');

		var rowTaskPassedCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + '_' + chartId + ' .passed_cnt_box').text();
		var rowTaskFailedCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + '_' + chartId + ' .failed_cnt_box').text();
		var rowTaskEtcCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + ' .etc_cnt_box').text(); // 10-25 추가. etc count 비교를 위한 객체 생성
		var rowTaskErrorCnt = $('#rowTaskTr_' + subtask.task_detail_uuid + '_' + chartId + ' .error_cnt_box').text();

		var description = subtask.description ? subtask.description : subtask.kubescape_description;
		var remediation = subtask.remediation ? subtask.remediation : subtask.kubescape_remediation;
		var scanner = $('#rowSubtaskTr_' + subtask.task_detail_uuid + '_' + chartId).data('scanner');

		var subtaskHtml = ''; // task 하위의 subtask 요소
		subtaskHtml += '<div id="rowSubtask_' + subtask.task_detail_uuid + '_' + subtask.id + '_' + chartId + '" class="row_subtask"></div>'
		rowSubtaskElementHtml.append(subtaskHtml);

		var subTaskElemet = $('#rowSubtask_' + subtask.task_detail_uuid + '_' + subtask.id + '_' + chartId);
		var subTaskNameHtml = '';
		var rowSubTaskLength = $('#rowSubtaskTr_' + subtask.task_detail_uuid + '_' + chartId + ' .row_subtask').length;

		var subtaskTag = rowSubtaskDiv.length + 1;
		if(subtask.subtask_id != null && subtask.subtask_id != '') subtaskTag = subtask.subtask_id;

		// result가 error 밖에 없을 때, 에러 관련 row 한번만 출력(10-25 etc 조건 추가)
		if (rowTaskPassedCnt == 0 && rowTaskFailedCnt == 0 && rowTaskEtcCnt == 0 && rowTaskErrorCnt > 0) {
			if (rowSubTaskLength > 1) return false;
			subTaskNameHtml += '<div class="subtask_name">';
			subTaskNameHtml += '	<div class="subtask_catagory_detail">' + transformDataOfNull(subtask.actual_value) + '</div>';
			subTaskNameHtml += '</div>';
		} else {
			subTaskNameHtml += '<div class="subtask_name">';
			subTaskNameHtml += '	<div class="subtask_catagory_title">';
			subTaskNameHtml += '		<div class="view_hide_btn_icon_grey" data-onoff="' + subtask.task_detail_uuid + '_' + subtask.id + '_subtask_'+chartId+'" onclick="onoffDisplay(this)"></div>';
			subTaskNameHtml += '	</div>';
			subTaskNameHtml += '	<div class="subtask_catagory_detail">' + subtaskTag + '. ' + transformDataOfNull(subtask.subtask_name) + '</div>' + '<div style="margin-left: 10px; font-weight: bold; color:' + COLOR_OF_RESULT[subtask.scan_result] + '">[' + transformDataOfNull(subtask.scan_result) + ']</div>';
			subTaskNameHtml += '</div>';
		}
		subTaskElemet.append(subTaskNameHtml);

		// 카테고리 정보를 객체 배열로 정의
		var categories = [
			{ title: '· Result:', detail: subtask.scan_result },
			{ title: '· Description: ', detail: description },
			{ title: '· Remediation:', detail: remediation },
			{ title: '· Actual value:', detail: subtask.actual_value, scanner: scanner },
		];

		// 상세 정보 HTML 구성
		var subtaskDetailHtml = '';
		subtaskDetailHtml += '<div class="subtask_detail" data-onoff="' + subtask.task_detail_uuid + '_' + subtask.id + '_subtask_'+chartId+'" style="display: none">';
		subtaskDetailHtml += categories.map(getCategoryHtml).join('');
		subtaskDetailHtml += '</div>';

		subTaskElemet.append(subtaskDetailHtml);
	});

	// 하위 요소가 없다면 드롭다운 버튼 삭제
	taskLogDataList.forEach((task) => {
		var subtaskRow = $('#rowSubtaskTr_' + task.uuid + '_' + chartId + ' td');
		if (subtaskRow.is(':empty')) {
			$('[data-onoff="' + task.uuid + '_task_'+chartId+'"]').remove();
			$('#rowSubtaskTr_' + task.uuid+ '_' + chartId).remove();
		}
	});
	mscrollbarReset();
}

//검색 (검색 키워드 할당, selectBox value 저장) 
function executeSearch(chartId) {
	$('#searchValue_'+chartId).val($('#searchKeyword_'+chartId).val());
	
	selectFramework_object[chartId] = $('#frameworkSelect_'+chartId).val();
	page_object[chartId].lvar_event_totalCnt = 0;
	lf_serviceCall700019(chartId);
	lf_serviceCall700017(0, chartId);
}

//프레임워크 리스트 생성
function selectFrameworkList(chartId,param) {
	var clusterUuid = param['clusterUuid']?param['clusterUuid']:$('.popup_sel.cluster_list').val();
	//var clusterUuid = $('.popup_sel.cluster_list').val();
	var term = $('#' + chartId).parents().find(".popup_sel.small").val();
	var body = {
		'clusterUuid': clusterUuid,
		'chartId': chartId,
		'term': term,
		'is_user_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 유저 활성화 프레임 워크만 구하기
		'is_scan_enable' : 'T',	// 2023-09-08 이성호 수정> 스캔 가능한 프레임 워크만 구하기
	};
	cf_requestServer(_TR_DASHBOARD_FRAMEWORK_LIST_BY_CLUSTER, body, lf_serviceCall600603CallBack, false);
}
function lf_serviceCall600603CallBack(data, body) {
	var chartId = body.chartId;
	var selectBoxDiv = $('#frameworkSelectBox_'+chartId);
	var selectElement = $('<select id="frameworkSelect_'+chartId+'" class="popup_sel" onchange="executeSearch(\''+chartId+'\')">');
	selectBoxDiv.append(selectElement);
	var frameworkList = filterFirstOccurrenceByProperty(data);
	if(frameworkList.length == 0) { // 조회된 프레임워크 리스트가 없는경우
		$("#frameworkSelect_"+chartId).append(`<option>-</option>`);
	}
	frameworkList.forEach(function(data){
		$("#frameworkSelect_"+chartId).append(`<option value=${data.id}>${data.name}</option>`);
	});
	
	// 이전에 지겅된 framework id가 존재할 경우 유지
	if(selectFramework_object[chartId]) {
		$("#frameworkSelect_"+chartId).val(selectFramework_object[chartId]);
	}
	
	$("#frameworkSelect_"+chartId).niceSelect();
}
//프로퍼티의 중복을 제거하면서 해당 프로퍼티 값의 첫 번째 등장 객체만 남기는 로직
function filterFirstOccurrenceByProperty(data) {
	// 클러스터 규정 준수 스캔 정책 정보  
	var frameworkList = [];
	var frameworkIds = new Set();

	for (const obj of data.body.frameworkList) {
		if (!frameworkIds.has(obj.id)) {
			frameworkIds.add(obj.id);
			frameworkList.push(obj);
		}
	}
	return frameworkList;
}
