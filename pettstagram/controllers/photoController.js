const router = require('express').Router();
const { isAuthorized } = require('../middlewares/authMiddleware');
const photoService = require('../services/photoService');
const authService = require('../services/authService');
const { getErrorMessage } = require('../utils/errorUtils');

router.get('/catalog', async (req, res) => {
    const photos = await photoService.getAll().populate('owner');


    res.render('photo/catalog', { photos });
});

router.get('/profile', isAuthorized, async (req, res) => {
    const allPhotos = await photoService.getAll().populate('owner');
    // let photos = [];
    let photos = [];

    for (photo in allPhotos){
        if (allPhotos[photo].owner._id.toString() == req.user._id){
            photos.push(allPhotos[photo]);
        }
    }

    const imagesCount = photos?.length;
    
    const user = await authService.getUserData(req.user?._id);
    res.render('photo/profile', { photos, user, imagesCount });
});

router.get('/catalog/:photoId/details', async (req, res) => {
    const photo = await photoService.getOne(req.params.photoId).populate('owner').populate('commentsList');

    const isOwner = photo.owner._id == req.user?._id;
    const canComment = req.user?._id != photo.owner._id
    const comments = photo.commentsList;

    for (comment in comments){
        let user = await authService.getUserData(comments[comment].userId);
        comments[comment].userId = user.username;
    }

    res.render('photo/details', { photo, isOwner, canComment, comments });
});

router.post('/catalog/:photoId/details', isAuthorized, async (req, res) => {

    try {
        const comment = req.body.comment;
        await photoService.comment(req.user?._id, comment, req.params.photoId);
    } catch (error) {
        return res.status(404).render('/home/404', { error: getErrorMessage(error) });
    }

    res.redirect(`/catalog/${req.params.photoId}/details`);
});

router.get('/catalog/:photoId/edit', isAuthorized, async (req, res) => {


    const photo = await photoService.getOne(req.params.photoId).populate('owner');
    if (req.user?._id == photo.owner._id.toString()) {
        res.render('photo/edit', { photo });
    } else {
        res.redirect('/');
    }
});

router.post('/catalog/:photoId/edit', isAuthorized, async (req, res) => {
    const photoData = req.body;

    await photoService.edit(req.params.photoId, photoData);

    res.redirect(`/catalog/${req.params.photoId}/details`);
});

router.get('/catalog/:photoId/delete', isAuthorized, async (req, res) => {
    const photo = await photoService.getOne(req.params.photoId).populate('owner');
    if (req.user?._id == photo.owner._id.toString()){
        await photoService.delete(req.params.photoId);
        res.redirect('/catalog');
    } else {
        res.redirect('/');
    }
});

router.get('/create', isAuthorized, (req, res) => {
    res.render('photo/create');
});

router.get('/create', isAuthorized, (req, res) => {
    res.render('photo/create');
});

router.post('/create', isAuthorized, async (req, res) => {
    const photoData = req.body;

    try {
        await photoService.create(req.user._id, photoData);
    } catch (error) {
        return res.status(400).render('photo/create', { error: getErrorMessage(error) });
    }

    res.redirect('/catalog');
});

module.exports = router;