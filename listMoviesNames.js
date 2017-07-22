
module.exports.listMovienames = function (step, array) {
    var quantity = Math.ceil(array.length/step);
    var newArray = [];
    for (var i=0; i<quantity; i++) {
        newArray[i] = [];
        for (var j=0; j<step && i*step+j<array.length; j++) {
            newArray[i].push(array[i*step+j]);
        }
    }
    newArray.unshift(["/start"]);
    return newArray
};