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
*   File:   RadioButton.js
*
*   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

/*
*   @constructor RadioButton
*
*   @desc
*       Wrapper object for a simple menu item in a popup menu
*
*   @param domNode
*       The DOM element node that serves as the menu item container.
*       The menuObj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*   @param menuObj
*       The object that is a wrapper for the PopupMenu DOM element that
*       contains the menu item DOM element. See PopupMenu.js
*/
var RadioButton= function (domNode, groupObj) {

  this.domNode = domNode;
  this.radioGroup = groupObj;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

RadioButton.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this) );
  this.domNode.addEventListener('keypress',   this.handleKeypress.bind(this) );
  this.domNode.addEventListener('click',      this.handleClick.bind(this) );
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this) );
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this) );
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this) );
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this) );

};

/* EVENT HANDLERS */

RadioButton.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

//  console.log("[RadioButton][handleKeydown]: " + event.keyCode + " " + this.radioGroup)

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      
      flag = true;
      break;

    case this.keyCode.ESC:
      this.radioGroup.setFocusToController();
      this.radioGroup.close(true);
      flag = true;
      break;

    case this.keyCode.UP:
      this.radioGroup.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.radioGroup.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.radioGroup.setFocusToController('previous');
      this.radioGroup.close(true);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.radioGroup.setFocusToController('next');
      this.radioGroup.close(true);
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.radioGroup.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.radioGroup.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.radioGroup.setFocusToController();
      this.radioGroup.close(true);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

RadioButton.prototype.handleKeypress = function (event) {
  var char = String.fromCharCode(event.charCode);

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    this.radioGroup.setFocusByFirstCharacter(this, char);
  }
};


RadioButton.prototype.handleClick = function (event) {
  this.radioGroup.setFocusToController();
  this.radioGroup.close(true);
};

RadioButton.prototype.handleFocus = function (event) {
  this.radioGroup.hasFocus = true;
};

RadioButton.prototype.handleBlur = function (event) {
  this.radioGroup.hasFocus = false;
  setTimeout(this.radioGroup.close.bind(this.radioGroup, false), 300);
};

RadioButton.prototype.handleMouseover = function (event) {
  this.radioGroup.hasHover = true
  this.radioGroup.open();

};

RadioButton.prototype.handleMouseout = function (event) {
  this.radioGroup.hasHover = false;
  setTimeout(this.radioGroup.close.bind(this.radioGroup, false), 300);
};
