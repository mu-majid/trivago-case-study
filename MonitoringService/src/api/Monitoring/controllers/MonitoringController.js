const AuditService = require('../services/AuditService');
const EmailService = require('../services/EmailService');


async function audit (req, res) {
  const data = req.body;
  await EmailService.sendEmail(data);
  await AuditService.createAudit(data);

  return res.status(200).send({
    message: 'Done Auditing, and Sent Email notification'
  });

}
module.exports = {
  audit
};
