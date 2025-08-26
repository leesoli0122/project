
var lvar_dashboardId = '';
var lvar_dashboardData = [];
var lvar_dashboardType = 'USER';
var lvar_dashboardName = '';
var lvar_chartInterValObj = {};
var lvar_chartConfInterval;

var lvar_dashboardTabIdPrefix = 'dashboardTabMgmt_';
var lvar_dashboardChartPrefix = 'cloudvm_';

var _ACTION_LOCALE = {
	'allowed': '허용',
	'blocked': '차단',
}

// 레지스트리 입력 폼 추가 
var registryTag = '';
var clusterTag = '';

$(function () {
	lf_serviceCall600074(); // 레지스트리 목록 호출 로직 추가
	lf_serviceCall800060(); // 클러스터 목록 호출 로직 추가
	
	lf_tabInit();
	lf_serviceCall600101();
	
});

function lf_openDashboardFullWindow(){
	var newWindowName = lvar_dashboardData[lf_getActiveTabIdx()-1]['templateName'] + '_' + lvar_dashboardData[lf_getActiveTabIdx()-1]['order'];
	var newWindow = window.open('./dashboardView.do',newWindowName,'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
	
	 // 추가. 팝업창 오픈 시 레지스트리 uuid 값 전달 
	var registryUuid =  $('#dashboardTabMgmt > div.open').find(".registryList option:selected").val();
	if(registryUuid){
		lvar_dashboardData[lf_getActiveTabIdx()-1]['registryUuid'] = registryUuid;
	}
		 // 추가. 팝업창 오픈 시 레지스트리 uuid 값 전달 
	var clusterUuid =  $('#dashboardTabMgmt > div.open').find(".cluster_list option:selected").val();
	if(clusterUuid){
		lvar_dashboardData[lf_getActiveTabIdx()-1]['clusterUuid'] = clusterUuid;
	}
	
	$('#dashboardData').attr(newWindowName, JSON.stringify(lvar_dashboardData[lf_getActiveTabIdx()-1]));
}

function lf_dashboardAllConfiguration(thiz){
	var interval = 60;
	if(lvar_chartConfInterval) {
		interval = lvar_chartConfInterval;
	}
	var chartConf = {
		'interval': Number(interval)
	};
	
	var callbackFn = function(){
		var fn_interval = $('#chartConfInterval').val();
		if(fn_interval != 0) {
			if(fn_interval < 10) fn_interval = 10;
			if(fn_interval > 60 * 30) fn_interval = 60 * 30;
		}
		lvar_chartConfInterval = fn_interval;
		var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
		for(var i = 0; i < chartData.length; i++){
			chartData[i]['chartConf']['interval'] = fn_interval;
			lf_refreshChart(chartData[i]['chartId']);
		}
		return true;
	}
	cf_openDialog('DASHBOARD_CHART_CONFIGURATION', callbackFn, chartConf);
}

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
		
		var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
		for(var i = 0; i < chartData.length; i++){
			if(chartData[i]['chartId'] == chartId){
				chartData[i]['chartConf'] = paramChartConf;
			}
		}
		
		return true;
		
	}
	
	cf_openDialog('DASHBOARD_CHART_CONFIGURATION', callbackFn, chartConf);	
}

// 2023-09-22 1카드 N차트 추가
function lf_dashboardConfigurationNChart(thiz,chartId){
	var chartDIV = $(thiz).parent().parent().parent().parent().parent().parent().parent();
	var chart =chartDIV.find('.chart_box');
	var chartConf = chart.data('chartConf');
	var callbackFn = function(){
	var term = $('#chartConfTerm').val();
	var chartIdArry = chartId.split(',');
	var paramChartConf = {
		'term': term,
	}
		
	if(chartConf['interval']){
		paramChartConf['interval'] = $('#chartConfInterval').val();
	}
		
	chart.data('chartConf', paramChartConf);
		
	chartDIV.find('.dashboard_cont_top > .cont_btn_box > .sel_box > select').val(term);
	chartDIV.find('.dashboard_cont_top > .cont_btn_box > .sel_box > select').niceSelect('update');
		
	lf_refreshChart(chartIdArry);
	
	var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
	for(var i = 0; i < chartData.length; i++){
		if(JSON.stringify(chartData[i]['chartId']) === JSON.stringify(chartIdArry)){
			chartData[i]['chartConf'] = paramChartConf;
		}
	}		
		return true;		
	}
	
	cf_openDialog('DASHBOARD_CHART_CONFIGURATION', callbackFn, chartConf);	
}

function lf_dashboardCreateChartCallBack(){
var flag = false;
	
	var chartIdData = [];
	// 체크리스트 조회
	$("input:checkbox[name='chart_checkbox_list']").each(function(){
		if($(this).is(':checked')){
			if($(this).attr('id')){
				// check 된 태그의 id 값 추가
				chartIdData.push($(this).attr('id')); 
			}
		}
	});
	
	var tabData = lvar_dashboardData[lf_getActiveTabIdx()-1];
	
	//선택된 값이 있는 경우 tabData(대시보드 탭 데이터) 생성
	if(chartIdData.length > 0){ 
		//차트 생성
		flag = true; 
		for(var i = 0 ; i < chartIdData.length; i++){
			// lf_getActiveTabId: 대쉬보드들 탭중 어디에 띄울것인지 숫자로 리턴 ex)Dashboard1> 1, Dashboard2> 2
			var chartId = lf_createChartCard(lf_getActiveTabId(), chartIdData[i],false); 
			lf_makeChart(chartIdData[i], chartId, true);
			
			tabData['chart'].push({
				'chartType': chartIdData[i],
				'chartConf': lvar_defaultChartConf,
				'order': tabData['chart'].length+1,
				'chartId': chartId
			});
			
		}
	}

	$('.mscrollbar').mCustomScrollbar('update');
	return flag;
}

function lf_dashboardCreateChart(){
	cf_openDialog('DASHBOARD_CHART_CREATE', lf_dashboardCreateChartCallBack);
	
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

function lf_clickEventTab(thiz){
	lf_getActiveTab($(thiz).attr('tab-id'));
}


//Dashboard Tab Index
function lf_getActiveTabIdx(){
	var dashboardTabMgmtCnt = $('#dashboardTabMgmt').children().length;
	var retIdx = null;
	for(let i = 0; i < dashboardTabMgmtCnt;i++){
		var className = $('#dashboardTabMgmt').children().eq(i).attr('class');
		if(className.indexOf('open')>-1){
			retIdx = i;
		}
	}
	return retIdx+1;

		//return $('#dashboardTabMgmt > div.open').attr('class').replaceAll('tab_cont', '').replaceAll('open', '').replaceAll('dashboardTabMgmt_', '').trim();
}

function lf_loadPublicDashboard(rowData){
	lvar_dashboardId = rowData.dashboardId;
	lvar_dashboardData = eval(rowData.dashboardData);
	
	lf_dashboardInit();
	lf_loadDashboard();
}

function lf_dashboardPublicDialog(){
	
	cf_openDialog('DASHBOARD_PUBLIC', null, lf_loadPublicDashboard);
	
}

function lf_dashboardAdminDialog(){
	cf_openDialog('DASHBOARD_PUBLIC_ADMIN', null, lf_loadPublicDashboard);
}

function lf_dashboardPublicSaveDialog(){
	if(_USER.getUserLevKnm() != USER_LEVEL_SUPERADMIN){
		cf_alert('오류', '관리자 권한만 사용 가능합니다.');
		return;
	}
	
	var callbackFn = function(){
		
		var publicDashboardName = $('#publicDashboardName').val();
		var publicDashboardDesc = $('#publicDashboardDesc').val();
		
		var publicDashboardType = '';
		var publicDashboardTypeArr = [];
		
		var publicDashboardType_superAdmin = $('#publicDashboardType_superAdmin').is(':checked');
		if(publicDashboardType_superAdmin) publicDashboardTypeArr.push(USER_LEVEL_SUPERADMIN)
		var publicDashboardType_admin = $('#publicDashboardType_admin').is(':checked');
		if(publicDashboardType_admin) publicDashboardTypeArr.push(USER_LEVEL_ADMIN)
		var publicDashboardType_operator = $('#publicDashboardType_operator').is(':checked');
		if(publicDashboardType_operator) publicDashboardTypeArr.push(USER_LEVEL_OPERATOR)
		var publicDashboardType_viewer = $('#publicDashboardType_viewer').is(':checked');
		if(publicDashboardType_viewer) publicDashboardTypeArr.push(USER_LEVEL_VIEWER)
		
		if(publicDashboardTypeArr.length > 0){
			for(var i = 0; i < publicDashboardTypeArr.length; i++){
				if(i == 0) publicDashboardType = publicDashboardTypeArr[i];
				else publicDashboardType += '|' + publicDashboardTypeArr[i];
			}
			
			var body = {
					'dashboardName': publicDashboardName,
					'dashboardDesc': publicDashboardDesc,
					'dashboardType': publicDashboardType,
					'dashboardData': JSON.stringify(lvar_dashboardData)
				};
			
			cf_requestServer(_TR_DASHBOARD_CONF_PUBLIC_SUPERADMIN_SAVE,body,lf_serviceCall600202CallBack);
			
			
			return true;
			
		}
		else{
			cf_alert('오류', '권한을 체크하여 주십시오.');
			return false;
		}
		
	}
	
	cf_openDialog('DASHBOARD_PUBLIC_SAVE', callbackFn);
}

function lf_serviceCall600202CallBack(data){
	if(data.body.dbCnt > 0){
		cf_alert('성공', '공통 대시보드 저장 완료 되었습니다.');
		lf_dashboardInit();
	}else if(data.body.dbCnt ==0){
		cf_alert('오류', '공통 대시보드 저장 도중 오류가 발생하였습니다.');
	}
}

function lf_saveEventFunc(){
	var saveData = [];
	if($('#dashboardTabMgmt > div').length == 0){
		
	}
	else{
		$('#dashboardTabMgmt > div').each(function(idx){
			var templateObj = {};
			var tabName = $(this).find('.dashboard_box_top > .dashboard_title > h3').text();
			if(!tabName) tabName = $(this).find('.dashboard_box_top > .dashboard_title').text();
			tabName = tabName.trim();
			
			templateObj['templateName'] = tabName;
			templateObj['order'] = idx+1;
			templateObj['chart'] = [];
			
			var chartUL = $(this).find('.dashboard_box_cont > .dashboard_cont');
			
			chartUL.find('> li').each(function(chartIdx){
				var chartObj = {};
				
				var chartLI = $(this);
				var chartConf = chartLI.find('.chart_box').data('chartConf');
				var chartType = chartLI.find('.chart_box').data('chartType');
				chartObj['chartType'] = chartType;
				chartObj['order'] = chartIdx+1;
				chartObj['chartConf'] = chartConf;
				templateObj['chart'].push(chartObj);
			});
			
			saveData.push(templateObj)
		});
	}
	if(saveData.length > 0 ) {
		lvar_dashboardData = saveData;
	}
	
	var callbackFunc = function(){			
		var body = {
			'dashboardData': JSON.stringify(lvar_dashboardData)
		};
		
		if(lvar_dashboardId != null && lvar_dashboardId != ""){
			body['dashboardId'] = lvar_dashboardId;
		}
		
		cf_requestServer(_TR_DASHBOARD_CONF_CURRENT_USER_SAVE,body,lf_serviceCall600102CallBack);
	}
	
	cf_confirm('대시보드 저장', '대시보드를 저장하시겠습니까?', callbackFunc);

	
	return saveData;
	
}

function lf_serviceCall600102CallBack(data){
	if(data.body.dbCnt > 0){
		lvar_dashboardId = data.body.dashboardId;
		cf_alert('성공', '대시보드 저장이 완료 되었습니다.');
		
		$('#dashboardSaveBtn').prop('disabled', false);
		$('#dashboardViewLoadBtn').prop('disabled', false);
		$('#dashboardRefreshBtn').prop('disabled', false);
		$('#dashboardRemoveBtn').prop('disabled', false);
		
	}else if(data.body.dbCnt ==0){
		cf_alert('오류', '대시보드 저장 도중 오류가 발생하였습니다.');
	}
}

function lf_serviceCall600103(){
	
	var callbackFunc = function(){
		var body = {
			'dashboardId': lvar_dashboardId	
		};
			
		cf_requestServer(_TR_DASHBOARD_CONF_CURRENT_USER_DELETE,body,lf_serviceCall600103CallBack);
	}
	
	cf_confirm('대시보드 삭제', '대시보드를 삭제하시겠습니까?', callbackFunc);
	
}

function lf_serviceCall600103CallBack(data){
	if(data.body.dbCnt > 0){
		cf_alert('성공', '대시보드 삭제가 완료 되었습니다.');
		
		$('.tab_lst li').remove();

		for(var chartId in lvar_chartInterValObj){
			delete lvar_chartInterValObj[chartId];
		}
		
		lf_serviceCall600101();
		
	}else if(data.body.dbCnt ==0){
		cf_alert('오류', '대시보드 삭제 도중 오류가 발생하였습니다.');
	}
}

function lf_serviceCall600101(){
	var body = {};
	lf_dashboardInit();
	cf_requestServer(_TR_DASHBOARD_CONF_CURRENT_USER_INFO,body,lf_serviceCall600101CallBack);
}

function lf_serviceCall600101CallBack(data){
	var dashboardId = data.body.dashboardId;
	lvar_dashboardType = 'USER';
	
	if(dashboardId != ''){
		
		lvar_dashboardId = dashboardId;
		lvar_dashboardData = eval(data.body.dashboardData);
		
		lf_loadDashboard();
	}
	else{
		lf_dashboardInit();
	}
	
	if(_USER.getUserLevKnm() == USER_LEVEL_SUPERADMIN){
		$('#adminControlBtnGroup').fadeIn();
	}
	else{
		$('#adminControlBtnGroup').hide();
	}
}

function lf_loadDashboard(){
	if(lvar_dashboardData.length > 0){
		
		lvar_dashboardData.sort(function(a, b) { // 오름차순
			var aSort = parseInt(['order']);
			var bSort = parseInt(b['order']);
			return aSort - bSort;
		});
		
		// 탭만 생성
		var activeTabIdx = 1; 
		for(var i = 0; i < lvar_dashboardData.length; i++){
			var templateData = lvar_dashboardData[i];
			var templateName = templateData['templateName'];
			
			if(templateData['active']) activeTabIdx = i+1;
			
			var tabIdx = lf_createDashboardTabContent(templateName);
		}
		
		lf_tabUi(); 
		
		// 선택된 탭만 차트 생성
		var tabData = lvar_dashboardData[activeTabIdx-1];
		var chart = tabData['chart'];
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
				
				var chartId = lf_createChartCard(activeTabIdx, chartType, chartConfParam);
				
				chartData['chartId'] = chartId;
				
				lf_makeChart(chartType, chartId, true);
			}
		}
		
	}
	
}

function lf_openTabEditDialog(thiz){
	//var tabId = $(thiz).parent().attr('rel');
	var tabId = $(thiz).attr('rel');
	//var tabIdx = tabId.replaceAll(lvar_dashboardTabIdPrefix, '');
	var tabIdx = lf_getActiveTabIdx();
	
	//var templateNameDIV = $(thiz).parent().find('.tab_link');
	var templateNameDIV = $(thiz).find('.tab_link');
	var tabContTitle = $('#dashboardTabMgmt > .'+tabId).find('.dashboard_title');
	
	var callBackFn = function(){
		var updateTabName = $('#updateTabName').val();
		if(updateTabName.length < 1) return;
		if(updateTabName.length > 16) updateTabName = updateTabName.substring(0, 15);

		lvar_dashboardData[tabIdx-1]['templateName'] = updateTabName;
		templateNameDIV.text(updateTabName);
		tabContTitle.html("<h3>" + updateTabName + "</h3>");
		
		return true;
	}
	
	cf_openDialog('DASHBOARD_TAB_EDIT', callBackFn, templateNameDIV.text());
	
}

function lf_createDashboardTabContent(dashboardTemplateName){
	var $UL = $('section.dashboard div.tab_box > div.tab > ul.tab_lst');
	
	var createIdx = $UL.find('li').length+1;
	
	var activeClass = (createIdx == 1) ? 'open' : ''; 
	
	// tab 생성 부분
	var $createLI = $('<li onclick="javascript: lf_tabEventClickLoadDashboard('+createIdx+');" ondblclick="javascript: lf_openTabEditDialog(this);" rel="dashboardTabMgmt_'+createIdx+'" class="on '+activeClass+'"></ul>')
					.append($('<a href="#" class="tab_link" title="'+dashboardTemplateName+'">'+dashboardTemplateName+'</a>'))
					.append($('<a href="#" onclick="javascript: lf_openDashboardFullWindow();" class="full" title="새창열기">새창열기</a>'))
					.append($('<a href="#" onclick="javascript: lf_removeTab('+createIdx+');" class="tab_cls">close</a>'));
	$UL.append($createLI);
	
	// tab cont 부분
	var $tabCont = $('<div class="dashboardTabMgmt_'+createIdx+' tab_cont '+activeClass+'"></div>');
	$tabCont.data('idx', createIdx);
	
	$tabCont.append(
		$('<div class="dashboard_box"></div>')
		.append($('<div class="dashboard_box_top"></div>'))
		.append($('<div class="dashboard_option_select_box"></div>'))
		.append($('<div class="dashboard_box_cont"></div>'))
	);
	
	$tabCont.find('.dashboard_box > .dashboard_box_top').append($('<div class="dashboard_title"><h3>'+dashboardTemplateName+'</h3></div>'));
	/*
	$tabCont.find('.dashboard_box > .dashboard_box_top').append(
		$('<div class="dashboard_btn_box"></div>')
		.append($('<a href="#" onclick="javascript: lf_dashboardCreateChart();" class="btn bline" title="차트 & 데이터 선택"><span>차트 & 데이터</span></a>'))
		.append($('<a href="#" onclick="javascript: lf_dashboardAllConfiguration(this);" class="btn bline" title="자동 리로딩 설정"><span>리로딩설정</span></a>'))
		.append($('<a href="#" onclick="javascript: lf_removeChartAll();" class="btn save" title="전체 삭제"><span>삭제</span></a>'))
	);
	*/
	var dashboard_btn_box = "";
	dashboard_btn_box += "<div class=\"dashboard_btn_box\">\n";
	dashboard_btn_box += "	<a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n";											
	dashboard_btn_box += "	<a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n";
	dashboard_btn_box += "	<a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n";
	dashboard_btn_box += "</div>\n";
	$tabCont.find('.dashboard_box > .dashboard_box_top').append(dashboard_btn_box);

	$tabCont.find('.dashboard_box').append($('<ul class="dashboard_cont"></ul>'));
	$tabCont.find('.dashboard_box > .dashboard_option_select_box').append(registryTag+clusterTag);
	$tabCont.find('.dashboard_box > .dashboard_box_cont').append($('<ul class="dashboard_cont"></ul>'));
	
	$('#dashboardTabMgmt').append($tabCont);
	
	return createIdx;
}

function lf_tabActive(activeTabIdx){
	$('.tab_box > .tab > .tab_lst li').removeClass('open');
	$('.tab_box > .tab > .tab_lst li[rel="'+lvar_dashboardTabIdPrefix+activeTabIdx+'"]').addClass('open');
	$('#dashboardTabMgmt div').removeClass('open');
	$('#dashboardTabMgmt div.'+lvar_dashboardTabIdPrefix+activeTabIdx).addClass('open');
}

function lf_tabEventClickLoadDashboard(activeTabIdx){
	
	var tabEl = lf_getTabElement(activeTabIdx);
	var tabContEl = tabEl.find('.dashboard_box > .dashboard_box_cont > ul.dashboard_cont');
	
	tabContEl.find('li').each(function(idx){
		lf_removeChart($(this).find('.chart_box').attr('id'), false);
	});
	
	tabContEl.empty();
	var arrIdx = 0;
	for(let i = 0; i < lvar_dashboardData.length; i++) {
                 if(lvar_dashboardData[i].order === activeTabIdx)  {
                         arrIdx=i;
                         break;
                 }
         }

	//var tabData = lvar_dashboardData[activeTabIdx-1];
	var tabData = lvar_dashboardData[arrIdx];
	
	var chart = tabData['chart'];
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
			
			var chartId = lf_createChartCard(activeTabIdx, chartType, chartConfParam);
			chartData['chartId'] = chartId;
			
			lf_makeChart(chartType, chartId, true);
			
		}
	}
	$('.mscrollbar').mCustomScrollbar('update');
}

function lf_refreshDashboardData(){

	var callback = function(){
		lf_dashboardInit(true);
	}
	
	cf_confirm('대시보드', '초기화 진행 하시겠습니까?<br/><code>(수정 및 저장 중인 대시보드가 저장되지 않을 수 있습니다.)</code>', callback);
	
}

function lf_dashboardInit(flag){
	
	// tab 삭제
	$('section[class="dashboard"] > div[class="tab_box"] > div[class="tab"] > ul[class="tab_lst"]').empty();
	// tab Cont 삭제
	$('#dashboardTabMgmt').empty();
	
	// 나중에 해당 interval 삭제 넣어야함
	for(var chartId in lvar_chartInterValObj){
		clearInterval(lvar_chartInterValObj[chartId]);
	}
	lvar_chartInterValObj = {};
	
	if(flag) lf_serviceCall600101();
}

function lf_getActiveTabId(){
	//return $('#dashboardTab li a.active').attr('tab-id');
	return $('#dashboardTabMgmt > div.open').attr('class').replaceAll('tab_cont', '').replaceAll('open', '').replaceAll('dashboardTabMgmt_', '').trim();
}


function lf_getActiveTab(tabId){
	$('#dashboardTab li a').removeClass('active');
	$('#tab-content > div.tab-pane').removeClass('active');
	
	
	$('#tab-content > div[id='+tabId+']').addClass('active');
	$('#tab-content > div[id='+tabId+']').hide();
	$('#tab-content > div[id='+tabId+']').slideDown(800);
	$('#dashboardTab li a[tab-id='+tabId+']').addClass('active');
}

function setChartAutoReload(chartFunc, chartId, param, interval){
	clearInterval(lvar_chartInterValObj[chartId]);
	
	if(interval > 0){
		lvar_chartInterValObj[chartId] = setInterval(function() {
			chartFunc(chartId, param);
			sendStatusToChildWindow(chartId); // 추가. '컨테이너 이미지 스캔 현황' 자식 팝업창에 변경 이벤트 전달
		}, interval * 1000);
	}
}

// 차트 생성
function lf_makeChart(chartType, chartId, use_cache){
	
	var chartDIV = $('#'+chartId);
	
	var chartConfData = lf_getChartELConf(chartType);
	var chartConf = chartDIV.data('chartConf');
	if(typeof chartConf == "undefined" || chartConf == null || chartConf == "")
		chartConf = lvar_defaultChartConf;
	var intervalParam = {};
	var reloadParam = {};
	
	//이쪽 생각해야함
	if(chartConf['term']){
		intervalParam['term'] = chartConf['term'];
		reloadParam['term'] = chartConf['term'];
	}
	
	if(use_cache) {		
		reloadParam['use_cache'] = 'true';
	} else {
		reloadParam['use_cache'] = 'false';
	}
	intervalParam['use_cache'] = 'true';
	chartConfData.func(chartId, reloadParam);
	setChartAutoReload(chartConfData.func, chartId, intervalParam, chartConf['interval']);
		
}

function lf_getTabElement(tabIdx){
	return $('#dashboardTabMgmt > div.dashboardTabMgmt_'+tabIdx);
}

function lf_chartTermSelectEvent(thiz){
	var term = $(thiz).val();
	var chartId = $(thiz).parent().parent().parent().parent().find('.chart_box').attr('id');
	var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
	for(var i = 0; i < chartData.length; i++){
		if(chartData[i]['chartId'] == chartId){
			chartData[i]['chartConf']['term'] = term;
		}
	}
	
	lf_refreshChart(chartId);
	
	return true;
}
// 2023-09-22 이성호 1카드 N 차트일때
function lf_chartTermSelectEventNChart(thiz,chartId){
	var term = $(thiz).val();
	//var chartId = $(thiz).parent().parent().parent().parent().find('.chart_box').attr('id');
	var chartIdArry = chartId.split(',');
	$.each(chartIdArry,function(index,item){
		var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
		for(var i = 0; i < chartData.length; i++){
			if(JSON.stringify(chartData[i]['chartId']) === JSON.stringify(chartIdArry)){
			chartData[i]['chartConf']['term'] = term;
			}
		}	
	});	
	lf_refreshChart(chartIdArry);
	return true;
}

/**
 * 
 * @param tabId : templateId (null 활성화된 tab)
 * @param width
 * @param height
 * @param chartType: table, view, any Chart (예외 처리) 
 * @returns chartId
 */
function lf_createChartCard(tabIdx, chartType, paramChartConf){
	var tabEl = lf_getTabElement(tabIdx);
	var chartConf = {};
	if(paramChartConf) chartConf = paramChartConf;
	else chartConf = lvar_defaultChartConf;
	var chartElConf = lf_getChartELConf(chartType);
	
	var tabContEl = tabEl.find('.dashboard_box > .dashboard_box_cont > ul.dashboard_cont');
	var contLI = $('<li class="w_'+chartElConf['width']+'"></li>');
	
	// 차트 제목 부수 공통
	var contCommonDIV = $('<div class="dashboard_cont_top"></div>'); 
	contCommonDIV.append($('<h4 class="cont_title">'+chartElConf['title']+'</h4>'));
	var contBtnBox = $('<div class="cont_btn_box"></div>');
	
	
	if(chartElConf['NChart']){ // 2023-09-22 이성호 추가 > 1카드 N차트 > 추후 더블 이외의 N차트로 확장 가능하도록 설계
		var randomInt = [];
		var chartId = [];
		$.each(chartElConf['chart'],function(index,item){
			// chartElConf['chart']가 배열이지만 정확성을 위해 index를 동일하게 사용
			randomInt[index] = (Math.floor((Math.random() * 10000) + 1));
			chartId[index] = lvar_dashboardChartPrefix+chartElConf['chart'][index]+'_'+randomInt[index];
		});
		
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
			contLI.append($('<div class="dashboard_'+chartElConf['chart'][index]+'_box '+chartElConf['applyCSS']+' nchart"><div id="'+chartId[index]+'" class="chart_box dashboard_'+chartElConf['chart'][index]+'"></div></div>'))	
	
			if(chartConf) contLI.find('#'+chartId[index]).data('chartConf', chartConf);
			else contLI.find('#'+chartId[index]).data('chartConf', lvar_defaultChartConf);
	
			contLI.find('#'+chartId[index]).data('chartType', chartType);	
			tabContEl.append(contLI);
		});	
	}else{ // 기존 로직
		if(chartElConf['params'].indexOf('term') >= 0){
			if(chartConf['term'] == 'DAY') {
				contBtnBox.append(
				$('<div class="sel_box fl" style="padding: 10px 10px 10px 10px;"></div>')
				.append('<select onchange="javascript: lf_chartTermSelectEvent(this);" class="popup_sel small">' + 
							'<option selected="selected" value="DAY">Day</option>' + 
							'<option value="WEEK">Weekly</option>' +
						'</select>')
				);
			

		} else { // default = DAY, else = WEEK 추가
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
	} // 기존 로직 끝


	
	return chartId;
}

function lf_removeTab(tabidx) {
	event.stopPropagation();
	
	if(!tabidx) tabidx = lf_getActiveTabIdx();
	
	// 차트 삭제 
	$('.'+lvar_dashboardTabIdPrefix+tabidx).find('.dashboard_cont > li').each(function(idx){
		lf_removeChart($(this).find('.chart_box').attr('id'), true);
	});
	
	
	$('ul.tab_lst > li[rel='+lvar_dashboardTabIdPrefix+tabidx+']').remove();
	$('.' + lvar_dashboardTabIdPrefix+tabidx).remove();
	for(let i = 0; i < lvar_dashboardData.length; i++) {
		if(lvar_dashboardData[i].order === tabidx)  {
			lvar_dashboardData.splice(i, 1);
			break;
		}
	}
	var tabEx = true;
	for(let j = tabidx; j >= 0; j--){
		for(let k = lvar_dashboardData.length-1; k >=0; k--){
			if(lvar_dashboardData[k].order < tabidx)  {
                        	lf_tabActive(lvar_dashboardData[k].order);
                        	lf_tabEventClickLoadDashboard(lvar_dashboardData[k].order);
				tabEx = false;
                        	break;
                	}
		}
	}
	if(tabEx){
		for(let l = 0; l < lvar_dashboardData.length; l++) {
			if(lvar_dashboardData[l].order > tabidx)  {
				lf_tabActive(lvar_dashboardData[l].order);
				lf_tabEventClickLoadDashboard(lvar_dashboardData[l].order);
				break;
			}
		}
	}
	lf_tab_btn_init();
}

function lf_removeChartAll(tabidx){
	event.stopPropagation();
	
	if(!tabidx) tabidx = lf_getActiveTabId();

	// 차트 삭제 
	$('.'+lvar_dashboardTabIdPrefix+tabidx).find('.dashboard_cont > li').each(function(idx){
		// 2023-09-24 이성호 추가 > 1카드 n 차트 경우 추가
		if($(this).find('.nchart').length >0){
			var chartIdArry = [];
			$(this).find('.nchart').each(function(idx){
				chartIdArry.push($(this).find('.chart_box').attr('id'));
			});
			lf_removeNChart(chartIdArry.toString(),true);
		}else{
			lf_removeChart($(this).find('.chart_box').attr('id'), true);
		}
	});
	$('.mscrollbar').mCustomScrollbar('update');
}

function lf_removeChartEvent(thiz){
	var chartId = $(thiz).parent().parent().parent().parent().parent().parent().parent().find('.chart_box').attr('id')
	lf_removeChart(chartId, true);
}

function lf_removeChartEventNChart(chartId){
	//var chartIdArry = chartId.split(',');
	lf_removeNChart(chartId, true);
	//lf_removeChart(chartId, true);
}

function lf_removeChart(chartId, dataFlag){
	clearInterval(lvar_chartInterValObj[chartId]);
	
	delete lvar_chartInterValObj[chartId];
	
	$('#'+chartId).parent().parent().remove();
	
	if(dataFlag){
		var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
		var needRegistrySelect = $('.dashboard_cont .'+NEED_REGISTRY_SELECT).length > 0;
		var needClusterSelect = $('.dashboard_cont .'+NEED_CLUSTER_SELECT).length > 0;
		
		for(var i = 0; i < chartData.length; i++){
			if(chartData[i]['chartId'] == chartId){
				lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'].splice(i, 1);
			}
		}
		
		// 상단 selectBox(cluster, registry)가 필요하지 않을 경우 숨김
		if (!needRegistrySelect) {
			$('.dashboard_box_registry').hide();
		}
		if (!needClusterSelect) {
			$('.dashboard_box_cluster').hide();
		}
	}
	$('.mscrollbar').mCustomScrollbar('update');
}

// 2023-09-24 이성호 추가 > 배열로된 chartId도 삭제
/**
 * interval: array.toString 으로 삭제
 * chartData: array 자체로 삭제
 */
function lf_removeNChart(chartId, dataFlag){
	var chartIdArry = chartId.split(',');
	clearInterval(lvar_chartInterValObj[chartId]);
	delete lvar_chartInterValObj[chartId];
	
	$('#'+chartId).parent().parent().remove();
	
	if(dataFlag){
		var chartData = lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'];
		var needRegistrySelect = $('.dashboard_cont .'+NEED_REGISTRY_SELECT).length > 0;
		var needClusterSelect = $('.dashboard_cont .'+NEED_CLUSTER_SELECT).length > 0;
		
		for(var i = 0; i < chartData.length; i++){
			if(JSON.stringify(chartData[i]['chartId']) == JSON.stringify(chartIdArry)){
				lvar_dashboardData[lf_getActiveTabIdx()-1]['chart'].splice(i, 1);
			}
		}
		
		// 상단 selectBox(cluster, registry)가 필요하지 않을 경우 숨김
		if (!needRegistrySelect) {
			$('.dashboard_box_registry').hide();
		}
		if (!needClusterSelect) {
			$('.dashboard_box_cluster').hide();
		}
	}
	$('.mscrollbar').mCustomScrollbar('update');
}

function lf_refreshChartEvent(thiz){
	var chartId = $(thiz).parent().parent().parent().parent().parent().parent().parent().find('.chart_box').attr('id');
	lf_refreshChart(chartId);
}

function lf_refreshChartEventNChart(chartId){
	var chartIdArry = chartId.split(',');
	lf_refreshChart(chartIdArry);
}

function lf_refreshChart(chartId){
	var chart = $('#'+chartId);
	var chartConf = chart.data('chartConf');
	// 2023-09-22 차트 아이디를 파라미터로 받고있고 데이터가 동일하기에 주석처리
	//var chartId = chart.attr('id');
	var chartType = chart.data('chartType');
	
	lf_makeChart(chartType, chartId, false);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////


/****************************************************************************************
 * Design Script
 ****************************************************************************************/


function lf_tabInit(){
	$('section').addClass('mscrollbar');
	if ($('.mscrollbar').length){
        $('.mscrollbar').mCustomScrollbar({
            autoExpandScrollbar: "true",
            scrollInertia: 600,
          //  advanced:{
          //         updateOnContentResize: true
          //     },
        });
        $('.dataTables_scrollBody').mCustomScrollbar();
    }
    	
	$(window).resize(function() {
		if ($('.tab_lst').length){
			lf_tabcheck();
			lf_tabrecheck();
		}
	});
	
	if ($('.tab_lst').length){
		if (window.matchMedia('(min-width: 1920px)').matches) {
			$('.tab_lst').css({
				maxWidth : 'calc(100% - 42px)'
			});
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li').first().addClass('on open');
			for (var i = 0; i <= 7; i++) {
				$('.tab_lst li.on').next().addClass('on');
			}
			lf_tabcheck();
		}
		if (window.matchMedia('(min-width: 1750px) and (max-width: 1919px)').matches) {
			$('.tab_lst').css({
				maxWidth : '1442px'
			});
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li').first().addClass('on open');
			for (var i = 0; i <= 6; i++) {
				$('.tab_lst li.on').next().addClass('on');
			}
			lf_tabcheck();
		}
		if (window.matchMedia('(min-width: 1560px) and (max-width: 1750px)').matches) {
			$('.tab_lst').css({
				maxWidth : '1260px'
			});
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li').first().addClass('on open');
			for (var i = 0; i <= 5; i++) {
				$('.tab_lst li.on').next().addClass('on');
			}
			lf_tabcheck();
		}
		if (window.matchMedia('(min-width: 1400px) and (max-width: 1560px)').matches) {
			$('.tab_lst').css({
				maxWidth : '1080px'
			});
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li').first().addClass('on open');
			for (var i = 0; i <= 4; i++) {
				$('.tab_lst li.on').next().addClass('on');
			}
			lf_tabcheck();
		}
		if (window.matchMedia('(max-width: 1400px)').matches) {
			$('.tab_lst').css({
				maxWidth : '900px'
			});
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li').first().addClass('on open');
			for (var i = 0; i <= 3; i++) {
				$('.tab_lst li.on').next().addClass('on');
			}
			lf_tabcheck();
		}
		lf_tabUi();
	}
	
	lf_tab_btn_init();
}

function lf_tabChoice(idx){
	var tabIdx = idx-1;
	
	$('.tab_lst > li').removeClass('open');
	$('.tab_lst > li').eq(tabIdx).addClass('open');
	
	$('#dashboardTabMgmt > div').removeClass('open');
	$('#dashboardTabMgmt > div').eq(tabIdx).addClass('open');
	
}

//tab실행 스크립트
function lf_tabUi() {
	lf_tabf();
//	lf_TabCls();
//	lf_tabadd();
	$('.next-slide').click(function(e) {
		e.preventDefault();
		$('.tab_lst li').not('.on').first().addClass('on');
		$('.tab_lst li.on').first().removeClass('on');
		lf_tabcheck();
	});
	$('.prev-slide').click(function(e) {
		e.preventDefault();
		$('.tab_lst li.on').last().removeClass('on');
		$('.tab_lst li').not('.on').first().addClass('on');
		lf_tabcheck();
	});
		
	// 탭개수 제한 걸고 사용하지 않음
	$(".prev-slide").css("display", "none");
	$(".next-slide").css("display", "none");
	
	lf_tab_btn_init();
}

//tab동작 스크립트
function lf_tabf() {
	var $btn_tab = $('.tab_lst li').find('.tab_link');
	$btn_tab.on('click', function(e) {
		e.preventDefault();
		var contTop = $('.tab_container').offset();
		$('.newmodal_body').scrollTop(contTop);
		var $this = $(this), $thisrel = $this.parent().attr('rel'); // tab_lst
																	// li :: rel
		$thisClass = $('.' + $thisrel); // tab_cont :: class
		target = $thisClass.parent('.tab_container').attr('id'); // tab_container
																	// :: id

		$('#' + target).find('.tab_cont').removeClass('open');
		$('#' + target + ' .' + $thisrel).addClass('open');
		$this.parent().addClass('open').siblings().removeClass('open'); // tab_lst
																		// li ::
																		// on

	});
}

function lf_tabadd(){
	var cnt = $('.tab_lst li').length;
	
	if(cnt >= 6) {
		swal("탭은 최대 6개까지 사용 할 수 있습니다.", {
	        icon: "./assets/images/icon_alert04.png",
	        buttons:"확인"
	    });
		return;
	}
	
	if (window.matchMedia('(min-width: 1920px)').matches) {
		var $lst_len = $('.tab_lst li').length;
		var count = $lst_len;
		var tabIds = [];
		if(lvar_dashboardData.length > 0){
                	for(let j = 0; j < lvar_dashboardData.length; j++) {
                        	tabIds.push(lvar_dashboardData[j].order);  
                	}
                	count = Math.max.apply(null, tabIds);
		}
		count++;
		var $lst_on_len = $('.tab_lst li.on').length;
		if ($lst_len == 0) {
			$('.tab_lst')
					.prepend(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.prepend(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                 </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else if ($lst_on_len < 9) {
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else {
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			for (var i = 0; i <= 7; i++) {
				$('.tab_lst li.on').prev().addClass('on');
			}
			lf_tabcheck();
		}
	}
	else if (window
			.matchMedia('(min-width: 1750px) and (max-width: 1919px)').matches) {	
		var $lst_len = $('.tab_lst li').length;
		var count = $lst_len;
		var tabIds = [];
                if(lvar_dashboardData.length > 0){
                        for(let j = 0; j < lvar_dashboardData.length; j++) {
                                tabIds.push(lvar_dashboardData[j].order);
                        }
                        count = Math.max.apply(null, tabIds);
                }
		count++;
		var $lst_on_len = $('.tab_lst li.on').length;
		if ($lst_len == 0) {
			$('.tab_lst')
					.prepend(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.prepend(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else if ($lst_on_len < 8) {
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else {
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			for (var i = 0; i <= 6; i++) {
				$('.tab_lst li.on').prev().addClass('on');
			}
			lf_tabcheck();
		}
	}
	else if (window
			.matchMedia('(min-width: 1560px) and (max-width: 1750px)').matches) {
		var $lst_len = $('.tab_lst li').length;
		var count = $lst_len;
		var tabIds = [];
                if(lvar_dashboardData.length > 0){
                        for(let j = 0; j < lvar_dashboardData.length; j++) {
                                tabIds.push(lvar_dashboardData[j].order);
                        }
                        count = Math.max.apply(null, tabIds);
                }
		count++;
		var $lst_on_len = $('.tab_lst li.on').length;
		if ($lst_len == 0) {
			$('.tab_lst')
					.prepend(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.prepend(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else if ($lst_on_len < 7) {
			lf_tabcheck();
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else {
			lf_tabcheck();
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			for (var i = 0; i <= 5; i++) {
				$('.tab_lst li.on').prev().addClass('on');
			}
			lf_tabcheck();
		}
	}
	else if (window
			.matchMedia('(min-width: 1400px) and (max-width: 1560px)').matches) {
		var $lst_len = $('.tab_lst li').length;
		var count = $lst_len;
		var tabIds = [];
                if(lvar_dashboardData.length > 0){
                        for(let j = 0; j < lvar_dashboardData.length; j++) {
                                tabIds.push(lvar_dashboardData[j].order);
                        }
                        count = Math.max.apply(null, tabIds);
                }
		count++;
		var $lst_on_len = $('.tab_lst li.on').length;
		if ($lst_len == 0) {
			$('.tab_lst')
					.prepend(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.prepend(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else if ($lst_on_len < 6) {
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else {
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			for (var i = 0; i <= 4; i++) {
				$('.tab_lst li.on').prev().addClass('on');
			}
			lf_tabcheck();
		}
	}
	else if (window.matchMedia('(max-width: 1400px)').matches) {
		var $lst_len = $('.tab_lst li').length;
		var count = $lst_len;
		var tabIds = [];
                if(lvar_dashboardData.length > 0){
                        for(let j = 0; j < lvar_dashboardData.length; j++) {
                                tabIds.push(lvar_dashboardData[j].order);
                        }
                        count = Math.max.apply(null, tabIds);
                }
		count++;
		var $lst_on_len = $('.tab_lst li.on').length;
		if ($lst_len == 0) {
			$('.tab_lst')
					.prepend(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.prepend(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else if ($lst_on_len < 5) {
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			lf_tabcheck();
		} else {
			$('.tab_lst li.on').removeClass('on');
			$('.tab_lst li.open').removeClass('open');
			$('.tab_container .tab_cont.open').removeClass(
					'open');
			$('.tab_lst')
					.children()
					.last()
					.after(
							"<li onclick=\"javascript: lf_tabEventClickLoadDashboard("+count+");\" ondblclick=\"javascript: lf_openTabEditDialog(this);\" rel=\"dashboardTabMgmt_"
									+ count
									+ "\" class=\"open on\">\n"
									+ "<a href=\"#\" class=\"tab_link\" title=\"\">Dashboard"
									+ count
									+ "</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_openDashboardFullWindow();\" class=\"full\" title=\"새창열기\">새창열기</a>\n"
									+ "<a href=\"#\" onclick=\"javascript: lf_removeTab("+count+");\" class=\"tab_cls\">close</a>\n"
									+ "</li>");
			$('.tab_container')
					.children()
					.last()
					.after(
							"        <div class=\"dashboardTabMgmt_"
									+ count
									+ " tab_cont open\">\n"
									+ "            <div class=\"dashboard_box\">\n"
									+ "                <div class=\"dashboard_box_top\">\n"
									+ "                    <div class=\"dashboard_title\">\n"
									+ "                        <h3>Dashboard"
									+ count
									+ "</h3>\n"
									+ "                    </div>\n"
									+ "                    <div class=\"dashboard_btn_box\">\n"
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardCreateChart();\" class=\"btn bline\" title=\"차트 & 데이터 선택\"><span>차트 & 데이터</span></a>\n"													
									+ "                        <a href=\"#\" onclick=\"javascript: lf_dashboardAllConfiguration(this);\" class=\"btn bline\" title=\"자동 리로딩 설정\"><span>리로딩설정</span></a>\n"
									+ "                        <a href=\"#\" onclick='javascript:lf_removeChartAll();' class=\"btn save\" title=\"전체 삭제\"><span>삭제</span></a>\n"
									+ "                    </div>\n"
									+ "                </div>\n"
									// 추가
									+ "                <div class=\"dashboard_option_select_box\">\n"
									+                    registryTag
									+                    clusterTag
									+ "                </div>\n"
									+ "                <div class=\"dashboard_box_cont\">\n"
									+ "                    <ul class=\"dashboard_cont\">\n"
									+ "\n"
									+ "                    </ul>\n"
									+ "                </div>\n"
									+ "            </div>\n"
									+ "        </div>\n");
			for (var i = 0; i <= 3; i++) {
				$('.tab_lst li.on').prev().addClass('on');
			}
			lf_tabcheck();
		}
	}
	lf_tabf();
	lf_tabcheck();
	lf_tab_btn_init();
	
	lvar_dashboardData.push({
		'templateName': 'Dashboard'+ count,
		'order': count,
		'chart': []
	});
	
	//lf_tabUi();
	$('.mscrollbar').mCustomScrollbar('update');
} 

// tab삭제 스크립트
//function lf_TabCls() {
//	var $tab_cls = $('.tab_lst li').find('.tab_cls');
//	$('html').click(
//			function(e) {
//				e.preventDefault();
//				if (!$('.tab_set_list').has(e.target).length
//						&& !$('.tab_lst li').has(e.target).length) {
//					$('.tab_cls').removeClass('on');
//				}
//			});
//
//	$tab_cls.on('click', function(e) {
//		e.preventDefault();
//		var contTop = $('.tab_container').offset();
//		$('.newmodal_body').scrollTop(contTop);
//		var $this = $(this), $thisrel = $this.parent().attr('rel'); // tab_lst
//																	// li :: rel
//		$thisClass = $('.' + $thisrel); // tab_cont :: class
//		target = $thisClass.parent('.tab_container').attr('id'); // tab_container
//																	// :: id
//		$('#' + target + ' .' + $thisrel).remove();
//		$this.parent().remove();
//	});
//	
//	
//	lf_removeTab();
//
//}

function lf_tabcheck() {	
	var LIMIT = 9;
	if (window.matchMedia('(max-width: 1400px)').matches) {
		LIMIT = 5;
	} else if (window.matchMedia('(min-width: 1401px) and (max-width: 1560px)').matches) {
		LIMIT = 6;
	} else if (window.matchMedia('(min-width: 1561px) and (max-width: 1750px)').matches) {
		LIMIT = 7;
	} else if (window.matchMedia('(min-width: 1751px) and (max-width: 1919px)').matches) {
		LIMIT = 8;
	} 
		
	var $lst_len = $('.tab_lst li').length;
	var firstON = $('.tab_lst li').first().hasClass('on');
	var lastON = $('.tab_lst li').last().hasClass('on');
	
	if (LIMIT > $lst_len) {
		$('.tab_box').find('a.prev-slide').addClass('disabled');
		$('.tab_box').find('a.next-slide').addClass('disabled');
	} else if (LIMIT < $lst_len) {
		if ($('.tab_lst li').first().hasClass('on')) {
			$('.tab_box').find('a.prev-slide').addClass('disabled');
		} else {
			$('.tab_box').find('a.prev-slide').removeClass('disabled');
		}
		if ($('.tab_lst li').last().hasClass('on')) {
			$('.tab_box').find('a.next-slide').addClass('disabled');
		} else {
			$('.tab_box').find('a.next-slide').removeClass('disabled');
		}
	}
}

function lf_tab_btn_init() {
	$('.tab_set_list').removeClass('on');
	$('.tab_set_btn').removeClass('on');
	$('.tab_cls').removeClass('on');
	$('.tab_edit').removeClass('on');
		
	$('.tab_set_btn').off('click');
	$('.tab_cls_on').off('click');
	$('.tab_edit_on').off('click');
	
	var cnt = $('.tab_lst li').length;
	if(cnt == 0) return;
	
	$('.tab_set_btn').on('click', function(e) {
		e.preventDefault();
		if ($('.tab_set_list').hasClass('on')) {
			$('.tab_set_list').removeClass('on');
		} else {
			$('.tab_set_list').addClass('on');
		}
	});
	$('.tab_cls_on').on('click', function(e) {
		e.preventDefault();
		if ($('.tab_cls').hasClass('on')) {
			$('.tab_cls').removeClass('on');
		} else {
			$('.tab_cls').addClass('on');
		}
		$('.tab_edit').removeClass('on');
		$('.tab_set_list').removeClass('on');
	});
	$('.tab_edit_on').on('click', function(e) {
		e.preventDefault();
		if ($('.tab_edit').hasClass('on')) {
			$('.tab_edit').removeClass('on');
		} else {
			$('.tab_edit').addClass('on');
		}
		$('.tab_cls').removeClass('on');
		$('.tab_set_list').removeClass('on');
	});
}

//tab슬라이드 반응형 채크 스크립트
function lf_tabrecheck() {
	if (window.matchMedia('(min-width: 1920px)').matches) {
		$('.tab_lst').css({
			maxWidth : 'calc(100% - 42px)'
		});
		var $lst_len = $('.tab_lst li.on').length;
		if (10 <= $lst_len) {
			$('.tab_lst li.on').last().removeClass('on');
		}
		if (8 == $lst_len) {
			if ($('.tab_lst li.on').last().hasClass('open')) {
				$('.tab_lst li.on').first().prev().addClass('on');
			} else {
				$('.tab_lst li.on').last().next().addClass('on');
			}
		}
		lf_tabcheck();
	}
	if (window.matchMedia('(min-width: 1750px) and (max-width: 1919px)').matches) {
		$('.tab_lst').css({
			maxWidth : '1442px'
		});
		var $lst_len = $('.tab_lst li.on').length;
		if (9 <= $lst_len) {
			$('.tab_lst li.on').last().removeClass('on');
		}
		if (7 == $lst_len) {
			if ($('.tab_lst li.on').last().hasClass('open')) {
				$('.tab_lst li.on').first().prev().addClass('on');
			} else {
				$('.tab_lst li.on').last().next().addClass('on');
			}
		}
		lf_tabcheck();
	}
	if (window.matchMedia('(min-width: 1560px) and (max-width: 1750px)').matches) {
		$('.tab_lst').css({
			maxWidth : '1260px'
		});
		var $lst_len = $('.tab_lst li.on').length;
		if (8 <= $lst_len) {
			$('.tab_lst li.on').last().removeClass('on');
		}
		if (6 == $lst_len) {
			if ($('.tab_lst li.on').last().hasClass('open')) {
				$('.tab_lst li.on').first().prev().addClass('on');
			} else {
				$('.tab_lst li.on').last().next().addClass('on');
			}
		}
		lf_tabcheck();
	}
	if (window.matchMedia('(min-width: 1400px) and (max-width: 1560px)').matches) {
		$('.tab_lst').css({
			maxWidth : '1080px'
		});
		var $lst_len = $('.tab_lst li.on').length;
		if (7 <= $lst_len) {
			$('.tab_lst li.on').last().removeClass('on');
		}
		if (5 == $lst_len) {
			if ($('.tab_lst li.on').last().hasClass('open')) {
				$('.tab_lst li.on').first().prev().addClass('on');
			} else {
				$('.tab_lst li.on').last().next().addClass('on');
			}
		}
		lf_tabcheck();
	}
	if (window.matchMedia('(max-width: 1400px)').matches) {
		$('.tab_lst').css({
			maxWidth : '900px'
		});
		var $lst_len = $('.tab_lst li.on').length;
		if (6 <= $lst_len) {
			$('.tab_lst li.on').last().removeClass('on');
		}
		if (4 == $lst_len < 6) {
			if ($('.tab_lst li.on').hasClass('open')) {
				$('.tab_lst li.on').first().prev().addClass('on');
			} else {
				$('.tab_lst li.on').last().next().addClass('on');
			}
		}
		lf_tabcheck();
	}
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
