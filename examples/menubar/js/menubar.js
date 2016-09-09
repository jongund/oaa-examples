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
*       child element of menubarNode that represents a menubaritem must 
*       be an A element
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

  // Check whether menubarNode has A elements
  console.log(menubarNode.tagName);
  e = menubarNode.firstElementChild;
  while (e) {
    var menubarItem = e.firstElementChild;
    console.log(e.tagName + " " + menubarItem.tagName)
    if (e && menubarItem && menubarItem.tagName !== 'A')
      throw new Error(msgPrefix + "has child elements are note A elements.");
    e = e.nextElementSibling;
  }

  this.menubarNode = menubarNode;

  this.menubarItems  = [];   // see Menubar init method
  this.firstChars = [];      // see Menubar init method

  this.firstItem  = null;    // see Menubar init method
  this.lastItem   = null;    // see Menubar init method

  this.hasFocus   = false;   // see MenubarItem handleFocus, handleBlur
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
  var menubarItem, childElement, menuElement, textContent, numItems;


  // Traverse the element children of menubarNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  e = this.menubarNode.firstElementChild;

  while (e) {
    var menuElement = e.firstElementChild;

    if (e && menuElement) console.log(menuElement.tagName)

    if (e && menuElement && menuElement.tagName === 'A') {
      menubarItem = new MenubarItem(menuElement, this);
      menubarItem.init();
      this.menubarItems.push(menubarItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }

    e = e.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menubarItems.length;
  if (numItems > 0) {
    this.firstItem = this.menubarItems[0];
    this.lastItem  = this.menubarItems[numItems - 1]
  }

  this.firstItem.menubarElement.tabIndex = 0;
};


/* FOCUS MANAGEMENT METHODS */

Menubar.prototype.setFocusToFirstItem = function () {
  this.firstItem.menubarElement.focus();
};

Menubar.prototype.setFocusToLastItem = function () {
  this.lastItem.menubarElement.focus();
};

Menubar.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;
  currentItem.tabIndex = -1;

  if (currentItem === this.firstItem) {
    this.lastItem.menubarElement.focus();
    this.lastItem.menubarElement.tabIndex = 0;
  }
  else {
    index = this.menubarItems.indexOf(currentItem);
    this.menubarItems[index - 1].menubarElement.focus();
    this.menubarItems[index - 1].menubarElement.tabIndex = 0;
  }
};

Menubar.prototype.setFocusToNextItem = function (currentItem) {
  var index;
  currentItem.tabIndex = -1;

  if (currentItem === this.lastItem) {
    this.firstItem.menubarElement.focus();
    this.firstItem.menubarElement.tabIndex = 0;
  }
  else {
    index = this.menubarItems.indexOf(currentItem);
    this.menubarItems[index + 1].menubarElement.focus();
    this.menubarItems[index + 1].menubarElement.tabIndex = 0;
  }
};

Menubar.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menubarItems.indexOf(currentItem) + 1;
  if (start === this.menubarItems.length) {
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
    this.menubarItems[index].menubarElement.focus();
    this.menubarItems[index].menubarElement.tabIndex = 0;
    currentItem.tabIndex = -1;
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
};

Menubar.prototype.close = function (force) {
};


