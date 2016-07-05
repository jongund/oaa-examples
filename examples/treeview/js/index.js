$(function() {
$(".codepen-able").each(function() {

    var el = $(this),
        type = el.data("type"),
        codeInside = el.find("code"),
        isCodeInside = codeInside.length,
        HTML = "",
        CSS = "",
        JS = "";
  
    console.log(type);
    
    if (type == "html") {
      if (codeInside) {
        HTML = codeInside.html();
      } else {
        HTML = el.html();
      }
    } else if (type == "css") {
      if (codeInside) {
        CSS = codeInside.html();
      } else {
        CSS = el.html();
      }
    } else if (type == "js") {
      if (codeInside) {
        JS = codeInside.html();
      } else {
        JS = el.html();
      }
    }

    var data = {
      title              : "",
      description        : "",
      html               : HTML,
      html_pre_processor : "none",
      css                : CSS,
      css_pre_processor  : "none",
      css_starter        : "neither",
      css_prefix_free    : false,
      js                 : JS,
      js_pre_processor   : "none",
      js_modernizr       : false,
      js_library         : "",
      html_classes       : "",
      css_external       : "../css/treeview-1.css",
      js_external        : "treeview.js"
    };

    var JSONstring = 
      JSON.stringify(data)
      // Quotes will screw up the JSON
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    var form = 
      '<form action="http://codepen.io/pen/define" method="POST" target="_blank">' + 
        '<input type="hidden" name="data" value=\'' + 
          JSONstring + 
          '\'>' + 
        '<input type="image" src="http://s.cdpn.io/3/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">' +
      '</form>';

    el.append(form);

  });
  
});