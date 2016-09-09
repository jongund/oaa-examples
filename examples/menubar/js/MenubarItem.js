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
*   File:   MenubarItem.js
*
*   Desc:   Object that configures menu item elements in compliance with
*           the ARIA Authoring Practices for role menuitem.
*
*   Author: Nicholas Hoyt
*/

/*
*   @constructor MenubarItem
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
*       MenubarItem from within the menu object; its configure method
*       can then be called on each menuitem element.
*
*   @param menuObj
*       The PopupMenu object that is a delegate for the menu DOM element
*       that contains the menuitem element.
*/
var MenubarItem = function (menubarElement, menuObj) {

  this.menubar = menuObj;
  this.menubarElement = menubarElement;

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

MenubarItem.prototype.init = function () {
  this.menubarElement.tabIndex = -1;

  var that = this;

  this.menubarElement.addEventListener('keydown',  function(event) { that.handleKeydown(event);});
  this.menubarElement.addEventListener('keypress', function(event) { that.handleKeypress(event);});
  this.menubarElement.addEventListener('click',    function(event) { that.handleClick(event);});
  this.menubarElement.addEventListener('focus',    function(event) { that.handleFocus(event);});
  this.menubarElement.addEventListener('blur',     function(event) { that.handleBlur(event);});

  // initialize pop up menus

  console.log(this.menubarElement.nextSiblingElement);

  var nextElement = this.menubarElement.nextElementSibling;

  if (nextElement && nextElement.tagName === 'UL') {
    console.log("Creating popup menu: " + this.menubarElement.innerHTML)
    this.menu = new PopupMenu(nextElement, this);
    this.menu.init();
    console.log("done")
  }

};


MenubarItem.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

  console.log(event.keyCode)    

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

    case this.keyCode.LEFT:
      this.menubar.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.menubar.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.UP:
      this.menu.open();
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.menu.open();
      this.menu.setFocusToFirstItem();
      flag = true;
      break;      

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menubar.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menubar.setFocusToLastItem();
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenubarItem.prototype.handleKeypress = function (event) {
  var tgt = event.currentTarget,
      char = String.fromCharCode(event.charCode);

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    this.menubar.setFocusByFirstCharacter(tgt, char);
  }
};

MenubarItem.prototype.handleClick = function (event) {
};

MenubarItem.prototype.handleFocus = function (event) {
  this.menubar.hasFocus = true;
};

MenubarItem.prototype.handleBlur = function (event) {
  this.menubar.hasFocus = false;
  setTimeout(this.menubar.close.bind(this.menubar, false), 300);
};
