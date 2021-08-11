const express = require("express");
const router = express.Router();

const { create } = require("../controllers/category");
const {requireSignIn, isAuth } = require('../controllers/auth');

router.post("/category/create", isAuth, create);

module.exports = router;