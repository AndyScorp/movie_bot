
var request = require('request');
var cheerio = require('cheerio');
var url = 'http://kino.i.ua';
var Iconv = require('iconv').Iconv;


var iconv = new Iconv('windows-1251', 'utf-8');


module.exports.getMovie = function (id) {
    return new Promise(function (resolve, reject) {
        request({url: url+id, encoding:null}, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var movie = {};
                var $ = cheerio.load(iconv.convert(html).toString());
                var str;
                $('p').each(function () {
                    var a = $(this);
                    str = a.text().replace(/\t/g, '');
                    if (str.toLowerCase().indexOf('жанр') != -1) {
                        movie.type = str;
                    } else if (str.toLowerCase().indexOf('длительность') != -1) {
                        movie.duration = str;
                    } else if (str.toLowerCase().indexOf('описание') != -1) {
                        movie.content = str;
                    }
                });
                movie.title = $('body > div.body_container > div.Body.clear > div.Left > div > div > div.content.clear > h2').text();
                movie.schedulePlaza = ' ';
                movie.scheduleLubava = ' ';
                movie.pathImage = $('body > div.body_container > div.Body.clear > div.Left > div > div > div.content.clear > dl > dt > a > img')['0'].attribs.src;
                movie.schedule = ' ';
                return resolve(movie)
            } else {
                return reject
            }
        });
    })
};

