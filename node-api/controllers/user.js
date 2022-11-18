const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const User = require('../models/user');

//mask email content
const MaskData = require("maskdata");//https://www.npmjs.com/package/maskdata
const emailMask2Options = {
    maskWith: "*", 
    unmaskedStartCharactersBeforeAt: 5,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false
};

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User ({
            email: MaskData.maskEmail2(req.body.email,emailMask2Options),
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({ message: 'User created !'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error}))
}

exports.login = (req, res, next) => {
    User.findOne({ email:  MaskData.maskEmail2(req.body.email,emailMask2Options) })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'User not found !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Incorrect password !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.APP_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };

