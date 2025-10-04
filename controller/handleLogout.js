const { getDb } = require("../model/usersDb"); // correct path to your db helper

const handleLogOut = async (req, res) => {
  const db = getDb();
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // nothing to do

  const refreshToken = cookies.jwt;

  try {
    // find user with that refresh token
    const user = await db.collection("users").findOne({ refreshToken });

    if (!user) {
      // clear cookie anyway (match options used when setting cookie)
      res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict", secure: false, path: "/" });
      return res.sendStatus(204);
    }

    // remove the refresh token from the user's document
    const result = await db.collection("users").updateOne(
      { _id: user._id },
      { $unset: { refreshToken: "" } }
    );

    // Clear cookie (ensure options match how it was set)
    res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict", secure: false, path: "/" });

    // return 204 No Content (no body)
    return res.sendStatus(204);

  } catch (err) {
    console.error("Logout error:", err);
    return res.sendStatus(500);
  }
};

module.exports = handleLogOut;