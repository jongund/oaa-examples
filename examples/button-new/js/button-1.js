function init() {
  // Create variables for the various buttons
  var printButton = document.getElementById('print');

    // Add event listeners to the various buttons
  printButton.addEventListener('click', printButtonEventHandler);
  printButton.addEventListener('keydown', printButtonEventHandler);

}

/**
 * @function printButtonEventHandler
 *
 * @desc  Handles events for the print button
 */
function printButtonEventHandler(event) {
  var type = event.type;
  
  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      window.print();
      
      event.preventDefault();
    }
  } else if (type === 'click') {
    window.print();
  }
}

window.addEventListener('load', init);
