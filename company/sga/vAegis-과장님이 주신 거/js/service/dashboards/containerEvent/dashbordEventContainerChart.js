function createDonutChartForContainerEvent(id, title, colorPalette, data) {
	// 차트 가져오기
	var $chartBoard = $('#' + id);
	// 기존 차트 삭제.
	$chartBoard.empty();

	// 차트 디자인 css 적용
	$chartBoard.addClass('UI_01_03');
	$chartBoard.addClass('donut-chart');
	$chartBoard.addClass('vulnerabilities');

	// 차트 박스
	var $chartBoxDIV = $('<div id="' + id + '-chart-pie" class="chart_box"></div>');

	// 차트 데이터
	var $chartDataDIV = $('<div class="chart_data"></div>');
	var $chartDataDL = $('<dl></dl>');

	var displayChartToolTips = '';
	var chartDrawData = [];
	
	
	$.each(data, function(index, item) {
		var indexColorValue = '';	
		switch(index){
			case 0:
				indexColorValue = 'critical';
				break;
			case 1:
				indexColorValue = 'hight';
				break;
			case 2:
				indexColorValue = 'medium';
				break;
			case 3:
				indexColorValue = 'low';
				break;
			case 4:
				indexColorValue = 'ignore';
				break;
		}		
		
		// 차트
		chartDrawData.push({
			value:item.cnt,
			name: 'sh'+index,
			class: id+'_tolltip_pop0'+(index+1)
		});
		
		
		
		// 차트 데이터
		$chartDataDL.append('<dd class="' + indexColorValue + ' value"><span>' + item.name + '</span></dd>');
		// 차트 툴팁
		displayChartToolTips +=
			'<div id="'+id+'_tolltip_pop0' + (index + 1) + '" class="tolltip">'
			+ '<dl>'
			+ '<dt>' + item.name + '</dt>'
			+ '<dd class="flex">'
			+ '<div>'
			//+ '<p class="bc_critical">'+item.cnt+'</p>'
			+ '<p>'+item.cnt+'</p>'
			+ '</div>'
			+ '<div>'
			+ '<p><label>TYPE</label>' + ccf_displayRunAndBuildTimeIcon(item.type) + '</p>'
			+ '<p><label>SEVERITY</label>' + ccf_displaySeverityBCSetting(item.severity) + '</p>'
			//+ '<p><label>DESCRIPTION</label>' + item.description + '</p>'
			+ '</div>'
			+ '</dd></dl></div>';
	});




	// 차트
	$chartBoard.append($chartBoxDIV);
	var dom = document.getElementById(id + '-chart-pie');
	var myChart = echarts.init(dom, 'dark', {
		renderer: 'svg',
		useDirtyRect: false
	});
	var app = {};

	var option;

	option = {
		color: colorPalette,
		backgroundColor: "transparent",
		series: [
			{
				name: 'Radius Mode',
				type: 'pie',
				radius: [15, 140],
				center: ['50%', '50%'],
				roseType: 'radius',
				itemStyle: {
					borderRadius: 5,
					borderColor: '#242636',
					borderWidth: 5
				},
				label: {
					show: false
				},
				emphasis: {
					label: {
						show: false
					}
				},
				data: chartDrawData
			},
		],
		tooltip: {
			show: true,
			trigger: 'item',
			formatter: function(params,ticket,callback) {
				openTooltip(params.data.class);
			}
		}
	};
	
	// 툴팁
	function openTooltip(classId){
		$(".tolltip").removeClass('on');
		$("#" + classId).addClass('on');
	}
	$('#'+id+'-chart-pie').mouseout(function() {
		$(".tolltip").removeClass('on');
	});

	if (option && typeof option === 'object') {
		myChart.setOption(option);
	}

	window.addEventListener('resize', myChart.resize);


	// 차트 데이터> 우측 데이터
	$chartDataDIV.append($chartDataDL);
	$chartBoard.append($chartDataDIV);

	// 차트 툴팁
	$chartBoard.append(displayChartToolTips);
}