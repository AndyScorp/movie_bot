var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var ajaxUtils = {};
var object;

function getRequestObject() {
    return (new XMLHttpRequest())
}


ajaxUtils.sendGetRequest =
    function(requestUrl, responseHandler, isJsonResponse) {
        var request = getRequestObject();
        request.onreadystatechange =
            function() {
                handleResponse(request, responseHandler, isJsonResponse);
            };
        request.open("GET", requestUrl, true);
        request.send(null);
    };

function handleResponse(request,
                        responseHandler, isJsonResponse, id) {


    if ((request.readyState == 4) &&

        ((request.status ==200) || (request.status ==202))) {
        if (isJsonResponse == undefined) {
            isJsonResponse = true;
        }
        if (isJsonResponse) {
            responseHandler(JSON.parse(request.responseText), id)
        }
        else {
            responseHandler(request);
        }

    }
}

module.exports = ajaxUtils;



