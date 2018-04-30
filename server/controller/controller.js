const db = require ('../../database/dbFunctions.js');
const passport = require('../middleware/passport.js');

const post = {};
const get = {};
const del = {};
const patch = {};

post.signup = (req, res) => {
  db.saveUser(req.body)
    .then((result) => {
      result === false ? res.sendStatus(422) : res.sendStatus(200);
    })
};

post.login = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {

    if (err || !user) {
      res.status(422).send(info);

    } else {

      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          console.log('error logging in', err);
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

get.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
}

get.user = (req, res) => {

  if (req.user) {
    db.fetchUser(req.user.username).then(user => res.json(user));
  }
}

post.upload = (req, res) =>
  db.savePicture(req.body)
    .then((data) => db.savePictureToUser(req.body))
    .then(() => res.end())
    .catch((err) => {
      console.log('error uploading photo', err);
      res.status(500).send('error uploading photo')
    });

get.closestPics = function(req, res) {
  db.selectClosestPictures({lat: req.query.lat, lng: req.query.lng})
    .then((pictures) => {
      res.json(pictures);
    });
};

post.favorites = function(req, res) {
  db.addToFavorites(req.body)
    .then(() => {
      return db.fetchUser(req.body.username);
    })
    .then((data) => {
      res.json(data);
    })
}

del.deletePic = function(req, res) {
  db.deletePic(req.body.imageURL)
  .then(() => {
    db.deletePicFromUser(req.body.username, req.body.imageURL)
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    res.sendStatus(404).send('Error deleting pic');
  })
}

patch.modifyPicDetails = function(req, res) {
  db.modifyUserPic(req.body.username, req.body.imageURL, req.body.location, req.body.description)
  .then(() => {
    db.modifyPic(req.body.imageURL, req.body.location, req.body.description)
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    return 'Error!';
  })
}
post.unfavorite = function(req, res) {
  db.removeFromFavorites(req.body)
    .then(() => {
      return db.fetchUser(req.body.username);
    })
    .then((data) => {
      res.json(data);
    })
}

post.starred = function(req, res) {
  db.rateFavoritedPicture(req.body)
    .then(() => {
      db.rateUnfavoritedPicture(req.body);
    })
    .then(() => {
      return db.fetchUser(req.body.username);
    })
    .then((data) => {
      res.json(data);
    })
}

get.trending = function(req, res){
  db.findTrending(function(data){
    res.json(data);
  })
}
  

get.friend = (req, res) => {
  if(req.query.username) {
    db.fetchUser(req.query.username).then(friend => res.json(friend));
  }
}

patch.comments = function(req, res) {
  db.addComments(req.body)
    .then(() => {
      db.commentUser(req.body);
    })
    .catch(error => {
      console.log('error in server\'s patch comment!');
    })
}


module.exports.patch = patch;
module.exports.del = del;
module.exports.get = get;
module.exports.post = post;