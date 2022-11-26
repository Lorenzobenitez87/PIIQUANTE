const passwordSchema = require('../models/password-schema');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({error : 'Password must have : '
            + passwordSchema.validate(req.body.password, {list : true})
        })
    } else {
        next();
    }
};
