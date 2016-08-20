'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Xmen Schema
 */
var XmenSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Xmen name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Xmen', XmenSchema);
