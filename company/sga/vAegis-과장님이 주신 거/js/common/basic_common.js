/***************************************************************
 * 업무 그룹명 : BLAS
 * 서브 업무명 : WEB ADMIN
 * 설       명 : BLAS WEB ADMIN 기본 함수
 * 작   성  자 : KIM IL YUN
 * 작   성  일 : 2012.06. 25
 * Copyright ⓒ DSNTECH All Right Reserved
 * ======================================
 * 변경자/변경일 : 
 * 변경사유/내역 : 
 * ======================================
 ***************************************************************/

/*******************************************************************************
 * console에 로그를 남기는 함수 - _LOGFLAG 설정에 따라 로그 여부 결정
 * 
 * @param msg :
 *            message or log name
 * @param para :
 *            null or message
 * @return console.log
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
if (window.console == undefined) {
	console = {
		log : function() {
		}
	};
}
function log(msg, para) {
	if (_LOGFLAG) {
		if (para)
			if (typeof para == "object")
				para = JSON.stringify(para);
			else if (typeof msg == "object")
				msg = JSON.stringify(msg);
		if ($.browser && $.browser.msie == true) {
			if (para)
				console.log(msg + ' >> ' + para);
			else
				console.log(msg);
		} else {
			if (para)
				console.debug(msg + ' >> ' + para);
			else
				console.debug(msg);
		}
	}
}

/*-----------------------------------------------------------------------------
 @brief     JSON의 데이타에서 특정 property 의 값을 구함
 @para	   
 - data : JSON [{},{},{}]
 - name : property
 @return    
 - value
 @date  2012. 6 .			@udate  2012.
 ------------------------------------------------------------------------------*/
/*******************************************************************************
 * JSON의 데이타에서 특정 property 의 값을 구함
 * 
 * @param data :
 *            JSON [{},{},{}]
 * @param name :
 *            property
 * @return property의 data
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function getJsonValue(data, name) {
	var result = '';
	for (property in data) {
		if (property == name)
			result = data[property];
	}
	return result;
}

/*******************************************************************************
 * 화면 출력용 현제 시간을 구함
 * 
 * @return date String
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function get_now() {
	var today = new Date();
	var msg = today.format("yyyy-MM-dd HH:mm:ss");
	return (msg);
}

/*******************************************************************************
 * Date 관련처리
 * 
 * @return date String
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
Date.prototype.format = function(f) {
	if (!this.valueOf())
		return " ";

	var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
		case "yyyy":
			return d.getFullYear();
		case "yy":
			return (d.getFullYear() % 1000).zf(2);
		case "MM":
			return (d.getMonth() + 1).zf(2);
		case "dd":
			return d.getDate().zf(2);
		case "E":
			return weekName[d.getDay()];
		case "HH":
			return d.getHours().zf(2);
		case "hh":
			return ((h = d.getHours() % 12) ? h : 12).zf(2);
		case "mm":
			return d.getMinutes().zf(2);
		case "ss":
			return d.getSeconds().zf(2);
		case "a/p":
			return d.getHours() < 12 ? "오전" : "오후";
		default:
			return $1;
		}
	});
};

Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() - days);
	return dat;
};

// 2014.03.31, SBKim : Svc에서 추가
Date.prototype.PlusDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
};

// 2014.03.31, SBKim : Svc에서 추가
Date.prototype.PlusMonths = function(months) {
	var dat = new Date(this.valueOf());
	dat.setMonth(dat.getMonth() + months);
	return dat;
};

Date.prototype.PlusHours = function(hours) {
	var rsHours = this.getHours() + hours;
	return this.setHours(rsHours);
};

Date.prototype.PlusMins = function(mins) {
	var rsMins = this.getMinutes() + mins;
	return this.setMinutes(rsMins);
};

/*******************************************************************************
 * String 관련처리
 * 
 * @return date String
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
String.prototype.string = function(len) {
	var s = '', i = 0;
	while (i++ < len) {
		s += this;
	}
	return s;
};
String.prototype.zf = function(len) {
	return "0".string(len - this.length) + this;
};

// replaceAll
String.prototype.replaceAll = function(str1, str2) {
	var temp_str = $.trim(this);
	temp_str = temp_str.replace(eval("/" + str1 + "/gi"), str2);
	return temp_str;
}

Number.prototype.zf = function(len) {
	return this.toString().zf(len);
};

/*******************************************************************************
 * Array 관련처리
 * 
 * @return date Array
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
Array.prototype.remove = function(idx) {
	return (idx < 0 || idx > this.length) ? this : this.slice(0, idx).concat(
			this.slice(idx + 1, this.length));
};

Array.prototype.unique = function() {
	var newArray = [], len = this.length;
	label: for (var i = 0; i < len; i++) {
		for (var j = 0; j < newArray.length; j++)
			if (newArray[j] == this[i])
				continue label;
		newArray[newArray.length] = this[i];
	}
	return newArray;
}

/*******************************************************************************
 * Array 문자열의 바이트수 리턴
 * 
 * @return Number
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
String.prototype.byteLength = function() {
	var l = 0;

	for (var idx = 0; idx < this.length; idx++) {
		var c = escape(this.charAt(idx));

		if (c.length == 1)
			l++;
		else if (c.indexOf("%u") != -1)
			l += 2;
		else if (c.indexOf("%") != -1)
			l += c.length / 3;
	}

	return l;
};

/*******************************************************************************
 * IE버젼체크
 * 
 * @return
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function getIE_Ver() {
	if (navigator.appName.match(/Explorer/i)) {
		return navigator.appVersion.match(/MSIE \d+.\d+/)[0].split(" ")[1];
	} else
		return 0;
}

/*******************************************************************************
 * date Picker 설정 함수
 * 
 * @return
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function datePickerUI() {
	var dates = $("#from, #to")
			.datepicker(
					{
						defaultDate : "+1w",
						changeMonth : true,
						changeYear : false,
						dateFormat : "yy-mm-dd",
						/*
						 * showOn: "button", buttonImage:
						 * "/css/images/calendar.gif", buttonImageOnly: true,
						 * buttonText : "Open Calendar", showButtonPanel : true,
						 */
						showAnim : "drop",
						showOptions : {
							direction : "down"
						},
						dayNamesMin : [ "일", "월", "화", "수", "목", "금", "토" ],
						monthNamesShort : [ " 1월", " 2월", " 3월", " 4월", " 5월",
								" 6월", " 7월", " 8월", " 9월", "10월", "11월", "12월" ],
						onSelect : function(selectedDate) {
							var option = this.id == "from" ? "minDate"
									: "maxDate", instance = $(this).data(
									"datepicker"), date = $.datepicker
									.parseDate(
											instance.settings.dateFormat
													|| $.datepicker._defaults.dateFormat,
											selectedDate, instance.settings);
							dates.not(this).datepicker("option", option, date);
						}
					});

	var today = new Date();
	$("#from").val(today.format("yyyy-MM-dd"));
	$("#to").val(today.format("yyyy-MM-dd"));
}

/*******************************************************************************
 * byte크기 가져오기
 * 
 * @return bytes크기(int)
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function getBytes(str) {
	var i, tmp = escape(str);
	var bytes = 0;
	for (i = 0; i < tmp.length; i++) {
		if (tmp.charAt(i) == "%") {
			if (tmp.charAt(i + 1) == "u") {
				bytes += 2;
				i += 5;
			} else {
				bytes += 1;
				i += 2;
			}
		} else {
			bytes += 1;
		}
	}

	return bytes;
}

/*******************************************************************************
 * Base64 인코딩 , 디코딩
 * 
 * @return 인코딩, 디코딩 String
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1)
					+ this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3)
					+ this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
};

/*******************************************************************************
 * ip스트링 long형변환
 * 
 * @return long값
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function ip2long(IP) {
	// http://kevin.vanzonneveld.net
	// + original by: Waldo Malqui Silva
	// + improved by: Victor
	// + revised by: fearphage (http://http/my.opera.com/fearphage/)
	// + revised by: Theriault
	// * example 1: ip2long('192.0.34.166');
	// * returns 1: 3221234342
	// * example 2: ip2long('0.0xABCDEF');
	// * returns 2: 11259375
	// * example 3: ip2long('255.255.255.256');
	// * returns 3: false
	var i = 0;
	// PHP allows decimal, octal, and hexadecimal IP components.
	// PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.
	IP = IP
			.match(/^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i); // Verify
																																									// IP
																																									// format.
	if (!IP) {
		return false; // Invalid format.
	}
	// Reuse IP variable for component counter.
	IP[0] = 0;
	for (i = 1; i < 5; i += 1) {
		IP[0] += !!((IP[i] || '').length);
		IP[i] = parseInt(IP[i]) || 0;
	}
	// Continue to use IP for overflow values.
	// PHP does not allow any component to overflow.
	IP.push(256, 256, 256, 256);
	// Recalculate overflow of last component supplied to make up for missing
	// components.
	IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
	if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) {
		return false;
	}
	return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536)
			+ IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
}

/*******************************************************************************
 * long형 ip변환
 * 
 * @return ip String
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function long2ip(ip) {
	if (!isFinite(ip))
		return false;

	return [ ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF ]
			.join('.');
}

/*******************************************************************************
 * 숫자 콤마 자리수만큼 표시하기
 * 
 * @param v1 :
 *            숫자
 * @param v2 :
 *            콤마찍을 자리수
 * @return 콤마를 찍은 스트링
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function formatnumber(v1, v2) { // 숫자와 콤마를 찍을자리수를 매개변수로 받음
	var str = new Array(); // 콤마스트링을 조합할 배열
	v1 = String(v1); // 숫자를 스트링으로 변환
	for (var i = 1; i <= v1.length; i++) { // 숫자의 길이만큼 반복
		if (i % v2)
			str[v1.length - i] = v1.charAt(v1.length - i); // 자리수가 아니면 숫자만삽입
		else
			str[v1.length - i] = ',' + v1.charAt(v1.length - i); // 자리수 이면
																	// 콤마까지 삽입
	}
	return str.join('').replace(/^,/, ''); // 스트링을 조합하여 반환
}

/*******************************************************************************
 * 숫자 점 자리수만큼 표시하기
 * 
 * @param v1 :
 *            숫자
 * @param v2 :
 *            점찍을 자리수
 * @return 콤마를 찍은 스트링
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function formatnumber2(v1, v2) { // 숫자와 콤마를 찍을자리수를 매개변수로 받음
	var str = new Array(); // 콤마스트링을 조합할 배열
	v1 = String(v1); // 숫자를 스트링으로 변환
	for (var i = 1; i <= v1.length; i++) { // 숫자의 길이만큼 반복
		if (i % v2)
			str[v1.length - i] = v1.charAt(v1.length - i); // 자리수가 아니면 숫자만삽입
		else
			str[v1.length - i] = '.' + v1.charAt(v1.length - i); // 자리수 이면
																	// 콤마까지 삽입
	}
	return str.join('').replace(/^,/, ''); // 스트링을 조합하여 반환
}

/*******************************************************************************
 * 유효성 체크를 위한 패턴 정의
 ******************************************************************************/
var patterns = new Object();
var mesages = new Object();
// match ip address
patterns.ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
mesages.ip = "ip타입만 입력가능합니다.";

// match email address
patterns.email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
mesages.email = "ip타입만 입력가능합니다.";

// match datetime 2008-01-31?but not 2008-13-00
patterns.date = /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2]\d|3[0-1])$/;
mesages.date = "날짜형식(YYYY-MM-DD)만 입력가능합니다.";

// match number
patterns.num = /^[-]?\d*\.?\d*$/;
mesages.num = "숫자만 입력가능합니다.\n\n다시 입력하십시요.";

// match number and alphabet
patterns.numEng = /[(0-9)(a-z)(A-Z))]/;
mesages.numEng = "영문/숫자만 입력가능합니다.\n\n다시 입력하십시요.";

// match korean
patterns.kor = /[(ㄱ-힣)]/;
mesages.kor = "한글만 입력가능합니다.\n\n다시 입력하십시요.";

// match number, alphabet and korean
patterns.numEngKor = /[(ㄱ-힣)(a-z)(A-Z)(0-9)]/;
mesages.numEngKor = "한글,영문,숫자만 입력가능합니다.\n\n다시 입력하십시요.";

// match time format 00:15:39?but not 24:60:00
patterns.time = new RegExp("^([0-1]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$");
mesages.time = "시간을 hh:mm:ss 와 같은 형식으로 입력하세요.";

/*******************************************************************************
 * 유효성체크
 * 
 * @param obj -
 *            object
 * @param pat -
 *            패턴 (regexp validation for date, time, ip,number, alphabet,korean)<br>
 *            ex : verify($("#obj"),"ip")
 * @returns
 ******************************************************************************/
function verify(obj, pat) {
	thePat = patterns[pat];
	theMes = mesages[pat];
	if (obj.val().length == 0) {
		return allowNull(obj);
	}
	if (thePat.test(obj.val())) {
		return true;
	} else {
		cf_alert('경고', theMes);
		obj.val("");
		obj.focus();
		return false;
	}
}

function verifyData(val, pat) {
	thePat = patterns[pat];
	theMes = mesages[pat];
	if (thePat.test(val)) {
		return true;
	} else {
		return false;
	}
}

// 2014.03.31, SBKim : Svc에서 추가
// allowNull, checkNull, checkPasswd, getSelectValues, setSelectValues,
// serializeObject
/*******************************************************************************
 * null값 허용여부
 * 
 * @param obj
 * @returns true or false
 ******************************************************************************/
function allowNull(obj) {
	if (obj.attr("required") != "required") {
		return true;
	} else {
		alert(obj.attr("name") + "은(는) 반드시 입력해야 합니다");
		obj.focus();
		return false;
	}
}

/*******************************************************************************
 * null 체크
 * 
 * @param obj
 * @returns
 ******************************************************************************/
function checkNull(obj) {
	if (obj.val().length == 0) {
		return allowNull(obj);
	} else {
		return true;
	}
}

/*******************************************************************************
 * password 체크(숫자, 영문자, 특문의 조합으로 8 ~ 20자)
 * 
 * @param obj
 * @returns
 ******************************************************************************/
function checkPasswd(obj) {
	var val = $(obj).val();

	var chk_num = val.search(/[0-9]/g);
	var chk_eng = val.search(/[a-z]/ig);
	var chk_i = val.search(/[!@#$%^&*?_~]/);

	if (chk_num < 0 || chk_eng < 0 || chk_i < 0) {
		alert("비밀번호는 숫자, 영문자, 특문의 조합으로 6 ~ 16자 이내이어야 합니다");
		obj.focus();
		return false;
	}

	if ((val.length < 6) || (val.length > 16)) {
		alert("비밀번호는 숫자, 영문자, 특문의 조합으로 6 ~ 16자 이내이어야 합니다");
		obj.focus();
		return false;
	}

	return true;
}

/*******************************************************************************
 * select의 id와 val을 json형태로 저장
 * 
 * @returns json데이터
 * @param parent
 *            상위의 div id
 * @return
 ******************************************************************************/
function getSelectValues(parent) {
	var obj = {};
	$("#" + parent + " select").each(function() {
		if (obj[$(this).attr("id")]) {
			if (!obj[$(this).attr("id")].push) {
				obj[$(this).attr("id")] = [ obj[$(this).attr("id")] ];
			}
			obj[$(this).attr("id")].push($(this).val() || '');
		} else {
			obj[$(this).attr("id")] = $(this).val() || '';
		}
	});
	return obj;
}

/*******************************************************************************
 * json데이터에서 select의 값을 set
 * 
 * @param obj
 *            json
 * @param parent
 *            상위의 div id
 * @return
 ******************************************************************************/
function setSelectValues(obj, parent) {
	$("#" + parent + " select").each(function() {
		$(this).val(obj[$(this).attr("id")]);
	});
}
/*******************************************************************************
 * arr --> json
 * 
 * @param arr
 * @returns json데이터
 * @param
 * @return
 ******************************************************************************/
function serializeObject(arr) {
	var obj = {};
	$.each(arr, function() {
		if (obj[this.name]) {
			if (!obj[this.name].push) {
				obj[this.name] = [ obj[this.name] ];
			}
			obj[this.name].push(this.value || '');
		} else {
			obj[this.name] = this.value || '';
		}
	});
	return obj;
}

/*******************************************************************************
 * html 태그문자 변경
 * 
 * @param 변경할
 *            문자
 * @return 변경된 문자
 * @author KIM IL YUN
 * @date 2014. 3. 6
 * @update
 ******************************************************************************/
function toHtmlTag(str) {
	return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
			/>/g, "&gt;").replace(/”/g, "&quot;");
}

/*******************************************************************************
 * ip스트링 long형변환 http://kevin.vanzonneveld.net + original by: Waldo Malqui Silva +
 * improved by: Victor + revised by: fearphage
 * (http://http/my.opera.com/fearphage/) + revised by: Theriault example 1:
 * ip2long('192.0.34.166'); returns 1: 3221234342 example 2:
 * ip2long('0.0xABCDEF'); returns 2: 11259375 example 3:
 * ip2long('255.255.255.256'); returns 3: false
 * 
 * @return long값
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function ip2long(IP) {

	var i = 0;
	// PHP allows decimal, octal, and hexadecimal IP components.
	// PHP allows between 1 (e.g. 127) to 4 (e.g 127.0.0.1) components.
	IP = IP
			.match(/^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i); // Verify
																																									// IP
																																									// format.
	if (!IP) {
		return false; // Invalid format.
	}
	// Reuse IP variable for component counter.
	IP[0] = 0;
	for (i = 1; i < 5; i += 1) {
		IP[0] += !!((IP[i] || '').length);
		IP[i] = parseInt(IP[i]) || 0;
	}
	// Continue to use IP for overflow values.
	// PHP does not allow any component to overflow.
	IP.push(256, 256, 256, 256);
	// Recalculate overflow of last component supplied to make up for missing
	// components.
	IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
	if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) {
		return false;
	}
	return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536)
			+ IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
}

/*******************************************************************************
 * long형 ip변환
 * 
 * @return ip String
 * @author KIM IL YUN
 * @date 2012. 6. 25
 * @update
 ******************************************************************************/
function long2ip(ip) {
	if (!isFinite(ip))
		return false;

	return [ ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF ]
			.join('.');
}
/*******************************************************************************
 * 정규표현식에서 사용되는 메타문자를 이스케이프해서 반환한다. + - && || ! ( ) { } [ ] ^ " ~ * ? : \
 * 
 * @return ip String
 * @author soullovers
 * @date 2013. 8. 30
 * @update
 ******************************************************************************/
function escapeRegExp(string) {
	return string.replace(/((\|\|)|(&&)|[-~*+?^!:&{}()\"\[\]\\])/g, "\\$1");
}
function stringEscapeRegExp(string) {
	return string.replace(/( )/g, "\\$1");
}
function textEscapeRegExp(string) {
	return string.replace(/( )/g, "+");
}

/*******************************************************************************
 * 밀리세컨드 -> 시, 분, 초로 변환하기
 * 
 * @param millis :
 *            변환할 밀리세컨드 값
 * @param rnd :
 *            소수점 보여질 자릿수(버림)
 * @param mod :
 *            h-시간, m-분, s-초
 * @return 콤마를 찍은 스트링
 * @author SBKim
 * @date 2014. 04. 18
 * @update
 ******************************************************************************/
function MillisToTime(millis, rnd, mod) {
	var returnVal = null;
	mod = mod.replace(' ', '');
	if (mod == null || mod == '')
		mod = "S";

	if (mod.toUpperCase() == "H") {
		returnVal = (millis / (1000 * 60 * 60)) % 24;
	} else if (mod.toUpperCase() == "M") {
		returnVal = (millis / (1000 * 60)) % 60;
	} else if (mod.toUpperCase() == "S")
		returnVal = (millis / 1000);

	returnVal = returnVal.toFixed(parseInt(rnd));

	return returnVal;
}

function email_check(email) {

	var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	return (email != '' && email != 'undefined' && regex.test(email));

}

Date.prototype.format = function(f) {
	if (!this.valueOf())
		return " ";

	var weekName = [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일" ];
	var d = this;

	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
		case "yyyy":
			return d.getFullYear();
		case "yy":
			return (d.getFullYear() % 1000).zf(2);
		case "MM":
			return (d.getMonth() + 1).zf(2);
		case "dd":
			return d.getDate().zf(2);
		case "E":
			return weekName[d.getDay()];
		case "HH":
			return d.getHours().zf(2);
		case "hh":
			return ((h = d.getHours() % 12) ? h : 12).zf(2);
		case "mm":
			return d.getMinutes().zf(2);
		case "ss":
			return d.getSeconds().zf(2);
		case "a/p":
			return d.getHours() < 12 ? "오전" : "오후";
		default:
			return $1;
		}
	});
};

$.fn.spin = function(opts) {
	this.each(function() {
	  var $this = $(this),
		  data = $this.data();

	  if (data.spinner) {
		data.spinner.stop();
		delete data.spinner;
	  }
	  if (opts !== false) {
		data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
	  }
	});
	return this;
};

function isValidDate(dateString)
{
    // First check for the pattern
    var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

    if(!regex_date.test(dateString))
    {
        return false;
    }

    // Parse the date parts to integers
    var parts   = dateString.split("-");
    var day     = parseInt(parts[2], 10);
    var month   = parseInt(parts[1], 10);
    var year    = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
    {
        return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    {
        monthLength[1] = 29;
    }

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

//전체화면 설정
function openFullScreenMode(docV) {
	if (docV.requestFullscreen)
		docV.requestFullscreen();
	else if (docV.webkitRequestFullscreen) // Chrome, Safari (webkit)
		docV.webkitRequestFullscreen();
	else if (docV.mozRequestFullScreen) // Firefox
		docV.mozRequestFullScreen();
	else if (docV.msRequestFullscreen) // IE or Edge
		docV.msRequestFullscreen();
}

// 전체화면 해제
function closeFullScreenMode(docV) {
	if (docV.exitFullscreen)
		docV.exitFullscreen();
	else if (docV.webkitExitFullscreen) // Chrome, Safari (webkit)
		docV.webkitExitFullscreen();
	else if (docV.mozCancelFullScreen) // Firefox
		docV.mozCancelFullScreen();
	else if (docV.msExitFullscreen) // IE or Edge
		docV.msExitFullscreen();
}

function preventUnloadOn(){
//	$(window).on('beforeunload', function(){
//		//do something
//		return "Any changes will be lost";
//	});
}

function preventUnloadOff(){
	$(window).off('beforeunload');
}

function isObject(obj) {
	return (typeof obj === "object" && obj !== null) || typeof obj === "function";
}

// JSON 데이터 뎁스에 상관없이 1뎁스로 데이터 저장
function getJsonAllData(obj, returnObj){
	
	if((Object.keys(obj)).length > 0){
		for(var key in obj){
			
			if(obj[key] != null){
				if(isObject(obj[key])){
					getJsonAllData(obj[key], returnObj);
				}
				else if(Array.isArray(obj[key])){
					returnObj[key] = obj[key].join(', ');
				}
				else{
					returnObj[key] = obj[key];
				}
			}
		}
	}
	
}
