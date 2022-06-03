const survey1 = require('./20220528015116-survey-enfr-survey-enfr.json');
const teams = require('./20220531011139-teams.json');

module.exports = {
  async up(db, client) {
    await db.collection('survey').insertOne({
      ...survey1,
      createdAt: new Date(),
    });
    await db.collection('team').insertMany(teams);
  },

  async down(db, client) {
    const surveys = await db
      .collection('survey')
      .find({}, { sort: { createdAt: -1 }, limit: 1 })
      .toArray();
    if (surveys && surveys.length > 0) {
      await db.collection('survey').deleteOne({ _id: surveys[0]._id });
    }
    await db.collection('team').remove({
      teamNameEn: {
        $in: ['Team A', 'Team B', 'Team C'],
      },
    });
  },
};
