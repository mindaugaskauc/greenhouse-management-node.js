"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    setWeatherTempLimits = _require.setWeatherTempLimits,
    getWeatherTemperature = _require.getWeatherTemperature,
    getAllWeatherTemperaturesDB = _require.getAllWeatherTemperaturesDB,
    truncateWeatherTemperatureTable = _require.truncateWeatherTemperatureTable;

function sanityCheck(value) {
  if (value > 32 || value < -1) return 1;
  return 0;
}

function resolveWeatherTempSet(req, res, next) { //req.body object stores soilHumLimit1 and soilHumLimit2 names of properties and their values.
  var weather_temp_limit1 = req.body.minValue; //access minValue property by name via req.body object and assign its value to the variable weather_temp_limit1
  var weather_temp_limit2 = req.body.maxValue; //access maxValue property by name via req.body object and assign its value to the variable weather_temp_limit2
  var weather_t_limit_value1 = parseFloat(weather_temp_limit1); //convert value to float variable type and assign it to the variable weather_t_limit_value1
  var weather_t_limit_value2 = parseFloat(weather_temp_limit2); //convert value to float variable type and assign it to the variable weather_t_limit_value2
    
    console.log("Min value is: " + weather_t_limit_value1);
    console.log("Max value is: " + weather_t_limit_value2);
    
  if (isNaN(weather_temp_limit1) || isNaN(weather_temp_limit2) || sanityCheck(weather_t_limit_value1) || sanityCheck(weather_t_limit_value2)) {
     
      res.redirect(302,'/indexWeatherTempCError');
       //https://www.javatpoint.com/javascript-return
      // Return stops execution of the function resolveSoilHumSet
      return;
    }

  setWeatherTempLimits(weather_t_limit_value1, weather_t_limit_value2);
  
  return res.redirect(302,'/indexWeatherTemperatureC');
}
/* Get all temperature measures */


router.get('/all', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  getAllWeatherTemperaturesDB(function (data, err) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
      return;
    } else if (!data) {
      res.sendStatus(404);
      return;
    }

    res.json(data);
  });
});
/* Remove all temerature data from database */

router["delete"]('/all', function (req, res, next) {
  truncateWeatherTemperatureTable();
  res.status(200).send();
});
/* Last temperature result */

router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "weather_tmp": getWeatherTemperature()
  }));
});
/* Set temperature limit */

router.post('/', resolveWeatherTempSet);
/* Set temperature limit */

router.put('/', resolveWeatherTempSet);
module.exports = router;