$(document).ready(function(){
	$('#gnbArea>ul>li').hover(function(){
			$('#header').stop(true, true).addClass('headerOn');
			$(this).addClass('on');
		},function(){
			$('#header').stop(true, true).removeClass('headerOn');
			$(this).removeClass('on');
		});
		
		$('.gnbDepth1>li>a').focus(function(){
			$('#header').stop(true, true).removeClass('headerOn');
			$('.gnbDepth1 li').removeClass('on');

			$('#header').stop(true, true).addClass('headerOn');
			$(this).parent().addClass('on');
		});

		$('.gnbDepth2>li').hover(function(){
			$(this).find('ZDEL_img').stop(true, true).animate({"marginTop":"-32px"}, 200, "easeInOutExpo");
		},function(){
			$(this).find('ZDEL_img').stop(true, true).animate({"marginTop":"0px"}, 200, "easeInOutExpo");
		});

	});

$(function(){
	//$(".drop:not(:first)").css("display","none"); 첫번째 하위메뉴 보여지게 하고싶을때 
	$(".drop").css("display","none");
	$(".dropdown dt").click(function(){
		if($("+.drop",this).css("display")=="none"){
		$(this).siblings(".drop").slideUp("fast");
		$("+.drop",this).slideDown("fast");
	}
	});
}); 

function Floating(FloatingObj,MarginX,MarginY,Percentage,setTime,Mstart) {
 this.FloatingObj = FloatingObj;
 this.MarginX = (MarginX) ? MarginX : 0;
 this.MarginY = (MarginY) ? MarginY : 0;
 this.Percentage = (Percentage) ? Percentage : 20;
 this.setTime = (setTime) ? setTime : 10;
 this.FloatingObj.style.position = "absolute";
 this.Body = null;
 this.setTimeOut = null;
 this.Mstart = (Mstart) ? Mstart : 0;
 this.Run();
}

Floating.prototype.Run = function () {
 if ((document.documentElement.scrollLeft + document.documentElement.scrollTop) > (document.body.scrollLeft + document.body.scrollTop)) {
 this.Body = document.documentElement;
 } else {
 this.Body = document.body;
 }

 var This = this;
 var FloatingObjLeft = (this.FloatingObj.style.left) ? parseInt(this.FloatingObj.style.left,10) : this.MarginX;//this.FloatingObj.offsetLeft;
 var FloatingObjTop = (this.FloatingObj.style.top) ? parseInt(this.FloatingObj.style.top,10) : this.Mstart;//this.FloatingObj.offsetTop;
 var DocLeft = this.Body.scrollLeft + this.MarginX;
 var DocTop = this.Body.scrollTop + this.MarginY;

 var MoveX = Math.abs(FloatingObjLeft - DocLeft);
 MoveX = Math.ceil(MoveX / this.Percentage);
 var MoveY = Math.abs(FloatingObjTop - DocTop);
 MoveY = Math.ceil(MoveY / this.Percentage);

 if (FloatingObjLeft < DocLeft) {
 this.FloatingObj.style.left = FloatingObjLeft + MoveX + "px";
 } else {
 this.FloatingObj.style.left = FloatingObjLeft - MoveX + "px";
 }

 if (FloatingObjTop < DocTop) {
 this.FloatingObj.style.top = FloatingObjTop + MoveY + "px";
 } else {
 this.FloatingObj.style.top = FloatingObjTop - MoveY + "px";
 }

 window.clearTimeout(this.setTimeOut);
 this.setTimeOut = window.setTimeout(function () { This.Run(); },this.setTime);
}
<!--
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
//-->


function bluring(){ 
if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG") document.body.focus(); 
} 
document.onfocusin=bluring; 



var b_name = null;
var is_ani_quick = false;






var rnb_active = function (){
	var main_obj = $('#rnb_wrap'),
		inner_rnb_obj = main_obj.find('.inner_rnb'),
		menu_btn_obj = main_obj.find('.menu_wrap').children(),
		rnb_contents_obj = main_obj.find('.rnb_contents'),
		rnb_contents_child = rnb_contents_obj.children(),
		close = main_obj.find('.close'),
		current_scrollTop = $(window).scrollTop(),
		flag = 100,
		move_effect = "easeInOutExpo",
		move_speed = 500 ,
		fade_speed = 700 ;

	menu_btn_obj.each(function(i){ this.num = i });
	rnb_contents_child.css({'opacity':'0'});

	menu_btn_obj.bind('click',function(){
		if (flag == this.num){ return ;}
		//2020-10-29 정현기 : 서류자동화 추가로 수정(if추가, this.num-1 수정)
		
		if(this.num == 2) {
			menu_btn_obj.eq(flag).removeClass('on');
			menu_btn_obj.eq(this.num).addClass('on');
			rnb_contents_obj.animate({'width':647},move_speed,move_effect);

			rnb_contents_child.eq(flag).animate({'opacity':0},fade_speed);
			rnb_contents_child.eq(this.num-1).animate({'opacity':1},fade_speed);

			rnb_contents_child.eq(flag).css({'z-index':'1'});
			rnb_contents_child.eq(this.num-1).css({'z-index':'10'});

			flag = this.num-1;
		}
	});

	close.bind('click',function(){
		rnb_contents_obj.animate({'width':0},move_speed,move_effect);
		menu_btn_obj.removeClass('on');
		rnb_contents_child.animate({'opacity':'0'}).css({'z-index':'1'});
		flag = 100
	});
};

// roh_test
var rnb_controller = function(num){
	var main_obj = $('#rnb_wrap'),
	inner_rnb_obj = main_obj.find('.inner_rnb'),
	menu_btn_obj = main_obj.find('.menu_wrap').children(),
	rnb_contents_obj = main_obj.find('.rnb_contents'),
	rnb_contents_child = rnb_contents_obj.children(),
	flag = 100;

	rnb_contents_child.css({'opacity':'0'});
	
	if (flag == num){ return; }
	
	menu_btn_obj.eq(flag).removeClass('on');
	menu_btn_obj.eq(num).addClass('on');

	rnb_contents_obj.animate({'width':647}, 500, "easeInOutExpo");

	rnb_contents_child.eq(flag).animate({'opacity':0}, 700);
	rnb_contents_child.eq(num).animate({'opacity':1}, 700);

	rnb_contents_child.eq(flag).css({'z-index':'1'});
	rnb_contents_child.eq(num).css({'z-index':'10'});

	flag = num;
};
// end roh


$(document).ready(function(){
	rnb_active();

});

