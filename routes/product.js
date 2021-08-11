const express = require("express");
const router = express.Router();

const { create } = require("../controllers/product");
const {requireSignIn, isAuth } = require('../controllers/auth');

router.post("/product/create", requireSignIn, isAuth, create)

module.exports = router;