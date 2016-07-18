
/*
 * ARIA Slider example
 * @function onload
 * @desc 
 */
 
window.addEventListener('load', function () {

  var sliders = document.getElementsByClassName('aria-widget-slider');
  
  [].forEach.call(sliders, function(slider) {
    if (slider && !slider.done) {
      var s = new aria.widget.slider(slider);
      s.initSlider();
    }
  });

});

/** 
 * @namespace aria
 */
var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */ 
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};

/* ---------------------------------------------------------------- */
/*                  Simple  Slider Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor Slider
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a slider widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 * @param  inc     Integer   -  inc is the increment value for the slider (default 1)
 * @param  jump    Integer   -  jump is the large increment value for the slider (default 10)
 * @param  width   Integer   -  jump is the large increment value for the slider (default 100)
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node         Object    -  JQuery node object
 * @property  siderHeight  Integer  - height of the slider in pixels
 * @property  siderWidth   Integer  - width of the slider in pixels
 *
 * @property  valueInc   Integer  - small slider increment value
 * @property  valueJump  Integer  - large slider increment value
 *
 * @property  valueMin  Integer  - Minimum value of the slider
 * @property  valueMax  Integer  - Maximum value of the slider
 * @property  valueNow  Integer array  - Current value of the slider thumb
 */

aria.widget.slider = function(node, inc, jump, width) {

   this.keyCode = Object.freeze({
     "pageUp" : 33,
     "pageDown" : 34,
     "end" : 35,
     "home" : 36,

     "left" : 37,
     "up" : 38,
     "right" : 39,
     "down" : 40
  });
  
  this.done = true;
  
  // Check fo DOM element node
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;

  this.container = node;

  var rails = node.getElementsByClassName('rail');
  if (rails) this.rail = rails[0];
  else return false;

  var _range = node.getElementsByClassName('range');
  if (_range) this.range = _range[0];
  else return false;

  
  var thumbs = node.getElementsByClassName('thumb');
  //changed--------changed--------changed---------changed---------changed--------changed
  if (thumbs) this.thumb = thumbs;
  else return false;

  var values = node.getElementsByClassName('value');
  if (values) this.value = values;
  else return false;
  
  var i = 0;
  while(i<this.value.length)
  {
    this.value[i].innerHTML = "0";
    i++;
  }

  
  
  this.thumbHeight  = 25;
  this.thumbWidth   = 20;
  
  if (typeof width !== 'number') {
    width = window.getComputedStyle(this.rail).getPropertyValue("width");
    if ((typeof width === 'string') && (width.length > 2)) {
      width = parseInt(width.slice(0,-2));
    }
  }

  if (typeof width === 'number') this.sliderWidth = width;
  else this.sliderWidth = 200;

  if (this.sliderWidth < 50) {
    this.sliderWidth  = 50;
  }  

  if (typeof inc !== 'number') inc = 1;
  if (typeof jump !== 'number') jump = 10;

  this.valueInc  = inc;
  this.valueJump = jump;
  
  if (typeof height === 'Number') this.sliderHeight = height;
  if (typeof width  === 'Number') this.sliderWidth  = width;
  
  //changed--------changed--------changed---------changed---------changed--------changed
  this.valueMin = parseInt(this.thumb[0].getAttribute('aria-valuemin'));
  if (isNaN(this.valueMin)) this.valueMin = 0;
  
  this.valueMax = parseInt(this.thumb[0].getAttribute('aria-valuemax'));
  if (isNaN(this.valueMax)) this.valueMax = 100;

  i = 0;
  this.valueNow = [];
  while(i<this.thumb.length)
  {
    var curr_value = parseInt(this.thumb[i].getAttribute('aria-valuenow'));
    this.valueNow.push(curr_value);
    if (isNaN(this.valueNow[i]))this.valueNow[i] = Math.round((this.valueMax - this.  valueMin) / 2);
    i++;
  }
  
  
  //changed--------changed--------changed---------changed---------changed--------changed
  i = 0;
  while(i<this.thumb.length)
  {
    this.thumb[i].setAttribute('role', 'slider');
    this.thumb[i].setAttribute('aria-valuenow', this.valueNow[i]);
    this.thumb[i].setAttribute('aria-valuemin', this.valueMin);
    this.thumb[i].setAttribute('aria-valuemax', this.valueMax);
    this.thumb[i].tabIndex = 0;
    this.thumb[i].innerHTML = "";
    i++;
  }
};

/**
 * @method initSlider
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Creates the HTML for the slider 
 */

aria.widget.slider.prototype.initSlider = function() {

  this.rail.style.height = "1px";
  this.rail.style.width = this.sliderWidth + "px";
  
  //changed--------changed--------changed---------changed---------changed--------changed
  var i = 0;
  while(i<this.thumb.length)
  {
    this.thumb[i].style.height = this.thumbHeight + "px";
    this.thumb[i].style.width = this.thumbWidth + "px";
    this.thumb[i].style.top = (-1 * this.thumbHeight/2)-(i*this.thumbHeight) + "px";//align
    
    this.value[i].style.top = (this.rail.offsetTop + (this.value[0].offsetHeight / 2) + 2) + "px";
    this.value[i].style.left = (this.rail.offsetLeft + i*this.rail.offsetWidth - 25) + "px";
    i++;
  }
  

  
  
  this.rangeLeftPos =  this.rail.offsetLeft;
  
  var slider = this;
  
  var eventKeyDown = function (event) {
    slider.eventKeyDown(event, slider);
  };

  var eventMouseDown = function (event) {
    slider.eventMouseDown(event, slider);
  };
  
  var eventFocus = function (event) {
    slider.eventFocus(event, slider);
  };

  var eventBlur = function (event) {
    slider.eventBlur(event, slider);
  };
  
  //changed--------changed--------changed---------changed---------changed--------changed
  i = 0;
  while(i<this.thumb.length)
  {
    this.thumb[i].addEventListener('keydown',   eventKeyDown);
    this.thumb[i].addEventListener('mousedown', eventMouseDown);
    this.thumb[i].addEventListener('focus', eventFocus);
    this.thumb[i].addEventListener('blur',  eventBlur);
    this.updateThumbPosition(i);
    i++;
  }
};

/**
 * @method updateThumbPosition
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Updates thumb position in slider div and aria-valuenow property
 */

aria.widget.slider.prototype.updateThumbPosition = function(i) {
  //changed--------changed--------changed---------changed---------changed--------changed
  var currThumbMax = this.valueMax;
  var currThumbMin = this.valueMin;
  
  if((i+1)<this.thumb.length) currThumbMax = this.valueNow[i+1]-2;
  if((i-1)>=0) currThumbMin = this.valueNow[i-1]+2;
  
  if (this.valueNow[i] > currThumbMax) this.valueNow[i] = currThumbMax;
  if (this.valueNow[i] < currThumbMin) this.valueNow[i] = currThumbMin;
  
  this.thumb[i].setAttribute('aria-valuenow', this.valueNow[i]);
  
  var pos = Math.round((this.valueNow[i] * this.sliderWidth) / (this.valueMax - this.valueMin)) - (this.thumbWidth/2);
  
  this.thumb[i].style.left = pos + "px";
  this.value[i].innerHTML = this.valueNow[i].toString();
  
  
  var thumb_1_pos = Math.round((this.valueNow[0] * this.sliderWidth) / (this.valueMax - this.valueMin)) - (this.thumbWidth/2);
  var thumb_2_pos = Math.round((this.valueNow[1] * this.sliderWidth) / (this.valueMax - this.valueMin)) - (this.thumbWidth/2);
  var length = thumb_2_pos-thumb_1_pos;
  this.range.style.width = (length-this.thumbWidth)+ "px";
  this.range.style.left = (thumb_1_pos+this.thumbWidth) + "px";
};

/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Keydown event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventKeyDown = function(event, slider) {
  function updateValue(value, i) {
    slider.valueNow[i] = value;
    slider.updateThumbPosition(i);
    
    event.preventDefault();
    event.stopPropagation();
  }
  
//changed--------changed--------changed---------changed---------changed--------changed
  var i = 0;
  while(i<slider.thumb.length)
  {
    if(event.target==slider.thumb[i])break;
    i++;
  }
  if(i==slider.thumb.length)return;
  
  switch(event.keyCode) {
  
  case slider.keyCode.left:
  case slider.keyCode.down:
    updateValue(slider.valueNow[i]-slider.valueInc, i);
    break;
  
  case slider.keyCode.right:
  case slider.keyCode.up:
    updateValue(slider.valueNow[i]+slider.valueInc, i);
    break;

  case slider.keyCode.pageDown:
    updateValue(slider.valueNow[i]-slider.valueJump, i);
    break;

  case slider.keyCode.pageUp:
    updateValue(slider.valueNow[i]+slider.valueJump, i);
    break;
  
  case slider.keyCode.home:
    updateValue(slider.valueMin, i);
    break;

  case slider.keyCode.end:
    updateValue(slider.valueMax, i);
    break;

  default:
    break;
  }
  
  
};

/**
 * @method eventMouseDown
 *
 * @memberOf aria.widget.slider
 *
 * @desc  MouseDown event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventMouseDown = function(event, slider) {
  // Set focus to the clicked handle
  event.target.focus();

  var i = 0;
  while(i<slider.thumb.length)
  {
    if(event.target==slider.thumb[i])break;
    i++;
  }
  if(i==slider.thumb.length)return;
  
  
  
  var mouseMove = function (event) {
    slider.eventMouseMove(event, slider, i);
  }

  slider.mouseMove = mouseMove;

  var mouseUp = function (event) {
    slider.eventMouseUp(event, slider);
  }

  slider.mouseUp = mouseUp;

  // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', slider.mouseMove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', slider.mouseUp);

  event.preventDefault();
  event.stopPropagation();
  

};

/**
 * @method eventMouseMove
 *
 * @memberOf aria.widget.slider
 *
 * @desc  MouseMove event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventMouseMove = function(event, slider, i) {
  var diffX = event.pageX - slider.rail.offsetLeft;
  slider.valueNow[i] = parseInt(((slider.valueMax - slider.valueMin) * diffX) / slider.sliderWidth);
  slider.updateThumbPosition(i);
  
  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventMouseUp
 *
 * @memberOf aria.widget.slider
 *
 * @desc  MouseUp event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventMouseUp = function(event, slider) {

  document.removeEventListener('mousemove', slider.mouseMove);
  document.removeEventListener('mouseup',   slider.mouseUp);

  event.preventDefault();
  event.stopPropagation();
  
};


/**
 * @method eventFocus
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Focus event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventFocus = function(event, slider) {

  slider.container.className = "aria-widget-slider focus";
  
  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventBlur
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Focus event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventBlur = function(event, slider) {

  slider.container.className = "aria-widget-slider";
  
  event.preventDefault();
  event.stopPropagation();
  
};
