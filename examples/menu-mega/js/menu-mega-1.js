

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
 
/**
 * ARIA Menu Button example
 * @function onload
 * @desc after page has loaded initializ all dialog buttons based on the selector "button.megaMenuButton"
 */

window.addEventListener('load', function(){

  var megaMenuButtons = document.querySelectorAll('button.megaMenuButton');
  [].forEach.call(megaMenuButtons, function(megaMenuButton){
    if (megaMenuButton){
      var tb = new aria.widget.MegaMenuButton(megaMenuButton)
      tb.initMegaMenuButton();
    }  
  });
});

/** 
 * @namespace aria
 */

var aria = aria ||{};

/* ---------------------------------------------------------------- */
/*                  ARIA Utils Namespace                        */ 
/* ---------------------------------------------------------------- */

/**
 * @constructor Menu
 *
 * @memberOf aria.Utils
 *
 * @desc  Computes absolute position of an element
 */

aria.Utils = aria.Utils ||{};

aria.Utils.findPos = function(element){
    var xPosition = 0;
    var yPosition = 0;
  
    while(element){
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return{ x: xPosition, y: yPosition };
};


/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                           */ 
/* ---------------------------------------------------------------- */

aria.widget = aria.widget ||{};


/* ---------------------------------------------------------------- */
/*                  megaMenuButton Widget                                  */
/* ---------------------------------------------------------------- */

/**
 * @constructor megaMenuButton
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a dialog button widget
 */

aria.widget.MegaMenuButton = function(node){

  if (typeof node !== 'object' || !node.getElementsByClassName) return false;
  
  this.node = node

};

/**
 * @method initMegaMenuButton
 *
 * @memberOf aria.widget.MegaMenuButton
 *
 * @desc  Adds event handlers to button element 
 */

aria.widget.MegaMenuButton.prototype.initMegaMenuButton = function(){
  
  var megaMenuButton = this;
  
  var eventClick = function(event){
    megaMenuButton.eventClick();
    };
  megaMenuButton.node.addEventListener('click', eventClick);
  megaMenuButton.node.addEventListener('touchstart', eventClick);
  
};

aria.widget.MegaMenuButton.prototype.eventClick = function(){
  this.megaMenuBox = new aria.widget.MegaMenuBox(this);
  this.megaMenuBox.initMegaMenuBox();

}

/**
 * @constructor Button
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a dialog box widget using ARIA 
 */

aria.widget.MegaMenuBox = function(megaMenuButton){
  this.keyCode = Object.freeze({
     "TAB"    : 9,
     "RETURN" : 13,
     "ESC"    : 27,
     "SPACE"  : 32,
     "ALT"    : 18,

     "UP"    : 38,
     "DOWN"  : 40,
     "RIGHT" : 39,
     "LEFT"  : 37
  });
  this.megaMenuButton = megaMenuButton;
};

/**
 * @method initMegaMenuBox
 *
 * @memberOf aria.Widget.MegaMenuBox
 *
 * @desc  creates a new dialog box, processes the current guess, and adds event listeners to the dialog box.
 */

aria.widget.MegaMenuBox.prototype.initMegaMenuBox = function(){
  megaMenuBox = this;
  var winW = window.innerWidth;
  var winH = window.innerHeight;
  
  this.dialogDiv = document.getElementById("dialogbox1")
  this.dialogDiv.setAttribute("aria-hidden", "false")
  this.dialogDiv.style.display = "block"
  this.dialogOpen = true;

  this.firstItem = document.getElementById('first_dialog_element');
  this.lastItem = document.getElementById('last_dialog_element');
  this.firstItem.focus()
  var bodyNodes = document.getElementsByTagName("body");
  if (bodyNodes && bodyNodes[0]){
    this.bodyNode = bodyNodes[0];
  }
  
  this.bodyNode.setAttribute("aria-hidden","true");
  var eventClick = function(event){
    megaMenuBox.cancelButtonClick(event, megaMenuBox);
  }
  this.eventBodyClick = function(event){
    megaMenuBox.bodyClick(event, megaMenuBox);
  }
  this.eventBodyKeyDown = function(event){
    megaMenuBox.bodyKeyDown(event, megaMenuBox);
  }
  var eventKeyDown = function (event){
    megaMenuBox.keyDown(event, megaMenuBox);
  };
  
  this.lastItem.addEventListener('keydown', eventKeyDown);
  this.firstItem.addEventListener('keydown', eventKeyDown);
  this.lastItem.addEventListener('click', eventClick);
  this.firstItem.addEventListener('click', eventClick);
  this.bodyNode.addEventListener('click', this.eventBodyClick);
  this.bodyNode.addEventListener('keydown', this.eventBodyKeyDown);
  
  menus = (this.dialogDiv.getElementsByTagName("UL"))
  this.firstMenu = menus[0];
  for(var i = 0; i < menus.length; i++){
    var menu = new Menu(menus[i]);
    if(i==0){
      menu.init(this.lastItem, null);
    }
    else if(i==menus.length-1){
      menu.init(null, this.firstMenu);
    }
    else{
      menu.init(null,null);
    }
  }
}

/**
 * @method closeMegaMenuBox
 *
 * @memberOf aria.Widget.MegaMenuBox
 *
 * @desc  removes the dialog box and all event listeners on it.
 */
 
aria.widget.MegaMenuBox.prototype.closeMegaMenuBox = function(){
  this.dialogDiv.setAttribute("aria-hidden","true");
  this.dialogDiv.style.display="none";
  this.bodyNode.setAttribute("aria-hidden","false");
  this.megaMenuButton.node.focus();
}

/**
 * @method keyDown
 *
 * @memberOf aria.Widget.MegaMenuBox
 *
 * @desc  makes sure the user cannot tab out of the dialog box
 */

 aria.widget.MegaMenuBox.prototype.keyDown = function(event, megaMenuBox){
  if(event.keyCode == megaMenuBox.keyCode.TAB){
    if(event.shiftKey && this.firstMenu.contains(event.currentTarget)){
      this.lastItem.focus();
      event.stopPropagation();
      event.preventDefault();
    }else if(event.currentTarget == megaMenuBox.lastItem && !event.shiftKey){
      tabableOptions = megaMenuBox.dialogDiv.getElementsByTagName("A");
      for(var i=0; i < tabableOptions.length; i++){
        if(tabableOptions[i].getAttribute("tabindex") == "0"){
          tabableOptions[i].focus();
          break;
        }
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

/**
 * @method cancelButtonClick
 *
 * @memberOf aria.Widget.MegaMenuBox
 *
 * @desc  closes the dialog box if the cancel button was clicked.
 */
 
aria.widget.MegaMenuBox.prototype.cancelButtonClick = function(event, megaMenuBox){
  if(event.currentTarget == this.lastItem){
    megaMenuBox.closeMegaMenuBox();
  }
}

/**
 * @method bodyClick
 *
 * @memberOf aria.Widget.MegaMenuBox
 *
 * @desc  makes sure clicks outside of the dialog box do nothing
 */

aria.widget.MegaMenuBox.prototype.bodyClick = function(event, megaMenuBox){
  if(!megaMenuBox.dialogDiv.contains(event.target)){
    event.stopPropagation();
    event.preventDefault();
  }
}

/**
 * @method bodyKeyDown
 *
 * @memberOf aria.Widget.MegaMenuBox
 *
 * @desc  Handles escape and tab presses on the body.
 */
 
aria.widget.MegaMenuBox.prototype.bodyKeyDown = function(event, megaMenuBox){
  if(event.keyCode ==megaMenuBox.keyCode.ESC){
    megaMenuBox.closeMegaMenuBox();
    
  }
  if(!megaMenuBox.dialogDiv.contains(event.target)){
    if(event.keyCode == megaMenuBox.keyCode.TAB){
      megaMenuBox.firstItem.focus();
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
