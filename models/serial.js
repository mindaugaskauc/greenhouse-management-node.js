"use strict";

var SerialPort = require('serialport');

var Readline = require('@serialport/parser-readline');

var _require1 = require('./db'),
    insertWeatherTemperatureDB = _require1.insertWeatherTemperatureDB,
    insertSoilTemperatureDB = _require1.insertSoilTemperatureDB,
    insertSoilHumidityDB = _require1.insertSoilHumidityDB,
    insertSoilPHDB = _require1.insertSoilPHDB;

var _require2 = require('./facebook'),
    // Send Facebook message
    sendFSMessage = _require2.sendFSMessage;


var port = new SerialPort('COM4', {
  baudRate: 115200
});
var serial_reader = port.pipe(new Readline({ delimiter: '\n'})); //Soil Temperature
//------Reading values from the controller---------
// Weather Temperature
var weather_temperature = 0;
var weather_temp_last_status = "";
var weather_temp_start_time = Date.now();
var recv_weather_temp = ""; //Field temperature

// Soil Temperature
var soil_temperature = 0;
var soil_temp_last_status = "";
var soil_temp_start_time = Date.now();
var recv_soil_temp = ""; //Soil temperature
var soil_temp_lim1 = 0; // 
var soil_temp_lim2 = 0;

// Soil Humidity
var soil_humidity = 0;
var soil_hum_last_status = "";
var soil_hum_start_time = Date.now();
var recv_soil_hum = ""; //Soil humidity

// Soil pH
var soil_pH = 0;
var soil_pH_last_status = "";
var soil_pH_start_time = Date.now();
var recv_soil_pH = ""; //Soil pH
var soil_pH_lim1 = 0; // 
var soil_pH_lim2 = 0;

//----------------------------------------
// Parser function to parse JSON value
function tryParseJson (str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return JSON.parse(str);
}
//-------Reading values from controller
serial_reader.on('data', function (data) {

  // Parse JSON object to JavaScript opject
  console.log(tryParseJson(data));
  const sensorData = tryParseJson(data);

  // Show weather, soil temperature and soil humidity
  console.log(sensorData.weather_temperature);
  console.log(sensorData.soil_temperature);
  console.log(sensorData.soil_humidity);
  console.log(sensorData.soil_pH);

  recv_weather_temp = sensorData.weather_temperature;
  recv_soil_temp = sensorData.soil_temperature;
  recv_soil_hum = sensorData.soil_humidity;
  recv_soil_pH = sensorData.soil_pH;

  var weather_temp_current_line = parseFloat(recv_weather_temp);
  var soil_temp_current_line = parseFloat(recv_soil_temp);
  var soil_hum_current_line = parseInt(recv_soil_hum);
  var soil_pH_current_line = parseFloat(recv_soil_pH);

  console.log("Weather Temperature");
  console.log(weather_temperature);
  console.log("Soil Temperature");
  console.log(soil_temperature);
  console.log("Soil Humidity");
  console.log(soil_humidity);
  console.log("Soil pH");
  console.log(soil_pH); 
  
  //---------------Get Weather Temperature-----------------------

  if (!isNaN(weather_temp_current_line)) {
    weather_temperature = weather_temp_current_line;
  } else {
    weather_temp_last_status = weather_temp_current_line;
  }

  if (Date.now() - weather_temp_start_time > 30000) {
    insertWeatherTemperatureDB(Date.now(), weather_temperature);
    weather_temp_start_time = Date.now();
  }
  //-------------Get Soil Temperature-------------------------

  if (!isNaN(soil_temp_current_line)) {
    soil_temperature = soil_temp_current_line;
  } else {
    soil_temp_last_status = soil_temp_current_line;
  }

  if (Date.now() - soil_temp_start_time > 30000) {
    insertSoilTemperatureDB(Date.now(), soil_temperature);
    soil_temp_start_time = Date.now();
  }

  //----------Get Soil Humidity---------------------

  if (!isNaN(soil_hum_current_line)) {
    soil_humidity = soil_hum_current_line;
  } else {
    soil_hum_last_status = soil_hum_current_line;
  }

  if (Date.now() - soil_hum_start_time > 30000) {
    insertSoilHumidityDB(Date.now(), soil_humidity);
    soil_hum_start_time = Date.now();
  }

  //-------------Get Soil pH-------------------------

  if (!isNaN(soil_pH_current_line)) {
    soil_pH = soil_pH_current_line;
  } else {
    soil_pH_last_status = soil_pH_current_line;
  }

  if (Date.now() - soil_pH_start_time > 30000) {
    insertSoilPHDB(Date.now(), soil_pH);
    soil_pH_start_time = Date.now();
  } 

  //-------------Send Facebook message if soil temperature too high or too low----
  console.log('Min soil temperature in serial is: ', soil_temp_lim1);
  console.log('Max soil temperature in serial is: ', soil_temp_lim2);

  const server_err_soil_temp = "Klaida serveryje";
  const soil_temp_below_min = "Dirvožemio temperatūra per žema";
  const soil_temp_above_max = "Dirvožemio temperatūra per aukšta";
 
  if (soil_temp_lim1 != 0 && soil_temperature < soil_temp_lim1) {
   sendFSMessage(soil_temp_below_min, (err) => {
     if (err) {
       return res.status(500).render('indexSoilTemperature', {
         serverErr: server_err_soil_temp
       }); 
     }
    });
  }
  else if (soil_temp_lim2 != 0 && soil_temperature > soil_temp_lim2) {
   sendFSMessage(soil_temp_above_max, (err) => {
     if (err) {
       return res.status(500).render('indexSoilTemperature', {
         server_err_soil_temp: server_err_soil_temp
       }); 
     }
    });
  }

  //-------------Send Facebook message if soil pH too high or too low----
  console.log('Min soil pH in serial is: ', soil_pH_lim1);
  console.log('Max soil pH in serial is: ', soil_pH_lim2);

  const server_err_soil_pH = "Klaida serveryje";
  const soil_pH_below_min = "Dirvožemio pH per žemas";
  const soil_pH_above_max = "Dirvožemio pH per aukštas";
 
  if (soil_pH_lim1 != 0 && soil_pH < soil_pH_lim1) {
   sendFSMessage(soil_pH_below_min, (err) => {
     if (err) {
       return res.status(500).render('indexSoilPH', {
         serverErr: server_err_soil_pH
       }); 
     }
    });
  }
  else if (soil_pH_lim2 != 0 && soil_pH > soil_pH_lim2) {
   sendFSMessage(soil_pH_above_max, (err) => {
     if (err) {
       return res.status(500).render('indexSoilPH', {
         server_err_soil_pH: server_err_soil_pH
       }); 
     }
    });
  }
    
}); 

//---------------Set Weather Temperature--------------------------

function setWeatherTempLimit(weather_temp_limit, weather_t_value) {
  var type;
  if (weather_temp_limit === 1) //lower
    type = 'L';else if (weather_temp_limit === 2) //upper
    type = 'U';else return 1;
  port.write("SET " + type + " " + weather_t_value);
}

function setWeatherTempLimits(weather_temp_limit1, weather_temp_limit2) {
  var message = 'SET WTEMP ' + weather_temp_limit1 + ' ' + weather_temp_limit2;
    port.write(message, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
}

function getWeatherTemperature() {
  return weather_temperature;
}
//----------------Set Soil Temperature-------------------------------

function setSoilTempLimit(soil_temp_limit, soil_t_value) {
  var type;
  if (soil_temp_limit === 1) //lower
    type = 'L';else if (soil_temp_limit === 2) //upper
    type = 'U';else return 1;
  port.write("SET " + type + " " + soil_t_value);
}

function setSoilTempLimits(soil_temp_limit1, soil_temp_limit2) {
 soil_temp_lim1 = soil_temp_limit1;
 soil_temp_lim2 = soil_temp_limit2;
}

function getSoilTemperature() {
  return soil_temperature;
} 
//---------------Set Soil Humidity------------------------------------

function setSoilHumLimit(soil_hum_limit, soil_h_value) {
  var type;
  if (soil_hum_limit === 1) //lower
    type = 'L';else if (soil_hum_limit === 2) //upper
    type = 'U';else return 1;
  port.write("SET " + type + " " + soil_h_value);
}

function setSoilHumLimits(soil_hum_limit1, soil_hum_limit2) {
  // https://bobbyhadz.com/blog/javascript-concatenate-string-with-variable
  // http://matthughes.io/serial-communication-with-node-js-and-arduino/ 
  // https://medium.com/@machadogj/arduino-and-node-js-via-serial-port-bcf9691fab6a
  var message = 'SET HUM ' + soil_hum_limit1 + ' ' + soil_hum_limit2;
    port.write(message, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
}

function getSoilHumidity() {
  return soil_humidity;
}

//----------------Set Soil pH-------------------------------

function setSoilPHLimit(soil_pH_limit, soil_pH_value) {
  var type;
  if (soil_pH_limit === 1) //lower
    type = 'L';else if (soil_pH_limit === 2) //upper
    type = 'U';else return 1;
  port.write("SET " + type + " " + soil_pH_value);
}

function setSoilPHLimits(soil_pH_limit1, soil_pH_limit2) {
 soil_pH_lim1 = soil_pH_limit1;
 soil_pH_lim2 = soil_pH_limit2;
}

function getSoilPH() {
  return soil_pH;
} 

//-----------Set watering------------------
function turnOnOffWatering(value) {
  var message = value;
  console.log('I have got message ' + message);
    port.write(message, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
  }
//---------Set Opening and Closing Windows--------
function openCloseWindow(value) {
  var message = value;
  console.log('I have got message ' + message);
    port.write(message, (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
}

module.exports = {
  //Weather Temperature
  getWeatherTemperature: getWeatherTemperature,
  setWeatherTempLimits: setWeatherTempLimits,
  setWeatherTempLimit: setWeatherTempLimit,
  //Soil Temperature
  getSoilTemperature: getSoilTemperature,
  setSoilTempLimits: setSoilTempLimits,
  setSoilTempLimit: setSoilTempLimit,
  //Field Temperature
  getWeatherTemperature: getWeatherTemperature,
  setWeatherTempLimits: setWeatherTempLimits,
  setWeatherTempLimit: setWeatherTempLimit,
  //Soil Humidity
  getSoilHumidity: getSoilHumidity,
  setSoilHumLimits: setSoilHumLimits,
  setSoilHumLimit: setSoilHumLimit,
  //Soil pH
  getSoilPH: getSoilPH,
  setSoilPHLimits: setSoilPHLimits,
  setSoilPHLimit: setSoilPHLimit,
  // Watering
  turnOnOffWatering: turnOnOffWatering,
  // Open and Close Windows
  openCloseWindow: openCloseWindow,
  // Send Facebook message
  sendFSMessage: sendFSMessage
};