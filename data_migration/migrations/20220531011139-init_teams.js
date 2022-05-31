const teams = require('./20220531011139-teams.json');

module.exports = {
  async up(db, client) {
    await db.collection('team').insertMany(teams);
  },

  async down(db, client) {
    await db.collection('team').remove({
      teamNameEn: {
        $in: ['Team A', 'Team B', 'Team C'],
      },
    });
  },
};
