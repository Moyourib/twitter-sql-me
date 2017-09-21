var pg = require('pg')
var postgresURL = 'postgres://localhost/twitter';
var client = new pg.Client(postgresURL);

client.connect();

module.exports = client;
