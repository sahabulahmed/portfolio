const { listApi } = require('./_lib');
module.exports = listApi('comments', {
  fields: { name: 80, relation: 80, comment: 1000 },
  required: ['name', 'comment'],
  publicGet: true,
});
