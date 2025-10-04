const {MongoClient} = require("mongodb");

let dbConnection;

module.exports ={
    connectToEmployeesDb: (cb) => {
        MongoClient.connect(process.env.EMPLOYEES_URI)
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