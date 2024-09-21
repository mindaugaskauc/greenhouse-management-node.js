"use strict";

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./db/main.db', sqlite3.OPEN_READWRITE, function (err) {
  if (err) {
    console.log('Can not connect to the database.');
    console.error(err.message);
  }
});
db.serialize(function() {
  // Create a users table
  db.run("CREATE TABLE IF NOT EXISTS USER (id integer PRIMARY KEY, firstname text," + 
    "lastname text, email text UNIQUE, password text, token text)");
  // Create a weather temperature table
  db.run("CREATE TABLE IF NOT EXISTS FIELD_TEMPERATURE (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "timestamp INTEGER NOT NULL, value REAL NOT NULL)");
  // Create soil temperature table
  db.run("CREATE TABLE IF NOT EXISTS SOIL_TEMPERATURE (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "timestamp INTEGER NOT NULL, value REAL NOT NULL)");  
  // Create soil humidity table
  db.run("CREATE TABLE IF NOT EXISTS SOIL_HUMIDITY (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "timestamp INTEGER NOT NULL, value REAL NOT NULL)");
  // Create soil ph table
  db.run("CREATE TABLE IF NOT EXISTS SOIL_PH (id INTEGER PRIMARY KEY AUTOINCREMENT," +
    "timestamp INTEGER NOT NULL, value REAL NOT NULL)");

}); 
//-----------Authentication-----------
 // Function finds user by e-mail
 function findUserByEmail (email, cb) {
  return db.get(`SELECT * FROM USER WHERE email = ?`, [email], (err, row) => {
      cb(err, row)
  });
}
// Function finds user by token
function findUserByToken (token, cb) {
  return db.get(`SELECT * FROM USER WHERE token = ?`, [token], (err, row) => {
      cb(err, row)
  });
}

// Function creates a new user
function createUser (user, cb) {
  return db.run(`INSERT INTO USER (firstname, lastname, email, password, token) VALUES (?,?,?,?,?)`, user, (err) => {
      cb(err)
  });
}

// Function updates token
function updateToken (user, cb) {
  return db.run(`UPDATE USER SET token = ? WHERE email = ?`, user, (err) => {
      cb(err)
  });
}
// Function updates password
function updatePassword (user, cb) {
  return db.run(`UPDATE USER SET password = ? WHERE token = ?`, user, (err) => {
      cb(err)
  });
}

//----------- Weather Temperature-----------------

function insertWeatherTemperatureDB(timestamp, value) {
  var sqlInsert = "INSERT INTO field_temperature(timestamp, value) VALUES(?, ?)";
  db.run(sqlInsert, [timestamp, value]);
}

function truncateWeatherTemperatureTable() {
  db.run("DELETE FROM field_temperature");
  db.run("VACUUM");
}

function getAllWeatherTemperaturesDB(cb) {
  var sql = "SELECT timestamp, value FROM field_temperature";
  db.all(sql, [], function (err, data) {
    cb(data, err);
  });
} 

//----------- Soil Temperature-----------------

function insertSoilTemperatureDB(timestamp, value) {
  var sqlInsert = "INSERT INTO soil_temperature(timestamp, value) VALUES(?, ?)";
  db.run(sqlInsert, [timestamp, value]);
}

function truncateSoilTemperatureTable() {
  db.run("DELETE FROM soil_temperature");
  db.run("VACUUM");
}

function getAllSoilTemperaturesDB(cb) {
  var sql = "SELECT timestamp, value FROM soil_temperature";
  db.all(sql, [], function (err, data) {
    cb(data, err);
  });
} 

//----------------------Soil humidity----------------------------

function insertSoilHumidityDB(timestamp, value) {
  var sqlInsert = "INSERT INTO soil_humidity(timestamp, value) VALUES(?, ?)";
  db.run(sqlInsert, [timestamp, value]);
}

function truncateSoilHumidityTable() {
  db.run("DELETE FROM soil_humidity");
  db.run("VACUUM");
}

function getAllSoilHumiditiesDB(cb) {
  var sql = "SELECT timestamp, value FROM soil_humidity";
  db.all(sql, [], function (err, data) {
    cb(data, err);
  });
}

//----------------------Soil ph----------------------------

function insertSoilPHDB(timestamp, value) {
  var sqlInsert = "INSERT INTO soil_ph(timestamp, value) VALUES(?, ?)";
  db.run(sqlInsert, [timestamp, value]);
}

function truncateSoilPHTable() {
  db.run("DELETE FROM soil_ph");
  db.run("VACUUM");
}

function getAllSoilPHsDB(cb) {
  var sql = "SELECT timestamp, value FROM soil_ph";
  db.all(sql, [], function (err, data) {
    cb(data, err);
  });
}


module.exports = {
  // Authentication
  findUserByEmail: findUserByEmail,
  findUserByToken: findUserByToken,
  createUser: createUser,
  updateToken: updateToken,
  updatePassword: updatePassword,
  //Field Temperature
  insertWeatherTemperatureDB: insertWeatherTemperatureDB,
  truncateWeatherTemperatureTable: truncateWeatherTemperatureTable,
  getAllWeatherTemperaturesDB: getAllWeatherTemperaturesDB,
  //Soil Temperature
  insertSoilTemperatureDB: insertSoilTemperatureDB,
  truncateSoilTemperatureTable: truncateSoilTemperatureTable,
  getAllSoilTemperaturesDB: getAllSoilTemperaturesDB,
  //Soil Humidity
  insertSoilHumidityDB: insertSoilHumidityDB,
  truncateSoilHumidityTable: truncateSoilHumidityTable,
  getAllSoilHumiditiesDB: getAllSoilHumiditiesDB,
  //Soil PH
  insertSoilPHDB: insertSoilPHDB,
  truncateSoilPHTable: truncateSoilPHTable,
  getAllSoilPHsDB: getAllSoilPHsDB
};