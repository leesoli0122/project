
var lvar_callbackFn = null;

$(function () {
	lvar_callbackFn = $('#dashboardPublicDialog').data('initParam');
	
	lf_serviceCall600106();
});

function lf_serviceCall600106(){
	var body = {};
	
	$("#dashboardPublicTable > tbody > tr:not(:first)").remove();
	
	cf_requestServer(_TR_DASHBOARD_CONF_PUBLIC_LIST,body,lf_serviceCall600106CallBack);
}



function lf_serviceCall600106CallBack(data){
	var publictDashboardData = data.body.publictDashboardData;
	
	if(publictDashboardData.length > 0){
		for(var i = 0; i < publictDashboardData.length; i++){
			var $rowHTML = $("#dashboardPublicTable > tbody > tr:eq(0)").clone();
			var dashboardData = publictDashboardData[i];
			$rowHTML.data('rowData', dashboardData);
			
			$rowHTML.click(function(){
				
				var $target = $('#dashboardPublicDialog .modal');
				
				$target.fadeOut(250);
				cf_removeDim();
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
				
				$('#dashboardPublicDialog').remove();
				
				lvar_callbackFn(dashboardData);
			});
			
			$rowHTML.find("td:eq(0)").text(publictDashboardData[i].dashboardName);
			$rowHTML.find("td:eq(1)").text(publictDashboardData[i].dashboardDesc);
			$rowHTML.find("td:eq(2)").text(publictDashboardData[i].dashboardType);
			$rowHTML.find("td:eq(3)").text(publictDashboardData[i].createUserid);
			
			$rowHTML.show();
			$("#dashboardPublicTable > tbody tr:last").after($rowHTML);
		}
		
		$("#dashboardPublicTable").dataTable({
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















