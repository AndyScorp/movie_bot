genres = require('../lib/genres-id.json');


module.exports.getGenreId = function (filter) {
    for (var i=0; i<genres.genres.length; i++) {
        if (genres.genres[i].text.toLowerCase() === filter.toLowerCase()) {
            filter = genres.genres[i].callback_data ;
            return filter
        }
    }
};
