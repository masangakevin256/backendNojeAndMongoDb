const bcrypt = require("bcrypt");
const {getDb} = require("../model/usersDb")
const jwt = require("jsonwebtoken");
const handleLogin = async (req,res) => {
    const {username, password}  = req.body;
    const db = getDb();

    if(!db) return res.status(400).json({"Message": "Database not initialized"});
    if(!username || !password) return res.status(400).json({"Message": "username and password required!!"});

    try {
        const user = await db.collection("users")
            .findOne({username: username})
        if(!user){
            return res.status(401).json({"Message": "Invalid username!!!"})
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match)  return res.status(401).json({"Message": "Password does'nt exist!!!"});

        const accessToken = jwt.sign(
            {
                username: user.username,
                roles: user.roles
            },
            process.env.ACCESS_SECRET_TOKEN,
            {expiresIn: "59s"}
        )
        const refreshToken = jwt.sign(
            {
                username: user.username,
                
            },
            
            process.env.REFRESH_SECRET_TOKEN,
            {expiresIn: "7d"}
        )
        await db.collection("users").updateOne(
            { username: user.username },
            { $set: { refreshToken } }
        );
        // Send refresh token in cookie, access token in response
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            accessToken: accessToken
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "Message": "Server error" });
    }
}
module.exports = handleLogin