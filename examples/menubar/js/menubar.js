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
*   File:   Menubar.js
*
*   Desc:   Popup menu widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson and Ku Ja Eun
*/

/*
*   @constructor Menubar
*
*   @desc
*       Wrapper object for a menubar (with nested submenus of links)
*
*   @param menuNode
*       The DOM element node that serves as the menubar container. Each
*       child element of menubarNode that represents a menuitem must have a
*       'role' attribute with value 'menuitem'.
*/
var Menubar = function (menubarNode) {
  var elementChildren,
      msgPrefix = "Menubar constructor argument menubarNode ";

  // Check whether menubarNode is a DOM element
  if (!menubarNode instanceof Element)
    throw new TypeError(msgPrefix + "is not a DOM Element.");

  // Check whether menubarNode has role='menubar'
  if (menubarNode.getAttribute('role') !== 'menubar')
    throw new Error(msgPrefix + "does not specify role=\"menubar\".");

  // Check whether menubarNode has descendant elements
  if (menubarNode.childElementCount === 0)
    throw new Error(msgPrefix + "has no element children.")

  // Check whether menubarNode children (e.g. A elements) elements with the role='menuitem'
  console.log(menubarNode.tagName);
  e = menubarNode.firstElementChild;
  while (e) {
    console.log(e.tagName + " " + e.firstElementChild.tagName)
    if (e && e.firstElementChild && e.firstElementChild.getAttribute('role') !== 'menuitem')
      throw new Error(msgPrefix +
        "has child elements that do not specify role=\"menuitem\".");
    e = e.nextElementSibling;
  }

  this.menubarNode = menubarNode;

  this.menuitems  = [];      // see Menubar init method
  this.firstChars = [];      // see Menubar init method

  this.firstItem  = null;    // see Menubar init method
  this.lastItem   = null;    // see Menubar init method

  this.hasFocus   = false;   // see MenuItem handleFocus, handleBlur
  this.hasHover   = false;   // see Menubar handleMouseover, handleMouseout
};

/*
*   @method Menubar.prototype.init
*
*   @desc
*       Add menubarNode event listeners for mouseover and mouseout. Traverse
*       menubarNode children (e.g. A elements) to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
Menubar.prototype.init = function () {
  var menuItemAgent = new MenuItemAgent(this),
      childElement, menuElement, textContent, numItems;

  // Configure the menubarNode itself
  this.menubarNode.tabIndex = -1;
  this.menubarNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.menubarNode.addEventListener('mouseout',  this.handleMouseout.bind(this));

  // Traverse the element children of menubarNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  childElement = this.menuNode.firstElementChild;

  while (childElement) {
    menuElement = childElement.firstElementChild;
    if (menuElement.getAttribute('role')  === 'menuitem') {
      menuItemAgent.configure(menuElement);
      this.menuitems.push(menuElement);
      textContent = menuElement.textContent.trim();
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

Menubar.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

Menubar.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

/* FOCUS MANAGEMENT METHODS */

Menubar.prototype.setFocusToController = function () {
  this.controller.domNode.focus();
};

Menubar.prototype.setFocusToFirstItem = function () {
  this.firstItem.focus();
};

Menubar.prototype.setFocusToLastItem = function () {
  this.lastItem.focus();
};

Menubar.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index - 1].focus();
  }
};

Menubar.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index + 1].focus();
  }
};

Menubar.prototype.setFocusByFirstCharacter = function (currentItem, char) {
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

Menubar.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) return i;
  }
  return -1;
};

/* MENU DISPLAY METHODS */

Menubar.prototype.getPosition = function (element) {
  var x = 0, y = 0;

  while (element) {
    x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    y += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return { x: x, y: y };
};

Menubar.prototype.open = function () {
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

Menubar.prototype.close = function (force) {
  if (force || (!this.hasFocus && !this.hasHover && !this.controller.hasHover)) {
    this.menuNode.style.display = 'none';
    this.controller.domNode.setAttribute('aria-expanded', 'false');
  }
};
