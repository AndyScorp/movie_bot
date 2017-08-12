var config = require('./config');
var Bot = require('node-telegram-bot-api');

var movies = require('./services/getmovies');
var movie = require('./services/getMovie');
var ListMovieNames = require('./services/listMoviesNames');
var genres = require('./lib/genres-id.json');
var urls = require('./lib/url-for-dbbase');

var express = require('express');
var app = express();

// Heroku Mode
// var bodyParser = require('body-parser');
// var bot = new Bot(config.telegram.token);
// bot.setWebHook(`${config.telegram.url}/bot${config.telegram.token}`);

// app.use(bodyParser.json());
// app.post(`/bot${config.telegram.token}`, function(req, res) {
//     bot.processUpdate(req.body);
// res.sendStatus(200);
// });


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/styles'));
// app.set('port', (8080 || 443));

// DEV Mode
var bot = new Bot(config.telegram.token, {polling: true});
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const configW = require('../webpack.config.js');
const compiler = webpack(configW);
app.use(webpackDevMiddleware(compiler, {
    publicPath: configW.output.publicPath
}));



bot.on('message', function (msg) {
    var movieString = [];
    var linkString = [];
    const chatId = msg.chat.id;
    if (msg.text.toLowerCase().includes('любава')) {
        movies.getMovies(urls.urls.lubavaUrl, '.afisha_td_bottom').then(function (resolve) {
            resolve.forEach(function (item, i, arr) {
                movieString.push('<b>' + item[0] + '</b>' + '\n' + item[1]);
                linkString.push({
                    text: item[0],
                    callback_data: item[2]
                });
            });

            var newArray = ListMovieNames.listMovienames(2, linkString);

            bot.sendMessage(chatId, '<b>' + msg.text.toUpperCase() + '</b>' + '\n\n' + movieString.join('\n\n'), {
                parse_mode : "HTML",
                "reply_markup": {
                    // "keyboard": newArray,
                    "inline_keyboard": newArray
                }
            }).then(function() {
                bot.once('callback_query', function(msg) {
                    if (msg.data) {
                        for (var i=0; i < resolve.length; i++) {
                            if (resolve[i][2] === msg.data) {
                                movie.getMovie(resolve[i][2]).then(function(mov) {
                                    bot.sendPhoto(
                                        msg.from.id,
                                        mov.pathImage, {
                                            caption : mov.title + '\n' + mov.type + '\n' + mov.duration,
                                            "reply_markup": {
                                                "inline_keyboard": [[{text:'Описание', callback_data: '/Description'}]]
                                            }
                                        }
                                    ).then(function () {
                                        bot.once('callback_query', function (msg) {
                                            if (msg.data==='/Description') {
                                                bot.sendMessage(msg.from.id,
                                                    '*' + mov.title + '*' + '\n'
                                                    + mov.type + '\n'
                                                    + '_' + mov.duration + '_' + '\n'
                                                    + '\n' + mov.content + '\n\n'
                                                    + '_' + mov.scheduleLubava + '_'
                                                    + '_' + mov.schedulePlaza + '_' + '\n',
                                                    {parse_mode : "Markdown"}
                                                );
                                            }
                                        })
                                    });
                                });
                            }
                        }
                    }
                })
            });
        });
    }
    else if (msg.text.toLowerCase().includes('плаза')) {
        movies.getMovies(urls.urls.plazaUrl, '.afisha_td_bottom').then(function (resolve) {
            resolve.forEach(function (item, i, arr) {
                movieString.push('<b>' + item[0] + '</b>' + '\n' + item[1]);
                linkString.push({
                    text: item[0],
                    callback_data: item[2]
                });
            });

            var newArray = ListMovieNames.listMovienames(3, linkString);

            bot.sendMessage(chatId, '<b>' + msg.text.toUpperCase() + '</b>' + '\n\n' + movieString.join('\n\n'), {
                parse_mode : "HTML",
                "reply_markup": {
                    "inline_keyboard": newArray
                }
            }).then(function() {
                bot.once('callback_query', function(msg) {
                    if (msg.data) {
                        for (var i=0; i < resolve.length; i++) {
                            if (resolve[i][2] === msg.data) {
                                movie.getMovie(resolve[i][2]).then(function(mov) {
                                    bot.sendPhoto(
                                        msg.from.id,
                                        mov.pathImage, {
                                            caption : mov.title + '\n' + mov.type + '\n' + mov.duration,
                                            "reply_markup": {
                                                "inline_keyboard": [[{text:'Описание', callback_data: '/Description'}]]
                                            }
                                        }
                                    ).then(function () {
                                        bot.once('callback_query', function (msg) {
                                            if (msg.data==='/Description') {
                                                bot.sendMessage(msg.from.id,
                                                    '*' + mov.title + '*' + '\n'
                                                    + mov.type + '\n'
                                                    + '_' + mov.duration + '_' + '\n'
                                                    + '\n' + mov.content + '\n\n'
                                                    + '_' + mov.scheduleLubava + '_'
                                                    + '_' + mov.schedulePlaza + '_' + '\n',
                                                    {parse_mode : "Markdown"}
                                                );
                                            }
                                        })
                                    });
                                });
                            }
                        }
                    }
                })
            });
        });
    }
    else if (msg.text.toLowerCase().includes('звонок в кинотеатр')) {
        bot.sendMessage(msg.chat.id, "Позвоните в кинотеатр", {
            "reply_markup": {
                "inline_keyboard": [[{text:'Звонок в Любаву', callback_data: '/lubava'}, {text:'Звонок в Плазу', callback_data: '/plaza'}]]
            }
        }).then(function () {
            bot.once('callback_query', function(msg) {
                if (msg.data==='/lubava') {
                    bot.sendContact(
                        msg.from.id,
                        '+380472599899',
                        "Lubava")
                } else if ((msg.data==='/plaza')) {
                    bot.sendContact(
                        msg.from.id,
                        '+380472724313',
                        "Plaza")
                }
            });
        });
    }
});

bot.onText(/\/start/, function(msg) {
    bot.sendMessage(msg.chat.id, "*Welcome to MovieLiteBot created by rrLero*\nBot lists schedule of movies in Cherkassy's cinemas", {
        parse_mode: "Markdown",
        "reply_markup": {
            "keyboard": [["/Любава", "/Днепро-Плаза"], ["Звонок в кинотеатр"]]
        }
    });
});

bot.onText(/\/help/, function(msg) {
    bot.sendMessage(msg.chat.id, "/start - Movies from our city\n"
        + "/genre - 3 different movies filtered by Genre\n"
        + "/year - 3 movies from chosen year you wanted to watch\n"
        + "/filterGY - 3 movies by filter Genre + Year\n"
        + "/get_db - list from db\n"
        + "/find_by_title - Filter for example like this: star+wars+I\n"
        + "/best_year - 3 top-rated movies of some year\n"
        + "/bestGY - 3 top-rated movies of some year by genre\n"
        + "/BookSeatsLubava - Book ticket in the cinema Lubava\n"
        + "/BookSeatsPlaza - Book ticket in the cinema Plaza\n"
    );
});

bot.onText(/\/admin/, function(msg) {
    bot.sendMessage(msg.chat.id, "/setSeats - Put cinema to DB or replace old\n"
    );
});

// Command to receive movie filtered by Year
bot.onText(/\/year/, function (msg) {
    bot.sendMessage(msg.chat.id, "Input Year which interesting for you (example: 2017)", {
    }).then(function () {
        bot.once('message', function (msg) {
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.year + '&year={name}';
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, msg.text);
            movie_list_by_genre.then(function (resolve) {
                if (!resolve.length) {
                    bot.sendMessage(chat_id, 'Sorry Nothing Found by such request.\nTry another one');
                } else {
                    resolve.forEach(function (elem) {
                        bot.sendMessage(chat_id,
                            '*' + elem.original_title + '*' + '\n'
                            + elem.overview + '\n'
                            + '_' + elem.release_date + '_' + '\n'
                            + '\n' + elem.popularity + '\n\n'
                            + urls.urls.heroku + elem.id,
                            {parse_mode : "Markdown"}
                        );
                    });
                }
            });
        })
    })
});

// Command to receive movie filtered by genre
bot.onText(/\/genre/, function (msg) {
    bot.sendMessage(msg.chat.id, "Input Genre of the movie you want to watch", {
        "reply_markup": {
            "inline_keyboard": ListMovieNames.listMovienames(3, genres.genres)
        }
    }).then(function () {
        bot.once('callback_query', function (msg) {
            var chat_id = msg.message.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.genre + '&with_genres={name}';
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, msg.data);
            movie_list_by_genre.then(function (resolve) {
                if (!resolve.length) {
                    bot.sendMessage(chat_id, 'Sorry Nothing Found by such request.\nTry another one');
                } else {
                    resolve.forEach(function (elem) {
                        bot.sendMessage(chat_id,
                            '*' + elem.original_title + '*' + '\n'
                            + elem.overview + '\n'
                            + '_' + elem.release_date + '_' + '\n'
                            + '\n' + elem.popularity + '\n\n'
                            + urls.urls.heroku + elem.id,
                            {parse_mode : "Markdown"}
                        );
                    });
                }
            });
        })
    })
});

// Command to receive movie filtered by year and genre
bot.onText(/\/filterGY/, function (msg) {
    bot.sendMessage(msg.chat.id, "input Genre and Year in such way: comedy+2017", {
    }).then(function () {
        bot.once('message', function (msg) {
            var array = msg.text.split('+');
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var genre_id = require('./services/get_genre_id').getGenreId(array[0].toLowerCase());
            var url = urls.urls.filterGY + '&year={name}&with_genres='+genre_id;
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, array[1]);
            movie_list_by_genre.then(function (resolve) {
                if (!resolve.length) {
                    bot.sendMessage(chat_id, 'Sorry Nothing Found by such request.\nTry another one');
                } else {
                    resolve.forEach(function (elem) {
                        bot.sendMessage(chat_id,
                            '*' + elem.original_title + '*' + '\n'
                            + elem.overview + '\n'
                            + '_' + elem.release_date + '_' + '\n'
                            + '\n' + elem.popularity + '\n\n'
                            + urls.urls.heroku + elem.id,
                            {parse_mode : "Markdown"}
                        );
                    });
                }
            });
        })
    })
});

// Block for find movie by title !!!!!Need to do!!!!!!!Not Working!!!!!
bot.onText(/\/find_by_title/, function (msg) {
    bot.sendMessage(msg.chat.id, "input KeyWords. Example: star+wars").then(function () {
        bot.once('message', function (msg) {
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.byKeyWords;
            var movie_by_KW = get_movie_by_genre.getMovieByGenre(url, msg.text);
            movie_by_KW.then(function (resolve) {
                if (!resolve.length) {
                    bot.sendMessage(chat_id, 'Sorry Nothing Found by such request.\nTry another one');
                } else {
                    resolve.forEach(function (elem) {
                        bot.sendMessage(chat_id,
                            '*' + elem.original_title + '*' + '\n'
                            + elem.overview + '\n'
                            + '_' + elem.release_date + '_' + '\n'
                            + '\n' + elem.popularity + '\n\n'
                            + urls.urls.heroku + elem.id,
                            {parse_mode : "Markdown"}
                        );
                    });
                }
            })
        })
    })
});

// Command to receive last ten database records
bot.onText(/\/get_db/, function (msg) {
    var list = require('./models/database');
    list.get_db().then(function (resolve) {
        var lastTen = resolve.slice(resolve.length-11);
        var newString = '';
        lastTen.forEach(function (elem) {
            newString += elem.id + ' ' + elem.data.title + '\n';
        });
        bot.sendMessage(msg.chat.id, newString + '\n' + 'https://movie-lite-bot.herokuapp.com/history');
    });
});

bot.onText(/\/best_year/, function (msg) {
    bot.sendMessage(msg.chat.id, "Input Year which interesting for you (example: 2017)", {
    }).then(function () {
        bot.once('message', function (msg) {
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.year + '&year={name}' + '&sort_by=popularity.desc';
            var movie_list_by_genre = get_movie_by_genre.getBestMovieByGenre(url, msg.text);
            movie_list_by_genre.then(function (resolve) {
                if (!resolve.length) {
                    bot.sendMessage(chat_id, 'Sorry Nothing Found by such request.\nTry another one');
                } else {
                    resolve.forEach(function (elem) {
                        bot.sendMessage(chat_id,
                            '*' + elem.original_title + '*' + '\n'
                            + elem.overview + '\n'
                            + '_' + elem.release_date + '_' + '\n'
                            + '\n' + elem.popularity + '\n\n'
                            + urls.urls.heroku + elem.id,
                            {parse_mode : "Markdown"}
                        );
                    });
                }
            });
        })
    })
});

bot.onText(/\/bestGY/, function (msg) {
    bot.sendMessage(msg.chat.id, "input Genre and Year in such way: comedy+2017, result: 3 best movies", {
    }).then(function () {
        bot.once('message', function (msg) {
            var array = msg.text.split('+');
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var genre_id = require('./services/get_genre_id').getGenreId(array[0].toLowerCase());
            var url = urls.urls.filterGY + '&year={name}&with_genres='+genre_id + '&sort_by=popularity.desc';
            var movie_list_by_genre = get_movie_by_genre.getBestMovieByGenre(url, array[1]);
            movie_list_by_genre.then(function (resolve) {
                if (!resolve.length) {
                    bot.sendMessage(chat_id, 'Sorry Nothing Found by such request.\nTry another one');
                } else {
                    resolve.forEach(function (elem) {
                        bot.sendMessage(chat_id,
                            '*' + elem.original_title + '*' + '\n'
                            + elem.overview + '\n'
                            + '_' + elem.release_date + '_' + '\n'
                            + '\n' + elem.popularity + '\n\n'
                            + urls.urls.heroku + elem.id,
                            {parse_mode : "Markdown"}
                        );
                    });
                }
            });
        })
    })
});

bot.onText(/\/setSeats/, function (msg, match) {
    bot.sendMessage(msg.chat.id, "input Seats + Rows + Good + Best + Cinema", {})
        .then(function () {
           bot.once('message', function (msg) {
               var array = msg.text.split('+');
               var chat_id = msg.chat.id;
               var create = require('./models/database').createTableSeats({
                   "total_seats" : array[0],
                   "rows" : array[1],
                   "good" : array[2],
                   "best" : array[3],
                   "cinema": array[4]
               })
           })
        })
});

bot.onText(/\/getSeatsDB/, function (msg, match) {
    var list = require('./models/database').getSeats('seats');
    console.log(msg);
    list.then(function (resolve) {
        var getFreeSeats = require('./services/get-free-seats').getFreeSeats(resolve, msg.from.id);
        getFreeSeats.push([{
            "text": "Cancel",
            "callback_data": "cancel"
        }]);
        bot.sendMessage(msg.chat.id, 'Free Seats', {
            "reply_markup": {
                "inline_keyboard": getFreeSeats
            }
        })
    });
});

bot.onText(/\/BookSeatsLubava/, function (msg, match) {
    var list = require('./models/database').getSeats('lubava');
    list.then(function (resolve) {
        var getFreeSeats = require('./services/get-free-seats').getFreeSeats(resolve, msg.from.id);
        getFreeSeats.push([{
            "text": "Cancel",
            "callback_data": "cancel"
        }]);
        bot.sendMessage(msg.chat.id, 'Free Seats. Pick one to book seat.', {
            "reply_markup": {
                "inline_keyboard": getFreeSeats
            }
        }).then(function () {
            bot.once('callback_query', function (msg) {
                require('./models/database').BookSeats(msg.data, msg.from.id, 'lubava').then(function (resolve) {
                    bot.sendMessage(msg.from.id, resolve + '\n'
                        + 'Here you can see fullfillment of cinema\n'
                        + urls.urls.cinema + 'lubava/' + msg.from.id
                    )
                })
            })
        })
    });
});

bot.onText(/\/BookSeatsPlaza/, function (msg, match) {
    var list = require('./models/database').getSeats('plaza');
    list.then(function (resolve) {
        var getFreeSeats = require('./services/get-free-seats').getFreeSeats(resolve, msg.from.id);
        getFreeSeats.push([{
            "text": "Cancel",
            "callback_data": "cancel"
        }]);
        bot.sendMessage(msg.chat.id, 'Free Seats. Pick one to book seat.', {
            "reply_markup": {
                "inline_keyboard": getFreeSeats
            }
        }).then(function () {
            bot.once('callback_query', function (msg) {
                require('./models/database').BookSeats(msg.data, msg.from.id, 'plaza').then(function (resolve) {
                    bot.sendMessage(msg.from.id, resolve + '\n'
                        + 'Here you can see fullfillment of cinema\n'
                        + urls.urls.cinema + 'plaza/' + msg.from.id
                    )
                })
            })
        })
    });
});


app.get('/', function (req, res) {
    var rowsPlaza, rowsLubava;
    require('./models/database').getSeats('lubava').then(function (lubava) {
        return lubava;
    }).then(function (lubava) {
            require('./models/database').getSeats('plaza').then(function (plaza) {
                rowsLubava = lubava[lubava.length-1].row;
                rowsPlaza = plaza[plaza.length-1].row;
                res.render('pages/index', {
                    lubava: lubava,
                    rowsLubava: +rowsLubava,
                    obj: {
                        false: 'busy',
                        true: 'free'
                    },
                    plaza: plaza,
                    rowsPlaza: +rowsPlaza
                });
        })
    })
});

app.get('/cinema/:cinema/:id', function (req, res) {
    var rows;
    var cinema = req.params.cinema.trim();
    var id = req.params.id.trim();
    require('./models/database').getSeats(cinema).then(function (resolve) {
        rows = resolve[resolve.length - 1].row;
        res.render('pages/cinema', {
            title: cinema,
            cinema: resolve,
            rows: +rows,
            obj: {
                false: 'busy',
                true: 'free'
            },
            idUser: id
        });
    });
});


app.get('/history', function(req, res) {
    var list = require('./models/database');
    list.get_db().then(function (resolve) {
        var lastTen = resolve.slice(resolve.length-11);
        res.render('pages/history', {
            lastTen: lastTen,
            url: urls.urls.heroku,
            urlPoster: 'https://image.tmdb.org/t/p/w500'
        });
    });
});

app.get('/year/:year', function(req, res) {
    var moviesByYear = [];
    var get_movie_by_genre = require('./services/get-movie-by-genre');
    var url = urls.urls.year + '&year={name}';
    var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, req.params.year.trim());
    movie_list_by_genre.then(function (resolve) {
        if (!resolve.length) {
            moviesByYear = [];
        } else {
            resolve.forEach(function (elem) {
                moviesByYear.push({
                    title: elem.original_title,
                    overview: elem.overview,
                    release_date: elem.release_date,
                    popularity: elem.popularity,
                    url: 'https://image.tmdb.org/t/p/w500' + elem.poster_path
                });
            });
        }
        res.render('pages/year', {
            moviesByYear: moviesByYear,
            year: req.params.year.trim()
        });
    });
});

app.get('/movie/:id', function(req, res) {
    var movie = [];
    var omdb;
    var get_movie_by_genre = require('./services/get-movie-by-genre');
    var url = urls.urls.movieID;

    var movie_list_by_genre = get_movie_by_genre.getSingleMovie(url, req.params.id.trim());

    movie_list_by_genre.then(function (resolve) {
        movie = resolve;
        movie.posterUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
        omdb = get_movie_by_genre.getMovieIMBD(urls.urls.getOmdb, resolve.imdb_id);
        return omdb
    }).then(function (omdb) {
        res.render('pages/movie', {
            movie: movie,
            id: req.params.id.trim(),
            omdb: omdb
        });
    });
});


// Heroku Mode
// var server = app.listen(config.telegram.port, function () {
//     var host = server.address().address;
//     var port = server.address().port;
//
//     console.log('Web server started at http://%s:%s', host, port);
// });


// DEV Mode
var server = app.listen(function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Web server started at http://%s:%s', host, port);
});



bot.onText(/(.+)/, function (msg, match) {

    var apiai = require('apiai');

    var apiAi = apiai(process.env.API_API_AI || require('./token_telegram.json').apiai);

    var request = apiAi.textRequest(msg.text, {
        sessionId: '12345678'
    });

    request.on('response', function(response) {
        if (response.result.action !== 'input.unknown') {

            bot.sendMessage(msg.chat.id, response.result.fulfillment.speech)
        }

    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();

});
