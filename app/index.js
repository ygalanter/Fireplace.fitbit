// importing libraries
import document from "document";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib";
import {display} from "display";

// getting SVG elements
let flame = document.getElementById("flame");
let flameHidden = document.getElementById("flameHidden");
let time = document.getElementById("time");
let all = document.getElementById("all");


// flame animation
function animateFlame(delay) {
  let last_time_update = null;
  let frame = 1;        //starting with frame 1
  let frameCount = 12;  //total 12 frames
  return setInterval(function(){
   
      // preloading "caching" next frame into hidden IMAGE
      if (frame < frameCount) {
        flameHidden.href = `frames/frame${frame+1}.png`;
      } else {
        flameHidden.href = `frames/frame${1}.png`;
      }
    
      //loading current frame
      flame.href = `frames/frame${frame}.png`;
    
      //incrementing frame counter
      frame++;
      if (frame > frameCount) {
          frame = 1;
      }

      var now = new Date();
      if ((last_time_update == null) || (last_time_update.getMinutes() != now.getMinutes()) || (last_time_update.getHours() != now.getHours())) {
        last_time_update = now;
        updateClock(now);
      }
      
    
  }, delay)
  
}


// Update the <text> element with the current time
function updateClock(today) {
 
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

// on display on/off stoping/starting animation/time
display.onchange = () => {
  if (display.on) {
    console.log("display on")
    interval = animateFlame(50);  //restarting flame animation with 50ms delay between frames
    setTimeout(function(){all.style.visibility="visible"}, 50); //to avoid skipped frame making displat visible on 50ms delay
  } else {
    console.log("display off")
    all.style.visibility="hidden";
    clearInterval(interval);
  }
}



// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;


let interval = animateFlame(50); //kicking of flame animation with 50ms delay between frames
setTimeout(function(){all.style.visibility="visible"}, 50); //to avoid skipped frame making displat visible on 50ms delay
console.log("kicked interval");
