
var libBot = require('./lib/bot');

const bot = new libBot();

var movies = require('./services/getmovies');
var movie = require('./services/getMovie');
var ListMovieNames = require('./services/listMoviesNames');

var lubavaUrl = 'http://cherkassy.multiplex.ua/Poster.aspx?id=16';
var plazaUrl = 'http://cherkassy.multiplex.ua/Poster.aspx?id=10';


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
                        "Lubava")
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
    bot.sendMessage(msg.chat.id, "All you need is to type /start - then everything will be clear to understand");
});