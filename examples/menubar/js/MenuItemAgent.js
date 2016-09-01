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
*   File:   MenuItemAgent.js
*
*   Desc:   Object that configures menu item elements in compliance with
*           the ARIA Authoring Practices for role menuitem.
*
*   Author: Nicholas Hoyt
*/

/*
*   @constructor MenuItemAgent
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
*       MenuItemAgent from within the menu object; its configure method
*       can then be called on each menuitem element.
*
*   @param menuObj
*       The PopupMenu object that is a delegate for the menu DOM element
*       that contains the menuitem element.
*/
var MenuItemAgent = function (menuObj) {

  this.menu = menuObj;

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

MenuItemAgent.prototype.configure = function (element) {
  element.tabIndex = -1;

  element.addEventListener('keydown',  this);
  element.addEventListener('keypress', this);
  element.addEventListener('click',    this);
  element.addEventListener('focus',    this);
  element.addEventListener('blur',     this);
};

/* EVENT HANDLERS */

MenuItemAgent.prototype.handleEvent = function (event) {
  switch (event.type) {
    case 'keydown':
      this.handleKeydown(event);
      break;
    case 'keypress':
      this.handleKeypress(event);
      break;
    case 'click':
      this.handleClick(event);
      break;
    case 'focus':
      this.handleFocus(event);
      break;
    case 'blur':
      this.handleBlur(event);
      break;
    default:
      break;
  }
};

MenuItemAgent.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

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
      this.menu.setFocusToController();
      this.menu.close(true);
      flag = true;
      break;

    case this.keyCode.UP:
      this.menu.setFocusToPreviousItem(tgt);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.menu.setFocusToNextItem(tgt);
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.menu.setFocusToController();
      this.menu.close(true);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItemAgent.prototype.handleKeypress = function (event) {
  var tgt = event.currentTarget,
      char = String.fromCharCode(event.charCode);

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    this.menu.setFocusByFirstCharacter(tgt, char);
  }
};

MenuItemAgent.prototype.handleClick = function (event) {
  this.menu.setFocusToController();
  this.menu.close(true);
};

MenuItemAgent.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenuItemAgent.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};
