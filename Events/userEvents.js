const sendEmail= require('../functions/email');
const events = require('events');
const ee= new events.EventEmitter();

//Registerd New user
registerEvent= ee.on('sendRegisteremail',sendEmail);

module.exports.registerEvent =registerEvent;


