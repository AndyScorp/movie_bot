var apiKey = process.env.API_DB || require('../token_telegram.json').apiDB;
var apiOmdb = process.env.API_OMDB || require('../token_telegram.json').omdbApi;

module.exports.urls = {
    filterGY : 'https://api.themoviedb.org/3/discover/movie' + apiKey,
    genre : 'https://api.themoviedb.org/3/discover/movie' + apiKey,
    movieDB : 'https://www.themoviedb.org/movie/',
    year : 'https://api.themoviedb.org/3/discover/movie' + apiKey,
    movieID : 'https://api.themoviedb.org/3/movie/{name}' + apiKey,
    heroku: 'https://movie-lite-bot.herokuapp.com/movie/',
    byKeyWords: 'https://api.themoviedb.org/3/search/movie' + apiKey + '&query={name}',
    getOmdb: 'http://www.omdbapi.com/?i={name}' + apiOmdb,
    cinema: 'https://movie-lite-bot.herokuapp.com/cinema/',
    lubavaUrl: 'http://cherkassy.multiplex.ua/Poster.aspx?id=16',
    plazaUrl: 'http://cherkassy.multiplex.ua/Poster.aspx?id=10'
};