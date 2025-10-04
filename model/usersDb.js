const {MongoClient} = require("mongodb");


let dbConnection;
module.exports ={
    connectToDb: (cb)=> {
        MongoClient.connect(process.env.USERS_URI)
        .then((client) => {
            dbConnection = client.db();
            console.log("Mongodb for users connected")
            return cb()
        })
        .catch((error) => {
            console.log(error)
            return cb(error)
        })

    },
    getDb: () => dbConnection
}