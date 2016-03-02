

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

  var toolbars = document.querySelectorAll('div.toolbar');

  [].forEach.call(toolbars, function(toolbar){
    if (toolbar){
      var tb = new aria.widget.Toolbar(toolbar)
      tb.initToolbar();
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
/*                  Toolbar Widget                                  */
/* ---------------------------------------------------------------- */

/**
 * @constructor Toolbar
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

aria.widget.Toolbar = function(node){

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
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;
  
  var textAreas = node.getElementsByTagName('textarea');
  if (textAreas && textAreas[0]) this.textArea = textAreas[0];
  
  this.buttons = node.getElementsByTagName('button');
  this.firstButton = this.buttons[0]
  nb = this.firstButton
  while(nb){
    if(nb.nodeType === Node.ELEMENT_NODE &&
      (nb.tagName  === 'BUTTON')){
      this.lastButton = nb
    }
    nb = nb.nextSibling
  }
  this.currentButton = this.firstButton
};

/**
 * @method initToolbar
 *
 * @memberOf aria.widget.Toolbar
 *
 * @desc  Adds event handlers to input element 
 */

aria.widget.Toolbar.prototype.initToolbar = function(){
  
  var toolbar = this;
  
  var eventKeyDown = function (event){
    toolbar.buttonKeyDown(event, toolbar);
  };
  for(i=0;i<this.buttons.length;i++){
    this.buttons[i].addEventListener('keydown', eventKeyDown)
  }

};

/**
 * @method nextButton
 *
 * @memberOf aria.widget.Toolbar
 *
 * @desc  Moves focus to the next toolbar button 
 */
 
aria.widget.Toolbar.prototype.nextButton = function(){
  var cb = this.currentButton
  var pb = cb.nextSibling;

  while (pb){
    if(pb.nodeType === Node.ELEMENT_NODE &&
      (pb.tagName  === 'BUTTON')){
      cb.tabIndex = -1
      pb.tabIndex = 0
      pb.focus()
      this.currentButton = pb;
      return pb;
    }
    pb = pb.nextSibling;
  }

  if (!pb && this.firstButton){
    pb = this.firstButton;
    cb.tabIndex = -1
    pb.tabIndex = 0
    pb.focus()
    this.currentButton = pb;
    return pb;
  }
  return false;
};

/**
 * @method previousButton
 *
 * @memberOf aria.widget.Toolbar
 *
 * @desc  Moves focus to the previous toolbar button 
 */

aria.widget.Toolbar.prototype.previousButton = function(){
  var cb = this.currentButton
  var pb = cb.previousSibling;

  while (pb){
    if(pb.nodeType === Node.ELEMENT_NODE &&
      (pb.tagName  === 'BUTTON')){
      cb.tabIndex = -1
      pb.tabIndex = 0
      pb.focus()
      this.currentButton = pb;
      return pb;
    }
    pb = pb.previousSibling;
  }

  if (!pb && this.lastButton){
    pb = this.lastButton;
    cb.tabIndex = -1
    pb.tabIndex = 0
    pb.focus()
    this.currentButton = pb;
    return pb;
  }
  return false;
};


/**
 * @method buttonKeyDown
 *
 * @memberOf aria.widget.Toolbar
 *
 * @desc  handles keydown events for the buttons
 */
 
aria.widget.Toolbar.prototype.buttonKeyDown = function(event, toolbar){
  
  var flag = false;
  
  switch(event.keyCode){
    case toolbar.keyCode.RIGHT:
      cb = toolbar.nextButton();
      flag = true;
      break;
    case toolbar.keyCode.LEFT:
      cb = toolbar.previousButton();
      flag = true;
      break;
    
    
  }
  if (flag){
    event.stopPropagation();
    event.preventDefault();
  }
}

/**
 * @function increaseFontSize
 *
 * @desc  Increases the font size of the text area
 */
 
increaseFontSize = function(event){
  var button = event.currentTarget
  var textArea = document.getElementById(button.getAttribute("aria-controls"))
  textFontSize = textArea.style.fontSize
  fontSize = textFontSize.replace("px","")
  fontSize = Number(fontSize)
  if (fontSize < 24){
    fontSize = Number(fontSize) + 2
    fontSize = fontSize.toString() + "px"
    textArea.style.fontSize = fontSize;
  }
}

/**
 * @function decreaseFontSize
 *
 * @desc  Decreases the font size of the text area
 */
 
decreaseFontSize = function(event){
  var button = event.currentTarget
  var textArea = document.getElementById(button.getAttribute("aria-controls"))
  textFontSize = textArea.style.fontSize
  fontSize = textFontSize.replace("px","")
  fontSize = Number(fontSize)
  if (fontSize > 10){
    fontSize = Number(fontSize) - 2
    fontSize = fontSize.toString() + "px"
    textArea.style.fontSize = fontSize;
  }
}

/**
 * @method justify
 *
 * @memberOf aria.widget.Toolbar
 *
 * @desc  Justifies the text of the text area to the the specified direction
 */
justify = function(event, justification){
  var button = event.currentTarget
  var textArea = document.getElementById(button.getAttribute("aria-controls"))
  textArea.style.textAlign = justification
  
  unhightlightJustify(event)
  highlightJustify(event, justification)
}



unhightlightJustify = function(event){
  var button = event.currentTarget.parentNode.firstChild;  
  while(button){
    if (button.nodeType === Node.ELEMENT_NODE){
      if (button.tagName === 'BUTTON'){
        img = button.firstChild
        while(img){
          if (img.nodeType === Node.ELEMENT_NODE){
            if (img.tagName === 'IMG'){
              if(img.src.indexOf('-pressed') > 0){
                var imgText = img.src.replace('-pressed','')
                img.src = imgText;
              }   
            }
          }
          img = img.nextSibling;
        }
      }
    }button = button.nextSibling
  }  
  
}

highlightJustify = function(event,item){
  var img = event.currentTarget.firstChild;
  var itemText = item.replace(".png","")

  while(img) {
    if (img.nodeType === Node.ELEMENT_NODE) {
      if (img.tagName === 'IMG') break;
    }
    img = img.nextSibling;
  }
  if(img.src.indexOf(item + '.png') > 0){
    var imgText = "./images/" + itemText + "-pressed.png"
    img.src = imgText;
  }  
}
