const express = require("express");
const {connectToDb, getDb} = require("./model/usersDb");
const {connectToEmployeesDb, getEmployeesDb} = require("./model/employeesDb");
const {logger} = require("./middleware/eventLogger");
const logError = require("./middleware/handleErrorLog");
require("dotenv").config();
const cors = require("cors");
const corsOption = require("./middleware/corsOption");
const verifyJwt = require("./middleware/verifyJwt")

const app = express();
const PORT = process.env.PORT || 3500;
let db;
let dbEmployees
//custom middleware
app.use(logger)
// built in middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(cors(corsOption))
//routes

app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJwt);
app.use("/users", require("./routes/route"));
app.use("/employees", require("./routes/employees"));
app.use(logError);
connectToEmployeesDb(err => {
    if(!err) dbEmployees = getEmployeesDb();
})
connectToDb(err => {
    if(!err){
        app.listen(PORT, () => console.log(`Server listening on Port ${PORT}....`));
    }
    db = getDb();
})

