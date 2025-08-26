const elId = "elMalwareTrend";
const chartId = "malwareTrendList";

$(function () {
	serviceCall600321();
});
function serviceCall600321(){	
	var body = {
		'term' : 'DAY',
		'chartId': chartId,
		'use_cache': true
	};
	
	//cf_contPreloader(chartId);
	//$('#'+chartId).data('chartConf')['term'] = 'DAY';
	
	cf_requestServer(_TR_DASHBOARD_MALWARE_EVENT_TREND,body,lf_serviceCall600321CallBack);
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
		
		initLineChart(chartData, chartId, body.term);
	}
	else{
		//lf_createNotDateView($chartId);
	}
}

function initLineChart(chartData, term){
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
			backgroundColor : 'rgba(120,115,108,0.8)',
			transitionDuration : 0,
			textStyle : {
				color : '#ffffff',
				fontWeight : 400,
				fontSize : 11,
			},
			position : 'top',
			renderMode : 'html',
			formatter : '<span style="color: #fdfa01">{c}</span>',
		},
		grid : {
			height : '330',
			top : '40',
			bottom : '0',
			left : '60',
		},
		xAxis : {
			type : 'category',
			name : '(시간)',
			nameTextStyle : {
				padding : [ 25, 0, 0, 0 ],
			},
			axisLine : {
				lineStyle : {
					color : '#adb0bc'
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
				lineStyle : {
					color : '#adb0bc'
				}
			},
		},
		series : [ {
			data : visualChartData,
			type : 'line',
			showSymbol : true,
			markLine : {
				silent : true,
				data : [ {
					yAxis : average
				} ],
				symbol : 'none',
				label : {
					color : '#5978ed',
				},
				lineStyle : {
					color : '#5978ed',
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
						color : '#000000',
					},
				} ],

			},
			lineStyle : {
				width : 2,
			},
		} ],
		visualMap : [ {
			show : false,
			showAllSymbol : true,
			type : 'continuous',
			seriesIndex : 0,
			min : minValue,
			max : maxValue,
			borderWidth : 4,
			inRange : {
				color : [ '#43c7d3', '#ff9f24' ],
				symbolSize : [ 10, 10 ],
			},
		} ],
	};
	chart.setOption(option);
	window.addEventListener('resize', function() {
		chart.resize();
	});
	
	chart.on('click', 'series', function (dot) {
		/*
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
		
		cf_openDialog('DASHBOARD_CHART_MALWARE_EVENT', null, param);
		*/
	});
	
	
	$('#'+elId).fadeIn();
}
