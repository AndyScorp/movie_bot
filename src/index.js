
var libBot = require('./lib/bot');

const bot = new libBot();

var movies = require('./services/getmovies');
var movie = require('./services/getMovie');
var ListMovieNames = require('./services/listMoviesNames');

var lubavaUrl = 'http://cherkassy.multiplex.ua/Poster.aspx?id=16';
var plazaUrl = 'http://cherkassy.multiplex.ua/Poster.aspx?id=10';

var genres = require('./lib/genres-id.json');


bot.on('message', function (msg) {
    var movieString = [];
    var linkString = [];
    const chatId = msg.chat.id;
    if (msg.text.toLowerCase().includes('любава')) {
        movies.getMovies(lubavaUrl, '.afisha_td_bottom').then(function (resolve) {
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
            }).then(function(ans) {
                bot.once('callback_query', function(msg) {
                    if (msg.data) {
                        for (var i=0; i < resolve.length; i++) {
                            if (resolve[i][2] === msg.data) {
                                movie.getMovie(resolve[i][2]).then(function(mov) {
                                    bot.sendPhoto(
                                        msg.from.id,
                                        mov.pathImage,
                                        {
                                            caption : mov.title + '\n' + mov.type + '\n' + mov.duration,
                                            "reply_markup": {
                                                "inline_keyboard": [[{text:'Описание', callback_data: 'Description'}]]
                                            }
                                        }
                                    ).then(function (ans) {
                                        bot.once('callback_query', function (msg) {
                                            if (msg.data==='Description') {
                                                bot.sendMessage(
                                                    msg.from.id,
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
        movies.getMovies(plazaUrl, '.afisha_td_bottom').then(function (resolve) {
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
            }).then(function(ans) {
                bot.once('callback_query', function(msg) {
                    if (msg.data) {
                        for (var i=0; i < resolve.length; i++) {
                            if (resolve[i][2] === msg.data) {
                                movie.getMovie(resolve[i][2]).then(function(mov) {
                                    bot.sendPhoto(
                                        msg.from.id,
                                        mov.pathImage,
                                        {
                                            caption : mov.title + '\n' + mov.type + '\n' + mov.duration,
                                            "reply_markup": {
                                                "inline_keyboard": [[{text:'Описание', callback_data: 'Description'}]]
                                            }
                                        }
                                    ).then(function (ans) {
                                        bot.once('callback_query', function (msg) {
                                            if (msg.data==='Description') {
                                                bot.sendMessage(
                                                    msg.from.id,
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
                "inline_keyboard": [[{text:'Звонок в Любаву', callback_data: 'lubava'}, {text:'Звонок в Плазу', callback_data: 'plaza'}]]
            }
        }).then(function (value) {
            bot.once('callback_query', function(msg) {
                if (msg.data==='lubava') {
                    bot.sendContact(
                        msg.from.id,
                        '+380472599899',
                        "Lubava")
                } else if ((msg.data==='plaza')) {
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
            "keyboard": [["Любава", "Днепро-Плаза"], ["Звонок в кинотеатр"]]
        }
    });
});

bot.onText(/\/help/, function(msg) {
    bot.sendMessage(msg.chat.id, "/start - Movies from our city\n"
        + "/genre - 3 different movies filtered by genre\n"
        + "/year - 3 movies from year you wanted to watch\n"
        + "/filter_g_y - 3 movies by filter genre + year\n"
        + "/get_db - list from db"
    );
});



bot.onText(/\/year/, function (msg) {
    bot.sendMessage(msg.chat.id, "input Year which interesting for you (example: 2017)", {
    }).then(function (value) {
        bot.once('message', function (msg) {
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = 'https://api.themoviedb.org/3/discover/movie?api_key=15693fda909384f535d90fd7b33e3b4f&year={name}';
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, msg.text);
            movie_list_by_genre.then(function (resolve) {
                for (var i=0; i<3; i++) {
                        bot.sendMessage(
                            chat_id,
                            '*' + resolve[i].original_title + '*' + '\n'
                            + resolve[i].overview + '\n'
                            + '_' + resolve[i].release_date + '_' + '\n'
                            + '\n' + resolve[i].popularity + '\n\n'
                            + 'https://www.themoviedb.org/movie/'+ resolve[i].id,
                            {parse_mode : "Markdown"}
                        );
                }
            });
        })
    })
});

bot.onText(/\/genre/, function (msg) {

    bot.sendMessage(msg.chat.id, "input Genre of the movie you want to watch", {
        "reply_markup": {
            "inline_keyboard": ListMovieNames.listMovienames(3, genres.genres)
        }
    }).then(function (value) {
        bot.once('callback_query', function (msg) {
            var chat_id = msg.message.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var url = 'https://api.themoviedb.org/3/discover/movie?api_key=15693fda909384f535d90fd7b33e3b4f&with_genres={name}';
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, msg.data);
            movie_list_by_genre.then(function (resolve) {
                for (var i=0; i<3; i++) {
                    bot.sendMessage(
                        chat_id,
                        '*' + resolve[i].original_title + '*' + '\n'
                        + resolve[i].overview + '\n'
                        + '_' + resolve[i].release_date + '_' + '\n'
                        + '\n' + resolve[i].popularity + '\n\n'
                        + 'https://www.themoviedb.org/movie/'+ resolve[i].id,
                        {parse_mode : "Markdown"}
                    );
                }
            });
        })
    })
});

bot.onText(/\/filter_g_y/, function (msg) {

    bot.sendMessage(msg.chat.id, "input Genre and Year in such way: comedy+2017", {

    }).then(function (value) {
        bot.once('message', function (msg) {
            var array = msg.text.split('+');
            var chat_id = msg.chat.id;
            var get_movie_by_genre = require('./services/get-movie-by-genre');
            var genre_id = require('./services/get_genre_id').getGenreId(array[0].toLowerCase());
            var url = 'https://api.themoviedb.org/3/discover/movie?api_key=15693fda909384f535d90fd7b33e3b4f&year={name}&with_genres='+genre_id;
            var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, msg.data);
            movie_list_by_genre.then(function (resolve) {
                for (var i=0; i<3; i++) {
                    bot.sendMessage(
                        chat_id,
                        '*' + resolve[i].original_title + '*' + '\n'
                        + resolve[i].overview + '\n'
                        + '_' + resolve[i].release_date + '_' + '\n'
                        + '\n' + resolve[i].popularity + '\n\n'
                        + 'https://www.themoviedb.org/movie/'+ resolve[i].id,
                        {parse_mode : "Markdown"}
                    );
                }
            });
        })
    })
});
bot.onText(/\/find_by_title_imdb/, function (msg) {
    bot.sendMessage(msg.chat.id, "input Genre of the movie you want to watch", {
        "reply_markup": {
            "inline_keyboard": [[{text:'Action', callback_data: 'Action'}], [{text:'Звонок в Плазу', callback_data: 'plaza'}]]
        }
    })
});

bot.onText(/\/get_db/, function (msg) {
    var list = require('./models/database');
    list.get_db().then(function (resolve) {
        resolve.forEach(function (elem) {
            bot.sendMessage(msg.chat.id, elem.id + elem.data.title)
        });
    });
});
