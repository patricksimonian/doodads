
var SimpleToggler = function(widgets, options) {
    options = options || {};
    widgets = widgets || [];
    this.options = Object.assign(SimpleToggler.defaultOptions(), options);
    this.widgets = widgets;
    this.map = new Map();
    return this.initialize();
  }
}

SimpleToggler.defaultOptions = function() {
  return {
    beforeOnClick: function(e, toggler, widgets, target) {
      return toggler;
    },
    afterOnClick: function(e, toggler, widgets, target) {
      return toggler;
    },
    onClick: function(e, toggler, widgets, target) {
      return toggler;
    }
  }
}

SimpleToggler.prototype.initialize = function() {
  // create a map based on the widgets and their respective target
  var m = new Map();
  var handler = this.handleToggleClicked.bind(this);
  //loop over widgets, turn into dom objects and set into map
  for(var w of this.widgets) {
    var toggler = document.querySelectorAll(w.toggler);
    var target;
    var mapValue = {};
    if(w.hasOwnProperty("target")) {
      target = document.querySelectorAll(w.target);;
      mapValue.target = target;
    }
    if(!toggler.length || (target && !target.length)) {
      throw new Error("The toggle or target selector " + w.toggler + " " + w.target + " could not be found");
    }

    if(w.hasOwnProperty("customHandler")) {
      mapValue.customHandler = w.customHandler
    }

    for(var i = 0; i < toggler.length; i++) {
      if(m.has(toggler[i])) {
        toggler[i].removeEventListener("click", handler, false);
      }
      toggler[i].addEventListener("click", handler, false);
      m.set(toggler[i], mapValue);
    }
  }
  this.map = m;
  return this;
}

SimpleToggler.prototype.handleToggleClicked = function(e) {
  e.stopPropagation();
  // get toggler, get widget
  var toggler = e.currentTarget;
  var widget = this.map.get(toggler);
  var args = [e, toggler, this.widgets];
  if(widget.hasOwnProperty("target")) {
    args.push(widget.target);
  }
  if(widget.hasOwnProperty("customHandler")) {
    // attempt to grab handlers by the handler group
    var handlers = this.options.customHandlers[widget.customHandler];
    if(handlers.hasOwnProperty("beforeOnClick")) {
      handlers.beforeOnClick.apply(null, args);
    }
    if(handlers.hasOwnProperty("onClick")) {
      handlers.onClick.apply(null, args);
    }
    if(handlers.hasOwnProperty("afterOnClick")) {
      handlers.afterOnClick.apply(null, args);
    }
  } else {
    this.options.beforeOnClick.apply(null, args);
    this.options.onClick.apply(null, args);
    this.options.afterOnClick.apply(null, args);
  }
  return;
}
