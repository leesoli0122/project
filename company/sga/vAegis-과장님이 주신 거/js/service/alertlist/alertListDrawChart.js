$(function() {
	clusterRealtimeChart = echarts.init(document.getElementById('clusterRealtimeChart'), 'dark', {
		renderer: 'canvas',
		useDirtyRect: false
	});
	hostRealtimeChart = echarts.init(document.getElementById('hostRealtimeChart'), 'dark', {
		renderer: 'canvas',
		useDirtyRect: false
	});
});

// 클러스터
var clusterRealtimeChart;

var clusterRealtimeOption = {
	animation: false, // 효과 끄기
	backgroundColor: 'transparent',
	tooltip: {
		trigger: 'axis',
		formatter: function(param) {
			let returnResult = '';
			$.each(param, function(index, item) {
				returnResult += item.seriesName + ": " + item.value + "</br>";
			});
			return returnResult;
		},
		backgroundColor: '#121212',
		borderColor: '#ffffff65',
		borderWidth: '0.8',
		textStyle: {
			color: '#fff'
		}
	},
	grid: {
		left: '2%',
		right: '2%',
		bottom: '3%',
		top: '5%',
		containLabel: true
	},
	xAxis: [
		{
			type: 'category',
			boundaryGap: false,
			// new Array 는 추후 시간 데이터로 변경 예정
			data: new Array(chartSize),
			show: false
		},
	],
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: '이미지 시큐리티',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.6,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(119, 50, 141, 1)'
					},
					{
						offset: 1,
						color: 'rgba(119, 50, 141, 0)'
					}
				])
			},
			emphasis: {
				focus: 'series'
			},
			color: '#7732F1',
			data: imageSecurityChartData
		},
		{
			name: '컨테이너 워크로드 실행 제어',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.2,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(1, 219, 50, 1)'
					},
					{
						offset: 1,
						color: 'rgba(1, 219, 50, 0)'
					}
				])
			},
			color: "#01DBCD",
			emphasis: {
				focus: 'series'
			},
			data: containerWorkloadChartData
		},
		{
			name: '컨테이너 이미지 실행 제어',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.3,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(95, 153, 255, 1)'
					},
					{
						offset: 1,
						color: 'rgba(95, 153, 255, 0)'
					}
				])
			},
			color: "#5E99FF",
			emphasis: {
				focus: 'series'
			},
			data: imageRunningControlChartData
		},
		{
			name: '컨테이너 이벤트',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.3,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(95, 103, 156, 1)'
					},
					{
						offset: 1,
						color: 'rgba(95, 103, 156, 0)'
					}
				])
			},
			color: "#5F679C",
			emphasis: {
				focus: 'series'
			},
			data: containerSecurityChartData
		}
	]
};


function clusterRealtimeChartDrow() {
	if (clusterRealtimeOption && typeof clusterRealtimeOption === 'object') {
		clusterRealtimeChart.setOption(clusterRealtimeOption);
	}
	window.addEventListener('resize', clusterRealtimeChart.resize);
}

// 호스트
var hostRealtimeChart;
var hostRealtimeOption = {
	animation: false, // 효과 끄기
	backgroundColor: 'transparent',
	tooltip: {
		trigger: 'axis',
		formatter: function(param) {
			let returnResult = '';
			$.each(param, function(index, item) {
				returnResult += item.seriesName + ": " + item.value + "</br>";
			});
			return returnResult;
		},
		backgroundColor: '#121212',
		borderColor: '#ffffff65',
		borderWidth: '0.8',
		textStyle: {
			color: '#fff'
		}
	},
	grid: {
		left: '2%',
		right: '2%',
		bottom: '3%',
		top: '5%',
		containLabel: true
	},
	xAxis: [
		{
			type: 'category',
			boundaryGap: false,
			// new Array 는 추후 시간 데이터로 변경 예정
			data: new Array(chartSize),
			show: false
		},
	],
	yAxis: {
		type: 'value',
	},
	series: [
		{
			name: '방화벽',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.6,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(63, 174, 184, 1)'
					},
					{
						offset: 1,
						color: 'rgba(63, 174, 184, 0)'
					}
				])
			},
			emphasis: {
				focus: 'series'
			},
			color: '#3faeb8',
			data: firewallChartData
		},
		{
			name: '침입방지시스템',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.4,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(10, 128, 218, 1)'
					},
					{
						offset: 1,
						color: 'rgba(10, 128, 218, 0)'
					}
				])
			},
			color: "#0A80DA",
			emphasis: {
				focus: 'series'
			},
			data: ipsChartData
		},
		{
			name: '안티 멀웨어',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.3,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(41, 219, 107, 1)'
					},
					{
						offset: 1,
						color: 'rgba(41, 219, 107, 0)'
					}
				])
			},
			color: "#2ADB6B",
			emphasis: {
				focus: 'series'
			},
			data: malwareChartData
		},
		{
			name: '파일 무결성',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.3,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(160, 160, 160, 1)'
					},
					{
						offset: 1,
						color: 'rgba(160, 160, 160, 0)'
					}
				])
			},
			color: "#A0A0A0",
			emphasis: {
				focus: 'series'
			},
			data: fileChartData
		},
		{
			name: '실행 파일 통제',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.5,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(87, 70, 205, 1)'
					},
					{
						offset: 1,
						color: 'rgba(87, 70, 205, 0)'
					}
				])
			},
			color: "#5446CD",
			emphasis: {
				focus: 'series'
			},
			data: appctlChartData
		},
		{
			name: '서비스제어',
			type: 'line',
			smooth: true,
			//stack: 'Total',
			areaStyle: {
				opacity: 0.3,
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: 'rgba(79, 72, 204, 1)'
					},
					{
						offset: 1,
						color: 'rgba(79, 72, 204, 0)'
					}
				])
			},
			color: "#4F48CC",
			emphasis: {
				focus: 'series'
			},
			data: pamaclChartData
		}
	]
};

function hostRealtimeChartDrow() {
	if (hostRealtimeOption && typeof hostRealtimeOption === 'object') {
		hostRealtimeChart.setOption(hostRealtimeOption);
	}
	window.addEventListener('resize', hostRealtimeChart.resize);
}