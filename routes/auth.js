const express = require('express');
const router = express.Router();

const { signUp, signIn, signOut, requireSignIn } = require('../controllers/auth');
const { userSingupValidator, validateResult } = require("../validator/index");

router.post("/signup", userSingupValidator, validateResult, signUp);

router.post("/signin", signIn);
router.get("/signout", signOut);
router.get("/hello", requireSignIn, (req, res) => {
    res.send("hello from node");
});

module.exports = router;
