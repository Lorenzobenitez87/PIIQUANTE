const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const isOwner = require('../middleware/isOwner');

const saucesCtrl = require('../controllers/sauces');


router.post('/', auth, multer, saucesCtrl.createSauce);
router.put('/:id', auth,isOwner, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth,isOwner, saucesCtrl.deleteSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.post('/:id/like', auth, saucesCtrl.updateLikeDislike);


module.exports = router;
