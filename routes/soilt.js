"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    setSoilTempLimits = _require.setSoilTempLimits,
    getSoilTemperature = _require.getSoilTemperature,
    getAllSoilTemperaturesDB = _require.getAllSoilTemperaturesDB,
    truncateSoilTemperatureTable = _require.truncateSoilTemperatureTable;

function sanityCheck(value) {
  if (value > 32 || value < -1) return 1;
  return 0;
}

function resolveSoilTempSet(req, res, next) {
  var soilTempLimit1 = req.body.minValue;
  var soilTempLimit2 = req.body.maxValue;
  var soil_t_limit_value1 = parseFloat(soilTempLimit1);
  var soil_t_limit_value2 = parseFloat(soilTempLimit2); // Sanity check
  //const limFormatErr = "*Įvesti ne skaičiai arba dirvožemio temperatūros riba mažesnė už -1 ar didesnė už 32";
  
  console.log("Min value in soilt view is: " + soilTempLimit1);
  console.log("Max value in soilt view is: " + soilTempLimit2);

  if (isNaN(soilTempLimit1) || isNaN(soilTempLimit2) || sanityCheck(soil_t_limit_value1) || sanityCheck(soil_t_limit_value2)) {
   
      res.redirect(302,'/indexSoilTempCError');

      return;
  }

  setSoilTempLimits(soil_t_limit_value1, soil_t_limit_value2);
 
    return res.redirect(302,'/indexSoilTemperatureC');
}
/* Get all temperature measures */


router.get('/all', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  getAllSoilTemperaturesDB(function (data, err) {
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
  truncateSoilTemperatureTable();
  res.status(200).send();
});
/* Last temperature result */

router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "soil_tmp": getSoilTemperature()
  }));
});
/* Set temperature limit */

router.post('/', resolveSoilTempSet);
/* Set temperature limit */

router.put('/', resolveSoilTempSet);
module.exports = router;