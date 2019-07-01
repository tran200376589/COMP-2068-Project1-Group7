const mongoose = require('mongoose');

// Our Schema
const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED'],
    default: 'DRAFT'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  }
}, {
  timestamps: true
});

// Query Helper
MovieSchema.query.drafts = function () {
  return this.where({
    status: 'DRAFT'
  });
};

MovieSchema.query.published = function () {
  return this.where({
    status: 'PUBLISHED'
  });
};

module.exports = mongoose.model('Movie', MovieSchema);