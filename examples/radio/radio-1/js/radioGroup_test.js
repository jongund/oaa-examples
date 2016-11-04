/*
*   Copyright 2016 University of Illinois
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*   File:   menubuttonItemAction.js
*
*   Desc:   Menubutton Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

/*
*   @constructor MenubuttonItem
*
*   @desc
*       Object that configures menu item elements by setting tabIndex
*       and registering itself to handle pertinent events.
*
*       While menuitem elements handle many keydown events, as well as
*       focus and blur events, they do not maintain any state variables,
*       delegating those responsibilities to its associated menu object.
*
*       Consequently, it is only necessary to create one instance of
*       MenubuttonItem from within the menu object; its configure method
*       can then be called on each menuitem element.
*
*   @param domNode
*       The DOM element node that serves as the menu item container.
*       The menuObj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*   @param menuObj
*       The PopupMenu object that is a delegate for the menu DOM element
*       that contains the menuitem element.
*/
var RadioGroup = function (domNode) {

  this.domNode   = domNode;

  this.radioButtons = [];

  this.firstRadioButton  = null;   
  this.lastRadioButton   = null;   

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'SPACE'    : 32,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

RadioGroup.prototype.init = function () {

  // initialize pop up menus
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'menuitem');
  }

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this) );
  this.domNode.addEventListener('keypress',   this.handleKeypress.bind(this) );
  this.domNode.addEventListener('click',      this.handleClick.bind(this) );
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this) );
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this) );
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this) );
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this) );
  //Understand keydown,press,click...

  var rbs = this.domNode.querySelectorAll("[role=radio]");

  for (var i = 0; i < rbs.length; i++) {
    var rb = new RadioButton(rbs[i], this);
    rb.init();
    this.radioButtons.push(rb);

    console.log(rb);

    if (!this.firstRadioButton) this.firstRadioButton = rb;
    this.lastRadioButton = rb;
  }

};
//Event Handlers
RadioGroup.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

//  console.log("[RadioGroup][handleKeydown]: " + event.keyCode + " " + this.radioButtons)

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      // Create simulated mouse event to mimic the behavior of ATs
      // and let the event handler handleClick do the housekeeping.
      try {
        clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
      }
      catch(err) {
        if (document.createEvent) {
          // DOM Level 3 for IE 9+
          clickEvent = document.createEvent('MouseEvents');
          clickEvent.initEvent('click', true, true);
        }
      }
      tgt.dispatchEvent(clickEvent);
      flag = true;
      break;

    case this.keyCode.ESC:
      this.radioButtons.setFocusToController();
      this.radioButtons.close(true);
      flag = true;
      break;

    case this.keyCode.UP:
      this.radioButtons.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.radioButtons.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.radioButtons.setFocusToController('previous');
      this.radioButtons.close(true);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.radioButtons.setFocusToController('next');
      this.radioButtons.close(true);
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.radioButtons.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.radioButtons.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.radioButtons.setFocusToController();
      this.radioButtons.close(true);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

RadioGroup.prototype.handleKeypress = function (event) {
  var char = String.fromCharCode(event.charCode);

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    this.radioButtons.setFocusByFirstCharacter(this, char);
  }
};


RadioGroup.prototype.handleClick = function (event) {
  this.radioButtons.setFocusToController();
  this.radioButtons.close(true);
};

RadioGroup.prototype.handleFocus = function (event) {
  this.radioButtons.hasFocus = true;
};

RadioGroup.prototype.handleBlur = function (event) {
  this.radioButtons.hasFocus = false;
  setTimeout(this.radioButtons.close.bind(this.radioButtons, false), 300);
};

RadioGroup.prototype.handleMouseover = function (event) {
  this.radioButtons.hasHover = true
  this.radioButtons.open();

};

RadioGroup.prototype.handleMouseout = function (event) {
  this.radioButtons.hasHover = false;
  setTimeout(this.radioButtons.close.bind(this.radioButtons, false), 300);
};
