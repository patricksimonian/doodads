// returns a new HSL string on every call of the return of the wrapper fn
  // the way it is set up allows for predicatable color string itterations
  // if the hue is cycled and finds its self having the same value as the startingHue
  // the saturation is increased to prevent two colors being the same **if the theme
  // is set to make unique colours
 const genHSL = function genHSL(desiredTheme, customTheme) {
    var cycleNum;
    // check if we have the cycleNumber function, if not just use a place holder
    // function
    if(!NumUtils || !NumUtils.cycleNumber) {
      cycleNum = function cycleNumber(value, incrementer, limit, startingPoint = 0) {
        value += incrementer;
        if(value > limit) {
          value = (value % limit) + startingPoint;
        }
        return value;
      }
    } else {
      cycleNum = NumUtils.cycleNumber;
    }
    let hslThemes = {
      soft: {
        makeAsUniqueAsPossible: true,
        hue: {
          start: 269,
          current: 269,
          min: 0, 
          max: 360, 
          incrementBy: 66
        },
        sat: {
          start: 33,
          current: 33,
          min: 25,
          max: 100, 
          incrementBy: 25
        },
        light: {
          start: 50,
          current: 50,
          min: 25, 
          max: 100,
          incrementBy: 25
        }
      },
      custom: customTheme
    }
    let usedTheme;

    // make sure theme exists
    if(!hslThemes.hasOwnProperty(desiredTheme) && !(customTheme instanceof Object)) {
      let themesStr = Object.keys(hslThemes).join(", ");
      throw new Error("incorrect arguments passed to the function, valid themes are: " + themesStr + "  PLEASE NOTE \"custom\" requires a custom theme object passed in in the format \n\n " + JSON.stringify(hslThemes, null, 2));
    } else {
      // if it does exist assign it as a brand new obejct so that its muteable
      usedTheme = Object.assign({}, hslThemes[desiredTheme]);
    }

    return function() {
      let h = usedTheme.hue.current;
      let s = usedTheme.sat.current;
      let l = usedTheme.light.current;
      let hslString = `hsl(${h}, ${s}%, ${l}%)`;
      // cycle up hue
      usedTheme.hue.current = cycleNum(usedTheme.hue.current, usedTheme.hue.incrementBy, usedTheme.hue.max, usedTheme.hue.min);
      // if the used theme should make unique colors turn up saturation incase hues match
      if(usedTheme.makeAsUniqueAsPossible) {
        if(usedTheme.hue.current === usedTheme.hue.start) {
          usedTheme.sat.current = cycleNum(usedTheme.sat.current, usedTheme.sat.incrementBy, usedTheme.sat.max, usedTheme.sat.min);
        }
      }
      return hslString;
    }
  } 
