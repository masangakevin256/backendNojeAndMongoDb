const handleLogOut = require("../controller/handleLogout");
const express = require("express");
const router = express.Router();

router.get("/", handleLogOut);

module.exports = router;