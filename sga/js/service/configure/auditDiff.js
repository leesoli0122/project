var auditlog;
$(function () {	
	var _audit = $(opener.document).find('#_audit').val();
	auditlog = JSON.parse(_audit)
	
	var message = "";
	$.each(auditlog.diffdata, function(idx, rowData) {
		if(rowData.old == null || rowData.new == null) return;
		if(rowData.type != 'update') return;
		
		var splitKey = rowData.key.split(' -> ');
		var fieldName = splitKey[splitKey.length - 1].replace("[", "");
		fieldName = fieldName.replace("]", "");
		
		message += (fieldName + " 필드의 기존 데이터인 [" + rowData.old + "] 을 [" + rowData.new + "] 로 변경하였습니다.\n")	
	});
	if(message.length > 0) message = "\n" + message;
	
	$('#type').html(_AUDIT_TYPE[(auditlog.type)]);
	$('#subject').val(auditlog.subject);
	$('#eventtime').val(auditlog.eventtime);
	$('#topic').val(_AUDIT_TOPIC[(auditlog.topic)]);
	$('#message').val(auditlog.message + message);
	
	$('#json-renderer1').jsonViewer(auditlog.auditdata, {collapsed: false, rootCollapsable: true, withQuotes: false, withLinks: true});
	//$('#json-renderer2').jsonViewer(auditlog.prevdata, {collapsed: false, rootCollapsable: true, withQuotes: false, withLinks: true});
	//$('#json-renderer3').jsonViewer(auditlog.diffdata, {collapsed: false, rootCollapsable: true, withQuotes: false, withLinks: true});
	
	$("#tab1").on("click", function() {
		replaceClass('tab1','','open');
		replaceClass('tab2','open','');
		replaceClass('tab3','open','');
		$('.tabMgmt_1').show();
		$('.tabMgmt_2').hide();
		$('.tabMgmt_3').hide();
		$('#json-renderer1').jsonViewer(auditlog.auditdata, {collapsed: false, rootCollapsable: true, withQuotes: false, withLinks: true});
	});
	$("#tab2").on("click", function() {
		replaceClass('tab1','open','');
		replaceClass('tab2','','open');
		replaceClass('tab3','open','');
		$('.tabMgmt_1').hide();
		$('.tabMgmt_2').show();
		$('.tabMgmt_3').hide();
		$('#json-renderer2').jsonViewer(auditlog.prevdata, {collapsed: false, rootCollapsable: true, withQuotes: false, withLinks: true});
	});
	$("#tab3").on("click", function() {
		replaceClass('tab1','open','');
		replaceClass('tab2','open','');
		replaceClass('tab3','','open');
		$('.tabMgmt_1').hide();
		$('.tabMgmt_2').hide();
		$('.tabMgmt_3').show();
		$('#json-renderer3').jsonViewer(auditlog.diffdata, {collapsed: false, rootCollapsable: true, withQuotes: false, withLinks: true});
	});
});

function replaceClass(id, oldClass, newClass) {
	var elem = $(`#${id}`);
	if (elem.hasClass(oldClass)) {
		elem.removeClass(oldClass);
	}
	elem.addClass(newClass);
}
