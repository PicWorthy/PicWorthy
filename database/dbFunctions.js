const Promise = require('bluebird');
const bcrypt = require('bcrypt-nodejs');

const schemas = require('./schemas.js');
const models = require('./models.js');
const db = require('./mongoose.js');

Promise.promisifyAll(bcrypt);

db.fetchUser = (username) =>  models.Users.findOne({username: username});

db.saveUser = (obj) => {
  return db.fetchUser(obj.username)

  .then((user) => {

    if (user === null) {
      const saltRounds = 10;
      return bcrypt.genSaltAsync(saltRounds)

      .then ((salt) => {
        return bcrypt.hashAsync(obj.password, salt, null)

        .then ((hash) => {
          obj.password = hash;
          return models.Users.create({
            firstName: obj.firstName,
            lastName: obj.lastName,
            username: obj.username,
            password: obj.password
          }, (err) => {
            console.log(err);
          });
        })

        .catch((err) =>
          console.log(err)
        )
    })

  } else {
      return false;
    }
  })
};

db.savePicture = function (data) {

  const newPic = new models.Pictures({
    category: data.category,
    location: data.location,
    imageURL: data.imageURL,
    description: data.description,
    username: data.username,
    user_id: data.user_id,
    loc: {
      type: 'Point',
      coordinates: [data.latLng.lng, data.latLng.lat]
    },
    comments: data.comments
  });

  return newPic.save();
};

db.savePictureToUser = (data) =>
  models.Users.update(
    {_id: data.user_id},
    {$push: { photos: data}}
  );

const MAX_DISTANCE = 20000000;

db.selectClosestPictures = (location) =>
  models.Pictures.aggregate(
    [
      {$geoNear: {
        near: {
          type: 'Point',
          coordinates: [Number(location.lng), Number(location.lat)]//[lat, lng]
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: MAX_DISTANCE
      }},
      {'$sort': { 'distance': 1}},
      {'$limit': 30}
    ]
  );

db.addToFavorites = (data) =>
  models.Users.update(
    {_id: data.user_id},
    {$push: { likes: data}}
  );

db.deletePic = (imageURL) => {
  console.log(imageURL);
  return models.Pictures.remove({
    imageURL: imageURL
  }, function(err) {
    return err;
  });
}

db.deletePicFromUser = (username, imageURL) => {
  console.log(username);
  console.log(imageURL);
  return models.Users.update(
    {},
    {$pull: {photos: {imageURL: imageURL}}
  }, function(err) {
      if(err) {
        console.log('Got an error!!!');
      }
    });
}

db.modifyPic = (imageURL, location, description) => {
  return models.Pictures.update({imageURL: imageURL}, {
    location: location,
    description: description
  }, function(err) {
      if(err) {
        console.log('Got an error!');
      }
  });
}

db.modifyUserPic = (username, imageURL, location, description) => {
  return models.Users.update({username: username, "photos.imageURL": imageURL}, {$set:
    {
      "photos.$.location": location,
      "photos.$.description": description
   }}, function(err) {
    if(err) {
      console.log('Got an error!');
    }
  });
}

db.removeFromFavorites = (data) =>
  models.Users.update(
    {_id: data.user_id},
    {$pull: { likes: {'imageURL': data.imageURL}}}
  );

db.rateUnfavoritedPicture = (data) =>
  models.Users.update(
    {_id: data.user_id, 'photos.imageURL': data.imageURL},
    {'photos.$.rating': data.rating}
  ).exec();

db.rateFavoritedPicture = (data) => 
  models.Users.update(
    {_id: data.user_id, 'likes.imageURL': data.imageURL},
    {'likes.$.rating': data.rating}
  ).exec();

db.findTrending = (cb) =>
  models.Users.find({photos: {$elemMatch: {rating:{ $lte: 5}}}}, function(err, data){
    if(err){
      console.log(err)
    } else {
      cb(data) 
    }
  })

db.addComments = (data) => {
  return models.Pictures.update(
    {
      user_id: data.user_id,
      imageURL: data.imageURL,
    },
    {$set: {comments: data.comments}}
  );
}

db.commentUser = (data) => {
  models.Users.update({_id: data.user_id, 'likes.imageURL': data.imageURL}, {$set:
    {
      'likes.$.comments': data.comments
    }}, function(err) {
      if (err) {
        console.log('Got an error!');
      }
    }
  );
  return models.Users.update({_id: data.user_id, 'photos.imageURL': data.imageURL}, {$set: 
    {
      'photos.$.comments': data.comments
    }}, function(err) {
      if (err) {
        console.log('Got an error!');
      }
    });
}
  
module.exports = db;