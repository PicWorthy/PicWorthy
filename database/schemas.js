const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  photos: [{}],
  likes: [{}],
  ratings: [{}],
});

const PictureSchema = new mongoose.Schema({
  category: String,
  location: String,
  imageURL: String,
  description: String,
  username: String,
  user_id: String,
  loc: {
    type: {
      default: 'Point', 
      type: String
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
      
    }
  },
  comments: [{
    username: String,
    message: String,
    createdAt: Date
  }]
});

module.exports.UserSchema = UserSchema;
module.exports.PictureSchema = PictureSchema;
