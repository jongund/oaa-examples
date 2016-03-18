

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

window.addEventListener('load', function(){

  var dialogButtons = document.querySelectorAll('button.dialogButton');
  [].forEach.call(dialogButtons, function(dialogButton){
    if (dialogButton){
      var tb = new aria.widget.DialogButton(dialogButton)
      tb.initDialogButton();
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

 * @desc  Computes absolute position of an element
 *
 * @param  element    DOM node  -  DOM node object
 *
 * @retruns  Object  Object contains left and top position
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
/*                  dialogButton Widget                                  */
/* ---------------------------------------------------------------- */

/**
 * @constructor dialogButton
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a toolbar widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node               Object    -  JQuery node object
 */

aria.widget.DialogButton = function(node){

  if (typeof node !== 'object' || !node.getElementsByClassName) return false;
  
  this.node = node

};

/**
 * @method initDialogButton
 *
 * @memberOf aria.widget.DialogButton
 *
 * @desc  Adds event handlers to button element 
 */

aria.widget.DialogButton.prototype.initDialogButton = function(){
  
  var dialogButton = this;
  
  var eventClick = function(event){
    dialogButton.eventClick();
    };
  dialogButton.node.addEventListener('click', eventClick);
  dialogButton.node.addEventListener('touchstart', eventClick);
  
};

aria.widget.DialogButton.prototype.eventClick = function(){
  this.dialogBox = new aria.widget.DialogBox(this);
  this.dialogBox.initDialogBox();

}

/**
 * @constructor Button
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a Button widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node               Object    -  JQuery node object
 */

aria.widget.DialogBox = function(dialogButton){
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
  this.dialogButton = dialogButton;
};

aria.widget.DialogBox.prototype.initDialogBox = function(){
  dialogBox = this;
  var winW = window.innerWidth;
  var winH = window.innerHeight;
  
  this.dialogoverlay = document.createElement('DIV');
  this.dialogoverlay.id = "dialogoverlay"
  
  buttonParent = this.dialogButton.node.parentNode;
  ce = buttonParent.firstChild
  while(ce){
    if ((ce.nodeType === Node.ELEMENT_NODE) && 
        (ce.tagName  === 'BUTTON')){
          ce = ce.nextSibling.nextSibling;
          break;
        }
    ce = ce.nextSibling;
  }
  buttonParent.insertBefore(this.dialogoverlay, ce)
  

  this.dialogBoxNode = document.createElement('DIV');
  buttonParent.insertBefore(this.dialogBoxNode, ce);
  this.dialogBoxNode.id = "dialogbox1";
  this.dialogoverlay.style.display = "block";
  this.dialogoverlay.style.height = winH+"px";
  this.dialogBoxNode.style.left = (winW/2) - (550 * .5)+"px";
  this.dialogBoxNode.style.top = "100px";
  this.dialogBoxNode.style.display = "block";

  dialogBoxMiddle = document.createElement('DIV');
  this.dialogBoxNode.appendChild(dialogBoxMiddle);
  
  var dialogHead = document.createElement('DIV');
  dialogBoxMiddle.appendChild(dialogHead);
  dialogHead.setAttribute('class', 'dialogboxhead');
  var dialogBody = document.createElement('DIV');
  dialogBoxMiddle.appendChild(dialogBody);
  dialogBody.setAttribute('class', 'dialogboxbody');
  var dialogFoot = document.createElement('DIV');
  dialogBoxMiddle.appendChild(dialogFoot);
  dialogFoot.setAttribute('class', 'dialogboxfoot');
  dialogHead.innerHTML = "Add a contact";
  dialogBody.innerHTML = "Name:";
  dialogBody.innerHTML += '<br><input id="prompt_value1">';
  dialogBody.innerHTML += '<br>Phone:';
  dialogBody.innerHTML += '<br><input id="prompt_value2">';
  dialogBody.innerHTML += '<br>Address:';
  dialogBody.innerHTML += '<br><input id="prompt_value3">';
  dialogFoot.innerHTML = '<button id="submit">OK</button> <button id="last_dialog_element">Cancel</button>';
  this.firstItem = document.getElementById('prompt_value1')
  this.lastItem = document.getElementById('last_dialog_element')
  this.submit = document.getElementById('submit')
  this.firstItem.focus();
  
  var bodyNodes = document.getElementsByTagName("body");
  if (bodyNodes && bodyNodes[0]){
    this.bodyNode = bodyNodes[0];
  }
  
  
  var eventClick = function(event){
    dialogBox.buttonClick(event, dialogBox);
  }
  this.eventBodyClick = function(event){
    dialogBox.bodyClick(event, dialogBox);
  }
  this.eventBodyKeyDown = function(event){
    dialogBox.bodyKeyDown(event, dialogBox);
  }
  var eventKeyDown = function (event){
    dialogBox.keyDown(event, dialogBox);
  };
  
  this.lastItem.addEventListener('keydown', eventKeyDown);
  this.firstItem.addEventListener('keydown', eventKeyDown);
  this.lastItem.addEventListener('click', eventClick);
  this.firstItem.addEventListener('click', eventClick);
  this.submit.addEventListener('click', eventClick);
  this.bodyNode.addEventListener('click', this.eventBodyClick);
  this.bodyNode.addEventListener('keydown', this.eventBodyKeyDown);

}
aria.widget.DialogBox.prototype.closeDialogBox = function(){
  this.bodyNode.removeEventListener('click', this.eventBodyClick);
  this.bodyNode.removeEventListener('keydown', this.eventBodyKeyDown);
  this.dialogBoxNode.style.display = "none";
  this.dialogoverlay.style.display = "none";
  this.dialogButton.node.focus();
}
aria.widget.DialogBox.prototype.submitDialogBox = function(){
  this.bodyNode.removeEventListener('click', this.eventBodyClick);
  this.bodyNode.removeEventListener('keydown', this.eventBodyKeyDown);
  var prompt_value1 = document.getElementById('prompt_value1').value;
  var prompt_value2 = document.getElementById('prompt_value2').value;
  var prompt_value3 = document.getElementById('prompt_value3').value;
  this.dialogBoxNode.style.display = "none";
  this.dialogoverlay.style.display = "none";
  var contactList = document.getElementById('contact-list-body');
              // <tr>
                // <td>Joe</td>
                // <td>1234567890</td>
                // <td>123 Yellow Dr</td>
              // </tr>
  tableEntry = document.createElement('TR');
  contactList.appendChild(tableEntry);
  contactName = document.createElement('TD');
  contactName.textContent = prompt_value1;
  contactPhone = document.createElement('TD');
  contactPhone.textContent = prompt_value2;
  contactAddress = document.createElement('TD');
  contactAddress.textContent = prompt_value3;
  contactList.appendChild(contactName);
  contactList.appendChild(contactPhone);
  contactList.appendChild(contactAddress);
  this.dialogButton.node.focus()
}



aria.widget.DialogBox.prototype.keyDown = function(event, dialogBox){
  if(event.keyCode == dialogBox.keyCode.TAB){
    if(event.shiftKey && event.currentTarget == dialogBox.firstItem){
      dialogBox.lastItem.focus();
      event.stopPropagation();
      event.preventDefault();
    }else if(event.currentTarget == dialogBox.lastItem && !event.shiftKey){
      dialogBox.firstItem.focus();
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

aria.widget.DialogBox.prototype.buttonClick = function(event, dialogBox){
  if(event.currentTarget == this.submit){
    dialogBox.submitDialogBox();
  }else if(event.currentTarget == this.lastItem){
    dialogBox.closeDialogBox();
  }
}

aria.widget.DialogBox.prototype.bodyClick = function(event, dialogBox){
  if(!dialogBox.dialogBoxNode.contains(event.target)){
    event.stopPropagation();
    event.preventDefault();
  }
}

aria.widget.DialogBox.prototype.bodyKeyDown = function(event, dialogBox){
  if(event.keyCode ==dialogBox.keyCode.ESC){
    dialogBox.closeDialogBox();
    
  }
  if(!dialogBox.dialogBoxNode.contains(event.target)){
    if(event.keyCode == dialogBox.keyCode.TAB){
      dialogBox.firstItem.focus();
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
