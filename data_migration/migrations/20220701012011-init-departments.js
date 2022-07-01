const teams20220701 = require('./20220701012011-teams.json');
const teams20220528 = require('./20220528015116-teams.json');

module.exports = {
  async up(db, client) {
    await db.collection('team').deleteMany({});
    await db.collection('team').insertMany(teams20220701);
  },

  async down(db, client) {
    await db.collection('team').deleteMany({});
    await db.collection('team').insertMany(teams20220528);
  },
};
