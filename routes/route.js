const express = require("express");
const router = express.Router();
const handleUsers = require("../controller/handleUsers");
const ROLES = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRole");

//get all users
router.get("/", verifyRoles(ROLES.Admin,ROLES.Editor,ROLES.user), handleUsers.getAllUsers);
//add a new user
router.post("/",verifyRoles(ROLES.Admin, ROLES.Editor),handleUsers.addNewUser);
router.put("/:id",verifyRoles(ROLES.Admin, ROLES.Editor),handleUsers.updateUser);
router.delete("/:id", verifyRoles(ROLES.Admin), handleUsers.deleteUser);
router.get("/:id", handleUsers.getUser);
module.exports = router;
