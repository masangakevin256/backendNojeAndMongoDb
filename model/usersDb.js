const {MongoClient} = require("mongodb");

const uri = "mongodb://localhost:27017/UsersDb";
let dbConnection;
module.exports ={
    connectToDb: (cb)=> {
        MongoClient.connect(uri)
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