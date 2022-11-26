const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject._userId
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: [],
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => {
            console.log('/api/sauces :  ', error);
            res.status(400).json({ error })
        })
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };

    //  delete sauceObject._userId

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                .catch(error => res.status(401).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                    .catch(error => res.status(401).json({ error }));
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
}


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.updateLikeDislike = (req, res, next) => {
    let likeValue = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;

    if (likeValue === 1) {
        // if like => push userid and update counter
        //https://docs.mongodb.com/drivers/node/current/fundamentals/crud/write-operations/embedded-arrays/
        Sauce.updateOne(
            { _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
            .then(() => res.status(200).json({ message: "like added !" }))
            .catch((error) => res.status(400).json({ error }));
    }
    if (likeValue === -1) {
        // if dislike => push userid and update counter
        Sauce.updateOne(
            { _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
            .then(() => res.status(200).json({ message: "Dislike added !" }))
            .catch((error) => res.status(400).json({ error }));
    }
    if (likeValue === 0) {
        // if to cancel like or dislike
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // cancel a like
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: "Like removed !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
                // cancel a dislike
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: "Dislike removed !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(404).json({ error }));
    }
};
