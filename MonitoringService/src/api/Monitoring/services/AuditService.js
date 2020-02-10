const Audit = require('../models/Audit');

async function createAudit (data) {
  console.log('Auditing ... ');
  return await Audit.create(data);
}

module.exports = {
  createAudit
};


