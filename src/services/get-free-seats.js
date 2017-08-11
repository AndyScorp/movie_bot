


module.exports.getFreeSeats = function (listSeats, id) {
    var freeSeats = [];
    listSeats.forEach(function (elem) {
        if (elem.status) {
            freeSeats.push({
                "text": elem.id.toString(),
                "callback_data": elem.id.toString()
            })
        } else if (elem.user_id === id) {
            freeSeats.push({
                "text": elem.id.toString() + '-Yours',
                "callback_data": elem.id.toString()
            })
        }
    });

    return require('./listMoviesNames').listMovienames(6, freeSeats)
};