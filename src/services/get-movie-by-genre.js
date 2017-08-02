var ajax = require('./ajaxUtils');
var genres = require('../lib/genres-id.json');
var add_db = require('../models/database');


module.exports.getMovieByGenre = function (url, replace) {
    return new Promise(function (resolve, reject) {
        ajax.sendGetRequest(url.replace('{name}', replace) + '&page='+getRandomPage(100), handler, true);
        function handler(request) {
            if (request) {
                var filmsArray = [];
                var results = request.results;
                for (var i=0; i<3 && i<results.length; i++) {
                    var entry = getRandomEntry(results);
                    filmsArray.push(entry);
                    add_db.create_db(JSON.stringify(entry))
                }
                return resolve(filmsArray);
            } else {
                return reject
            }
        }
    });
};


function toArray(obj) {
    return [].slice.call(obj)
}

function getRandomEntry(array) {
    return array[Math.round(Math.random() * (array.length - 1))];
}

function getRandomPage(number) {
    return Math.round(Math.random() * (number - 1))
}