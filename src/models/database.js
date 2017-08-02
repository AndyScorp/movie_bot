var config = {
    user: 'chat_bot',
    host: 'localhost',
    database: 'chat_bot',
    password: '7M7T9nHH'
};
var connectionString = process.env.HEROKU_POSTGRESQL_BROWN_URL || 'postgresql://chat_bot:7M7T9nHH@localhost/chat_bot';
pg = require('pg');
var pool = new pg.Pool({connectionString: connectionString});


var createTableText = 'CREATE TABLE IF NOT EXISTS movies (id SERIAL PRIMARY KEY, data JSONB);';

pool.connect(function (err, client, release) {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        client.query(createTableText, function (err,res) {
        });
    }
});

module.exports.create_db = function (json) {
    pool.connect(function (err, client, release) {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            client.query(createTableText, function (err,res) {
            });
            client.query("INSERT INTO movies(data) values($1)", [json], function (err,res) {
            });
        }
    });
};

