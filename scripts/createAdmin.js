var Account, adminUser, env, fs, mongoose, newAdmin;

mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/clarissablog?slaveOk=true&connectTimeoutMS=10000');

fs = require('fs');

env = require('node-env-file');

if (typeof global.process.env.NODE_ENV === 'undefined') {
  if (fs.existsSync('./env/development.env')) {
    env('./env/development.env');
  }
}

require('../lib/models/accounts');

Account = mongoose.model('Account');

console.log(Account);

adminUser = {
  email: 'test@test.com',
  password: 'test'
};

newAdmin = new Account(adminUser);

newAdmin.save(function(err, doc) {
  return console.log(err, doc);
});