const {logEvents} = require("./eventLogger");

const logError = (error,req,res,next) => {
    logEvents(`${error.message}: ${error.name}`, "errorLog.txt");
    console.log(error.stack)
    res.sendStatus(500);
}

module.exports = logError;