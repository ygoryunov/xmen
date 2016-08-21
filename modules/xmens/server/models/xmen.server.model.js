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
  superpower: {
    type: String,
    default: '',
    trim: true
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
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
