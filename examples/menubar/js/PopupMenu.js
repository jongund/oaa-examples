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
*   File:   PopupMenu.js
*
*   Desc:   Popup menu widget that implements ARIA Authoring Practices
*
*   Author: Nicholas Hoyt
*/

/*
*   @constructor PopupMenu
*
*   @desc
*       Wrapper object for a simple popup menu (without nested submenus)
*
*   @param menuNode
*       The DOM element node that serves as the popup menu container. Each
*       child element of menuNode that represents a menuitem must have a
*       'role' attribute with value 'menuitem'.
*
*   @param controllerObj
*       The object that is a wrapper for the DOM element that controls the
*       menu, e.g. a button element, with an 'aria-controls' attribute that
*       references this menu's menuNode. See MenuButton.js
*
*       The controller object is expected to have the following properties:
*       1. domNode: The controller object's DOM element node, needed for
*          retrieving positioning information.
*       2. hasHover: boolean that indicates whether the controller object's
*          domNode has responded to a mouseover event with no subsequent
*          mouseout event having occurred.
*/
var PopupMenu = function (menuNode, controllerObj) {
  var elementChildren,
      msgPrefix = "PopupMenu constructor argument menuNode ";

  // Check whether menuNode is a DOM element
  if (!menuNode instanceof Element)
    throw new TypeError(msgPrefix + "is not a DOM Element.");

  // Check whether menuNode has role='menu'
  if (menuNode.getAttribute('role') !== 'menu')
    throw new Error(msgPrefix + "does not specify role=\"menu\".");

  // Check whether menuNode has child elements
  if (menuNode.childElementCount === 0)
    throw new Error(msgPrefix + "has no element children.")

  // Check whether menuNode child elements all have role='menuitem'
  elementChildren = menuNode.children;
  for (var i = 0; i < elementChildren.length; i++) {
    if (elementChildren[i].getAttribute('role') !== 'menuitem')
      throw new Error(msgPrefix +
        "has child elements that do not specify role=\"menuitem\".");
  }

  this.menuNode = menuNode;
  this.controller = controllerObj;

  this.menuitems  = [];      // see PopupMenu init method
  this.firstChars = [];      // see PopupMenu init method

  this.firstItem  = null;    // see PopupMenu init method
  this.lastItem   = null;    // see PopupMenu init method

  this.hasFocus   = false;   // see MenuItem handleFocus, handleBlur
  this.hasHover   = false;   // see PopupMenu handleMouseover, handleMouseout
};

/*
*   @method PopupMenu.prototype.init
*
*   @desc
*       Add menuNode event listeners for mouseover and mouseout. Traverse
*       menuNode children to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
PopupMenu.prototype.init = function () {
  var menuItemAgent = new MenuItemAgent(this),
      childElement, textContent, numItems;

  // Configure the menuNode itself
  this.menuNode.tabIndex = -1;
  this.menuNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.menuNode.addEventListener('mouseout',  this.handleMouseout.bind(this));

  // Traverse the element children of menuNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  childElement = this.menuNode.firstElementChild;

  while (childElement) {
    if (childElement.getAttribute('role')  === 'menuitem') {
      menuItemAgent.configure(childElement);
      this.menuitems.push(childElement);
      textContent = childElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }
    childElement = childElement.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[0];
    this.lastItem  = this.menuitems[numItems - 1]
  }
};

/* EVENT HANDLERS */

PopupMenu.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

PopupMenu.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

/* FOCUS MANAGEMENT METHODS */

PopupMenu.prototype.setFocusToController = function () {
  this.controller.domNode.focus();
};

PopupMenu.prototype.setFocusToFirstItem = function () {
  this.firstItem.focus();
};

PopupMenu.prototype.setFocusToLastItem = function () {
  this.lastItem.focus();
};

PopupMenu.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index - 1].focus();
  }
};

PopupMenu.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index + 1].focus();
  }
};

PopupMenu.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(currentItem) + 1;
  if (start === this.menuitems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.menuitems[index].focus();
  }
};

PopupMenu.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) return i;
  }
  return -1;
};

/* MENU DISPLAY METHODS */

PopupMenu.prototype.getPosition = function (element) {
  var x = 0, y = 0;

  while (element) {
    x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    y += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return { x: x, y: y };
};

PopupMenu.prototype.open = function () {
  // get position and bounding rectangle of controller object's DOM node
  var pos  = this.getPosition(this.controller.domNode);
  var rect = this.controller.domNode.getBoundingClientRect();

  // set CSS properties
  this.menuNode.style.display = 'block';
  this.menuNode.style.position = 'absolute';
  this.menuNode.style.top  = (pos.y + rect.height) + "px";
  this.menuNode.style.left = pos.x + "px";

  // set aria-expanded attribute
  this.controller.domNode.setAttribute('aria-expanded', 'true');
};

PopupMenu.prototype.close = function (force) {
  if (force || (!this.hasFocus && !this.hasHover && !this.controller.hasHover)) {
    this.menuNode.style.display = 'none';
    this.controller.domNode.setAttribute('aria-expanded', 'false');
  }
};
