"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../models'),
    setSoilPHLimits = _require.setSoilPHLimits,
    getSoilPH = _require.getSoilPH,
    getAllSoilPHsDB = _require.getAllSoilPHsDB,
    truncateSoilPHTable = _require.truncateSoilPHTable;

function sanityCheck(value) {
  if (value > 9 || value < 3) return 1;
  return 0;
}

function resolveSoilPHSet(req, res, next) {
  var soil_pH_limit1 = req.body.minValue;
  var soil_pH_limit2 = req.body.maxValue;
  var soil_pH_limit_value1 = parseFloat(soil_pH_limit1);
  var soil_pH_limit_value2 = parseFloat(soil_pH_limit2); // Sanity check
  
  console.log("Min value in soilph view is: " + soil_pH_limit1);
  console.log("Max value in soilph view is: " + soil_pH_limit2);

  if (isNaN(soil_pH_limit1) || isNaN(soil_pH_limit2) || sanityCheck(soil_pH_limit_value1) || sanityCheck(soil_pH_limit_value2)) {
   
      res.redirect(302,'/indexSoilPHCError');
      return;
  }

  setSoilPHLimits(soil_pH_limit_value1, soil_pH_limit_value2);
  
    return res.redirect(302,'/indexSoilPHC');
}
/* Get all temperature measures */


router.get('/all', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  getAllSoilPHsDB(function (data, err) {
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
  truncateSoilPHTable();
  res.status(200).send();
});
/* Last temperature result */

router.get('/', function (req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    "soil_pH": getSoilPH()
  }));
});

/* Set soil pH limit */
router.post('/', resolveSoilPHSet);

/* Set soil pH limit */
router.put('/', resolveSoilPHSet);

module.exports = router;