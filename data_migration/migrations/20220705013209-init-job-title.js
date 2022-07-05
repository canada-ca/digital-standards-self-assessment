const jobTitles = require('./20220705013209-Job-titles.json');
module.exports = {
  async up(db, client) {
    await db.collection('jobTitle').insertMany(jobTitles);
  },

  async down(db, client) {
    await db.collection('jobTitle').drop();
  },
};
