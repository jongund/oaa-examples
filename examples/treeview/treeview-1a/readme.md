# Example 1a: Expects browser to compute values for aria-level, aria-setsize and aria-posinset

* In this example the ARIA treeview relationships (e.g. tree, group and treeitem) are defined in the parent child relationships defined int he DOM structure.
* This example relies on the browser to calculate the values of aria-level, aria-setsize and aria-posinset for communication to accessibility APIs. NOTE: The ARIA specification recommends, but does not require browsers to compute these values.
* Pressing "space" or "enter" will trigger the click event added to each treeitem, which updates the "File or Folder Selected" textbox.
* Example based on the WAI-ARIA 1.1: Tree View authoring practices