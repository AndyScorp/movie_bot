
var request = require('request');
var cheerio = require('cheerio');
var homeUrl = 'http://cherkassy.multiplex.ua';
var url = 'http://cherkassy.multiplex.ua/Movie.aspx?id=';


module.exports.getMovie = function (id) {
    return new Promise(function (resolve, reject) {
        request(url+id, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var movie = {};
                var $ = cheerio.load(html);
                movie.schedulePlaza = $('#ctl00_cphMain_divEvents > table > tbody > tr.bg1_1').text().split('а"').join('а"  ');
                movie.scheduleLubava = $('#ctl00_cphMain_divEvents > table > tbody > tr.bg1_2').text().split('а"').join('а"  ');
                movie.title = $('.blok > div > h1').text();
                movie.duration = $('#ctl00_cphMain_lblLength').text();
                movie.type = $('#ctl00_cphMain_lblGenres').text();
                movie.pathImage = homeUrl + $('#ctl00_cphMain_lnkPic')['0'].attribs.href;
                movie.content = $('.blok > div > p').text();
                movie.schedule = $('#ctl00_cphMain_divEvents > table > tbody > tr.bg1_1').text();
                return resolve(movie)
            } else {
                return reject
            }
        });
    })
};

