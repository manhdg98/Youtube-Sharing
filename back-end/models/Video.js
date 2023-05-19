const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  url: String,
});

module.exports = mongoose.model('Video', videoSchema);
