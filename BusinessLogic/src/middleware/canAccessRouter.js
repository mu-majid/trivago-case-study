
function canAccessRouter(accessKey) {

  return function (req, res, next) {
    if (!req.headers || !req.headers.authorization) {
      return res.status(401).send({ message: 'No authorization headers.' });
    }

    const apiKey = req.headers.authorization.split(' ');

    if (apiKey.length != 2) {
      return res.status(401).send({ message: 'Malformed Api Key.' });
    }

    const key = apiKey[1];

    if (key !== accessKey) {
      return res.status(401).send({ message: 'Invalid Api Key.' });
    }

    return next();
  }
}

module.exports = canAccessRouter;