import {preferences} from "user-settings";
import document from "document";
import dtlib from "../common/datetimelib";
import {display} from "display";
import clock from "clock";
import * as messaging from "../common/fileMessaging";
import * as fs from "fs";
import { me } from "appbit";

// getting SVG elements
let flame = document.getElementById("flame");
let time = document.getElementById("time");

// get user time format preference
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;


// on app exit collect settings 
me.onunload = () => {
  fs.writeFileSync("user_settings.json", userSettings, "json");
}


// Message is received
messaging.peerSocket.onmessage = evt => {
  
  switch (evt.data.key) {
    case "timecolor": 
          userSettings[evt.data.key] = evt.data.newValue.replace(/["']/g, "");
          time.style.fill = userSettings.timecolor;
          break;
  };
 
      
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.close = () => {
  console.log("App Socket Closed");
};



// trying to get user settings if saved before
let userSettings;
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
} catch (e) {
  userSettings = {timecolor: "#000000"}
}


//trap
if (!userSettings.timecolor) userSettings = {timecolor: "#000000"}

time.style.fill = userSettings.timecolor;



flame.animate("enable");

// Update the clock every minute
clock.granularity = "minutes";

// Update the <text> element with the current time
clock.ontick = (evt) => {
  
  // getting current date time
  let today = evt.date;
 
  // formatting hours based on user preferences
  let hours = dtlib.format1224hour(today.getHours());
  
  // if this is 24H format - prepending 1-digit hours with 0
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_24H) {
      hours = dtlib.zeroPad(hours);
  }
  
  // getting 0-preprended minutes
  let mins = dtlib.zeroPad(today.getMinutes());

  time.text = `${hours}:${mins}`;

}



// on display on/off stoping/starting animation/time
display.onchange = () => {
  if (display.on) {
    flame.animate("enable");
  } else {
    flame.animate("disable");
  }
}





