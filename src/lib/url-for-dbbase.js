var apiKey = process.env.API_DB || require('../token_telegram.json').apiDB;

module.exports.urls = {
    filterGY : 'https://api.themoviedb.org/3/discover/movie' + apiKey,
    genre : 'https://api.themoviedb.org/3/discover/movie' + apiKey,
    movieDB : 'https://www.themoviedb.org/movie/',
    year : 'https://api.themoviedb.org/3/discover/movie' + apiKey
};