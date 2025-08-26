 
var diff = 0;

$(function () {
	lf_loadModalDataTableUi();
});

function lf_setModalData(data) {
	console.log(data);	
}

var timeId;
var timeSec;
function lf_initTime(difftime) {
	//시간이 있는 경우
	//기존 인터벌을 제거한다
	//새로운 인터벌을 걸어준다.
	//시간이 없는경우	
	clearTimeout(timeId);
	if(difftime < 0) return;
	timeSec = difftime;

	var timeFun = function() {
		timeSec++;
		var hour = Math.floor(timeSec/60, 0);
		var sec = timeSec%60;
		if(hour < 10) hour = "0" + hour;
		if(sec < 10) sec = "0" + sec;
		$('.scan_progress .modal_cont').eq(0).find('li').eq(1).text(hour + ":" + sec);
	};

	timeId = setInterval(timeFun, 1000); 		
}

function lf_loadModalDataTableUi() {
    $('a.modalLoad').on('click',function(e){
        var $self = $(this);
        var $thisrel = $self.attr('rel');
        var $target = $('#'+ $thisrel);
        $target.find(".close").on('click',function(){
			//console.log("close click");
        });
        $target.parents('html body').find(".dim").click(function () {
            //console.log("html body dim click");
        });
        
        e.stopPropagation();
    });
}
