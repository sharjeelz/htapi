const sendEmail= require('../functions/email');
const sendSMS= require('../functions/sms');
const events = require('events');
const ee= new events.EventEmitter();
//Registerd New user
userEvent= ee.on('sendRegisteremail',sendEmail);
userEvent= ee.on('sendRegistersms',sendSMS);
userEvent= ee.on('sendPasswordResetCode',sendSMS);

module.exports.userEvent =userEvent;



