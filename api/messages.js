const { listApi } = require('./_lib');
module.exports = listApi('messages', {
  fields: { name: 100, email: 150, subject: 150, message: 3000 },
  required: ['name', 'email', 'subject', 'message'],
  publicGet: false,
});
