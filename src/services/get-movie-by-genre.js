var ajax = require('./ajaxUtils');
var add_db = require('../models/database');


module.exports.getMovieByGenre = function (url, replace) {
    return new Promise(function (resolve, reject) {
        ajax.sendGetRequest(url.replace('{name}', replace), handlerPages, true);
        function handlerPages(req) {
            if (req) {
                var page = getRandomPage(1, req.total_pages);
                ajax.sendGetRequest(url.replace('{name}', replace) + '&page='+page, handler, true);
            }
        }
        function handler(request) {
            if (request) {
                var filmsArray = [];
                var results = request.results;
                for (var i=0; i<3 && i<results.length; i++) {
                    var entry = getRandomEntry(results);
                    for (var j=0; j<i; j++) {
                        if (entry.id === filmsArray[j].id) {
                            entry = getRandomEntry(results);
                            j=0;
                        }
                    }
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


module.exports.getBestMovieByGenre = function (url, replace) {
    return new Promise(function (resolve, reject) {
        ajax.sendGetRequest(url.replace('{name}', replace) + '&page' + getRandomPage(1, 3), handler, true);
        function handler(request) {
            if (request) {
                var filmsArray = [];
                var results = request.results;
                for (var i=0; i<3 && i<results.length; i++) {
                    var entry = getRandomEntry(results);
                    for (var j=0; j<i; j++) {
                        if (entry.id === filmsArray[j].id) {
                            entry = getRandomEntry(results);
                            j=0;
                        }
                    }
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
        ajax.sendGetRequest(url.replace('{name}', replace), handler, true);
        function handler(request) {
            if (request) {
                return resolve(request);
            } else {
                return reject
            }
        }
    });
};

module.exports.getMovieIMBD = function (url, replace) {
    return new Promise(function (resolve, reject) {
        ajax.sendGetRequest(url.replace('{name}', replace), handler, true);
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
    return array[Math.floor(Math.random() * (array.length - 1))];
}

// Method to get one random number
function getRandomPage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}