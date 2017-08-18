var express = require('express');
var app = express();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/styles'));

// app.get('/', function (req, res) {
//     var rowsPlaza, rowsLubava;
//     require('./models/database').getSeats('lubava').then(function (lubava) {
//         return lubava;
//     }).then(function (lubava) {
//             require('./models/database').getSeats('plaza').then(function (plaza) {
//                 rowsLubava = lubava[lubava.length-1].row;
//                 rowsPlaza = plaza[plaza.length-1].row;
//                 res.render('pages/index', {
//                     lubava: lubava,
//                     rowsLubava: +rowsLubava,
//                     obj: {
//                         false: 'busy',
//                         true: 'free'
//                     },
//                     plaza: plaza,
//                     rowsPlaza: +rowsPlaza
//                 });
//         })
//     })
// });

// app.get('/cinema/:cinema/:id', function (req, res) {
//     var rows;
//     var cinema = req.params.cinema.trim();
//     var id = req.params.id.trim();
//     require('./models/database').getSeats(cinema).then(function (resolve) {
//         rows = resolve[resolve.length - 1].row;
//         res.render('pages/cinema', {
//             title: cinema,
//             cinema: resolve,
//             rows: +rows,
//             obj: {
//                 false: 'busy',
//                 true: 'free'
//             },
//             idUser: id
//         });
//     });
// });

var obj = {
  data: {

  }
}
obj.data.id = 123;
obj.data.title = "Hello world";
obj.data.popularity = "1234353";
obj.data.release_date = "1234353";
obj.data.overview = 'lkjfda;lsjf;ladsjfl;asjd;;f aiefj;sdkljagfa;dslkfja;slkdfja;dsklfj;laksjfds;ljksaf;kjsad;lj';

console.log(obj);
var urls = {
  urls: {
    heroku: ''
  }
}

var lastTen = [];

for (var i = 0; i < 4; i++) {
  lastTen.push(obj);
}



app.get('/', function(req, res) {
  res.render('pages/main', {
    lastTen: lastTen,
    url: urls.urls.heroku,
    urlPoster: 'https://image.tmdb.org/t/p/w500'
  })

});


// app.get('/history', function(req, res) {
//         res.render('pages/history', {
//             lastTen: lastTen,
//             url: urls.urls.heroku,
//             urlPoster: 'https://image.tmdb.org/t/p/w500'
//         });
//     });
// });

// app.get('/year/:year', function(req, res) {
//     var moviesByYear = [];
//     var get_movie_by_genre = require('./services/get-movie-by-genre');
//     var url = urls.urls.year + '&year={name}';
//     var movie_list_by_genre = get_movie_by_genre.getMovieByGenre(url, req.params.year.trim());
//     movie_list_by_genre.then(function (resolve) {
//         if (!resolve.length) {
//             moviesByYear = [];
//         } else {
//             resolve.forEach(function (elem) {
//                 if (elem.poster_path) {
//                     var tempUrl = 'https://image.tmdb.org/t/p/w500' + elem.poster_path
//                 } else {
//                     var tempUrl = '/img/no-poster.png'
//                 }
//                 moviesByYear.push({
//                     title: elem.original_title,
//                     overview: elem.overview,
//                     release_date: elem.release_date,
//                     popularity: elem.popularity,
//                     url: tempUrl
//                 });
//             });
//         }
//         res.render('pages/year', {
//             moviesByYear: moviesByYear,
//             year: req.params.year.trim()
//         });
//     });
// });

// app.get('/movie/:id', function(req, res) {
//     var movie = [];
//     var omdb;
//     var get_movie_by_genre = require('./services/get-movie-by-genre');
//     var url = urls.urls.movieID;
//
//     var movie_list_by_genre = get_movie_by_genre.getSingleMovie(url, req.params.id.trim());
//
//     movie_list_by_genre.then(function (resolve) {
//         movie = resolve;
//         movie.posterUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
//         omdb = get_movie_by_genre.getMovieIMBD(urls.urls.getOmdb, resolve.imdb_id);
//         return omdb
//     }).then(function (omdb) {
//         res.render('pages/movie', {
//             movie: movie,
//             id: req.params.id.trim(),
//             omdb: omdb
//         });
//     });
// });


app.listen(3000);
