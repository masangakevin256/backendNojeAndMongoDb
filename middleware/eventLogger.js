const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const {format}= require("date-fns");
const{v4: uuid} = require("uuid");

const logEvents = async (message, logName) => {
    //check if log file exists
    if(!fs.existsSync(path.join(__dirname, "..", "log"))){
        await fsPromises.mkdir(path.join(__dirname, "..", "log"));
    }
    const dateFormat = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
    const logItem = `${dateFormat}\t${uuid()} ${message}\n`;

    await fsPromises.appendFile(path.join(__dirname, "..", "log", logName), logItem);
}

const logger = (req,res,next) => {
    logEvents(`${req.method}: ${req.headers.origin || "no origin"}: ${req.url}`, "eventLog.txt");
    console.log(req.method, req.url);
    next()
}
module.exports ={
    logEvents,
    logger
}