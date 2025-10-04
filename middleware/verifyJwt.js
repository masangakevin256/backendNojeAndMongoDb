const jwt = require("jsonwebtoken");

const verifyJwt =  async (req,res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if(!authHeader) return res.status(401).json({"Message": "No token to verify"});

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, decoded)=> {
        if(err) return res.status(403).json({"Message": "Failed to verify Token"});
        req.user = decoded;
        next()
    }) 
}
module.exports = verifyJwt;