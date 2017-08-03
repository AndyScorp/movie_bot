
var connectionString = process.env.HEROKU_POSTGRESQL_BROWN_URL || require('../token_telegram.json').DBPASSWORD;
pg = require('pg');
var createTableText = 'CREATE TABLE IF NOT EXISTS movies (id SERIAL PRIMARY KEY, data JSONB);';


function createTable() {

    var pool = new pg.Pool({connectionString: connectionString});

    pool.connect(function (err, client, release) {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            client.query(createTableText, function (err,res) {
            });
        }
    });

    pool.end();

}


module.exports.create_db = function (json) {

    var pool = new pg.Pool({connectionString: connectionString});

    pool.connect(function (err, client, release) {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            // client.query(createTableText, function (err,res) {
            // });
            client.query("INSERT INTO movies(data) values($1)", [json], function (err,res) {
                pool.end();
            });
        }

    });
};

module.exports.get_db = function () {
    return new Promise (function (resolve, reject) {

        var pool = new pg.Pool({connectionString: connectionString});

        pool.connect(function (err, client, release) {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                client.query("SELECT * FROM movies ORDER BY id;", function (err,res) {
                    pool.end();
                    return resolve(res.rows)
                })
            }

        });
    });
};

