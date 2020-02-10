const config = require('../config/config');

function authorize (req, res, next) {

  const callingServiceKey = req.headers.api_key;

  const service = config.authorizedServices.find((service) => {
    return service.api_key === callingServiceKey;
  });

  if (!service) {
    console.log(`Unauthorized external service request with key ${callingServiceKey}`);
    return res.status(401).send({ message: 'Unauthorized Request.' });
  }

  return next();
}

module.exports = authorize;