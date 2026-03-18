
var lvar_callbackFn = null;

$(function () {
	lvar_callbackFn = $('#dashboardAdminDialog').data('initParam');
	
	lf_serviceCall600107();
});

function lf_serviceCall600107(){
	var body = {};
	
	$("#dashboardAdminTable > tbody > tr:not(:first)").remove();
	
	cf_requestServer(_TR_DASHBOARD_CONF_ADMIN_PUBLIC_LIST,body,lf_serviceCall600107CallBack);
}

function lf_dashboardAdminClkTable(thiz){
	var data = $(thiz).data('rowData');
	var $target = $('#dashboardAdminDialog .modal');
	
	$target.fadeOut(250);
	cf_removeDim();
	$(thiz).off('click');
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
	
	$('#dashboardAdminDialog').remove();
	
	lvar_callbackFn(data);
}

function lf_serviceCall600107CallBack(data){
	var admintDashboardData = data.body.dashboardData;
	
	if(admintDashboardData.length > 0){
		for(var i = 0; i < admintDashboardData.length; i++){
			var $rowHTML = $("#dashboardAdminTable > tbody > tr:eq(0)").clone();
			$rowHTML.data('rowData', admintDashboardData[i]);
//			$rowHTML.click(function(){
//				
//				var $target = $('#dashboardAdminDialog .modal');
//				
//				$target.fadeOut(250);
//				cf_removeDim();
//				$(this).off('click');
//				$target.removeClass('open');
//				var isVisible = $target.is(':visible');
//				var modalLength = $('.modal:visible').length;
//
//				if (isVisible) {
//					if (modalLength > 1) {
//						$target.fadeOut(250);
//					} else {
//						$('.dim').fadeOut(250);
//					}
//				}
//				
//				$('#dashboardAdminDialog').remove();
//				
//				debugger;
//				lvar_callbackFn($(this).data('rowData'));
//			});
			
			$rowHTML.find("td:eq(0)").text(admintDashboardData[i].dashboardName);
			$rowHTML.find("td:eq(1)").text(admintDashboardData[i].dashboardDesc);
			$rowHTML.find("td:eq(2)").text(admintDashboardData[i].dashboardType);
			$rowHTML.find("td:eq(3)").text(admintDashboardData[i].createUserid);
			
			$rowHTML.show();
			$("#dashboardAdminTable > tbody tr:last").after($rowHTML);
		}
		$("#dashboardAdminTable > tbody > tr:eq(0)").remove();
		
		$("#dashboardAdminTable").dataTable({
			"autoWidth" : false,
			"paging" : true,
			"pagingType" : "full_numbers",
			"ordering" : false,
			"info" : true,
			"filter" : false,
			"lengthChange" : true,
			"language" : {
				"info" : "<span>_PAGE_</span> - _PAGES_ / _MAX_",
			},
			"dom" : 'rt<"bottom"fip><"clear">',
		});
		
	}
	
}















