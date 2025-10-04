const whiteLit = require("../config/whiteList");

const corsOption = {
    origin: (origin, callback) => {
        if(whiteLit.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error("Not allowed by Cors"));
        }
    },
    optionsSuccessCode: 200
}
module.exports = corsOption;