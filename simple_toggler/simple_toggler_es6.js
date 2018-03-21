class SimpleToggler {
  constructor(widgets = [], options = {}) {
    this.options = Object.assign(SimpleToggler.defaultOptions(), options);
    this.widgets = widgets;
    return this.initialize();
  }

  static defaultOptions() {
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

  initialize() {
    // create a map based on the widgets and their respective target
    let m = new Map();
    let handler = this.handleToggleClicked.bind(this);
    //loop over widgets, turn into dom objects and set into map
    for(let w of this.widgets) {
      let toggler = document.querySelectorAll(w.toggler);
      let target;
      let mapValue = {};
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

      for(let i = 0; i < toggler.length; i++) {
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

  handleToggleClicked(e) {
    e.stopPropagation();
    // get toggler, get widget
    let toggler = e.currentTarget;
    let widget = this.map.get(toggler);
    let args = [e, toggler, this.widgets];
    if(widget.hasOwnProperty("target")) {
      args.push(widget.target);
    }
    if(widget.hasOwnProperty("customHandler")) {
      // attempt to grab handlers by the handler group
      let handlers = this.options.customHandlers[widget.customHandler];
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
}


function SimpleToggler(widgets, options) {
    options = options || {};
    widgets = widgets || [];
    this.options = Object.assign(SimpleToggler.defaultOptions(), options);
    this.widgets = widgets;
    this.map = new Map();
    return this.initialize();
  }
}
