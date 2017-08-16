// Load required packages
var mongoose = require('mongoose');
var merge = require('mongoose-merge-plugin');
var defSchemaAttr = require('../../../common/plugins/defaultSchemaAttr');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../../connections/dbGeneral');

mongoose.plugin(merge);

// Define our ride schema
var RideSchema = new mongoose.Schema({
    requestId: {
        type: String,
        index: true,
        required: true
    },
    requestTime: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        index: true,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    distance: {
        type: Number
    },
    productId: {
        type: String
    },
    startCity: {
        name: {
            type: String
        },
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    }
},
{
    minimize: false
});

// Add paginate plugin
RideSchema.plugin(mongoosePaginate);
// Add default schema attributes plugin
RideSchema.plugin(defSchemaAttr);

// Export the Mongoose model
module.exports = db.model('Ride', RideSchema);