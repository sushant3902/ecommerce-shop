const { check, validationResult } = require("express-validator")

exports.userSingupValidator = [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email must be between 2 and 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({min: 4, max: 32}),
    check("password", "password id required").notEmpty(),
    check("password").isLength({min: 6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must conatain a number")
];

exports.validateResult = (req,res,next)=>{
    const errors = validationResult(req);
    console.log(req.body);
 
    if(!errors.isEmpty()){
        let error = errors.array();  
        return res.status(400).json({error})
    }
    next();
}