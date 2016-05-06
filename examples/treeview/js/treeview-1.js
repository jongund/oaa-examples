

/*
 * Copyright 2011-2016 University of Illinois
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initializ all treeitems based on the role=treeitem
 */


window.addEventListener('load', function() {

  var treeitems = document.querySelectorAll('[role="treeitem"]');

  for(var i = 0; i <treeitems.length; i++ ) {
    var ti = new Treeitem(treeitems[i]);
    ti.init();

  }

});

/*
*   @constructor Treeitem: Encapsulate state and behavior of treeitem
*
*   @param node : The treeitem element node.
*/

var Treeitem = function (node) {
  // Check whether node is a DOM element
  if (typeof node !== 'object') return;


  this.treeitemNode = node;

  if (node.tabIndex !== 0) node.tabIndex = -1;

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

/*
*   @method Treeitem.prototype.init
*
*   Initialize firstItem, lastItem
*   Set tabindex for each treeitemitem
*   Add event listeners for 'keydown', 'click', 'blur' and 'focus' events
*/
Treeitem.prototype.init = function (prevControl, nextControl) {

  if (typeof prevControl !== 'object') prevControl = null;
  if (typeof nextControl !== 'object') nextControl = null;

  this.prevControl = prevControl;
  this.nextControl = nextControl;

  var treeitem = this; // for reference from within event handler
  this.treeitemNode.addEventListener('keydown', function (event) {
    treeitem.handleKeydown(event);
  });

  if (this.treeitemNode.getAttribute('aria-expanded') && 
      this.treeitemNode.getAttribute('aria-expanded') !== 'true') {
    this.hideChildTreeitems()
  }
};

/* Event handler methods */

Treeitem.prototype.handleKeydown = function (event) {
  var ct = event.currentTarget,
      flag = false;

  var expanded = ct.getAttribute('aria-expanded'); 

  switch (event.keyCode) {

    case this.keyCode.UP:
      this.previousTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.nextTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.LEFT:

      if (expanded) {
        if (expanded === 'true') this.hideChildTreeitems();
        else this.moveFocusToParentTreeitem();
      }
      else {
        this.moveFocusToParentTreeitem();
      } 

      flag = true;
      break;

    case this.keyCode.RIGHT:
      if (expanded === 'false') {
        this.showChildTreeitems();
      } 
      this.moveFocusToFirstChildTreeitem();
      flag = true;
      break;

    case this.keyCode.TAB:
      if(this.prevControl && event.shiftKey){
        this.prevControl.focus()
        flag = true;
      }
      else if(this.nextControl && !event.shiftKey){
        this.nextControl.focus()
        flag = true;
      }
      
    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

/* show and hide child treeitems */


Treeitem.prototype.hideChildTreeitems = function () {

  if (this.treeitemNode.getAttribute('aria-expanded') === 'true') {
    try {
      var ul = this.treeitemNode.getElementsByTagName('UL')[0];

      var ti = ul.firstChild;

      while (ti) {
        if (ti.nodeType === Node.ELEMENT_NODE) {
          if (ti.getAttribute('role')  === 'treeitem') {
            ti.style.display = 'none';
          }
        }
        ti = ti.nextSibling;
      }
      this.treeitemNode.setAttribute('aria-expanded', 'false');
    }
    catch(e) {
      console.log('Missing tree grouping element (UL)');
    }
  }

};

Treeitem.prototype.showChildTreeitems = function () {

  if (this.treeitemNode.getAttribute('aria-expanded') === 'false') {
    try {
      var ul = this.treeitemNode.getElementsByTagName('UL')[0];

      var ti = ul.firstChild;

      while (ti) {
        if (ti.nodeType === Node.ELEMENT_NODE) {
          if (ti.getAttribute('role')  === 'treeitem') {
            ti.style.display = 'block';
          }
        }
        ti = ti.nextSibling;
      }
      this.treeitemNode.setAttribute('aria-expanded', 'true');
    }
    catch(e) {
      console.log('Missing tree grouping element (UL)');
    }
  }  
};


/* focus management treeitems: move focus to parent treeitem */
Treeitem.prototype.moveFocusToParentTreeitem = function () {

  try {
    var pe = this.treeitemNode.parentElement;

    while(pe) {
      if (pe.getAttribute('role') === 'treeitem') {
        this.treeitemNode.tabindex = -1;
        pe.tabindex = 0;
        pe.focus();
        break;
      }
      pe = pe.parentElement;
    }

  }
  catch(e) {
    console.log('No parent treeitem');
  }


};

/* focus management treeitems: move focus to first child treeitem */
Treeitem.prototype.moveFocusToFirstChildTreeitem = function () {

   try {
    var ti = this.treeitemNode.getElementsByTagName('UL')[0].firstChild;

    while(ti) {
      if (ti.nodeType === Node.ELEMENT_NODE) {
        if (ti.getAttribute('role') === 'treeitem') {
          this.treeitemNode.tabindex = -1;
          ti.tabindex = 0;
          ti.focus();
          break;
        }       
      }
      ti = ti.nextSibling;
    }

  }
  catch(e) {
    console.log('No child treeitem');
  }
};


/* find next tree item and previous item to manage focus, tabindex */
Treeitem.prototype.previousTreeitem = function (currentItem) {

  var ti = currentItem.previousSibling;
  while (ti) {
    if (ti.nodeType === Node.ELEMENT_NODE) {
      if (ti.getAttribute('role')  === 'treeitem') {
        ti.focus();
        ti.tabIndex = 0;
        currentItem.tabIndex = -1;
        break;
      }
    }
    ti = ti.previousSibling;
  }

};

Treeitem.prototype.nextTreeitem = function (currentItem) {
  var ti = currentItem.nextSibling;
  while (ti) {
    if (ti.nodeType === Node.ELEMENT_NODE) {
      if (ti.getAttribute('role')  === 'treeitem') {
        ti.focus();
        ti.tabIndex = 0;
        currentItem.tabIndex = -1;
        break;
      }
    }
    ti = ti.nextSibling;
  }
};

