// importing libraries
import clock from "clock";
import document from "document";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib";

// getting SVG elements
let flame = document.getElementById("flame");
let flameHidden = document.getElementById("flameHidden");
let time = document.getElementById("time");

// flame animation
function animateFlame(delay) {
  let frame = 1;        //starting with frame 1
  let frameCount = 25;  //total 25 frames
  let i = setInterval(function(){
    
      // preloading "caching" next frame into hidden IMAGE
      if (frame < frameCount) {
        flameHidden.href = `frames/frame_apngframe${frame+1}.png`;
      } else {
        flameHidden.href = `frames/frame_apngframe${1}.png`;
      }
    
      //loading current frame
      flame.href = `frames/frame_apngframe${frame}.png`;
    
      //incrementing frame counter
      frame++;
      if (frame > frameCount) {
          frame = 1;
      }
  }, delay)
}

//kicking of flame animation with 50ms delay between frames
animateFlame(50);

// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// Update the clock every minute
clock.granularity = "minutes";

// Update the <text> element with the current time
function updateClock() {
 let today = new Date();
 
  // formatting hours based on user preferences
  let hours = dtlib.format1224hour(today.getHours());
  
  // if this is 24H format - prepending 1-digit hours with 0
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_24H) {
      hours = dtlib.zeroPad(hours);
  }
  
  // getting 0-preprended minutes
  let mins = dtlib.zeroPad(today.getMinutes());

  time.text = `${monoDigits(hours)}:${monoDigits(mins)}`;
}

// Update the clock every tick event
clock.ontick = () => updateClock();

// Don't start with a blank screen
updateClock();


//creating monospace digits
function monoDigits(digits) {
  var ret = "";
  var str = digits.toString();
  for (var index = 0; index < str.length; index++) {
    var num = str.charAt(index);
    ret = ret.concat(hex2a("0x1" + num));
  }
  return ret;
}

// Hex to string
function hex2a(hex) {
  var str = '';
  for (var index = 0; index < hex.length; index += 2) {
    var val = parseInt(hex.substr(index, 2), 16);
    if (val) str += String.fromCharCode(val);
  }
  return str.toString();
}