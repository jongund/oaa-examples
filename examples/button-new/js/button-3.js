function init() {
  // Create variables for the various buttons
  var alert1Button =  document.getElementById('alert1');

  // Add event listeners to the various buttons
  alert1Button.addEventListener('click', alertButtonEventHandler);
  alert1Button.addEventListener('keydown', alertButtonEventHandler);

}

/**
 * @function alertButtonEventHandler
 *
 * @desc  Handles events for the alert button
 */

function alertButtonEventHandler(event) {
  var type = event.type;
  var message = 'Hej, hello, ciao, こんにちは';
  
  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      alert(message);
      
      event.preventDefault();
    }
  } else if (type === 'click') {
    alert(message);
  }
}

window.addEventListener('load', init);
