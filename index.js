var TelegramBot = require('node-telegram-bot-api');
var cron = require('node-cron');
const token = require('./token_telegram.json').token;
const bot = new TelegramBot(token, {polling: true});


ListMovieNames = require('./listMoviesNames');

var lubavaUrl = 'http://cherkassy.multiplex.ua/Poster.aspx?id=16';
var plazaUrl = 'http://cherkassy.multiplex.ua/Poster.aspx?id=10';


// cron.schedule('5 * * * * *', function(){
//     console.log('Hurray!!!!');
//     var chatId = 376822196;
//     var url = 'http://umorili.herokuapp.com/api/random?num=1';
//     request(url, function (error, response, body) {
//         var data = JSON.parse(body)[0].elementPureHtml;
//         bot.sendMessage(chatId, entities.decode(data));
//         console.log(data);
//     })
// });


var movies = require('./getmovies.js');
var movie = require('./getMovie');

bot.on('message', function (msg) {
    var movieString = [];
    var linkString = [];
    const chatId = msg.chat.id;
    if (msg.text.toLowerCase().includes('любава')) {
        movies.getMovies(lubavaUrl, '.afisha_td_bottom').then(function (resolve) {
            resolve.forEach(function (item, i, arr) {
                movieString.push('<b>' + item[0] + '</b>' + '\n' + item[1]);
                linkString.push(item[0]);
            });
            var newArray = ListMovieNames.listMovienames(2, linkString);

            bot.sendMessage(chatId, '<b>' + msg.text.toUpperCase() + '</b>' + '\n\n' + movieString.join('\n\n'), {
                parse_mode : "HTML",
                "reply_markup": {
                    "keyboard": newArray
                }
            }).then(function(ans) {
                bot.once('message', function(msg) {
                    if (msg.text) {
                        for (var i=0; i < resolve.length; i++) {
                            if (resolve[i][0].includes(msg.text)) {
                                movie.getMovie(resolve[i][2]).then(function(mov) {
                                    bot.sendPhoto(
                                        msg.chat.id,
                                        mov.pathImage,
                                        {
                                            caption : mov.title + '\n' + mov.type + '\n' + mov.duration,
                                            "reply_markup": {
                                                "keyboard": [['Description'], ['/start'], ["Любава", "Днепро-Плаза"]]
                                            }
                                        }
                                    ).then(function (ans) {
                                        bot.once('message', function (msg) {
                                            if (msg.text==='Description') {
                                                bot.sendMessage(
                                                    chatId, '*'+mov.title+'*' + '\n' + mov.type + '\n' + '_'+mov.duration+'_' + '\n' + mov.content,
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
                linkString.push(item[0]);
            });

            var newArray = ListMovieNames.listMovienames(3, linkString);

            bot.sendMessage(chatId, '<b>' + msg.text.toUpperCase() + '</b>' + '\n\n' + movieString.join('\n\n'), {
                parse_mode : "HTML",
                "reply_markup": {
                    "keyboard": newArray
                }
            }).then(function(ans) {
                bot.once('message', function(msg) {
                    if (msg.text) {
                        for (var i=0; i < resolve.length; i++) {
                            if (resolve[i][0].includes(msg.text)) {
                                movie.getMovie(resolve[i][2]).then(function(mov) {
                                    bot.sendPhoto(
                                        msg.chat.id,
                                        mov.pathImage,
                                        {
                                            caption : mov.title + '\n' + mov.type + '\n' + mov.duration,
                                            "reply_markup": {
                                                "keyboard": [['Description'], ['/start'], ["Любава", "Днепро-Плаза"]]
                                            }
                                        }
                                    ).then(function (ans) {
                                        bot.once('message', function (msg) {
                                            if (msg.text==='Description') {
                                                bot.sendMessage(
                                                    chatId, '*'+mov.title+'*' + '\n' + mov.type + '\n' + '_'+mov.duration+'_' + '\n' + mov.content,
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
});

bot.onText(/\/start/, function(msg) {
    bot.sendMessage(msg.chat.id, "Welcome", {
    "reply_markup": {
        "keyboard": [["Любава", "Днепро-Плаза"]]
        }
    });
});





