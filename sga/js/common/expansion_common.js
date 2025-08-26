/***************************************************************
* 업무 그룹명 : 
* 서브 업무명 : 
* 설       명 : caegis 웹 추가 common js, 함수명 ccf_: Caegis Common Funtion 
* 작   성  자 :
* 작   성  일 :
* Copyright ⓒ 
* ======================================
* 변경자/변경일 : 
* 변경사유/내역 :  
* ======================================
***************************************************************/
$(document).ready(function() {
	
});
/**
 * @description : YYYY-MM-DD 날짜 포메팅
 * @param source : date 타입 
 * @param time : default: null, 'H':시간 단위 표시, 'M': 분단위 표시, 'S': 초단위 표시
 * @description : time : 'H' 설정시 YYYY-MM-DD HH24:00:00
 * @param delimiter : 구분자, default: '-'
 * @return : default: YYYY-MM-DD
 */
function ccf_toStringByDateFormatting(source, time, delimiter = '-') {
    function leftPad(value) {
        if (value >= 10) {
            return value;
        }
        return `0${value}`;
    }
    var year = source.getFullYear();
    var month = leftPad(source.getMonth() + 1);
    var day = leftPad(source.getDate());
    var timeDisplay = "";
    if(time){
        timeDisplay = " "
        if(time==="H"){
            timeDisplay += leftPad(source.getHours())+":00:00";
        }else if(time==="M"){
            timeDisplay += leftPad(source.getHours())+":"+leftPad(source.getMinutes())+":00";
        }else if(time==="S"){
            timeDisplay += leftPad(source.getHours())+":"+source.getMinutes()+":"+leftPad(source.getSeconds());
        }     
    }
    return [year, month, day].join(delimiter)+timeDisplay;
}

/**
 * @description : 깊은 복사
 * @param origin : 원본
 * @return : 주소값이 아닌 값자체를 복사한 값
 */
function ccf_isCopyObj(origin) {
	let copy = {};

	for (let key in origin) {
		if (typeof origin[key] === 'object') {
			copy[key] = ccf_isCopyObj(obj[key]);
		} else {
			copy[key] = origin[key];
		}
	}
	return copy;
}

/**
 * @param : type(RUNTIME or BUILD or BUILD, RUNTIME) 
 * @description : 런타임, 빌드타임 아이콘 반환 함수.
 * @return : <span class =''></sapn> icon
 */
function ccf_displayRunAndBuildTimeIcon(type){
	var type_first = 'RUNTIME';
	var type_second = 'BUILD';
	
	if(type===type_first)return "<span class='ico runtime'>Runtime</span>";
	else if(type===type_second)return "<span class='ico build'>Buildtime</span>";
	else return "<span class='ico runtime'>Runtime</span><span style='margin-left: 10px;' class='ico build'>Buildtime</span>";
}

/**
 * @param : type(CRITICAL or HIGH or MEDIUM or LOW or IGNORE) 
 * @description : Severity에 백그라운드 색상이 적용된 span 반환
 * @return : <span class =''></sapn> icon
 */
function ccf_displaySeverityBCSetting(type){	
	return '<span class="severity bc_'+type.toLowerCase()+'">'+type+'</span>';
}

/**
 * @param : timeStemp(unixTime)
 * @description : timeStemp를 yyyy-MM-dd HH:mm:ss로 출력
 * @return : String yyyy-MM-dd HH:mm:ss
 */
function ccf_timeStempToDate(timeStemp) {
		let dateTimeStempType = new Date(timeStemp); 
        let month = dateTimeStempType.getMonth() + 1;
        let day = dateTimeStempType.getDate();
        let hour = dateTimeStempType.getHours();
        let minute = dateTimeStempType.getMinutes();
        let second = dateTimeStempType.getSeconds();

        month = month >= 10 ? month : '0' + month;
        day = day >= 10 ? day : '0' + day;
        hour = hour >= 10 ? hour : '0' + hour;
        minute = minute >= 10 ? minute : '0' + minute;
        second = second >= 10 ? second : '0' + second;
		
        return dateTimeStempType.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

