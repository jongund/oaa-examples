

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
 

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initializ all treeitems based on the selector li
 */


window.addEventListener('load', function() {

  var subTreeitems = document.querySelectorAll('li[role="treeitem"][aria-expanded="false"]');

  for(var i = 0; i < subTreeitems.length; i++ ) {
    var st = subTreeitems[i];

    console.log(st+ "subTreeitems");
  }

  var rootTreeitems = document.querySelectorAll('ul[role="tree"]>li:first-child')


  for(var i = 0; i < rootTreeitems.length; i++ ) {
    var rt = rootTreeitems[i];
    console.log(rt.tagName + " "+rt.textContent);
  }





});


