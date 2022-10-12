const { greeting } = require('../utils/greetings');

exports.handler = function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(greeting);
  callback(null, twiml);
};
