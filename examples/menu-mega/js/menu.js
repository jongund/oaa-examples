/*
*   @constructor Menu: Encapsulate state and behavior of menu
*
*   @param node : The element node that serves as the menu container.
*          Each child element that serves as a menuitem must have its
*          role attribute set to 'menuitem'.
*/
var Menu = function (node) {
  // Check whether node is a DOM element
  if (!node instanceof Element)
    throw new TypeError("Constructor argument 'node' is not a DOM Element.");

  // Check whether menu has child menuitems
  if (node.childElementCount === 0)
    throw new Error("Constructor argument 'node' has no Element children!")

  this.menuNode = node;
  node.tabIndex = -1;

  this.firstItem = null;
  this.lastItem  = null;

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
*   @method Menu.prototype.init
*
*   Initialize firstItem, lastItem
*   Set tabindex for each menuitem
*   Add event listeners for 'keydown', 'click', 'blur' and 'focus' events
*/
Menu.prototype.init = function (prevControl, nextControl) {
  this.prevControl = prevControl;
  this.nextControl = nextControl;
  var menu = this; // for reference from within event handler
  descendents = this.menuNode.getElementsByTagName('A');
  for(i=0;i < descendents.length; i++){
    element = descendents[i];
    if (element.getAttribute('role')  === 'menuitem') {
      element.tabIndex = -1;
      if (!this.firstItem) this.firstItem = element;
      this.lastItem = element;;
      element.addEventListener('keydown', function (event) {
        menu.handleKeydown(event);
      });
    }
  }
  this.firstItem.tabIndex = 0;
};

/* Event handler methods */

Menu.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
      console.log(tgt)
      href = tgt.getAttribute("href")
      console.log(href)
      window.location.href = href;
    case this.keyCode.UP:
    case this.keyCode.LEFT:
      this.previousItem(tgt);
      flag = true;
      break;

    case this.keyCode.DOWN:
    case this.keyCode.RIGHT:
      this.nextItem(tgt);
      flag = true;
      break;

    case this.keyCode.TAB:
      console.log(this.prevControl)
      console.log(this.nextControl)
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
/* Additional methods */

Menu.prototype.previousItem = function (currentItem) {
  var mi = currentItem.parentNode.previousElementSibling;
  currentItem.tabIndex = -1;
  while (mi) {
    if (mi.firstChild.getAttribute('role')  === 'menuitem') {
      mi.firstChild.focus();
      mi.firstChild.tabIndex = 0;
      break;
    }
    mi = mi.previousElementSibling;
  }

  if (!mi && this.lastItem) {
    this.lastItem.focus();
    this.lastItem.tabIndex = 0;
  }
};

Menu.prototype.nextItem = function (currentItem) {
  var mi = currentItem.parentNode.nextElementSibling;
  currentItem.tabIndex = -1;
  while (mi) {
    if (mi.firstChild.getAttribute('role')  === 'menuitem') {
      mi.firstChild.focus();
      mi.firstChild.tabIndex = 0;
      break;
    }
    mi = mi.nextElementSibling;
  }

  if (!mi && this.firstItem) {
    this.firstItem.focus();
    this.firstItem.tabIndex = 0;
  }
};