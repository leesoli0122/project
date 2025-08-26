/*---------------------------------------------
  수정 : lineWidth,colorStart,colorStop,strokeColor
  추가 : gauge_box에 bg-yel 클래스가 추가될 때 -> 추가라고 적어둠
---------------------------------------------*/
// 공통 색상 결정 함수 -> 추가
function getGaugeColor(canvasId) {
  var canvas = document.getElementById(canvasId);
  var gaugeBox = canvas.closest('.gauge_box');
  var hasYellowBg = gaugeBox.classList.contains('bg-yel');
  return hasYellowBg ? '#F76900' : '#27AD98';
}

var gaugeColor01 = getGaugeColor('view-gauge'); //추가
var opts = {
  angle: 0.25, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: gaugeColor01,   // Colors
  colorStop: gaugeColor01,    // just experiment with them
  strokeColor: '#7388A924',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  
};
var target = document.getElementById('view-gauge'); // your canvas element
var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 100; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 20; // set animation speed (32 is default value)
gauge.set(50); // set actual value


var gaugeColor02 = getGaugeColor('view-gauge02');//추가
var opts02 = {
  angle: 0.25, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: gaugeColor02,   // Colors
  colorStop: gaugeColor02,    // just experiment with them
  strokeColor: '#7388A924',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  
};
var target02 = document.getElementById('view-gauge02'); // your canvas element
var gauge02 = new Donut(target02).setOptions(opts02); // create sexy gauge!
gauge02.maxValue = 100; // set max gauge value
gauge02.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge02.animationSpeed = 20; // set animation speed (32 is default value)
gauge02.set(12); // set actual value


var gaugeColor03 = getGaugeColor('view-gauge03');//추가
var opts03 = {
  angle: 0.25, // The span of the gauge arc
  lineWidth: 0.07, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: gaugeColor03,   // Colors
  colorStop: gaugeColor03,    // just experiment with them
  strokeColor: '#7388A924',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  
};
var target02 = document.getElementById('view-gauge03'); // your canvas element
var gauge02 = new Donut(target02).setOptions(opts03); // create sexy gauge!
gauge02.maxValue = 100; // set max gauge value
gauge02.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge02.animationSpeed = 20; // set animation speed (32 is default value)
gauge02.set(70); // set actual value

