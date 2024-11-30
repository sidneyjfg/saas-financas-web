const { AuditLog } = require('../models');

const logAuditAction = async (teamId, userId, action, details) => {
  try {
    await AuditLog.create({
      teamId,
      userId,
      action,
      details,
    });
    console.log(`Audit log created: ${action}`);
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

module.exports = logAuditAction;
