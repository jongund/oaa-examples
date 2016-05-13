/*
 * Copyright 2011-2014 University of Illinois
 * Authors: Thomas Foltz and Jon Gunderson
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
 * ARIA megamenu example
 * @function onload
 * @desc after page has loaded initialize all megamenu buttons based on the selector "button.megamenu-button"
 */
 
window.addEventListener('load', function(){

  var megaMenuButtons = document.querySelectorAll('button.megamenu-button');
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
  
  this.dialogBox = new aria.widget.DialogBox(this);
  this.dialogBox.initDialogBox();
  
  var eventClick = function(event){
    megaMenuButton.eventClick();
    };
  megaMenuButton.node.addEventListener('click', eventClick);
  megaMenuButton.node.addEventListener('touchstart', eventClick);
  
};

aria.widget.MegaMenuButton.prototype.eventClick = function(){
  this.dialogBox.openMegamenu()
}

/**
 * @desc  Creates a dialog box widget 
 */

aria.widget.DialogBox = function(megaMenuButton){
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
 * @desc  creates a new dialog box, adds event listeners to the dialog box and initalizes the menus.
 */

aria.widget.DialogBox.prototype.initDialogBox = function(){
  dialogBox = this;
  var dialogDivID = this.megaMenuButton.node.getAttribute("aria-controls")
  this.dialogDiv = document.getElementById(dialogDivID)
  
  this.dialogCloseButton = this.dialogDiv.getElementsByClassName('megamenu-close-button')//Needs to be updated
  this.dialogCloseButton = this.dialogCloseButton[0]
  
  var cn = this.dialogDiv.getElementsByTagName('*')//Here I need to find the first and last elements, as well as elements before and after the menu
  for(var i=0; i<cn.length; i++){
    if(cn[i].tabIndex == 0 && cn[i].tagName.indexOf('DIV') < 0){
      if(!this.firstItem) this.firstItem = cn[i];
      this.lastItem = cn[i];
    }
  }
  this.firstItem.focus()
  
  var bodyNodes = document.getElementsByTagName("body");
  if (bodyNodes && bodyNodes[0]){
    this.bodyNode = bodyNodes[0];
  }
  
  this.bodyNode.setAttribute("aria-hidden","true");
  
  
  //Begin event handlers
  var eventClick = function(event){
    dialogBox.cancelButtonClick(event, dialogBox);
  }
  var eventBodyClick = function(event){
    dialogBox.bodyClick(event, dialogBox);
  }
  var eventBodyKeyDown = function(event){
    dialogBox.bodyKeyDown(event, dialogBox);
  }
  var eventKeyDown = function (event){
    dialogBox.keyDown(event, dialogBox);
  };
  
  this.lastItem.addEventListener('keydown', eventKeyDown); //Look for first dialog element
  this.firstItem.addEventListener('keydown', eventKeyDown); //Look for last dialog element
  this.dialogCloseButton.addEventListener('click', eventClick);
  this.bodyNode.addEventListener('click', eventBodyClick);
  this.bodyNode.addEventListener('keydown', eventBodyKeyDown);
  
  
  //Menu Stuff
  this.menus = (this.dialogDiv.getElementsByTagName("UL"))
  
  for(var i=0; i<cn.length; i++){
    if(cn[i].tabIndex == 0 && cn[i].tagName.indexOf('DIV') < 0){ //check for div is for IE compatability
      if(this.menus[0].contains(cn[i])){
        break;
      }
    var firstMenuPrev = cn[i];
    }
  }
  if(!firstMenuPrev)firstMenuPrev = this.lastItem;
  
  cn = this.menus[this.menus.length-1].nextSibling
  while(cn){
    if(cn.tabIndex == 0 && cn.tagName.indexOf('DIV') < 0){
      var lastMenuNext = cn;
      break;
    }
    cn = cn.nextSibling
  }
  if(!lastMenuNext) lastMenuNext = this.firstItem;
  
  
  for(var i = 0; i < this.menus.length; i++){ 
    var menu = new Menu(this.menus[i]);
    if(i==0){
      menu.init(firstMenuPrev, null);
    }
    else if(i==this.menus.length-1){
      menu.init(null, lastMenuNext);
    }
    else{
      menu.init(null,null);
    }
  }
}

/**
 * @method closeDialogBox
 *
 * @memberOf aria.Widget.DialogBox
 *
 * @desc  removes the dialog box and all event listeners on it.
 */
 
aria.widget.DialogBox.prototype.closeDialogBox = function(){
  this.dialogDiv.setAttribute("aria-hidden","true");
  this.bodyNode.setAttribute("aria-hidden","false");
  this.dialogDiv.style.display="none";
  this.megaMenuButton.node.focus();
  this.megamenuOpen = false;
}

/**
 * @method keyDown
 *
 * @memberOf aria.Widget.DialogBox
 *
 * @desc  makes sure the user cannot tab out of the dialog box
 */

aria.widget.DialogBox.prototype.keyDown = function(event, dialogBox){ //Need to clean this up a lot.
  if(event.keyCode == dialogBox.keyCode.TAB){ //If tab is pressed
    var tabableOptions = dialogBox.dialogDiv.getElementsByTagName("A");
    if(event.shiftKey && (this.firstItem == event.currentTarget)){ //And shift is pressed on the first element
      if(this.menus[this.menus.length-1].contains(this.lastItem)){ //if the last element is part of a menu
        for(var i=0; i < tabableOptions.length; i++){
          if(tabableOptions[i].getAttribute("tabindex") == "0"){
            var lastItem = tabableOptions[i];
          }
        }
        lastItem.focus()
      }
      else{
        this.lastItem.focus()
      }
      event.stopPropagation();
      event.preventDefault();
    }
    else if(event.currentTarget == dialogBox.lastItem && !event.shiftKey){ //And on the last element
      if(this.menus[0].contains(this.firstItem)){ //if the first element is part of a menu
        for(var i=0; i < tabableOptions.length; i++){
          if(tabableOptions[i].getAttribute("tabindex") == "0"){
            tabableOptions[i].focus();
            break;
          }
        }
      }else{
        this.firstItem.foucs()
      }
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

/**
 * @method cancelButtonClick
 *
 * @memberOf aria.Widget.DialogBox
 *
 * @desc  closes the dialog box if the cancel button was clicked.
 */
 
aria.widget.DialogBox.prototype.cancelButtonClick = function(event, dialogBox){
  if(event.currentTarget == this.dialogCloseButton){
    dialogBox.closeDialogBox();
  }
}

/**
 * @method bodyClick
 *
 * @memberOf aria.Widget.DialogBox
 *
 * @desc  makes sure clicks outside of the dialog box do nothing
 */

aria.widget.DialogBox.prototype.bodyClick = function(event, dialogBox){
  if(!dialogBox.dialogDiv.contains(event.target)){
    event.stopPropagation();
    event.preventDefault();
  }
}

/**
 * @method openMegamenu
 *
 * @memberOf aria.Widget.DialogBox
 *
 * @desc  Opens the megamenu
 */
 
aria.widget.DialogBox.prototype.openMegamenu = function(){
  this.dialogDiv.setAttribute("aria-hidden", "false");
  this.bodyNode.setAttribute("aria-hidden", "true");
  this.dialogDiv.style.display = "block";
  this.dialogCloseButton.focus()
  this.megamenuOpen = true;
}

/**
 * @method bodyKeyDown
 *
 * @memberOf aria.Widget.DialogBox
 *
 * @desc  Handles escape and tab presses on the body.
 */
 
aria.widget.DialogBox.prototype.bodyKeyDown = function(event, dialogBox){
  if(this.megamenuOpen){
    if(event.keyCode==dialogBox.keyCode.ESC){
      dialogBox.closeDialogBox();
      
    }
    if(!dialogBox.dialogDiv.contains(event.target)){
      if(event.keyCode == dialogBox.keyCode.TAB){
        dialogBox.firstItem.focus();
        event.stopPropagation();
        event.preventDefault();
      }
    }
  }
}