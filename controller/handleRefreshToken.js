const handleRefreshToken = async (req, res) => {
    const db = getDb();
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const user = await db.collection("users").findOne({ refreshToken });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err || user.username !== decoded.username) return res.sendStatus(403);

        const accessToken = jwt.sign(
            { username: decoded.username, roles: user.roles },
            process.env.ACCESS_SECRET_TOKEN,
            { expiresIn: "30S" }
        );

        res.json({ accessToken });
    });
};
module.exports = handleRefreshToken