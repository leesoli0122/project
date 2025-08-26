var lvar_eventFieldName = {
	'event_type' : '이벤트 타입',
	'timestamp' : '발생 시간',
	'src_ip' : '출발지 IP',
	'src_port' : '출발지 포트',
	'dest_ip' : '목적지 IP',
	'dest_port' : '목적지 포트',
	'proto' : '프로토콜',
	'app_proto' : '애플리케이션 프로토콜',
	'flow_id' : '플로우 ID',
	'in_iface' : '인터페이스',
	'app_proto_tc' : '애플레케이션 정보',
	'tx_id' : 'TX ID',
	'icmp_code' : 'ICMP 코드',
	'response_icmp_code' : 'ICMP 응답 코드',
	'icmp_type' : 'ICMP 타입',
	'response_icmp_type' : 'ICMP 응답 타입',
	'flow' : '플로우',
	'reason' : '사유',
	'pkts_toclient' : '클라이언트에게 패킷',
	'pkts_toserver' : '서버에게 간 패킷',
	'alerted' : 'Alert 여부',
	'start' : '플로우 시작 시간',
	'end' : '플로우 종료 시간',
	'bytes_toclient' : '클라이언트에게 Bytes',
	'bytes_toserver' : '서버에게 간 Bytes',
	'state' : '플로우 상태',
	'age' : '유지기간',
	'stats' : '상태 정보',
	'defrag' : '',
	'tcp' : 'TCP',
	'ftp' : 'FTP',
	'app_layer' : '애플리케이션 정보',
	'dns' : 'DNS',
	'capture' : '캡쳐',
	'detect' : '탐지 정보',
	'http' : 'HTTP',
	'decoder' : '디코더',
	'flow_mgr' : '플로우 매니져',
	'flow' : '플로우',
	'uptime' : '업타임',
	'fileinfo' : '파일 정보',
	'filename' : '파일명',
	'size' : '파일크기',
	'stored' : null,
	'state' : '파일상태',
	'tx_id' : 'TX_ID',
	'gaps' : null,
	'alert' : 'Alert',
	'signature_id' : '탐지 룰 ID',
	'signature' : '탐지명',
	'action' : '액션',
	'category' : '탐지 룰 분류',
	'severity' : '위험도',
	'rev' : '리비전',
	'metadata' : '메타데이터',
	'former_category' : '탐지 룰 대분류',
	'created_at' : '탐지 룰 만들어진 시간',
	'updated_at' : '탐지 룰 업데이트 시간',
	'http' : 'HTTP',
	'hostname' : '호스트 이름',
	'url' : 'URL',
	'protocol' : '프로토콜',
	'http_user_agent' : '사용자 에이젼트',
	'http_method' : '메소드',
	'http_content_type' : '컨텐트 타입',
	'http_refer' : '리피러',
	'length' : '길이',
	'status' : '응답 상태',
	'tls' : 'TLS',
	'serial' : '시리얼',
	'notbefore' : '유효시간 시작',
	'subject' : 'SUBJECT',
	'issuerdn' : '도메인정보',
	'notafter' : '유효시간 종료',
	'fingerprint' : '인증서 지문',
	'version' : '버젼',
	'ja3' : 'JA3',
	'sni' : 'SNI',
	'tcp' : 'TCP',
	'rst' : 'RST',
	'tcp_flags_ts' : 'TCP Flags TS',
	'tcp_flags_tc' : 'TCP Flags TC',
	'tcp_flags' : 'TCP Flags',
	'psh' : 'PSH',
	'ack' : 'ACK',
	'syn' : 'SYN',
	'fingerprint' : 'TCP 지문',
	'state' : '상태',
	'dns' : 'DNS',
	'qr' : null,
	'grouped' : null,
	'flags' : null,
	'answers' : null,
	'rrname' : null,
	'rcode' : null,
	'type' : null,
	'tx_id' : null,
	'version' : '버젼',
	'authorities' : null,
	'ra' : null,
	'rd' : null,
	'id' : null,
	'rrtype' : null,
	'ssh' : 'SSH',
	'server' : '서버',
	'client' : '클라이언트',
	'metadata' : '메타데이터',
	'flowints' : null,
	'flowbits' : null,
}

SolipsEvent = function(_data) {
	
	this.data = _data;
	this.eve = _data['eve'];
	this.event_type = _data['event_type'];
	this.event = null;
	
	try {		
		this.event = _data['eve'][this.event_type];
		console.log('created SolipsEvent : ');
		//console.log(_data);
	} catch(err) {
		console.log('create failed SolipsEvent : ');
		console.log(_data);
		console.error(err);
	} 
	
	this.getEventType = function() {
		return this.event_type;
	};
	
	this.getTime = function() {
		if(this.data['revisetime']) {
			return this.data['revisetime'].replaceAll("-", "/");
		} else if(this.data['collecttime']) {
			return this.data['collecttime'].replaceAll("-", "/");
		} else if(this.data['createtime']) {
			return this.data['createtime'].replaceAll("-", "/");
		} else {
			return "-";
		}
	};
	
	this.getAgentName = function() {
		return this.data['dn'] + "(" + this.data['devIP'] + ")";
	};
	
	this.getRev = function() {
		try {
			if(this.event['rev']) return this.event['rev'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getSignature = function() {
		try {
			if(this.event['signature']) {
				var signature = this.event['signature'];
				if(signature.indexOf("ET ") == 0) {
					return signature.replace("ET ", "")
				} else if(signature.indexOf("GPL ") == 0) {
					return signature.replace("GPL ", "")
				} 
				return signature;				
			}
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getSignatureId = function() {
		try {
			if(this.event['signature_id']) return this.event['signature_id'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getCategory = function() {
		try {
			if(this.event['category']) {
				var category = this.event['category'];
				if(category.indexOf("ET ") == 0) {
					return category.replace("ET ", "")
				} else if(category.indexOf("GPL ") == 0) {
					return category.replace("GPL ", "")
				} 
				return category;				
			}
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getTimestamp = function() {
		try {
			var timestamp;
			if(this.event['timestamp']) timestamp = this.event['timestamp'];
			else if(this.eve['timestamp']) timestamp = this.eve['timestamp'];

			if(timestamp) {
				timestamp = timestamp.replace("T", " ");
				if(timestamp.length > 19) {
					return timestamp.substring(0, 19);
				} else {
					return timestamp;
				}
			}
			
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getAction = function() {
		try {
			if(this.event['action']) return this.event['action'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getGid = function() {
		try {
			if(this.event['gid']) return this.event['gid'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getSrc = function() {
		return this.getSrcip() + ':' + this.getSrcport();
	};
	
	this.getDest = function() {
		return this.getDestip() + ':' + this.getDestport();
	};
	
	this.getSrcip = function() {
		try {
			if(this.data['src_ip']) return this.data['src_ip'];
			else if(this.eve['src_ip']) return this.eve['src_ip'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	this.getSrcport = function() {
		try {
			if(this.data['src_port']) return this.data['src_port'];
			else if(this.eve['src_port']) return this.eve['src_port'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getDestip = function() {
		try {
			if(this.data['dest_ip']) return this.data['dest_ip'];
			else if(this.eve['dest_ip']) return this.eve['dest_ip'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	this.getDestport = function() {
		try {
			if(this.data['dest_port']) return this.data['dest_port'];
			else if(this.eve['dest_port']) return this.eve['dest_port'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getProtocol = function() {
		try {
			if(this.data['proto']) return this.data['proto'];
			else if(this.eve['proto']) return this.eve['proto'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	
	this.getFormerCategory = function() {
		try {
			if(this.event['metadata']['former_category'][0]) {
				return this.event['metadata']['former_category'][0];
			}			
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	this.getSeverityName = function() {
		var severity;
		
		try {
			severity = this.event['severity'];
		} catch(err) {
			console.error(err);
		}
		
		if(severity == 0) severityName = "Critical";
		else if(severity == 1) severityName = "Major";
		else if(severity == 2) severityName = "Minor";
		else if(severity == 3) severityName = "Audit";
		else if(severity == 4) severityName = "Info";
		else {
			console.log("severity : " + severity);
			severityName = "Unknown"; // 1 others
		}
		//high = 1; medium = 2; low = 3; info = 4; research = 5.
		/*if(severity == 5) severityName = "Critical";
		else if(severity == 4) severityName = "Major";
		else if(severity == 3) severityName = "Minor";
		else if(severity == 2) severityName = "Audit";
		else if(severity == 1) severityName = "Info";
		else {
			console.log("severity : " + severity);
			severityName = "Unknown"; // 1 others
		}*/
		
		return severityName; 
	};
	/* FLOW */
	this.getFlowStart = function() {
		try {
			if(this.eve['flow']['start']) {
				var start = this.eve['flow']['start'];
				start = start.replace("T", " ");
				if(start.length > 19) {
					return start.substring(0, 19);
				} else {
					return start;
				}
			}			
		} catch(err) {
			console.error("fount not eve.alert.flow.start");
		}
		return "-";
	};
	this.getFlowPktsToClient = function() {
		try {
			if(this.eve['flow']['pkts_toclient'] > -1) {
				return this.eve['flow']['pkts_toclient'];
			}			
		} catch(err) {
			console.error("fount not eve.alert.flow.pkts_toclient");
		}
		return "-";
	};
	this.getFlowPktsToServer = function() {
		try {
			if(this.eve['flow']['pkts_toserver'] > -1) {
				return this.eve['flow']['pkts_toserver'];
			}			
		} catch(err) {
			console.error("fount not eve.alert.flow.pkts_toserver");
		}
		return "-";
	};
	this.getFlowBytesToClient = function() {
		try {
			if(this.eve['flow']['bytes_toclient'] > -1) {
				return this.eve['flow']['bytes_toclient'];
			}			
		} catch(err) {
			console.error("fount not eve.alert.flow.bytes_toclient");
		}
		return "-";
	};
	this.getFlowBytesToServer = function() {
		try {
			if(this.eve['flow']['bytes_toserver'] > -1) {
				return this.eve['flow']['bytes_toserver'];
			}			
		} catch(err) {
			console.error("fount not eve.alert.flow.bytes_toserver");
		}
		return "-";
	};
	
	
	
	/* HTTP */
	this.getHttpHostname = function() {
		try {
			if(this.data['hostname']) return this.data['hostname'];
			else if(this.event['hostname']) return this.event['hostname'];
		} catch(err) {
			console.error("found not eve.http.hostname");
		}
		return "-";
	};
	this.getHttpContentType = function() {
		try {
			if(this.data['http_content_type']) return this.data['http_content_type'];
			else if(this.event['http_content_type']) return this.event['http_content_type'];
		} catch(err) {
			console.error("found not eve.http.http_content_type");
		}
		return "-";
	};
	this.getHttpMethod = function() {
		try {
			if(this.data['http_method']) return this.data['http_method'];
			else if(this.event['http_method']) return this.event['http_method'];
		} catch(err) {
			console.error("found not eve.http.http_method");
		}
		return "-";
	};
	this.getHttpUserAgent = function() {
		try {
			if(this.data['http_user_agent']) return this.data['http_user_agent'];
			else if(this.event['http_user_agent']) return this.event['http_user_agent'];
		} catch(err) {
			console.error("found not eve.http.http_user_agent");
		}
		return "-";
	};
	this.getHttpLength = function() {
		try {
			if(this.data['length']) return this.data['length'];
			else if(this.event['length']) return this.event['length'];
		} catch(err) {
			console.error("found not eve.http.length");
		}
		return "0";
	};
	this.getHttpProtocol = function() {
		try {
			if(this.data['protocol']) return this.data['protocol'];
			else if(this.event['protocol']) return this.event['protocol'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	this.getHttpStatus = function() {
		try {
			if(this.data['status']) return this.data['status'];
			else if(this.event['status']) return this.event['status'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	this.getHttpUrl = function() {
		try {
			if(this.data['url']) return this.data['url'];
			else if(this.event['url']) return this.event['url'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	this.getHttpPort = function() {
		try {
			if(this.data['http_port']) return this.data['http_port'];
			else if(this.event['http_port']) return this.event['http_port'];
		} catch(err) {
			console.error(err);
		}
		return "-";
	};
	
	/* Header */	
	this.getFieldName = function(key) {
		var value = lvar_eventFieldName[key];
		if(value) return value;
		else return key;
	};
};
