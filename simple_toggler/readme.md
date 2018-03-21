
# Simple Toggler

This little class organizes is an organizing for repetitive toggling
tasks you introduce into your interface. A common use would be for
a sidebar navigation utility. With the custom handler option,
you have the flexibility of introducing different handlers to different
sets of togglers.

**All DOM searches used initially are by the query selector All Method**

### Constructor:
```
   widgets: Object[]
   options: Object
```
### Constructor Params:
- widgets: the widgets is an array of objects. Each 'widget' in the array is as follows:
```
 widget {
    toggler: selector[String], //query selector all is used to find and bind events
    target: selector[String], //optional, query selector all is used to find all elements
    customHandler: name[String], //this is the name of the custom handler group assigned in the options
 }
```
- options: these are the supported options as of now:
  - beforeOnClick: [Function callback Event]
  - onClick: [Function callback Event]
  - afterOnClick: [Function callback Event]
  - customHandlers: [Object] see Custom Handlers

### Callback Events:
   The event callbacks called when a toggler is clicked are as follow:
 - beforeOnClick
 - onClick
 - afterOnClick

##### callback arguments:
the arguments passed (in order) are:
- e [Event],
- toggler [DOM element]
- widgets[Array] this is the widgets array that was passed in to the constructor
- target[DOM element] <b>optionally passed in if you provided a target</b>

### Custom Handlers:
The customer handlers property allows you to group a custom set of handlers
and associate them with specific widget. If a widget has a custom handler
property who's value matches the name of the key in your custom handlers Object,
the before, on, and after callbacks in the custom handler will be called for that widget. **When custom handlers are passed only they will be called, the base callbacks will not be called**

### Usage:

##### Basic Usage:

Markup:
```
  <nav>
    <ul>
      <li data-section="section-a">Section A</li>
      <li data-section="section-b">Section B</li>
      <li data-section="section-c">Section C</li>
    </ul>
  </nav>
  <main>
    <div id="section-a" class="active">This is Section A</div>
    <div id="section-b">This is Section B</div>
    <div id="section-c">This is Section C</div>
  </main>
```
CSS:
```
  main > div { display: none;}
  main > div.active { display: block;}
```
JS:
```
  var widgets = [{
      toggler: "nav li",
      target: "main > div"
  }];

  var options = {
    onClick: function(e, toggler, widgets, sections) {
      for(var i = 0; i < sections.length; i++) {
        if(toggler.dataset.section === sections[i].id) {
          sections[i].classList.add("active");
        } else {
          sections[i].classList.remove("active");
        }
      }
    }
  }

  var toggler = new SimpleToggler(widgets, options);
```


##### Advanced Usage:

Markup:
```
  <nav>
    <ul data-hideable>
      <li data-section="section-a">Section A</li>
      <li data-section="section-b">Section B</li>
      <li data-section="section-c">Section C</li>
    </ul>
    <h1 data-hideable>Special Options</h1>
    <ul>  
      <li class='nav-show-hide'>show/hide nav</li>
    </ul>
  </nav>
  <main>
    <div id="section-a" class="active">This is Section A</div>
    <div id="section-b">This is Section B</div>
    <div id="section-c">This is Section C</div>
  </main>
```
CSS:
```
  main > div { display: none;}
  main > div.active { display: block;}
  nav[data-toggled="true"] *[data-hideable] {
    display: none;
  }
```
JS:
```
  var widgets = [{
      toggler: "nav li",
      target: "main > div"
  }, {
      toggler: ".nav-show-hide",
      customHandler: "navToggleHandlers",
      target: "nav"
  }];

  var options = {
    onClick: function(e, toggler, widgets, sections) {
      for(var i = 0; i < sections.length; i++) {
        if(toggler.dataset.section === sections[i].id) {
          sections[i].classList.add("active");
        } else {
          sections[i].classList.remove("active");
        }
      }
    },
    customHandlers: {
      navToggleHandlers: {
        onClick: function(e, toggler, widgets, nav) {
          var nav = nav[0];
          nav.dataset.toggled = nav.dataset.toggled === "true" ? "false" : "true";
        }
      }
    }
  }

  var toggler = new SimpleToggler(widgets, options);
```
