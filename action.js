var express = require('express');
var util = require('util');
var _ = require('lodash');
var bodyParser = require('body-parser');

var filter = function() {
    return function(req, res, next) {

        if(!req.body.payload) {
        	console.log("Error! Payload missing!");
        	return res.status(400).json({
                    'error': 'Could not decode request: JSON parsing failed'
                });
        }

        var payloadArray = req.body.payload;

        if(payloadArray.length === 0) {
        	console.log("Error! Empty payload!");
        	return res.status(400).json({
                    'error': 'Empty payload'
                });
        }

        getResultSet(payloadArray, [], function(err, resultArray) {
            if (err) {
                console.log("Error: " + util.inspect(err));
                return res.status(400).json({
                    'error': 'Could not decode request: JSON parsing failed'
                });
            }
            res.status(200).json({
                response: resultArray
            });
        });
    }
}

var getResultSet = function(payload, returnArray, cb) {
    //exit point for recursive call
    if (payload.length === 0) {
        return cb(null, returnArray);
    }
    var item = payload.pop();
    
    if (!item.type || !item.workflow) {
        console.log("Error! Item type or workflow missing!");
        return cb(new Error("type or workflow missing in payload"));
    }

    if ((item.type == "htv") && (item.workflow == "completed")) {
        //this is a wanted record, construct result object and push to result set
        var building = item.address.buildingNumber || '';
        var street = item.address.street || '';
        var suburb = item.address.suburb || '';
        var state = item.address.state || '';
        var pincode = item.address.postcode || '';

        var address = [building, street, suburb, state, pincode];

        var data = {};
        data.concataddress = address.join(' ');
        data.type = item.type;
        data.workflow = item.workflow;
        returnArray.push(data);
    }
    //recursive call to process payload
    getResultSet(payload, returnArray, cb);
}


module.exports.filter = filter;