
var request = require('request');
var cheerio = require('cheerio');


module.exports.getMovies = function (url, element) {
  return new Promise(function (resolve, reject) {
      request(url, function (error, response, html) {
          if (!error && response.statusCode == 200) {
              var array = [];
              var $ = cheerio.load(html);

              $(element).each(function(i, element){
                  var a = $(this);
                  var index = a.children()['1'].attribs.href.replace(/Movie.aspx\?id=/g, '');
                  var mov = (a.text().trim().replace(/\t/g, '').replace(/\n\n/g, '\n') + '\n' + index).split('\n');
                  array.push(mov)
              });
              return resolve(array)
          } else {
              return reject
          }
      });
  })
};