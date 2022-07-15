const sectionGroups = require('./20220715012246-init-section-groups.json');

module.exports = {
  async up(db, client) {
    await db.collection('sectionGroup').insertMany(sectionGroups);
  },

  async down(db, client) {
    await db.collection('sectionGroup').drop();
  },
};
