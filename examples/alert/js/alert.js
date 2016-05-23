window.addEventListener('load', function() {

  var button = document.getElementById('alert-trigger');

  button.addEventListener('click', addAlert);

});

/*
* @function addAlert
*
* @desc Adds an alert to the page
*/

function addAlert(event) {

  var example = document.getElementById('example');
  var template = document.getElementById('alert-template').innerHTML;

  example.innerHTML = template;

}
