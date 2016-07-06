function init() {
  // Create variables for the various buttons
  var toggleButton = document.getElementById('toggle');

  // Add event listeners to the various buttons
  toggleButton.addEventListener('click', toggleButtonEventHandler);
  toggleButton.addEventListener('keydown', toggleButtonEventHandler);

}

/**
 * @function toggleButtonEventHandler
 *
 * @desc  Handles events for the toggle button
 */

function toggleButtonEventHandler(event) {
  var type = event.type;

  // Grab the keydown and click events
  if (type === 'keydown' || type === 'keypress') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      toggleButtonState(event);

      event.preventDefault();
    }
  } else if (type === 'click') {
    toggleButtonState(event);
  }
}

/**
 * @function toggleButtonState
 *
 * @desc  Toggles the state of the toggle button
 */

function toggleButtonState(event) {
  var button = event.target;
  var currentState = button.getAttribute('aria-pressed');
  var newState = 'true';

  // If aria-pressed is set to true, set newState to false
  if (currentState === 'true') {
    newState = 'false';
  }

  // Set the new aria-pressed state on the button
  button.setAttribute('aria-pressed', newState);
}

window.addEventListener('load', init);
