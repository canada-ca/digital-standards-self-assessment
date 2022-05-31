const survey1 = require('./20220528015116-survey-enfr-survey-enfr.json');

module.exports = {
  async up(db, client) {
    await db.collection('survey').insertOne({
      ...survey1,
      createdAt: new Date(),
    });
  },

  async down(db, client) {
    const surveys = await db
      .collection('survey')
      .find({}, { sort: { createdAt: -1 }, limit: 1 })
      .toArray();
    if (surveys && surveys.length > 0) {
      await db.collection('survey').deleteOne({ _id: surveys[0]._id });
    }
  },
};
