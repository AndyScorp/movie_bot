
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
                  if (isInArray(array, mov[0])) {
                      array.push(mov)
                  }
              });
              return resolve(array)
          } else {
              return reject
          }
      });
  })
};

var isInArray = function (array, mov) {
    if (!array.length) {
        return true
    } else {
        for (var j=0; j<array.length; j++) {
            if (array[j][0] === mov) {
                return false
            }
        }
    }
    return true
};