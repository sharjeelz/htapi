const sendEmail= require('../functions/email');
const sendSMS= require('../functions/sms');
const events = require('events');
const ee= new events.EventEmitter();
//Registerd New user
registerEvent= ee.on('sendRegisteremail',sendEmail);
registerEvent= ee.on('sendRegistersms',sendSMS);

module.exports.registerEvent =registerEvent;



