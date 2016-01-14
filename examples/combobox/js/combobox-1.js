

/*
 * Copyright 2011-2014 OpenAjax Alliance
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
 
/*
 * ARIA Menu Button example
 * @function onload
 * @desc 
 */

window.addEventListener('load', function() {

  var comboBoxes = document.querySelectorAll('div.combobox');

  [].forEach.call(comboBoxes, function(comboBox) {
    if (comboBox) {
      var mb = new aria.widget.ComboBoxInput(comboBox)
      mb.initComboBox();
    }  
  });
});

/** 
 * @namespace aria
 */

var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Utils Namespace                        */ 
/* ---------------------------------------------------------------- */

/**
 * @constructor Menu
 *
 * @memberOf aria.Utils

 * @desc  Computes absolute position of an element
 *
 * @param  element    DOM node  -  DOM node object
 *
 * @retruns  Object  Object contains left and top position
 */

aria.Utils = aria.Utils || {};

aria.Utils.findPos = function(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
};


/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */ 
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};


/* ---------------------------------------------------------------- */
/*                  Menu Button Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor Menu
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a Menu Button widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node               Object    -  JQuery node object
 */

aria.widget.ListBox = function(listBoxNode, inputNode, buttonNode, comboBox) {

   this.keyCode = Object.freeze({
     "TAB"      : 9,
     "RETURN"   : 13,
     "ESC"    : 27,
     "SPACE"    : 32,
     "ALT"      :18,

     "PAGEUP"    : 33,
     "PAGEDOWN" : 34,
     "END"      : 35,
     "HOME"     : 36,

     "LEFT"  : 37,
     "UP"    : 38,
     "RIGHT" : 39,
     "DOWN"  : 40
  });
  
  // Check fo DOM element node
  if (typeof listBoxNode !== 'object' || !listBoxNode.getElementsByClassName) return false;

  this.listBoxNode = listBoxNode;
  listBoxNode.tabIndex = -1;

  if (typeof inputNode !== 'object' || !inputNode.getElementsByClassName) return false;

  this.inputNode = inputNode;
  inputNode.tabIndex = 0;
  
  if (typeof buttonNode !== 'object' || !buttonNode.getElementsByClassName) return false;

  this.buttonNode = buttonNode;
  buttonNode.tabIndex = -1;
  
  this.comboBox = comboBox;

  this.firstComboItem = false;
  this.lastComboItem = false;

};

/**
 * @method initComboBox
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Creates the HTML for the slider 
 */

aria.widget.ListBox.prototype.initMenu = function() {

    var listbox = this;
  
    var eventMouseOver = function (event) {
      listbox.eventMouseOver(event, listbox);
    };
    this.listBoxNode.addEventListener('mouseover',   eventMouseOver);

    var eventMouseOut = function (event) {
      listbox.eventMouseOut(event, listbox);
    };
    this.listBoxNode.addEventListener('mouseout',   eventMouseOut);

    var cn = this.listBoxNode.firstChild;

    while (cn) {
      if (cn.nodeType === Node.ELEMENT_NODE) {
        if (cn.getAttribute('role')  === 'option') {
          cn.tabIndex = -1;
          if (!this.firstComboItem) this.firstComboItem = cn; 
          this.lastComboItem = cn;

          // This is for the case of the LI elements containing the A elements
          var links = cn.getElementsByTagName('A');

          if (links.length) {
            links[0].tabIndex = -1;
            cn.href = links[0].href;
          }

          var eventKeyDown = function (event) {
            listbox.eventKeyDown(event, listbox);
          };

          cn.addEventListener('keydown', eventKeyDown);
        }
      }
      cn = cn.nextSibling;
    }


};

/**
 * @method nextComboItem
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Moves focus to next menuItem 
 */

aria.widget.ListBox.prototype.nextComboItem = function(currentComboItem) {

  var mi = currentComboItem.nextSibling;

  while (mi) {
    if ((mi.nodeType === Node.ELEMENT_NODE) && 
      (mi.getAttribute('role')  === 'option')) {
      mi.focus();
      break;
    }
    mi = mi.nextSibling;
  }

  if (!mi && this.firstComboItem) {
    this.firstComboItem.focus();
  }
  
  return mi;
};

/**
 * @method previousComboItem
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Moves focus to next menuItem 
 */

aria.widget.ListBox.prototype.previousComboItem = function(currentComboItem) {

  var mi = currentComboItem.previousSibling;

  while (mi) {
    if (mi.nodeType === Node.ELEMENT_NODE && mi.getAttribute('role')  === 'option') {
      mi.focus();
      break;
    }
    mi = mi.previousSibling;
  }

  if (!mi && this.lastComboItem) {
    this.lastComboItem.focus();
  }
  
  return mi;
};

/**
 * @method setInput
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Sets the text of the input field.
 */

aria.widget.ListBox.prototype.setInput = function(currentComboItem) {
  selectedInput = currentComboItem.childNodes[0].nodeValue;
  this.inputNode.setAttribute("value", selectedInput);

};


/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Keydown event handler for ListBox Object
 *        NOTE: The listbox parameter is needed to provide a reference to the specific
 *               listbox 
 */

aria.widget.ListBox.prototype.eventKeyDown = function(event, listbox) {

  var ct = event.currentTarget;
  var nt = ct;
  
  var flag = false;

  switch(event.keyCode) {

  case listbox.keyCode.SPACE:
  case listbox.keyCode.RETURN:
    listbox.setInput(ct);
    flag = true;
    break;

  case listbox.keyCode.ESC:
    listbox.comboBox.closeComboBox();
    listbox.comboBox.inputNode.focus();  
    flag = true;
    break;

  case listbox.keyCode.UP:
    if (event.altKey) {
      listbox.comboBox.toggleListBox();
      listbox.comboBox.inputNode.focus();
      flag = true;
      break;
    }
    nt = listbox.previousComboItem(ct);
    flag = true;
    break;
  case listbox.keyCode.LEFT:
    nt = listbox.previousComboItem(ct);
    flag = true;
    break;

  case listbox.keyCode.DOWN:
    if (event.altKey) {
      listbox.comboBox.toggleListBox();
      listbox.comboBox.inputNode.focus();
      flag = true;  
      break;
    }
    nt = listbox.nextComboItem(ct);
    flag = true;
    break;
  case listbox.keyCode.RIGHT:
    nt = listbox.nextComboItem(ct);
    flag = true;
    break;

  case listbox.keyCode.TAB:
    listbox.comboBox.closeComboBox();
    break;

  default:
    break;
  }

  
  if (flag) {
    if(nt){listbox.setInput(nt)}
    event.stopPropagation();
    event.preventDefault();
  }  
  
};

/**
 * @method eventMouseOver
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Keydown event handler for ListBox Object
 *        NOTE: The listbox parameter is needed to provide a reference to the specific
 *               listbox
 */

aria.widget.ListBox.prototype.eventMouseOver = function(event, listbox) {

  listbox.mouseInMenu = true;
  listbox.comboBox.openComboBox();

};

/**
 * @method eventMouseOut
 *
 * @memberOf aria.widget.ListBox
 *
 * @desc  Keydown event handler for ListBox Object
 *        NOTE: The listbox parameter is needed to provide a reference to the specific
 *               listbox 
 */

aria.widget.ListBox.prototype.eventMouseOut = function(event, listbox) {

  listbox.mouseInMenu = false;
  setTimeout(function(){ listbox.comboBox.closeComboBox() }, 500);

};

/* ---------------------------------------------------------------- */
/*                  ComboBox Input Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor ComboBox Input
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a Menu Button widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node               Object    -  JQuery node object
 * @property  mouseInMenuButton  Boolean   - Flag indicating the mouse is in listbox button, so listbox should stay open
 * @property  mouseInMenu        Boolean   - Flag indicating the mouse is in listbox, so listbox should stay open
 */

aria.widget.ComboBoxInput = function(node) {

  this.keyCode = Object.freeze({
     "TAB"    : 9,
     "RETURN" : 13,
     "ESC"    : 27,
     "SPACE"  : 32,
     "ALT"    : 18,

     "UP"    : 38,
     "DOWN"  : 40
  });

  // Check fo DOM element node
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;

  this.done = true;
  this.mouseInMouseButton = false;
  
  var inputs = document.getElementsByTagName('input');
  if (inputs && inputs[0]) this.inputNode = inputs[0];
  
  var buttons = document.getElementsByTagName('button');
  if (buttons && buttons[0]) this.buttonNode = buttons[0];
};

/**
 * @method initComboBox
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Adds event handlers to button element 
 */

aria.widget.ComboBoxInput.prototype.initComboBox = function() {

  var id = this.inputNode.getAttribute('aria-controls');

  if (id) {
    this.listBoxNode = document.getElementById(id);

    if (this.listBoxNode) {
      this.listbox = new aria.widget.ListBox(this.listBoxNode, this.inputNode, this.buttonNode, this);
        this.listbox.initMenu();
    }
  }  


  this.closeComboBox();

  var comboBox = this;
  
    var eventKeyDown = function (event) {
      comboBox.eventKeyDown(event, comboBox);
    };
    this.inputNode.addEventListener('keydown',   eventKeyDown);

    /* var eventMouseOver = function (event) {
      comboBox.eventMouseOver(event, comboBox);
    };
    this.inputNode.addEventListener('mouseover',   eventMouseOver);

    var eventMouseOut = function (event) {
      comboBox.eventMouseOut(event, comboBox);
    };
    this.inputNode.addEventListener('mouseout',   eventMouseOut);
 */

};

/**
 * @method openComboBox
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Opens the listbox
 */

aria.widget.ComboBoxInput.prototype.openComboBox = function() {

  if (this.listBoxNode) {
    var pos = aria.Utils.findPos(this.inputNode);
    var br = this.inputNode.getBoundingClientRect();

    this.listBoxNode.style.display = 'block';
    this.listBoxNode.style.position = 'absolute';
    this.listBoxNode.style.top  = (pos.y + br.height) + "px"; 
    this.listBoxNode.style.left = pos.x + "px"; ;
  }  
};


/**
 * @method closeComboBox
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Close the listbox
 */

aria.widget.ComboBoxInput.prototype.closeComboBox = function() {

  if (!this.mouseInMenuButton && 
    !this.listbox.mouseInMenu &&
    this.listBoxNode) this.listBoxNode.style.display = 'none';

};

/**
 * @method toggleListBox
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Close or open the listbox depending on current state
 */

aria.widget.ComboBoxInput.prototype.toggleListBox = function() {

  if (this.listBoxNode) {
    if (this.listBoxNode.style.display === 'block') this.listBoxNode.style.display = 'none';
    else this.listBoxNode.style.display = 'block';
  }

};

/**
 * @method moveFocusToFirstListBoxItem
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Move keyboard focus to first listbox item
 */

aria.widget.ComboBoxInput.prototype.moveFocusToFirstListBoxItem = function() {

  if (this.listbox.firstComboItem) {
    this.openComboBox();
    this.listbox.firstComboItem.focus();
  }

};

/**
 * @method moveFocusToLastListBoxItem
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Move keyboard focus to first listbox item
 */

aria.widget.ComboBoxInput.prototype.moveFocusToLastListBoxItem = function() {

  if (this.listbox.lastComboItem) {
    this.openComboBox();
    this.listbox.lastComboItem.focus();
  }

};

/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Keydown event handler for ComboBoxInput Object
 *        NOTE: The comboBox parameter is needed to provide a reference to the specific
 *               comboBox 
 */

aria.widget.ComboBoxInput.prototype.eventKeyDown = function(event, comboBox) {

  var flag = false;
  
  switch(event.keyCode) {
    case comboBox.keyCode.RETURN:
      if (!comboBox.isLink) {
        comboBox.toggleListBox();
        flag = true;
      }
      break;

    case comboBox.keyCode.UP:
      if (event.altKey) {
        comboBox.toggleListBox();
        flag = true;
        comboBox.moveFocusToLastListBoxItem();
        break;
      } 

    case comboBox.keyCode.DOWN:
      if (event.altKey) {
        comboBox.toggleListBox();
        flag = true;
        comboBox.moveFocusToFirstListBoxItem();
        break;
      }

  
    case comboBox.keyCode.ESC:
      comboBox.closeComboBox();
      flag = true;
      break;

    case comboBox.keyCode.TAB:
      comboBox.closeComboBox();
      break;

    default:
      break;
    }
  
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }  

};

/**
 * @method eventMouseOver
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Keydown event handler for ComboBoxInput Object
 *        NOTE: The comboBox parameter is needed to provide a reference to the specific
 *               comboBox 
 */

/* aria.widget.ComboBoxInput.prototype.eventMouseOver = function(event, comboBox) {

  comboBox.mouseInMenuButton = true;
  comboBox.openComboBox();

}; */

/**
 * @method eventMouseOut
 *
 * @memberOf aria.widget.ComboBoxInput
 *
 * @desc  Keydown event handler for ComboBoxInput Object
 *        NOTE: The comboBox parameter is needed to provide a reference to the specific
 *               comboBox 
 */

/* aria.widget.ComboBoxInput.prototype.eventMouseOut = function(event, comboBox) {

  comboBox.mouseInMenuButton = false;
  setTimeout(function(){ comboBox.closeComboBox() }, 500);

}; */
