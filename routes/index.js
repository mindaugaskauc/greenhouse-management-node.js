"use strict";

var express = require('express'); //require express module and import it
var bcrypt = require('bcryptjs'); // require bcyptjs module to encrypt passwords 
var randtoken = require('rand-token'); // require randtoken model to generate a random token
var emailvalidator = require('email-validator'); // require e-mail validator module
var router = express.Router(); // create an Express router

var _require = require('../models'),
    // get authentication functions
    findUserByEmail = _require.findUserByEmail,
    findUserByToken = _require.findUserByToken,
    createUser = _require.createUser,
    updateToken = _require.updateToken,
    updatePassword = _require.updatePassword,
    // get email function to send reset password link
    sendEmail = _require.sendEmail,
    // send Facebook message
    sendFSMessage = _require.sendFSMessage,
    // get sensor values
    getWeatherTemperature = _require.getWeatherTemperature,
    getSoilTemperature = _require.getSoilTemperature,
    getSoilHumidity = _require.getSoilHumidity,
    getSoilPH = _require.getSoilPH,
    //Get watering functions
    turnOnOffWatering = _require.turnOnOffWatering,
    // Opening and Closing Window
    openCloseWindow = _require.openCloseWindow;
//--------------Render main page and its drawers-----------------
// Get main page
router.get('/', function (req, res) {
  
  res.render('index', {
    title: "ŠILTNAMIO PRIEŽIŪROS SISTEMA"
  });
});
// Get weather temperature page
router.get('/indexWeatherTemperatureC', function (req, res) {
  
  res.render('indexWeatherTemperature', {
    title: "ORO TEMPERATŪRA",
    value: getWeatherTemperature()
  });
});
// Get weather temperature error page
router.get('/indexWeatherTempCError', function (req, res) {
  const limFormatErr = "*Įvesti ne skaičiai arba oro temperatūros riba mažesnė už -1 ar didesnė už 32";
 
  res.render('indexWeatherTemperature', {
    title: "ORO TEMPERATŪRA",
    value: getWeatherTemperature(),
    limFormatErr: limFormatErr
  });
});
// Get soil temperature page
router.get('/indexSoilTemperatureC', function (req, res) {
  
  res.render('indexSoilTemperature', {
    title: "DIRVOŽEMIO TEMPERATŪRA",
    value: getSoilTemperature()
  });
});
// Get soil temperature error page
router.get('/indexSoilTempCError', function (req, res) {
  const limFormatErr = "*Įvesti ne skaičiai arba dirvožemio temperatūros riba mažesnė už -1 ar didesnė už 32";
 
  res.render('indexSoilTemperature', {
    title: "DIRVOŽEMIO TEMPERATŪRA",
    value: getSoilTemperature(),
    limFormatErr: limFormatErr
  });
});
// Get soil humidity page
router.get('/indexSoilHumidityC', function (req, res) {
  
  res.render('indexSoilHumidity', {
    title: "DIRVOŽEMIO DRĖGMĖ",
    value: getSoilHumidity()
  });
});
// Get soil humidity error page
router.get('/indexSoilHumidityCError', function (req, res) {
  const limFormatErr = "*Įvesti ne skaičiai arba drėgmės riba mažesnė už 0 ar didesnė už 100";
 
  res.render('indexSoilHumidity', {
    title: "DIRVOŽEMIO DRĖGMĖ",
    value: getSoilHumidity(),
    limFormatErr: limFormatErr
  });
});
// Get soil pH page
router.get('/indexSoilPHC', function (req, res) {
  
  res.render('indexSoilPH', {
    title: "DIRVOŽEMIO RŪGŠTINGUMAS",
    value: getSoilPH()
  });
});
// Get soil pH error page
router.get('/indexSoilPHCError', function (req, res) {
  const limFormatErr = "*Įvesti ne skaičiai arba rūgštingumo riba mažesnė už 3 ar didesnė už 9";
 
  res.render('indexSoilPH', {
    title: "DIRVOŽEMIO RŪGŠTINGUMAS",
    value: getSoilPH(),
    limFormatErr: limFormatErr
  });
});
// Get Watering page
router.get('/indexWateringC', function (req, res) {
  
  res.render('indexWatering', {
    title: "LAISTYMAS"
  });
});
// Get Window control page

router.get('/indexWindowC', function (req, res) {
  
  res.render('indexWindow', {
    title: "LANGŲ VALDYMAS"
  });
});

/*router.get('/indexModesC', function (req, res) {
  
  res.render('indexModes', {
    title: "JAVŲ REŽIMAI"
  });
}); */

router.get('/indexTasksC', function (req, res) {
  
  res.render('indexTasks', {
    title: "UŽDUOTYS"
  });
});

router.get('/indexStatisticsC', function (req, res) {
  
  res.render('indexStatistics', {
    title: "DIRVOŽEMIO DRĖGMĖS STATISTIKA"
  });
});

router.get('/indexAuthorC', function (req, res) {
  
  res.render('indexAuthor', {
    title: "Programinės įrangos kūrėjas"
  });
});
//----------------------Test Facebook sending--------
/*router.post('/facebook', function (req, res) {

  sendFSMessage((err) => {
    if (err) {
      return res.status(500).render('indexWatering', {
        serverErr: serverErr
      }); 
    }
   });
}); */
//----------------------Test Facebook sending--------

//----------------Opening and Closing Window--------
// Open and close window from PC
function setWindowC(req, res, next) {
  var window = req.body.window_control; //vietoj water_plant
 // var water_value = String(water);

  console.log("Window value is: " + window);
  // send window value to Arduino
  openCloseWindow(window, (err) => {
    if (err) {
      return res.status(500).render('indexWindow', {
        serverErr: serverErr
      }); 
    }
    else {
    res.render('indexWindow', {
     title: ""
   });
 }
});
};

router.post('/indexWindowC', setWindowC);

//Open and close window from Mobile
// Open window from mobile
function setWindowOnM(req, res, next) {
  var window = req.body.window_control;
 // var water_value = String(water);

  console.log("Window value is: " + window);
  // send window value to Arduino
  if (window == 'WINDOW OPENS') {
  openCloseWindow(window, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        msg: "Klaida serveryje" 
      }); 
    }
    else {
      return res.status(200).json({
        success: true,
        "server_answer": "Langas atidarytas!"
        });
   }
 });
 };
};

router.post('/windowOnM', setWindowOnM);

//Open and close window from mobile
function setWindowOffM(req, res, next) {
  var window = req.body.window_control;
 // var water_value = String(water);

  console.log("Window value is: " + window);
  // send window value to Arduino
  if (window == 'WINDOW CLOSES') {
  openCloseWindow(window, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        msg: "Klaida serveryje" 
      }); 
    }
    else {
      return res.status(200).json({
        success: true,
        "server_answer": "Langas uždarytas!"
        });
   }
 });
 };
};

router.post('/windowOffM', setWindowOffM);

//--------------------------End of Opening and Closing Window------
//--------------------------- Watering---------------
// Turn on watering from PC
function setWateringC(req, res, next) {
  var water = req.body.water_plant;

  console.log("Water value is: " + water);
  // send water value to Arduino
  turnOnOffWatering(water, (err) => {
    if (err) {
      return res.status(500).render('indexWatering', {
        serverErr: serverErr
      }); 
    }
    else {
    res.render('indexWatering', {
     title: "LAISTYMAS"
   });
 }
});
};

router.post('/indexWateringC', setWateringC);

//Watering from Mobile

 //Turn on watering from mobile
function setWateringOnM(req, res, next) {
  var water = req.body.water_plant;

  console.log("Water value is: " + water);
  // send water value to Arduino
  if (water == 'WATER ON') {
  turnOnOffWatering(water, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        msg: "Klaida serveryje" 
      }); 
    }
    else {
      return res.status(200).json({
        success: true,
        "server_answer": "Laistymas įjungtas!"
        });
   }
 });
 };
};

router.post('/wateringOnM', setWateringOnM);

//Turn off watering from mobile
function setWateringOffM(req, res, next) {
  var water = req.body.water_plant;
 // var water_value = String(water);

  console.log("Water value is: " + water);
  // send water value to Arduino
  if (water == 'WATER OFF') {
  turnOnOffWatering(water, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        msg: "Klaida serveryje" 
      }); 
    }
    else {
      return res.status(200).json({
        success: true,
        "server_answer": "Laistymas išjungtas!"
        });
   }
 });
 };
};

router.post('/wateringOffM', setWateringOffM);

//----------------------------------End of Watering--------------------------

//--------------Render main page and its drawers------------------------------

//---------------Authentication--------------------------------
router.get('/loginc', (req, res) => {
res.render('login'); // returns login.jade to client
});

router.get('/registerc', (req, res) => {
res.render('register'); // returns register.jade to client
});

 // Logout from computer
router.post('/logoutc', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/loginc');
  });
});

// Get Forgot password template
router.get('/sendPasswordLinkc', (req, res) => {
  res.render('passwordLink');
});

//Get Reset password template
router.get('/resetPasswordc', (req, res) => {
  res.render('resetPassword');
});

//post route - used to create a route that accepts a POST request
// The method takes that path as the first parameter and the 
// function to process the request as the second parameter:
// req -represents the request sent from the client
// res - represents the response sent from the server to the client

router.post('/registerc', (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email; // extract name from request body
  const password = bcrypt.hashSync(req.body.password); // extract password from request body
  const serverErr = "Klaida serveryje";
  const firstnameErr = "*Įveskite vardą";
  const lastnameErr = "*Įveskite pavardę";
  const emailErr = "*Įveskite elektroninio pašto adresą";
  const emailFormatErr = "*Netinkamas elektroninio pašto adreso formatas";
  const doubleEmailErr = "*Elektroninio pašto adresas jau egzistuoja";
  const passwordErr = "*Įveskite slaptažodį";
//!!! cannot use two if statements. If both of them are true/
// then erroor 'cannot set headers' comes as 2 res. objects are returned.
// therefore if /else if/ else conditionals are used.
  findUserByEmail(email, (err, user) => {// find user by e-mail and add data to 'user'
    if (err) {
      return res.status(500).render('register', {
        serverErr: serverErr  
      }); 
      }
     
    else if (firstname == "") {
      return res.status(400).render('register', {
        firstnameErr: firstnameErr
      });
    }
    else if (lastname == "") {
      return res.status(400).render('register', {
        lastnameErr: lastnameErr
      });
    }
    else if (email == "") {
      return res.status(400).render('register', {
        emailErr: emailErr
      });
    }
    else if (!emailvalidator.validate(email)) {
      return res.status(400).render('register', {
        emailFormatErr: emailFormatErr
      });
    }
    else if (user) {
      // if the SQLite query in the findUserByEmail function returns a raw
      return res.status(400).render('register', {
        doubleEmailErr: doubleEmailErr
      });
    }
    else if (req.body.password == "") {
      return res.status(400).render('register', {
        passwordErr: passwordErr
      });
    }
    else if (!user) {
      const token = randtoken.generate(20);      
      createUser([firstname, lastname, email, password, token], (err,user) => {
        if (err) {
          return res.status(500).render('register', {
            serverErr: serverErr
          }); 
        }
        
        req.session.loggedIn = true;
        return res.redirect(302,'/'); //https://masteringjs.io/tutorials       
        
      });
      }
    });
  });


// login route - log in to the server
router.post('/loginc', (req, res) => {
  const email = req.body.email; // extract name from request body
  const password = req.body.password; // extract password from request body
  const serverErr = "Klaida serveryje";
  const emailErr = "*Įveskite elektroninio pašto adresą";
  const emailFormatErr = "*Netinkamas elektroninio pašto adreso formatas";
  const unknownEmailErr = "*Toks elektroninio pašto adresas neegzistuoja";
  const passwordErr = "*Įveskite slaptažodį";
  const wrongPasswordErr = "*Neteisingas slaptažodis";

  findUserByEmail(email, (err, user) => { // find user by e-mail and add data to 'user'
    if (err) {
      return res.status(500).render('login', {
        serverErr: serverErr
      }); 
    }
    else if (email == "") {
      return res.status(400).render('login', {
        emailErr: emailErr
      }); 
    }
    else if (!emailvalidator.validate(email)) {
      return res.status(400).render('login', {
        emailFormatErr: emailFormatErr
      }); 
    }
    else if (!user) {
      return res.status(400).render('login', {
        unknownEmailErr: unknownEmailErr
      }); 
    }
    else if (password == "") {
      return res.status(400).render('login', {
        passwordErr: passwordErr
      }); 
    }
    else if (user) {
      const result = bcrypt.compareSync(password, user.password); // bcrypt.compareSync(password, user.password); //// check if entered password matches the password in db after encrypting passwords,
      if (!result) {
       return res.status(400).render('login', {
        wrongPasswordErr: wrongPasswordErr
      }); 
      }
      const token = randtoken.generate(20);      
      updateToken([token, email], (err,user) => {
        if (err) {
          return res.status(500).render('login', {
              serverErr: serverErr
            }); 
          }
        req.session.loggedIn = true;
      //  const userToken = user.token;
      //  req.flash('myToken', userToken); // we use the same object name myToken as in router.get(/index) to pass data (user.token) to router.get query
        return res.redirect(302,'/'); //https://masteringjs.io/tutorials 
        });
      }
    });
  });   

//Post Reset password template
router.post('/sendPasswordLinkc', (req, res) => {
     const email = req.body.email;
     const serverErr = "Klaida serveryje";
     const emailErr = "*Įveskite elektroninio pašto adresą";
     const emailFormatErr = "*Netinkamas elektroninio pašto adreso formatas";
     const unknownEmailErr = "*Toks elektroninio pašto adresas neegzistuoja";
     const passwordLinkSent = "Slaptažodžio keitimo nuoroda sėkmingai išsiųsta nurodytu elektroninio pašto adresu";
     
     findUserByEmail(email, (err, user) => {// find user by e-mail and add data to 'user'
      if (err) {
        return res.status(500).render('passwordLink', {
        serverErr: serverErr
       });
      }
      else if (email == "") {
        return res.status(400).render('passwordLink', {
          emailErr: emailErr
        }); 
      }
      else if (!emailvalidator.validate(email)) {
        return res.status(400).render('passwordLink', {
          emailFormatErr: emailFormatErr
        }); 
      }
      else if (!user) {
        return res.status(500).render('passwordLink', {
          unknownEmailErr: unknownEmailErr
         });
       }
       else if (user) {
        // if the SQLite query in the findUserByEmail function returns a raw
          var token = randtoken.generate(20);
          var sent = sendEmail(email, token);
            if (sent != '0') {
              updateToken([token, email], (err,user) => {
                if (err) {
                  return res.status(500).render('passwordLink', {
                  serverErr: serverErr
                 });
                 }
                else {
                  return res.status(200).render('passwordLink', {
                  passwordLinkSent: passwordLinkSent
                  });
                }
             });     
            }
         }
       });
     });

  // Post Forgot password template
  router.post('/resetPasswordc', (req, res) => {
      var token = req.body.token;
      var password = bcrypt.hashSync(req.body.password);
      const serverErr = "Klaida serveryje";
      const emptyTokenErr = "*Įveskite tokeną";
      const wrongTokenErr = "*Neteisingas tokenas";
      const passwordErr = "*Įveskite naują slaptažodį";
      const correctToken = "Jūsų slaptažodis sėkmingai pakeistas";
     
      findUserByToken(token, (err, user) => {// find user by token and add data to 'user'
        if (err) {
          return res.status(500).render('resetPassword', {
          serverErr: serverErr
          });
        }
        else if (token=="") {
          return res.status(400).render('resetPassword', {
          emptyTokenErr: emptyTokenErr
          }); 
        }
        else if (!user) {
          return res.status(400).render('resetPassword', {
          wrongTokenErr: wrongTokenErr
          }); 
        }
        else if (user) {
          updatePassword([password, token], (err,user) => {
            if (err) { //if yes, statements after if not executed
              return res.status(500).render('resetPassword', {
              serverErr: serverErr
              });
            }
            else if (req.body.password == "") {
              return res.status(400).render('resetPassword', {
                passwordErr: passwordErr
              }); 
            }
            else {
              return res.status(200).render('resetPassword', {
                correctToken: correctToken
                });
            }
        });
      } 
    });
  });
            
router.post('/registerm', (req, res) => {
     const firstname = req.body.firstname;
     const lastname = req.body.lastname;
     const email = req.body.email; // extract name from request body
     const password = bcrypt.hashSync(req.body.password); // extract password from request body

   //!!! cannot use two if statements. If both of them are true/
   // then erroor 'cannot set headers' comes as 2 res. objects are returned.
   // therefore if /else if/ else conditionals are used.
     findUserByEmail(email, (err, user) => {// find user by e-mail and add data to 'user'
       if (err) {
         return res.status(500).json({
           success: false,
           msg: "Klaida serveryje" 
         }); 
       } 
       else if (user) {
         // if the SQLite query in the findUserByEmail function returns a raw
         return res.status(400).json({ // then error 400 (works only with this one, not 403) returned which goes to android code   
           success: false, // json object property returns false
           msg: "Elektroninio pašto adresas jau egzistuoja" 
         });
       } 
       else if (!user) {  
         const token = randtoken.generate(20); 
         createUser([firstname, lastname, email, password, token], (err,user) => {
           if (err) { //if yes, statements after if not executed
             return res.status(500).json({
               success: false,
               msg: "Klaida serveryje" 
             }); 
           }
           else  {
           findUserByEmail(email, (err, user) => {
             if (err) { //if yes, statements after if not executed
               return res.status(500).json({
                 success: false,
                 msg: "Klaida serveryje" 
               }); 
             }
            else {
           res.status(200).json({
               success: true,
               "server_welcome": "Sveiki prisijungę į javų priežiūros sistemą!"
               });
              }
             });       
            }
         });
        }
      });
    });

// login route - log in to the server
router.post('/loginm', (req, res) => {
  const email = req.body.email; // extract name from request body
  const password = req.body.password; // extract password from request body
 
  findUserByEmail(email, (err, user) => { // find user by e-mail and add data to 'user'
    if (err) {
      return res.status(500).json({
        success: false,
        msg: "Klaida serveryje" 
      }); 
    }
    else if (!user) {
      // if the SQLite query in the findUserByEmail function returns a raw
      return res.status(400).json({ // then error 400 (works only with this one, not 403) returned which goes to android code   
        success: false, // json object property returns false
        msg: "Toks elektroninio pašto adresas neegzistuoja" 
      });
    }
    else {
      const result = bcrypt.compareSync(password, user.password); bcrypt.compareSync(password, user.password); //// check if entered password matches the password in db after encrypting passwords,
      if (!result) {
       return res.status(400).json({
        success: false,
        msg: "Neteisingas slaptažodis"
       });
      }
      else if (result) {
        var token = randtoken.generate(20);
        updateToken([token, email], (err,user) => {
          if (err) { //if yes, statements after if not executed
            return res.status(500).json({
              success: false,
              msg: "Klaida serveryje" 
            }); 
          }
          else  {
            findUserByEmail(email, (err, user) => {
              if (err) { //if yes, statements after if not executed
                return res.status(500).json({
                  success: false,
                  msg: "Klaida serveryje" 
                }); 
              }
             else {
            res.status(200).json({
                success: true,
                "server_welcome": "Sveiki prisijungę į javų priežiūros sistemą!"
                });
               }
              });       
             }
       });
        } 
      };
    });
  });

  //Post Reset password template in mobile
router.post('/sendPasswordLinkm', (req, res) => {
  var email = req.body.email;
  
  findUserByEmail(email, (err, user) => { // find user by e-mail and add data to 'user'
    if (err) {
       return res.status(500).json({
         success: false,
         msg: "Klaida serveryje" 
       }); 
      }
    else if (!user) {
       // if the SQLite query in the findUserByEmail function returns a raw
       return res.status(400).json({ // then error 400 (works only with this one, not 403) returned which goes to android code   
         success: false, // json object property returns false
         msg: "Toks elektroninio pašto adresas neegzistuoja" 
       });
      }
    else if (user) {
     // if the SQLite query in the findUserByEmail function returns a raw
       var token = randtoken.generate(20);
       var sent = sendEmail(email, token);
         if (sent != '0') {
           updateToken([token, email], (err,user) => {
             if (err) { //if yes, statements after if not executed
               return res.status(500).json({
                 success: false,
                 msg: "Klaida serveryje" 
               }); 
             }
          });
        return res.status(200).json({
          success: true,
          msg: "Slaptažodžio keitimo nuoroda sėkmingai išsiųsta nurodytu elektroninio pašto adresu"
          }); 
        }          
      }     
  });
});
//---------------------Authentication-------------------------------------------

module.exports = router;