const { Schema, model } = require('mongoose')

const AuditSchema = new Schema({
  userId: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: { type: String, required: true },
  action: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  status: { type: String, enum: ['SUCCESS', 'ERROR'] }

}, { timestamps: true });

const auditModel = model('Audit', AuditSchema);

module.exports =  auditModel;