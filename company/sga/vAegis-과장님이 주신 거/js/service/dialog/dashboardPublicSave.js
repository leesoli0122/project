

$(function () {
	
	$('label[for="publicDashboardType_superAdmin"]').click(function(e){
		$('#publicDashboardType_superAdmin').prop("checked", !($('#publicDashboardType_superAdmin').is(':checked')));
	});
	
	$('label[for="publicDashboardType_admin"]').click(function(e){
		$('#publicDashboardType_admin').prop("checked", !($('#publicDashboardType_admin').is(':checked')));
	});
	
	$('label[for="publicDashboardType_operator"]').click(function(e){
		$('#publicDashboardType_operator').prop("checked", !($('#publicDashboardType_operator').is(':checked')));
	});
	
	$('label[for="publicDashboardType_viewer"]').click(function(e){
		$('#publicDashboardType_viewer').prop("checked", !($('#publicDashboardType_viewer').is(':checked')));
	});
});

