"use strict";

var _require = require('./serial'),
    // Weather Temperature
    getWeatherTemperature = _require.getWeatherTemperature,
    setWeatherTempLimits = _require.setWeatherTempLimits,
    setWeatherTempLimit = _require.setWeatherTempLimit,
    // Soil Temperature
    getSoilTemperature = _require.getSoilTemperature,
    setSoilTempLimits = _require.setSoilTempLimits,
    setSoilTempLimit = _require.setSoilTempLimit,
    // Soil Humidity
    getSoilHumidity = _require.getSoilHumidity,
    setSoilHumLimits = _require.setSoilHumLimits,
    setSoilHumLimit = _require.setSoilHumLimit,
    // Soil pH
    getSoilPH = _require.getSoilPH,
    setSoilPHLimits = _require.setSoilPHLimits,
    setSoilPHLimit = _require.setSoilPHLimit,
    // Watering
    turnOnOffWatering = _require.turnOnOffWatering,
    //turnOffWatering = _require.turnOffWatering;
    // Open and Close Window
    openCloseWindow = _require.openCloseWindow;

var _require2 = require('./db'),
    // Authentication
    findUserByEmail = _require2.findUserByEmail,
    findUserByToken = _require2.findUserByToken,
    createUser = _require2.createUser,
    updateToken = _require2.updateToken,
    updatePassword = _require2.updatePassword,
    // Field temperature
    insertWeatherTemperatureDB = _require2.insertWeatherTemperatureDB,
    truncateWeatherTemperatureTable = _require2.truncateWeatherTemperatureTable,
    getAllWeatherTemperaturesDB = _require2.getAllWeatherTemperaturesDB,
    // Soil Temperature
    insertSoilTemperatureDB = _require2.insertSoilTemperatureDB,
    truncateSoilTemperatureTable = _require2.truncateSoilTemperatureTable,
    getAllSoilTemperaturesDB = _require2.getAllSoilTemperaturesDB,
    // Soil Humidity
    insertSoilHumidityDB = _require2.insertSoilHumidityDB,
    truncateSoilHumidityTable = _require2.truncateSoilHumidityTable,
    getAllSoilHumiditiesDB = _require2.getAllSoilHumiditiesDB,
    // Soil ph
    insertSoilPHDB = _require2.insertSoilPHDB,
    truncateSoilPHTable = _require2.truncateSoilPHTable,
    getAllSoilPHsDB = _require2.getAllSoilPHsDB;


var _require3 = require('./mail'),
    // Send password reset email
    sendEmail = _require3.sendEmail;

var _require4 = require('./facebook'),
    // Send Facebook message
    sendFSMessage = _require4.sendFSMessage;

module.exports = {
  // Authentication
  findUserByEmail: findUserByEmail,
  findUserByToken: findUserByToken,
  createUser: createUser,
  updateToken: updateToken,
  updatePassword: updatePassword,
  // Send password reset email
  sendEmail: sendEmail,
  // Send Facebook message
  sendFSMessage: sendFSMessage,
  //Weather Temperature
  getWeatherTemperature: getWeatherTemperature,
  setWeatherTempLimits: setWeatherTempLimits,
  setWeatherTempLimit: setWeatherTempLimit,
  insertWeatherTemperatureDB: insertWeatherTemperatureDB,
  truncateWeatherTemperatureTable: truncateWeatherTemperatureTable,
  getAllWeatherTemperaturesDB: getAllWeatherTemperaturesDB,
  //Soil Temperature
  getSoilTemperature: getSoilTemperature,
  setSoilTempLimits: setSoilTempLimits,
  setSoilTempLimit: setSoilTempLimit,
  insertSoilTemperatureDB: insertSoilTemperatureDB,
  truncateSoilTemperatureTable: truncateSoilTemperatureTable,
  getAllSoilTemperaturesDB: getAllSoilTemperaturesDB,
  //Soil Humidity
  getSoilHumidity: getSoilHumidity,
  setSoilHumLimits: setSoilHumLimits,
  setSoilHumLimit: setSoilHumLimit,
  insertSoilHumidityDB: insertSoilHumidityDB,
  truncateSoilHumidityTable: truncateSoilHumidityTable,
  getAllSoilHumiditiesDB: getAllSoilHumiditiesDB,
  //Soil PH
  getSoilPH: getSoilPH,
  setSoilPHLimits: setSoilPHLimits,
  setSoilPHLimit: setSoilPHLimit,
  insertSoilPHyDB: insertSoilPHDB,
  truncateSoilPHTable: truncateSoilPHTable,
  getAllSoilPHsDB: getAllSoilPHsDB,
  // Watering
  turnOnOffWatering: turnOnOffWatering,
  // Open and Close Windows
  openCloseWindow: openCloseWindow
};