var KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    UP: 38
}

window.addEventListener('load', function() {

  var combobox = document.querySelectorAll('[role=option]');
  for(var i = 0; i < combobox.length; i++ ) {
    var cb = combobox[i];

    cb.addEventListener('click', clickComboBox);
    cb.addEventListener('keydown', keyDownComboBox);
    cb.addEventListener('focus', focusComboItem);
    cb.addEventListener('blur', blurComboItem);
  }

});

/* 
* @function firstComboItem
*
* @desc Returns the first radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function firstComboItem(node) {
  
  var first = node.parentNode.firstChild;
  
  while(first) {
    if (first.nodeType === Node.ELEMENT_NODE) {
      if (first.getAttribute("role") === 'option') return first;
    }
    first = first.nextSibling;
  }
  
  return null;
}

/* 
* @function lastComboItem
*
* @desc Returns the last radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function lastComboItem(node) {
  
  var last = node.parentNode.lastChild;

  while(last) {
    if (last.nodeType === Node.ELEMENT_NODE) {
      if (last.getAttribute("role") === 'option') return last;
    }
    last = last.previousSibling;
  }
  
  return last;
}

/* 
* @function nextComboItem
*
* @desc Returns the next radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function nextComboItem(node) {
  
  var next = node.nextSibling;
  
  while(next) {
    if (next.nodeType === Node.ELEMENT_NODE) {
      if (next.getAttribute("role") === 'option') return next;
    }
    next = next.nextSibling;
  }
  
  return null;
}

/* 
* @function previousComboItem
*
* @desc Returns the previous radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function previousComboItem(node) {
  
  var prev = node.previousSibling;
  
  while(prev) {
    if (prev.nodeType === Node.ELEMENT_NODE) {
      if (prev.getAttribute("role") === 'option') return prev;
    }
    prev = prev.previousSibling;
  }
  
  return null;
}

/*
* @function setComboItem
*
* @desc Toogles the state of a radio button
*
* @param   {Object}  event  -  Standard W3C event object
*
*/

function setComboItem(node, state) {
  if (state == 'true') {
    node.className += ' selected';
    node.focus();
  }
  else {
    node.className = node.className.replace(' selected', '');
    node.className = node.className.replace(' focus', '');
  }  
}

/*
* @function clickComboBox
*
* @desc 
*
* @param   {Object}  node  -  DOM node of updated group radio buttons
*/

function clickComboBox(event) {
  var type = event.type;
  
  if (type === 'click') {
    var node = event.currentTarget;

    var comboItem = firstComboItem(node);

    while (comboItem) {
      setComboItem(comboItem, "false");
      comboItem = nextComboItem(comboItem);
    } 

    setComboItem(node, "true");

    event.preventDefault();
    event.stopPropagation();
  }
}

/*
* @function keyDownComboBox
*
* @desc 
*
* @param   {Object}   node  -  DOM node of updated group radio buttons
*/

function keyDownComboBox(event) {
  var type = event.type;
  var next = false;
  
  if(type === "keydown"){
    var node = event.currentTarget;
  
    switch (event.keyCode) {
      case KEYCODE.DOWN:
      case KEYCODE.RIGHT:
        var next = nextComboItem(node);
        break;

      case KEYCODE.UP:
      case KEYCODE.LEFT:
        next = previousComboItem(node);
        break;
        
      case KEYCODE.SPACE:
        next = node;
        break;
    }
    
    if (next) {
      var comboItem = firstComboItem(node);

      while (comboItem) {
        setComboItem(comboItem, "false");
        comboItem = nextComboItem(comboItem);
      } 
      
      setComboItem(next, "true");

      event.preventDefault();
      event.stopPropagation();
    }
  }  
}

/*
* @function focusComboItem
*
* @desc Adds focus styling to label element encapsulating standard radio button
*
* @param   {Object}  event  -  Standard W3C event object
*/

function focusComboItem(event) {
  event.currentTarget.className += ' focus';
}

/*
* @function blurComboItem
*
* @desc Adds focus styling to the label element encapsulating standard radio button
*
* @param   {Object}  event  -  Standard W3C event object
*/

function blurComboItem(event) {
   event.currentTarget.className = event.currentTarget.className.replace(' focus','');
}
