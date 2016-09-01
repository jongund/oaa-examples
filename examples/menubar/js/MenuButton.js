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
*   File:   MenuButton.js
*
*   Desc:   Menu button widget that implements ARIA Authoring Practices
*
*   Author: Nicholas Hoyt
*/

/*
*   @constructor MenuButton
*
*   @desc
*       Object that encapsulates data and behavior (via event handlers)
*       of an HTML button or custom button-like component that, in turn
*       controls a menu component.
*
*   @param domNode
*       The DOM element for which this object serves as a delegate, via
*       its properties and event handlers.
*/
var MenuButton = function (domNode) {
  var msgPrefix = "MenuButton constructor argument domNode ";

  // Check whether domNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + "is not a DOM Element.");
  }

  this.domNode  = domNode;
  this.hasHover = false;  // see MenuButton handleMouseover, handleMouseout
  this.menuNode = null;   // see MenuButton init method

  this.keyCode = Object.freeze({
    'RETURN' : 13,
    'ESC'    : 27,
    'SPACE'  : 32,
    'UP'     : 38,
    'DOWN'   : 40
  });
};

/*
*   @method MenuButton.prototype.init
*
*   @desc
*       Find and store the menuNode associated with button via its
*       aria-controls attribute; instantiate and initialize the PopupMenu
*       object associated with the menuNode; add event listeners.
*/
MenuButton.prototype.init = function () {
  var id = this.domNode.getAttribute('aria-controls');

  if (id) {
    this.menuNode = document.getElementById(id);
    if (this.menuNode) {
      this.menu = new PopupMenu(this.menuNode, this);
      this.menu.init();
    }
    else {
      throw new Error("MenuButton init error: menuNode not found.");
    }
  }
  else {
    throw new Error("MenuButton init error: 'aria-controls' id not found.")
  }

  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout',  this.handleMouseout.bind(this));
  this.domNode.addEventListener('keydown',   this.handleKeydown.bind(this));
  this.domNode.addEventListener('click',     this.handleClick.bind(this));
};

/* EVENT HANDLERS */

MenuButton.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.SPACE:
      this.menu.open();
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.RETURN:
      this.menu.open();
      this.menu.setFocusToFirstItem();
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

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuButton.prototype.handleClick = function (event) {
  this.menu.open();
  this.menu.setFocusToFirstItem();
};

MenuButton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.menu.open();
};

MenuButton.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};
