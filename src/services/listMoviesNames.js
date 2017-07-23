
module.exports.listMovienames = function (step, array) {
    var quantity = Math.ceil(array.length/step);
    var newArray = [];
    for (var i=0; i<quantity; i++) {
        newArray[i] = [];
        for (var j=0; j<step && i*step+j<array.length; j++) {
            newArray[i].push(
                 {text: array[i*step+j].text, callback_data: array[i*step+j].callback_data}
            );
        }
    }
    return newArray
};