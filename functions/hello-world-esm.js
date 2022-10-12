import { greeting } from '../utils/greetings';

export function handler(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(greeting);
  callback(null, twiml);
};
