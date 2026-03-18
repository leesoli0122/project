
var lvar_ChartData = [];
var lvar_chartInterValObj = {};

var lvar_dashboardTabIdPrefix = 'dashboardTabMgmt_';
var lvar_dashboardChartPrefix = 'cloudvm_';

var _ACTION_LOCALE = {
	'allowed': '허용',
	'blocked': '차단',
}



// 추가. 전달받은 레지스트리 Uuid 값 저장
var dashboardRegistryUuid;
var dashboardClusterUuid;

$(function () {
	var dashboardData = JSON.parse($('#dashboardData', opener.document).attr(window.name));
	var title = dashboardData['templateName'];
	
	lvar_ChartData = dashboardData['chart'];
	
	// 추가. 전달받은 레지스트리 Uuid 값 저장
	dashboardRegistryUuid =  dashboardData['registryUuid'];
	dashboardClusterUuid = dashboardData['clusterUuid'];
	$('#dashboardViewTitle').html(title +' <span>(<em>'+(new Date()).format('yyyy-MM-dd HH:mm:ss')+'</em>)</span>');
	
	lf_loadDashboard(lvar_ChartData);
});

function lf_dashboardConfiguration(thiz){
	var chartDIV = $(thiz).parent().parent().parent().parent().parent().parent().parent();
	var chart =chartDIV.find('.chart_box');
	var chartConf = chart.data('chartConf');
	var chartId = chart.attr('id');
	var chartType = chart.data('chartType');
	
	var callbackFn = function(){
		var term = $('#chartConfTerm').val();
		
		var paramChartConf = {
			'term': term,
		}
		
		if(chartConf['interval']){
			paramChartConf['interval'] = $('#chartConfInterval').val();
		}
		
		chart.data('chartConf', paramChartConf);
		
		chartDIV.find('.dashboard_cont_top > .cont_btn_box > .sel_box > select').val(term);
		chartDIV.find('.dashboard_cont_top > .cont_btn_box > .sel_box > select').niceSelect('update');
		
		lf_refreshChart(chartId);
		
		var chartData = lvar_ChartData;
		for(var i = 0; i < chartData.length; i++){
			if(chartData[i]['chartId'] == chartId){
				chartData[i]['chartConf'] = paramChartConf;
			}
		}
		
		return true;
		
	}
	
	cf_openDialog('DASHBOARD_CHART_CONFIGURATION', callbackFn, chartConf);
	
}

function lf_DashboardEventInit(){
	// 그래그 앤 그롭
	if ($('.dashboard_cont').length) {
		$(".dashboard_cont").sortable({
			placeholder : "ui-state-highlight",
			start : function(event, ui) {
				var $width = ui.item.innerWidth();
				$(this).find('.ui-state-highlight').css({
					width : $width
				});
			}
		}).disableSelection();
	}
	// 차트 day,week 셀릭트 박스 
	$('.sel_box select').niceSelect();
	// 차트 컨텍스트 메뉴
	$('.cont_btn_link').on('click', function(e) {
		e.preventDefault();
		$(this).addClass('on');
		$(this).parent().find('.cont_btn_list').addClass('on');
	});
	$('html').click(function(e) {
		/*
		e.preventDefault();
		if (!$('.cont_btn_link').has(e.target).length) {
			$('.cont_btn_list').removeClass('on');
			$('.cont_btn_link').removeClass('on');
		}
		*/
	});
}

function lf_getActiveTabIdx(){
	return $('#dashboardTabMgmt > div.open').attr('class').replaceAll('tab_cont', '').replaceAll('open', '').replaceAll('dashboardTabMgmt_', '').trim();
}

function lf_loadDashboard(){
	
	
	if(lvar_ChartData.length > 0){
		
		
		// 선택된 탭만 차트 생성
		var chart = lvar_ChartData;
		if(chart.length > 0){
			chart.sort(function(a, b) { // 오름차순
				var aSort = parseInt(['order']);
				var bSort = parseInt(b['order']);
				return aSort - bSort;
			});
			
			for(var j = 0; j < chart.length; j++){
				var chartData = chart[j];
				var chartType = chartData['chartType'];
				var chartConfParam = chartData['chartConf'];
				//var chartId = lf_createChartCard(chartType, chartConfParam);
				
				var chartId = chartData['chartId'];
				lf_createChartCard(chartType, chartConfParam, chartId);
				chartData['chartId'] = chartId;
				
				lf_makeChart(chartType, chartId);
			}
		}
		
	}
	
}

function setChartAutoReload(chartFunc, chartId, param, interval){
	clearInterval(lvar_chartInterValObj[chartId]);
	if(interval >= 0){
		//if(interval < 1000) interval = interval * 1000;
		interval = interval * 1000;
		lvar_chartInterValObj[chartId] = setInterval(function() {
			chartFunc(chartId, param);
			sendStatusToChildWindow(chartId); // 0808 추가. '컨테이너 이미지 스캔 현황' 자식 팝업창에 변경 이벤트 전달
		}, interval);
	}
}


function lf_makeChart(chartType, chartId){
	var chartDIV = $('#'+chartId);
	
	var chartConfData = lf_getChartELConf(chartType);
	var chartConf = chartDIV.data('chartConf');
	var serverParam = {};
	
	//이쪽 생각해야함
	if(chartConf['term']){
		serverParam['term'] = chartConf['term'];
	}
	
	if(dashboardRegistryUuid){ // 추가. registryUuid 가 있는 경우 params에 추가
		serverParam['registryUuid'] = dashboardRegistryUuid; 
	} 
	if(dashboardClusterUuid){ // 추가. clusterUuid 가 있는 경우 params에 추가
		serverParam['clusterUuid'] = dashboardClusterUuid; 
	}
	chartConfData.func(chartId, serverParam); // 여기서 chartConfData에 정의되어있는 함수 호출
	setChartAutoReload(chartConfData.func, chartId, serverParam, chartConf['interval']);
	
}

function lf_chartTermSelectEvent(thiz){
	var term = $(thiz).val();
	var chartId = $(thiz).parent().parent().parent().parent().find('.chart_box').attr('id');
	
	var chartData = lvar_ChartData;
	for(var i = 0; i < chartData.length; i++){
		if(chartData[i]['chartId'] == chartId){
			chartData[i]['chartConf']['term'] = term;
		}
	}
	
	lf_refreshChart(chartId);
	
	return true;
	
}

/**
 * 
 * @param tabId : templateId (null 활성화된 tab)
 * @param width
 * @param height
 * @param chartType: table, view, any Chart (예외 처리) 
 * @returns
 */
function lf_createChartCard(chartType, paramChartConf){
	var chartConf = {};
	if(paramChartConf) chartConf = paramChartConf;
	else chartConf = lvar_defaultChartConf;
	
	var chartElConf = lf_getChartELConf(chartType);
	
	var tabContEl = $('#dashboardViewCont');
	var contLI = $('<li class="w_'+chartElConf['width']+'"></li>');
	
	// 차트 제목 부수 공통
	var contCommonDIV = $('<div class="dashboard_cont_top"></div>'); 
	contCommonDIV.append($('<h4 class="cont_title">'+chartElConf['title']+'</h4>'));
	var contBtnBox = $('<div class="cont_btn_box"></div>');
	if(chartElConf['params'].indexOf('term') >= 0){
		if(chartConf['term'] == 'DAY') {
			contBtnBox.append(
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small">' + 
							'<option selected="selected" value="DAY">Day</option>' + 
							'<option value="WEEK">Weekly</option>' +
						'</select>')
			);
		} else {
			contBtnBox.append(
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small">' + 
							'<option value="DAY">Day</option>' + 
							'<option selected="selected" value="WEEK">Weekly</option>' +
						'</select>')
			);
		}
	}
	contBtnBox.append(
		$('<div class="cont_btn fl"></div>')
		.append($('<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>'))
		.append(
			$('<div class="cont_btn_list"></div>')
			.append(
				$('<ul></ul>')
				.append($('<li><a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a></li>'))
				.append($('<li><a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a></li>'))
				.append($('<li><a onclick="javascript: lf_removeChartEvent(this);">Delete</a></li>'))
			)
		)
	);
	contCommonDIV.append(contBtnBox);
	contLI.append(contCommonDIV);
	
	var randomInt = Math.floor((Math.random() * 10000) + 1);
	var chartId = lvar_dashboardChartPrefix+chartElConf['chart']+'_'+randomInt;
	
	contLI.append($('<div class="dashboard_'+chartElConf['chart']+'_box"><div id="'+chartId+'" class="chart_box dashboard_'+chartElConf['chart']+'"></div></div>'))	
	
	if(chartConf) contLI.find('#'+chartId).data('chartConf', chartConf);
	else contLI.find('#'+chartId).data('chartConf', lvar_defaultChartConf);
	
	contLI.find('#'+chartId).data('chartType', chartType);
	
	tabContEl.append(contLI);
	
	return chartId;
}

function lf_createChartCard(chartType, paramChartConf, chartId){
	var chartConf = {};
	if(paramChartConf) chartConf = paramChartConf;
	else chartConf = lvar_defaultChartConf;
	
	var chartElConf = lf_getChartELConf(chartType);
	
	var tabContEl = $('#dashboardViewCont');
	var contLI = $('<li class="w_'+chartElConf['width']+'"></li>');
	
	// 차트 제목 부수 공통
	var contCommonDIV = $('<div class="dashboard_cont_top"></div>'); 
	contCommonDIV.append($('<h4 class="cont_title">'+chartElConf['title']+'</h4>'));
	var contBtnBox = $('<div class="cont_btn_box"></div>');
	
	if(chartElConf['NChart']){ // 2023-09-23 이성호 추가 > 1카드 N차트 > 추후 더블 이외의 N차트로 확장 가능하도록 설계
		if(chartElConf['params'].indexOf('term') >= 0){
			if(chartConf['term'] == 'DAY') {
				contBtnBox.append(//chartElConf['chart']
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEventNChart(this,\''+chartId+'\');" class="popup_sel small">' + 
							'<option selected="selected" value="DAY">Day</option>' + 
							'<option value="WEEK">Weekly</option>' +
						'</select>')
				);
			

		} else { // default = DAY, else = WEEK 추가
				contBtnBox.append(
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEventNChart(this,\''+chartElConf['chart']+'\');" class="popup_sel small">' + 
							'<option value="DAY">Day</option>' + 
							'<option selected="selected" value="WEEK">Weekly</option>' +
						'</select>')
			);			
		}
	}
	contBtnBox.append(
		$('<div class="cont_btn fl"></div>')
		.append($('<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>'))
		.append(
			$('<div class="cont_btn_list"></div>')
			.append(
				$('<ul></ul>')
				.append($('<li><a onclick="javascript: lf_dashboardConfigurationNChart(this,\''+chartId+'\');">Configuration</a></li>'))
				.append($('<li><a onclick="javascript: lf_refreshChartEventNChart(\''+chartId+'\');">Refresh</a></li>'))
				.append($('<li><a onclick="javascript: lf_removeChartEventNChart(\''+chartId+'\');">Delete</a></li>'))
			)
		)
	);
	contCommonDIV.append(contBtnBox);
	contLI.append(contCommonDIV);
		
		
		$.each(chartElConf['chart'],function(index,item){
			//randomInt = Math.floor((Math.random() * 10000) + 1);
			//chartId[index] = lvar_dashboardChartPrefix+chartElConf['chart'][index]+'_'+randomInt;
			contLI.append($('<div class="dashboard_'+chartElConf['chart'][index]+'_box '+chartElConf['applyCSS']+'"><div id="'+chartId[index]+'" class="chart_box dashboard_'+chartElConf['chart'][index]+'"></div></div>'))	
	
			if(chartConf) contLI.find('#'+chartId[index]).data('chartConf', chartConf);
			else contLI.find('#'+chartId[index]).data('chartConf', lvar_defaultChartConf);
	
			contLI.find('#'+chartId[index]).data('chartType', chartType);	
			tabContEl.append(contLI);
		});		
	}else{
		if(chartElConf['params'].indexOf('term') >= 0){
		if(chartConf['term'] == 'DAY') {
			contBtnBox.append(
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small">' + 
							'<option selected="selected" value="DAY">Day</option>' + 
							'<option value="WEEK">Weekly</option>' +
						'</select>')
			);
		} else {
			contBtnBox.append(
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small">' + 
							'<option value="DAY">Day</option>' + 
							'<option selected="selected" value="WEEK">Weekly</option>' +
						'</select>')
			);
		}
	}
	contBtnBox.append(
		$('<div class="cont_btn fl"></div>')
		.append($('<a href="#" class="cont_btn_link"><span class="linktext">메뉴</span></a>'))
		.append(
			$('<div class="cont_btn_list"></div>')
			.append(
				$('<ul></ul>')
				.append($('<li><a onclick="javascript: lf_dashboardConfiguration(this);">Configuration</a></li>'))
				.append($('<li><a onclick="javascript: lf_refreshChartEvent(this);">Refresh</a></li>'))
				.append($('<li><a onclick="javascript: lf_removeChartEvent(this);">Delete</a></li>'))
			)
		)
	);
	contCommonDIV.append(contBtnBox);
	contLI.append(contCommonDIV);
	
	var randomInt = Math.floor((Math.random() * 10000) + 1);
	//var chartId = lvar_dashboardChartPrefix+chartElConf['chart']+'_'+randomInt;
	
	contLI.append($('<div class="dashboard_'+chartElConf['chart']+'_box"><div id="'+chartId+'" class="chart_box dashboard_'+chartElConf['chart']+'"></div></div>'))	
	
	if(chartConf) contLI.find('#'+chartId).data('chartConf', chartConf);
	else contLI.find('#'+chartId).data('chartConf', lvar_defaultChartConf);
	
	contLI.find('#'+chartId).data('chartType', chartType);
	
	tabContEl.append(contLI);
	}
	

	
	return chartId;
}

function lf_removeChartEvent(thiz){
	
	var chartId = $(thiz).parent().parent().parent().parent().parent().parent().parent().find('.chart_box').attr('id')
	lf_removeChart(chartId, true);
}

function lf_removeChart(chartId, dataFlag){
	
	clearInterval(lvar_chartInterValObj[chartId]);
	
	delete lvar_chartInterValObj[chartId];
	
	$('#'+chartId).parent().parent().remove();
	
	if(dataFlag){
		var chartData = lvar_ChartData;
		for(var i = 0; i < chartData.length; i++){
			if(chartData[i]['chartId'] == chartId){
				lvar_ChartData.splice(i, 1);
			}
		}
	}
	$('.mscrollbar').mCustomScrollbar('update');
}

function lf_refreshChartEvent(thiz){
	var chartId = $(thiz).parent().parent().parent().parent().parent().parent().parent().find('.chart_box').attr('id');
	lf_refreshChart(chartId);
}

function lf_refreshChart(chartId){
	var chart = $('#'+chartId);
	var chartConf = chart.data('chartConf');
	var chartId = chart.attr('id');
	var chartType = chart.data('chartType');
	
	lf_makeChart(chartType, chartId);
}

var lvar_colorList = [
	'rgb(255, 99, 132)', // red
	"rgb(255, 159, 64)", //orange
	'rgb(54, 162, 235)', //blue,
	'rgb(153, 102, 255)', //purple
	'rgb(75, 192, 192)', //green,
	'rgb(255, 099, 071)', //tomato
	'rgb(255, 205, 86)', //yellow
	'rgb(000, 255, 255)', //aqua
	'rgb(128, 000, 000)', //navy
	'rgb(238, 130, 238)', //violet
	'rgb(075, 000, 130)' //indigo
]

function lf_getFormatDate(date, type) {
	var year = date.getFullYear(); //yyyy
	var month = (1 + date.getMonth()); //M
	month = month >= 10 ? month : '0' + month; //month 두자리로 저장
	var day = date.getDate(); //d
	day = day >= 10 ? day : '0' + day; //day 두자리로 저장
	
	var hour = date.getHours();
	hour = hour >= 10 ? hour : '0' + hour;
	
	if(type == 'WEEK') return year + '-' + month + '-' + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
	else return hour + '시'; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

function lf_firewallInfoTableClickFunc(){
	var rowData = $(this).data('rowData');
	
	$('#dashboardFirewallInfoDialog').remove();
	
	var $modalDIV = $('<div id="dashboardFirewallInfoDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
	$('body').prepend($modalDIV);
	
	
	$modalDIV.load('./page/dashboard/firewall/Info_firewall_dialog.html', function(){
		$modalDIV.modal();
		lf_dashboardFirewallInitDialogInit(rowData);
	});
	
}

function lf_ipsInfoTableClickFunc(){
	var rowData = $(this).data('rowData');
	
	$('#dashboardIPSInfoDialog').remove();
	
	var $modalDIV = $('<div id="dashboardIPSInfoDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
	$('body').prepend($modalDIV);
	
	
	$modalDIV.load('./page/dashboard/ips/Info_ips_dialog.html', function(){
		$modalDIV.modal();
		lf_dashboardIPSInitDialogInit(rowData);
	});
	
}

function lf_avInfoTableClickFunc(){
	var rowData = $(this).data('rowData');
	
	$('#dashboardAVInfoDialog').remove();
	
	var $modalDIV = $('<div id="dashboardAVInfoDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
	$('body').prepend($modalDIV);
	
	
	$modalDIV.load('./page/dashboard/av/Info_av_dialog.html', function(){
		$modalDIV.modal();
		lf_dashboardAVInitDialogInit(rowData);
	});
	
}

function lf_malwareInfoTableClickFunc(){
	var rowData = $(this).data('rowData');
	
	$('#dashboardMalwareInfoDialog').remove();
	
	var $modalDIV = $('<div id="dashboardMalwareInfoDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
	$('body').prepend($modalDIV);
	
	
	$modalDIV.load('./page/dashboard/av/Info_malware_dialog.html', function(){
		$modalDIV.modal();
		lf_dashboardMalwareInitDialogInit(rowData);
	});
	
}

function lf_fileIntInfoTableClickFunc(){
	var rowData = $(this).data('rowData');
	
	$('#dashboardFileIntInfoDialog').remove();
	
	var $modalDIV = $('<div id="dashboardFileIntFileIntInfoDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
	$('body').prepend($modalDIV);
	
	
	$modalDIV.load('./page/dashboard/fileint/Info_fileint_dialog.html', function(){
		$modalDIV.modal();
		lf_dashboardFileIntInitDialogInit(rowData);
	});
	
}

function lf_pamAclInfoTableClickFunc(){
	var rowData = $(this).data('rowData');
	
	$('#dashboardPamAclInfoDialog').remove();
	
	var $modalDIV = $('<div id="dashboardPamAclInfoDialog" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
	$('body').prepend($modalDIV);
	
	
	$modalDIV.load('./page/dashboard/pamacl/Info_pamacl_dialog.html', function(){
		$modalDIV.modal();
		lf_dashboardPamAclInitDialogInit(rowData);
	});
	
}

