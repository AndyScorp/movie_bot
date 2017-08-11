
var connectionString = process.env.HEROKU_POSTGRESQL_BROWN_URL || require('../token_telegram.json').DBPASSWORD;
pg = require('pg');
var createTableText = 'CREATE TABLE IF NOT EXISTS test (id SERIAL PRIMARY KEY, data JSONB);';


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
            //     client.end();
            //     pool.end();
            // });
            client.query("INSERT INTO movies(data) values($1)", [json], function (err,res) {
                client.end();
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
                    client.end();
                    pool.end();
                    return resolve(res.rows)
                })
            }
        });
    });
};

var dropTableSeatsText = 'DROP TABLE IF EXISTS seats;';
var createTableSeatsText = 'CREATE TABLE IF NOT EXISTS seats (id SERIAL PRIMARY KEY, row integer, quality text, status boolean, user_id integer );';

module.exports.createTableSeats = function (obj) {
    var seatsPerRow = Math.floor(+obj.total_seats/+obj.rows);
    console.log(seatsPerRow);
    var pool = new pg.Pool({connectionString: connectionString});

    pool.connect(function (err, client, release) {
        if (err) {
            console.error('connection error', err.stack)
        } else {
            client.query(dropTableSeatsText, function (err, res) {
            });
            client.query(createTableSeatsText, function (err,res) {
            });
            var row = 1;
            var good = +obj.good;
            var best = +obj.best;
            var quality;
            for (var i=1; i<+obj.total_seats+1; i++) {
                if (i > row*seatsPerRow ) {row++}
                quality = getRandomNumber(1, 2);
                if (quality === 1 && good) {
                    good--;
                    quality = 'good'
                } else if (quality ===1 && !good) {
                    quality = 'best'
                } else if (quality === 2 && best) {
                    best--;
                    quality = 'best';
                } else if (quality === 2 && !best) {
                    quality = 'good'
                }
                client.query("INSERT INTO seats(row, quality, status) values($1, $2, $3)", [row, quality, getRandomNumber(0,1)] , function (err,res) {
                });
            }
            client.query("SELECT * FROM seats ORDER BY id;", function (err,res) {
                client.end();
                pool.end();
            });
        }
    });
};

module.exports.getSeats = function () {

    return new Promise(function (resolve, reject) {

        var pool = new pg.Pool({connectionString: connectionString});

        pool.connect(function (err, client, release) {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                client.query("SELECT * FROM seats ORDER BY id;", function (err,res) {
                    client.end();
                    pool.end();
                    return resolve(res.rows)
                });
            }
        });
    })
};

// Method to get one random number
function getRandomNumber(min , max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}


module.exports.BookSeats = function (idSeat, idUser) {

    return new Promise(function (resolve, reject) {

        var pool = new pg.Pool({connectionString: connectionString});

        pool.connect(function (err, client, release) {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                if (idSeat === 'cancel') {
                    return resolve('Canceled operation')
                }
                client.query("SELECT * FROM seats WHERE id="+idSeat+";", function (err,res) {
                    if (res.rows[0].user_id === idUser) {
                        client.query("UPDATE seats SET status=true, user_id=null WHERE id="+idSeat+";", function (err,res) {
                            client.end();
                            pool.end();
                            return resolve('Your seat by number: ' + idSeat + ' where unbooked')
                        });
                    } else {
                        client.query("UPDATE seats SET status=false, user_id="+idUser+ "WHERE id="+idSeat+";", function (err,res) {
                            client.end();
                            pool.end();
                            return resolve('Your seat by number: ' + idSeat + ' where booked')
                        });
                    }
                });
            }
        });
    })
};
