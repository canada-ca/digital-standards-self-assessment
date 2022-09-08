print('Start #################################################################');
db = db.getSiblingDB('dssa-db');
db.createUser({
  user: 'api_user',
  pwd: 'api_user',
  roles: [{ role: 'readWrite', db: 'dssa-db' }],
});
print('END #################################################################');
