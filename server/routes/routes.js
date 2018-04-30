const router = require('express').Router();
const controller = require('../controller/controller.js');

router.post('/api/signup', controller.post.signup);

router.post('/api/login', controller.post.login);

router.get('/api/logout', controller.get.logout);

router.get('/api/user', controller.get.user);

router.post('/api/upload', controller.post.upload);

router.get('/api/closestPics', controller.get.closestPics);

router.post('/api/favorites', controller.post.favorites);

router.delete('/api/deletePic', controller.del.deletePic);

router.patch('/api/modifyPicDetails', controller.patch.modifyPicDetails);

router.post('/api/unfavorite', controller.post.unfavorite);

router.post('/api/starred', controller.post.starred);

router.get('/api/trending', controller.get.trending);


router.get('/api/friend', controller.get.friend);

module.exports = router;