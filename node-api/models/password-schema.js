const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8, 'password must have min 8 chars')
    .is().max(100, 'password must have max 100 chars')
    .has().uppercase(1, 'password must have one uppercase')
    .has().lowercase(1, 'password must have one lowercase')
    .has().digits(3, 'password must have min 3 digits')
    .has().symbols(1, 'password must have one symbols')
    .has().not().spaces(0, 'password must not have spaces')
    .is().not().oneOf(['Passw0rd', 'Password123']); 


module.exports = passwordSchema;