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