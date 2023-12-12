const { check } = require('express-validator');

exports.loginValidation = [
    // check('first_name', 'Name is requied').not().isEmpty(),
    check('mobile_number', 'Mobile number is requied').not().isEmpty(),
]

exports.registrationValidation = [
    check('first_name', 'Frist name is requied').not().isEmpty(),
    check('last_name', 'Last name is requied').not().isEmpty(),
    check('mobile_number', 'Mobile number is requied').not().isEmpty(),
    check('age', 'Age is requied').not().isEmpty()
]
