
const Sauce = require('../models/sauces');

module.exports = (req, res, next) => {
    try {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.userId != req.auth.userId) {
                    res.status(401).json({ message: 'Not authorized' });
                } else {
                    next();
                }
            })
    } catch (error) {
        res.status(401).json({ error });
    }
};

