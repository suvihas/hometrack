var express = require('express');
var util = require('util');
var _ = require('lodash');
var bodyParser = require('body-parser');

var filter = function() {
    return function(req, res, next) {

        console.log("Inside function: filter");

        var payloadArray = req.body.payload;

        getResultSet(payloadArray, [], function(err, resultArray) {
            if (err) {
                console.log("Error: " + util.inspect(err));
                return res.status(500).json({
                    'msg': 'Error '
                });
            }
            res.status(200).json({
                data: resultArray
            });
        });
    }
}

var getResultSet = function(payload, returnArray, cb) {
    if (payload.length === 0) {
        return cb(null, returnArray);
    }
    var item = payload.pop();

    if ((item.type == "htv") && (item.workflow == "completed")) {

        //this is a wanted record, construct result object and push to result set
        var building = item.address.buildingNumber;
        var street = item.address.street;
        var suburb = item.address.suburb;
        var state = item.address.state;
        var pincode = item.address.postcode;

        var address = [building, street, suburb, state, pincode];

        var data = {};
        data.concataddress = address.join(' ');
        data.type = item.type;
        data.workflow = item.workflow;
        returnArray.push(data);
    }
    getResultSet(payload, returnArray, cb);

}


module.exports.filter = filter;