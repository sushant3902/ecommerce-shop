const User = require('../models/user');
const { errorHandler } = require("../utils/dbErrorHandler");
const jwt  = require("jsonwebtoken");
const expressJwt  = require("express-jwt");

exports.signUp = (req, res, next) => {
    console.log("req body", req.body);
    const userModel = new User(req.body);
    userModel.save((err, user) => {
        if(err){
            return res.status(500).json({
                err: errorHandler(err)
            });
        }

        res.status(201).json({
            message: "User created successfullly",
            name: user.name,
            email: user.email
        });
    })
}

exports.signIn = (req, res, next) => {
    //find the user based on email
    const { email, password } = req.body;
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User with theat email does not exist. Please signUp"
            })
        }

        //if user found, match the email and password
        if(!user.authenticate){
            return res.status(403).json({
                error: 'Email and password dont match'
            });
        }

        //generate the signed token with userid and secretkey
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET);

        //persist the token as t in cookie with expiry date
        res.cookie("t", token, {expire: new Date() + 9999});

        //respond with user and token to frontend client
        const {_id, name, email, role} = user;
        return res.json({ token, user: {_id, name, email, role}});
    });

}

exports.signOut = (req, res, next) => {
    res.clearCookie('t');
    res.json({
        message: "Signout success"
    });
}

exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"

});

exports.isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        return res.status(403).json({error: "Authorization failed"});

    }

    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.log("errrrrrrrr")
        return res.status(403).json({error});
    }

    if(!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw err;
    }
    req.userId = decodedToken.userId;
    console.log("req", req.auth, req.userId);
    next();
}