const login = require("facebook-chat-api");
const fs = require('fs');

const credential = { appState: JSON.parse(fs.readFileSync('./json/appstate.json', 'utf-8'))}

//send facebook message

/*function sendFSMessage () {
    login(credential, (err, api) => {
         if(err) return console.error(err);
 
         var yourID = "100089669058591";
         var msg = "Hey!";
         api.sendMessage(msg, yourID);
    });
}*/

function sendFSMessage (msg) {
    login(credential, (err, api) => {
         if(err) return console.error(err);
         //100091654332252 Jonas Javaitis ID
         // test user ID 100089669058591
         var yourID = "100091654332252";
         //var msg = "Hey!";
         api.sendMessage(msg, yourID);
    });
}

module.exports = {
    sendFSMessage: sendFSMessage
};