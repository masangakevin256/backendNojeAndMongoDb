const handleLogin = require("../controller/handleLogin");
const express = require("express");
const router = express.Router();

router.get("/", handleLogin);

module.exports = router;