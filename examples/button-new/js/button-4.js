function init() {
  // Create variables for the various buttons
  var alert2Button =  document.getElementById('alert2');

  // Add event listeners to the various buttons
  alert2Button.addEventListener('click', alertButtonEventHandler);

}

/**
 * @function alertButtonEventHandler
 *
 * @desc  Handles events for the alert button
 */

function alertButtonEventHandler(event) {
  var message = 'Hej, hello, ciao, こんにちは';
  
  alert(message);
  
}

window.addEventListener('load', init);
