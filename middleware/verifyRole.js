// verifyRoles.js
const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.user?.roles) return res.sendStatus(403);

        // Normalize: convert string → array
        const userRoles = Array.isArray(req.user.roles) 
            ? req.user.roles 
            : [req.user.roles];

        const hasRole = userRoles.some(role => allowedRoles.includes(role));

        if (!hasRole) return res.sendStatus(403);

        next();
    };
};


module.exports = verifyRoles;
