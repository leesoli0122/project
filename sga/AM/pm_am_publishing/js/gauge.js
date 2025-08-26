var opts = {
  angle: 0.25, // The span of the gauge arc
  lineWidth: 0.09, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#ff9d1f',   // Colors
  colorStop: '#ff9d1f',    // just experiment with them
  strokeColor: '#eee',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  
};
var target = document.getElementById('view-gauge'); // your canvas element
var gauge = new Donut(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 100; // set max gauge value
gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 20; // set animation speed (32 is default value)
gauge.set(0.2); // set actual value



var opts02 = {
  angle: 0.25, // The span of the gauge arc
  lineWidth: 0.09, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.6, // // Relative to gauge radius
    strokeWidth: 0.035, // The thickness
    color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#27b9cf',   // Colors
  colorStop: '#27b9cf',    // just experiment with them
  strokeColor: '#eee',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  
};
var target02 = document.getElementById('view-gauge02'); // your canvas element
var gauge02 = new Donut(target02).setOptions(opts02); // create sexy gauge!
gauge02.maxValue = 100; // set max gauge value
gauge02.setMinValue(0);  // Prefer setter over gauge.minValue = 0
gauge02.animationSpeed = 20; // set animation speed (32 is default value)
gauge02.set(31.87); // set actual value


