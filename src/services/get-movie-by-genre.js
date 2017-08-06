var ajax = require('./ajaxUtils');
var add_db = require('../models/database');


module.exports.getMovieByGenre = function (url, replace) {
    return new Promise(function (resolve, reject) {
        console.log(url, replace);
        ajax.sendGetRequest(url.replace('{name}', replace) + '&page='+getRandomPage(50), handler, true);
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

module.exports.getSingleMovie = function (url, replace) {
    return new Promise(function (resolve, reject) {
        console.log(url, replace);
        ajax.sendGetRequest(url.replace('{name}', replace) + '&page='+getRandomPage(50), handler, true);
        function handler(request) {
            if (request) {
                return resolve(request);
            } else {
                return reject
            }
        }
    });
};

// Method to call Object like array
function toArray(obj) {
    return [].slice.call(obj)
}

// Method to get one random Array item
function getRandomEntry(array) {
    return array[Math.round(Math.random() * (array.length - 1))];
}

// Method to get one random number
function getRandomPage(number) {
    return Math.round(Math.random() * (number - 1))
}