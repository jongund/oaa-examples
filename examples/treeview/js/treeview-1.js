

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

  var trees = document.querySelectorAll('[role="tree"]');

  for(var i = 0; i <trees.length; i++ ) {
    var t = new Tree(trees[i]);
    t.init();

  }

});

/*
*   @constructor 
*
*   @desc
*       Tree item object for representing the state and user interactions for a 
*       tree widget
*
*   @param node
*       An element with the role=tree attribute
*/

var Tree = function (node) {
  // Check whether node is a DOM element
  if (typeof node !== 'object') return;

  this.treeNode = node;

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
*   @desc
*       Adds 'keydown', 'click', 'blur' and 'focus' event handlers to the treeitem in the tree
*       Set tabindex for each treeitemitem
*       Set the display of treeitems based on aria-expanded state
*/
Tree.prototype.init = function () {
  var that = this;

  var treeitems = this.getTreeitems(this.treeNode);

  var flag = true;

  for (var i = 0; i < treeitems.length; i++) {
    var ti = treeitems[i];

    if(flag) {
      ti.tabIndex = 0;
      flag = false;
    }
    else {
      ti.tabIndex = -1;
    }  

    ti.addEventListener('keydown', function (event) {
      that.handleKeydown(event);
    });

    if (ti.getAttribute('aria-expanded') === 'false') {
      console.log('hide')
      this.hideChildTreeitems(ti);
    }
  }

};

/*
*   @desc
*       Finds all the descendant treeitems of the node
*
*   @param node
*       DOM node to start looking for descendant treeitems
*
*   @returns
*       Array of DOM nodes 
*/

Tree.prototype.getTreeitems = function(node) {

  var n = node.firstChild;
  var ti = [];

  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) {

      if (n.getAttribute('role') === 'treeitem') ti.push(n);

      if (n.firstChild) ti = ti.concat(this.getTreeitems(n));

    }
    n = n.nextSibling;
  }

  return ti;

};

/*
*   @desc
*       Finds all the child treeitems of the node
*
*   @param node
*       DOM node to start looking for child treeitems
*
*   @returns
*       Array of DOM nodes 
*/

Tree.prototype.getChildTreeitems = function(node) {

  var n = node.firstChild;
  var ti = [];

  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) {
      var flag = n.getAttribute('role') === 'treeitem';
      if (flag) ti.push(n);
      if (!flag && n.firstChild) ti = ti.concat(this.getTreeitems(n));
    }
    n = n.nextSibling;
  }

  return ti;

};

/*
*   @desc
*       Get previous sibling treeitem, if exists
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getPreviousSiblingTreeitem = function(node) {

  var ti = node.previousSibling;

  while (ti) {
    if (ti.nodeType === Node.ELEMENT_NODE) {
      if (ti.getAttribute('role')  === 'treeitem') {
        return ti;
      }
    }
    ti = ti.previousSibling;
  }

  return false;
};

/*
*   @desc
*       Get previous sibling treeitem, if exists
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getNextSiblingTreeitem = function(node) {

  var ti = node.nextSibling;

  while (ti) {
    if (ti.nodeType === Node.ELEMENT_NODE) {
      if (ti.getAttribute('role')  === 'treeitem') {
        return ti;
      }
    }
    ti = ti.nextSibling;
  }

  return false;
};


/*
*   @desc
*       Get previous sibling treeitem, if exists
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getFirstSiblingTreeitem = function(node) {

  var ti = node.nextSibling;

  while (ti) {
    if (ti.nodeType === Node.ELEMENT_NODE) {
      if (ti.getAttribute('role')  === 'treeitem') {
        return ti;
      }
    }
    ti = ti.nextSibling;
  }

  return false;
};

/*
*   @desc
*       Get parent treeitem, if exists
*
*   @param node
*       DOM node to start looking for parent treeitem
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getParentTreeitem = function(node) {

  var ti = node.parentElement;

  while (ti) {
    if (ti.nodeType === Node.ELEMENT_NODE) {
      if (ti.getAttribute('role')  === 'treeitem') {
        return ti;
      }
    }
    ti = ti.parentElement;
  }

  return false;
};


/*
*   @desc
*       Keyboard event handler for treeitems
*
*   @param event
*       DOM event object
*/

Tree.prototype.handleKeydown = function (event) {
  var ct = event.currentTarget,
      flag = false;

  var expanded = ct.getAttribute('aria-expanded'); 

  switch (event.keyCode) {

    case this.keyCode.UP:
      this.moveFocusToPreviousTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.moveFocusToNextTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.LEFT:

      if (expanded) {
        if (expanded === 'true') this.hideChildTreeitems(ct);
        else this.moveFocusToParentTreeitem(ct);
      }
      else {
        this.moveFocusToParentTreeitem(ct);
      } 

      flag = true;
      break;

    case this.keyCode.RIGHT:
      if (expanded === 'false') {
        this.showChildTreeitems(ct);
      } 
      this.moveFocusToFirstChildTreeitem(ct);
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

/*
*   @desc
*       Hides child treeitems if aria-expanded=true (e.g. children are visible)
*
*   @param treeitem
*       Treeitem with child treeitems 
*/

Tree.prototype.hideChildTreeitems = function (treeitem) {

  var treeitems = this.getChildTreeitems(treeitem);

  for(var i = 0; i < treeitems.length; i++) {
    treeitems[i].style.display = 'none';
  }
  treeitem.setAttribute('aria-expanded', 'false');

};

/*
*   @desc
*       Show child treeitems if aria-expanded=false (e.g. children are invisible)
*
*   @param treeitem
*       Treeitem with child treeitems 
*/

Tree.prototype.showChildTreeitems = function (treeitem) {

  var treeitems = this.getChildTreeitems(treeitem);

  for(var i = 0; i < treeitems.length; i++) {
    treeitems[i].style.display = 'block';
  }
  treeitem.setAttribute('aria-expanded', 'true');

};

/*
*   @desc
*       Moves focus to parent treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToParentTreeitem = function (treeitem) {

  var p = this.getParentTreeitem(treeitem);

  if (p) {
    treeitem.tabIndex = -1;
    p.tabIndex = 0;
    p.focus();
  }

};

/*
*   @desc
*       Moves focus to first child treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToFirstChildTreeitem = function (treeitem) {

  var treeitem = this.getChildTreeitems(treeitem);

  if (treeitem.length) {
    treeitem.tabIndex = -1;
    var ti = treeitem[0];
    ti.tabIndex = 0;
    ti.focus();
  }

};


/*
*   @desc
*       Moves focus to previous sibling treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToPreviousTreeitem = function (treeitem) {

  var ti = this.getPreviousSiblingTreeitem(treeitem);

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
  }

};

/*
*   @desc
*       Moves focus to next sibling treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToNextTreeitem = function (treeitem) {

  var ti = this.getNextSiblingTreeitem(treeitem);

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
  }

};

