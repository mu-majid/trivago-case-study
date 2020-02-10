const Joi = require('joi');
const middleware = (schema) => {
  return (req, res, next) => {
    const { error } = Joi.validate(req, schema, { abortEarly: false, allowUnknown: true });
    const valid = error == null;

    if (valid) {
      return next();
    }
    else {
      const { details } = error;
      const message = details.map(i => i.message).join(',');

      console.log('Request Validation Error: ', message);
      return res.status(422).json({ error: message })
    }
  }
}
module.exports = middleware;