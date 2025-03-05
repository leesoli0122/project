var detailData;
var rowData;

$(function () {
	lf_detailFrame();
});

function lf_detailFrame() {
	var category = opener.document.getElementById("detailNum").value;
	var detailList = $('.detail_list_cluster');
	var detailInfo = "";

	detailList.find('> li').remove();

	switch (category) {
		case 'eventContainerImageControl':
			detailInfo = (
				"<li><dl><dt>Result</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Cluster</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Namespace</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Kind</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Operation</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Registry</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Request User</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Image Tag</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Digest</dt><dd></dd></dl></li>" +
				"<li><dl><dt>Message</dt><dd></dd></dl></li>"
			); break;

		default:
			detailInfo = (
				""
			); break;
	}
	
	detailList.append(detailInfo);

	detailData = opener.document.getElementById("detailData").value;
	rowData = JSON.parse(detailData);
	lf_eventDetail(category);
}

function lf_eventDetail(category) {
	$("#deviceNm1").val(rowData["cluster"]); // 상세 정보 
	$("#eventDtm1").val(rowData["created_at​"]); // 탐지 시간

	var bodyList = $('ul.detail_list_cluster > li > dl > dd');
	if (category == 'eventContainerImageControl') {
		lf_setData(bodyList[0], rowData["result"]);
		lf_setData(bodyList[1], rowData["cluster"]);
		lf_setData(bodyList[2], rowData["namespace"]);
		lf_setData(bodyList[3], rowData["kind"]);
		lf_setData(bodyList[4], rowData["operation"]);
		lf_setData(bodyList[5], rowData["registry"]);
		lf_setData(bodyList[6], rowData["request_user"]);
		lf_setData(bodyList[7], rowData["image_tag"]);
		lf_setData(bodyList[8], rowData["digest"]);
		lf_setData(bodyList[9], rowData["message"]);
	}

}

function lf_setData(thiz, data) {
	$(thiz).text(data);
	$(thiz).attr('title', data);
}