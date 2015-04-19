  (function() {

    var chargingStateEl = document.getElementById("chargingState");
    var chargingTimeEl = document.getElementById("chargingTime");
    var dichargeTimeEl = document.getElementById("dischargeTime");
    var levelEl = document.getElementById("level");

    var warningEl = document.getElementById("warning");

    var updateBatteryUI = function(battery) {
      levelEl.innerText = (battery.level * 100) + "%";

      chargingTime.innerText = battery.chargingTime + " Seconds";
      dischargeTime.innerText = battery.dischargingTime + " Seconds";

      if(battery.charging === true) {
        chargingStateEl.innerText = "Charging";
      }
      else if(battery.charging === false) {
        chargingStateEl.innerText = "Discharging";
      }
    }

    var batterySuccess = function(battery) {
      updateBatteryUI(battery);

      // Monitor futher updates
      battery.addEventListener("levelchange", function() {
        // The battery level has changed, update the UI
        updateBatteryUI(battery);
      });
      battery.addEventListener("chargingchange", function() {
        // The charge state has changed, update the UI
        updateBatteryUI(battery);
      });
      battery.addEventListener("dischargingtimechange", function() {
        // The charge time has changed, update the UI
        updateBatteryUI(battery);
      });
      battery.addEventListener("chargingtimechange", function() {
        // The discharge time has changed, update the UI
        updateBatteryUI(battery);
      });

    };

    var batteryFailure = function(e) {
      warngingEl.innerText = "There was an error getting access to the Battery Status API.";
    };

    if(!!navigator.getBattery) {
      navigator.getBattery().then(batterySuccess, batteryFailure);
    }
    else {
      warngingEl.innerText = "Battery Status API is not supported on this platform.";
    }
  })();
