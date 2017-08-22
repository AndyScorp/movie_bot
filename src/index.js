const config = require('./config');
const Bot = require('node-telegram-bot-api');
const movies = require('./services/getmovies');
const movie = require('./services/getMovie');
const ListMovieNames = require('./services/listMoviesNames');
const genres = require('./lib/genres-id.json');
const urls = require('./lib/url-for-dbbase');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const configW = require('../webpack.config.js');
const compiler = webpack(configW);
const bodyParser = require('body-parser');
const app = express();
const translate = require('./services/translate');

if (process.env.PORT) {
    // Heroku Mode
    var bot = new Bot(config.telegram.token);
    bot.setWebHook(`${config.telegram.url}/bot${config.telegram.token}`);
} else {
    // DEV Mode
    var bot = new Bot(config.telegram.token, {polling: true});
    app.use(webpackDevMiddleware(compiler, {
        publicPath: configW.output.publicPath
    }));
}


app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/styles'));


bot.onText(/\/admin/, function(msg) {
    bot.sendMessage(msg.chat.id, "/setSeats - Put cinema to DB or replace old\n"
    );
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

//********************** START OF FRONT END PART ***************************
//**********************                         ***************************

app.get('/order', function (req, res) {
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

app.get('/', function(req, res) {
    var list = require('./models/database');
    list.get_db().then(function (resolve) {
        var lastTen = resolve.slice(resolve.length-11);
        res.render('pages/main', {
            lastTen: lastTen,
            url: urls.urls.heroku,
            urlPoster: 'https://image.tmdb.org/t/p/w500'
        });
    });
});

app.get('/help', function (req, res) {
    res.render('pages/help');
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
                if (elem.poster_path) {
                    var tempUrl = 'https://image.tmdb.org/t/p/w500' + elem.poster_path
                } else {
                    var tempUrl = '/img/no-poster.png'
                }
                moviesByYear.push({
                    title: elem.original_title,
                    overview: elem.overview,
                    release_date: elem.release_date,
                    popularity: elem.popularity,
                    url: tempUrl,
                    id: elem.id
                });
            });
        }
        res.render('pages/year', {
            moviesByYear: moviesByYear,
            year: req.params.year.trim(),
            url: urls.urls.heroku
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

app.post(`/bot${config.telegram.token}`, function(req, res) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

//**********************                       ***************************
//********************** END OF FRONT END PART ***************************



//**********************                       ***************************
//********************** START OF BACK END PART ***************************
bot.onText(/(.+)/, function (msg, match) {

    var apiai = require('apiai');

    var chat_id = chatId = msg.chat.id;

    var apiAi = apiai(process.env.API_API_AI || require('./token_telegram.json').apiai);

    var request = apiAi.textRequest(msg.text, {
        sessionId: '12345678'
    });

    request.on('response', function(response) {

        if (response.result.fulfillment.speech) {
            bot.sendMessage(msg.chat.id, response.result.fulfillment.speech);
        }

        if (doAction[response.result.action]) {
            doAction[response.result.action](response.result.parameters, chat_id, msg)
        }

    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
});


const doAction = {

//*********************** Action API AI Show Cinema **********************

    'show.cinema': function (parameters, chatId, msg) {
        if (parameters.cinema) {
            var movieString = [];
            var linkString = [];

            movies.getMovies(urls.urls[parameters.cinema + 'Url'], '.afisha_td_bottom').then(function (resolve) {
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
    },

    //*********************** Action API AI Call Cinema **********************

    'call.cinema': function (parameters, chatId, msg) {
        if (parameters.cinema) {
            if (parameters.cinema === 'lubava') {
                bot.sendContact(
                    msg.from.id,
                    '+380472599899',
                    "Lubava")
            } else if (parameters.cinema === 'plaza') {
                bot.sendContact(
                    msg.from.id,
                    '+380472724313',
                    "Plaza")
            }
        }
    },

    //*********************** Action API AI Book Ticket **********************

    'book.tickets': function (parameters, chatId, msg) {
        if (parameters.seans) {
            var cinemaName = parameters.seans;
            var list = require('./models/database').getSeats(cinemaName);
            list.then(function (resolve) {
                var getFreeSeats = require('./services/get-free-seats').getFreeSeats(resolve, msg.from.id);
                getFreeSeats.push([{
                    "text": "Cancel",
                    "callback_data": "cancel"
                }]);
                bot.sendMessage(msg.chat.id,
                    '*Free Seats*. Pick one to book seat.\n' + 'Here you can see fullfillment of cinema\n' + '[Link to cinema view](' + urls.urls.cinema + cinemaName + '/' + msg.chat.id + ')', {
                        parse_mode : "Markdown",
                        "reply_markup": {
                            "inline_keyboard": getFreeSeats
                        }
                    }).then(function () {
                    bot.once('callback_query', function (msg) {
                        require('./models/database').BookSeats(msg.data, msg.from.id, cinemaName).then(function (resolve) {
                            bot.sendMessage(msg.from.id, resolve + '\n'
                                + 'Here you can see fullfillment of cinema\n'
                                + '[Link to cinema view](' + urls.urls.cinema + cinemaName + '/' + msg.from.id + ')',
                                {parse_mode : "Markdown"}
                            )
                        })
                    })
                })
            });
        }
    },

    //*********************** Action API AI Show Movies **********************

    'show.movies': function (parameters, chat_id, msg) {
        if (parameters.year && !parameters.genre) {
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.year + '&year={name}';
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, parameters.year);
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
        } else if (parameters.year && parameters.genre) {
            var array = [parameters.genre, parameters.year];
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
        }
    },

    //*********************** Action API AI Best Movies **********************

    'best.movies': function (parameters, chat_id, msg) {
        if (parameters.year && parameters.genre) {
            var array = [parameters.genre, parameters.year];
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
        } else if (parameters.year && !parameters.genre) {
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.year + '&year={name}' + '&sort_by=popularity.desc';
            var movie_list_by_genre = get_movie_by_genre.getBestMovieByGenre(url, parameters.year);
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
        }
    },

    //*********************** Action API AI Show by Title **********************

    'show.by_title': function (parameters, chat_id, msg) {
        if (parameters.Title) {
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = urls.urls.byKeyWords;
            var title = parameters.Title.replace(/ /g, "+");
            var movie_by_KW = get_movie_by_genre.getMovieByGenre(url, title);
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
        }
    },

    //*********************** Action API AI Show Help **********************

    'show.help': function (parameters, chat_id, msg) {
        if (parameters.help) {
            bot.sendMessage(msg.chat.id, "Just type something like:\n"
                + "`I want films of 2017` or\n"
                + "`Show me best comedies of 1999` or\n"
                + "`What now in cinemas in cherkasy` or\n"
                + "`Show me dramas, please` or\n"
                + "`Find movie by title Star Wars Episode I` or\n"
                + "`I want to make call to ...` or\n"
                + "`I want to order/book ticket to lubava` or\n"
                + "`Translate 'word/слово' - will translate from en/ru to ru/en\n"
                + "`Price 'компресор муромец' - smart search in price AvtoHim",
                {parse_mode : "Markdown"}
            );
        }
    },

    //*********************** Action API AI Show Start **********************

    'show.start': function (parameters, chat_id, msg) {
        if (parameters.start) {
            bot.sendMessage(msg.chat.id, "I am super smart " +"*Movie-Lite-Bot*" + " made by team 10\n"
                + "in summer camp in *MOC*. You may try to speak with me. If you want to know more\n"
                + "type `help` or `help me`",
                {parse_mode : "Markdown"}
            );
        }
    },
    'action.translate': function (parameters, chat_id) {
        if (parameters.any) {

            let translation = translate.translate(parameters.any);
            let alternative;

            if (translation) {
                translation.then(res => {
                    let raw = JSON.parse(res.raw || '[]');
                    if (Array.isArray(raw) && Array.isArray(raw[1]) && Array.isArray(raw[1][0]) && raw[1][0][1]) {
                        alternative = raw[1][0][1].join(', ')
                    } else { alternative = ''}
                    bot.sendMessage(
                        chat_id,
                        '*Translation:* ' + res.text + '\n' + '*Alternative:* ' + alternative,
                        {parse_mode : "Markdown"}
                    );
                }).catch(err => {
                    console.error(err);
                })
            }
        }
    },
    'action.price': function (parameters, chat_id) {
        let str = '_Search result_\n';
        require('./services/getPriceAvtohim').getPrice(parameters.any).then(function (resolve) {
            for (let i=0; i<resolve.length && i<10; i++) {
                str += '*1c-code:* ' + resolve[i][1] + ' *Description:* ' + resolve[i][2] + ' *Price:* ' + resolve[i][3] + ' грн.' + '\n'
            }
            bot.sendMessage(
                chat_id,
                str,
                {parse_mode : "Markdown"}
            );
        });
    }
};





//**********************                       ***************************
//********************** END OF BACK END PART ***************************


var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Web server started at http://%s:%s', host, port);
});



// if (process.env.PORT) {
//     // Heroku Mode
//     var server = app.listen(config.telegram.port, function () {
//         var host = server.address().address;
//         var port = server.address().port;
//         console.log('Web server started at http://%s:%s', host, port);
//     });
// } else {
//     // DEV Mode
//     var server = app.listen(function () {
//         var host = server.address().address;
//         var port = server.address().port;
//         console.log('Web server started at http://%s:%s', host, port);
//     });
// }
