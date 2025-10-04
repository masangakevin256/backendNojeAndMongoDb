const express = require("express");
const router = express.Router();
const handleEmployees = require("../controller/handleEmployees");
const verifyRoles = require("../middleware/verifyRole");
const ROLES = require("../config/roles_list");


//get all users
router.get("/",verifyRoles(ROLES.Admin, ROLES.Editor, ROLES.user), handleEmployees.getAllEmployees);
//add a new user
router.post("/",verifyRoles(ROLES.Admin, ROLES.Editor), handleEmployees.addNewEmployee);
router.put("/:id",verifyRoles(ROLES.Admin, ROLES.Editor), handleEmployees.updateEmployee);
router.delete("/:id",verifyRoles(ROLES.Admin), handleEmployees.deleteEmployee);
router.get("/:id", handleEmployees.getEmployee);
module.exports = router;