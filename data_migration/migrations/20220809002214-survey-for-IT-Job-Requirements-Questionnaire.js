const surveyBackup = require('./20220528015116-survey-enfr.json');
const survey20220809 = require('./20220809002214-survey-for-IT-Job-Requirements-Questionnaire.json');

module.exports = {
  async up(db, client) {
    await db.collection('surveyResult').deleteMany({});
    await db.collection('survey').deleteMany({});
    await db.collection('survey').insertOne({
      ...survey20220809,
      createdAt: new Date(),
    });
  },

  async down(db, client) {
    await db.collection('surveyResult').deleteMany({});
    await db.collection('survey').deleteMany({});
    await db.collection('survey').insertOne({
      ...surveyBackup,
      createdAt: new Date(),
    });
  },
};
