const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017/EmployeesDb";
let dbConnection;

module.exports ={
    connectToEmployeesDb: (cb) => {
        MongoClient.connect(uri)
            .then(client => {
                dbConnection = client.db()
                console.log("Mongodb for employees connected");
                return cb()
            })
            .catch(err => {
                console.log(err);
                return cb(err);
            })
    },
    getEmployeesDb: () => dbConnection
}