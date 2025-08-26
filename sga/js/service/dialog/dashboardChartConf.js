
var lvar_initParam = {};

$(function () {
	lvar_initParam = $('#dashboardChartConfigurationDialog').data('initParam');
	
	if(lvar_initParam['term']){
		$('#chartConfTerm').parent().show();
		$('#chartConfTerm').val(lvar_initParam['term']);
	}
	else{
		$('#chartConfTerm').parent().hide()
	}

	$('#chartConfInterval').val(lvar_initParam['interval']);
	
});
