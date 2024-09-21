"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    setSoilHumLimits = _require.setSoilHumLimits,
    getSoilHumidity = _require.getSoilHumidity,
    getAllSoilHumiditiesDB = _require.getAllSoilHumiditiesDB,
    truncateSoilHumidityTable = _require.truncateSoilHumidityTable;

// If soilhumidity is higher than 100 or lower than 0, then 
// else return success (return 0)
function sanityCheck(value) {
  if (value > 100 || value < 0) return 1; //if the value not correct print error to STDERR
  return 0; // else execution successfull
}
// set humidity limit
// https://www.w3schools.com/js/js_object_properties.asp 
// https://www.digitalocean.com/community/tutorials/nodejs-req-object-in-expressjs
// https://www.coderrocketfuel.com/article/how-to-convert-a-string-to-a-number-in-node-js 
function resolveSoilHumSet(req, res, next) { //req.body object stores soilHumLimit1 and soilHumLimit2 names of properties and their values.
  var soilHumLimit1 = req.body.minValue; //access minValue property by name via req.body object and assign its value to the variable soilHumLimit1
  var soilHumLimit2 = req.body.maxValue; //access maxValue property by name via req.body object and assign its value to the variable soilHumLimit2
  var soil_h_limit_value1 = parseInt(soilHumLimit1); //convert value to integer variable type and assign it to the variable soil_h_limit_value1
  var soil_h_limit_value2 = parseInt(soilHumLimit2); ////convert value to integer variable type and assign it to the variable soil_h_limit_value2
  
  console.log("Min value is: " + soilHumLimit1);
  console.log("Max value is: " + soilHumLimit2);
  // if soilHumLimit1 or soilHumLimit2 are not numbers
  // or soil_h_limit_value1 or soil_h_limit_value2 values are higher than 100 or lower than 0
  // show serror message, else stop execution of the function
  if (isNaN(soilHumLimit1) || isNaN(soilHumLimit2) || sanityCheck(soil_h_limit_value1) || sanityCheck(soil_h_limit_value2)) {

    res.redirect(302,'/indexSoilHumidityCError');
    //https://www.javatpoint.com/javascript-return
    // Return stops execution of the function resolveSoilHumSet
    return;
  }
  // else call the function setSoilHumLimits which sends the humidity variables to arduino
  setSoilHumLimits(soil_h_limit_value1, soil_h_limit_value2);
 
  return res.redirect(302,'/indexSoilHumidityC');
}

/* Get all temperature measures */


router.get('/all', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  getAllSoilHumiditiesDB(function (data, err) {
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
  truncateSoilHumidityTable();
  res.status(200).send();
});
/* Last humidity result */

router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "soil_hum": getSoilHumidity()
  }));
});
/* Set humidity limit */

router.post('/', resolveSoilHumSet);
/* Set humidity limit */

router.put('/', resolveSoilHumSet);
module.exports = router;