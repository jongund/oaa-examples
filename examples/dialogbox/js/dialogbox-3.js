

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

  var guessingDiv = document.getElementById("numberGuessingGame");
  var tb = new aria.widget.GuessingGame(guessingDiv)
  tb.initGuessingGame();
  
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
/*                  GuessingGame Widget                                  */
/* ---------------------------------------------------------------- */

/**
 * @constructor GuessingGame
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

aria.widget.GuessingGame = function(guessingDiv){

  this.guessingDiv = guessingDiv;
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

};

/**
 * @method initGuessingGame
 *
 * @memberOf aria.widget.GuessingGame
 *
 * @desc  Adds event handlers to button element 
 */

aria.widget.GuessingGame.prototype.initGuessingGame = function(){
  
  var GuessingGame = this;
  
  var buttons = this.guessingDiv.getElementsByTagName("button");
  if (buttons && buttons[0] && buttons[1]){
    this.submitButton = buttons[0];
    this.resetButton = buttons[1];
  }
  
  var inputs = this.guessingDiv.getElementsByTagName("input");
  if (inputs && inputs[0]){
    this.input = inputs[0];
  }
  
  this.alertDiv = document.getElementById("guessing_game_alert");
  
  
  
  var submitGuess = function(event){
    GuessingGame.submitGuess();
    };
  var inputKeyDown = function(event){
    GuessingGame.inputKeyDown();
  };
  var initializeGame = function(event){
    GuessingGame.initializeGame();
    };
  this.submitButton.addEventListener('click', submitGuess);
  this.submitButton.addEventListener('touchstart', submitGuess);
  this.resetButton.addEventListener('click', initializeGame);
  this.resetButton.addEventListener('touchstart', initializeGame);
  this.input.addEventListener('keydown', inputKeyDown);
  
  GuessingGame.initializeGame();
  
};

aria.widget.GuessingGame.prototype.submitGuess = function(){
  this.numberOfGuesses += 1;
  this.dialogBox = new aria.widget.DialogBox(this);
  this.dialogBox.initDialogBox();

}

aria.widget.GuessingGame.prototype.initializeGame = function(){
  this.value = Math.floor(Math.random()*(10)) + 1;
  this.numberOfGuesses = 0;
  this.submitButton.disabled = false;
  this.alertDiv.innerHTML = "Guess a number between 1 and 10."
  this.input.value = "";
  this.input.focus();
}

aria.widget.GuessingGame.prototype.inputKeyDown = function(){
  
  if(event.keyCode == this.keyCode.RETURN && !this.submitButton.disabled){
    this.submitGuess();
    event.stopPropagation();
    event.preventDefault();
  }else if(event.keyCode == this.keyCode.RETURN){
    this.initializeGame()
    event.stopPropagation();
    event.preventDefault();
  }
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

aria.widget.DialogBox = function(guessingGame){
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
  this.guessingGame = guessingGame;
};

aria.widget.DialogBox.prototype.initDialogBox = function(){
  dialogBox = this;
  alertDiv = this.guessingGame.alertDiv

  var guessedValue = this.guessingGame.input.value
  if(isNaN(guessedValue) || guessedValue == ""){
    alertDiv.innerHTML = "You must guess an int"
    this.guessingGame.input.focus()
    this.guessingGame.input.select()
  }
  else if(this.guessingGame.value > guessedValue){
    alertDiv.innerHTML = "Your guess of " + guessedValue + " was too small.";
    this.guessingGame.input.focus()
    this.guessingGame.input.select()
  }
  else if(this.guessingGame.value < guessedValue){
    alertDiv.innerHTML = "Your guess of " + guessedValue + " was too large.";
    this.guessingGame.input.focus()
    this.guessingGame.input.select()
  }
  else if(this.guessingGame.value == guessedValue){
    if(this.guessingGame.numberOfGuesses == 1){
      alertDiv.innerHTML = "Your guess of " + guessedValue + " was correct.  You got it on the first try!";
    }else{
      alertDiv.innerHTML = "Your guess of " + guessedValue + " was correct! It only took you " + this.guessingGame.numberOfGuesses + " tries.";
    }
    this.guessingGame.submitButton.disabled = true;
    this.guessingGame.resetButton.focus();
  }
}
