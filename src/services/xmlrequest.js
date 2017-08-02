
var ajax = require("./ajaxUtils");

ajax.sendGetRequest(url, handler, false);

function handler(request) {
    var arrayFilms=[];


    array.forEach(function (item, i) {
        arrayFilms.push(item.textContent);
    });
}

function toArray(obj) {
    return [].slice.call(obj)
}