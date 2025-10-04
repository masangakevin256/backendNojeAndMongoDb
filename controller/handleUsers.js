const { ObjectId } = require("mongodb");
const { getDb } = require("../model/usersDb");
const bcrypt = require("bcrypt");

const getAllUsers = async (req,res)=>{
    const db =  getDb();
    //check if db exists
    if(!db) return res.status(400).json({"Error": "Database not initialized"});

   
   try {
     const users = await db.collection("users")
            .find()
            .sort({"username": 1})
            .toArray();
         res.status(200).json(users);
   } catch (error) {
    console.log(error)
        res.status(500).json({"Message": "Could not fetch users"});
   }
}
const addNewUser = async (req,res) => {
    const validRoles = ["Admin", "Editor", "user"];
    const db = getDb();
    const user = req.body;

    if(!db){
        return res.status(400).json({"Message": "Database is not initialized!!"});
    }
   
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const userFormat = {
            "username": user.username,
            "roles": user.roles || "user",
            "password": hashedPassword
        }
        if(!user.username || !user.password){
            return res.status(400).json({"Message": "Username and password required"})
        }
        if(user.roles){
             const rolesArray = Array.isArray(user.roles) ? user.roles : [user.roles];

            // check if every role is valid
             const invalidRoles = rolesArray.filter(role => !validRoles.includes(role));

            if (invalidRoles.length > 0) {
                return res.status(400).json({ 
                    "Error": `Invalid roles: ${invalidRoles.join(", ")}` 
             });
        }
        }
        const duplicate = await db.collection("users").findOne({username: user.username})
        if(duplicate){
            return res.status(409).json({"Message": `User with ${user.username} already exists`});
        }
        await db.collection("users")
            .insertOne(userFormat)

        res.status(201).json({"Success": `User ${user.username} created successfully`}, userFormat);

    } catch (error) {
        res.status(500).json({"Message": "Failed to create a new user!!"})
    }
    

}
const updateUser = async (req,res) =>{
    const db = getDb();
    const {id} = req.params;
    const updates = req.body;

    if(!db) return res.status(400).json({"Error": "Database not initialized"});
    if(!id) return res.status(400).json({"Error": "Id not Found"});    
    if(!updates) return res.status(400).json({"Error": "No  updates Found"});  

   try {
        await db.collection("users")
            .updateOne({_id: new ObjectId(id)}, {$set: updates});

        res.status(200).json({"Message": "Updated successfully"}, updates)
   }catch (error) {
    res.status(500).json({"Error": "Could not update user"});
   }


}
const deleteUser = async (req,res) => {
    const db = getDb();
    const {id} = req.params;
    if(!db) return res.status(400).json({"Error": "Database not initialized"});
    if(!id) return res.status(400).json({"Error": "Id not Found"});  

    try {
        const results =  await db.collection("users")
            .deleteOne({_id: new ObjectId(id)});

        if (!results || results.deletedCount === 0) {
            return res.status(404).json({"Message": "User with that id not found or already deleted."});
        }
    res.status(200).json({"Message": `User with id ${id} deleted`});
    } catch (error) {
        return res.status(500).json({"Message": "Failed to delete user!!"})
    }

}
const getUser = async (req, res) => {
    const db = getDb();
    const {id} = req.params;

    if(!db) return res.status(400).json({"Error": "Database not initialized"});
    if(!id) return res.status(400).json({"Error": "Id not Found"}); 

    try {
        const results = await db.collection("users")
            .findOne({_id: new ObjectId(id) })

        res.status(200).json(results)
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = {
    getAllUsers,
    addNewUser,
    updateUser,
    deleteUser,
    getUser
}