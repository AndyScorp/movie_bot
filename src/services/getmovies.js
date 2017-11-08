
var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;
const Buffer = require('buffer').Buffer;

var iconv = new Iconv('windows-1251', 'utf-8');

module.exports.getMovies = function (url, element) {
  return new Promise(function (resolve, reject) {
      element = 'tr';
      request({url: url, encoding:null}, function (error, response, html) {
          if (!error && response.statusCode == 200) {
              var array = [];
              var $ = cheerio.load(iconv.convert(html).toString());

              $(element).each(function(i, element){
                  var a = $(this);
                  var strin = a.text().replace(/\t/g, '').split('\n');


                  if (strin.length === 6 && array[array.length-1]) {
                      array[array.length-1][1] += '\n' + strin[1] + ' ' +  strin[2] + ' ' + strin[3];

                  } else if (strin.length === 7 && a.children()[0].children[0].attribs) {
                      array.push([strin[1], strin[2] + ' ' +  strin[3] + ' ' + strin[4], a.children()[0].children[0].attribs.href]);
                  }

                  if (a.children()[3].children[0].attribs && a.children()[3].children[0].children && a.children()[3].children[0].attribs.class === 'ddd') {
                      array[array.length-1][1] += ' 3D';
                  } else if (a.children()[2].children[0].attribs && a.children()[2].children[0].children && a.children()[2].children[0].attribs.class === 'ddd') {
                      array[array.length-1][1] += ' 3D';
                  }


                  // console.log(a.children()['1'].children[2].next.children[0].next.children[1].next);

                  // var index = a.children()['1'].attribs.href.replace(/Movie.aspx\?id=/g, '');
                  // var mov = (a.text().trim().replace(/\t/g, '').replace(/\n\n/g, '\n') + '\n' + index).split('\n');
                  // if (isInArray(array, mov[0])) {
                  //     array.push(mov)
                  // }
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

function to(str) { // функция перевода из win1251 в utf8
    return Iconv.decode(new Buffer(str, "win1251"), "utf8")
}