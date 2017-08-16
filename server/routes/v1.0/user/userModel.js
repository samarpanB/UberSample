// Load required packages
var mongoose = require('mongoose');
var merge = require('mongoose-merge-plugin');
var defSchemaAttr = require('../../../common/plugins/defaultSchemaAttr');
var mongoosePaginate = require('mongoose-paginate');
var db = require('../../../connections/dbGeneral');

mongoose.plugin(merge);

// Define our user schema
var UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    externalUuid: {
        type: String,
        index: true,
        required: true
    }
},
{
    minimize: false
});

// Add paginate plugin
UserSchema.plugin(mongoosePaginate);
// Add default schema attributes plugin
UserSchema.plugin(defSchemaAttr);

// Export the Mongoose model
module.exports = db.model('User', UserSchema);