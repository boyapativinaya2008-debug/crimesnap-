const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  // 🔴 No token check
  if (!header) {
    return res.status(401).json({
      msg: "No token provided"
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 🔥 IMPORTANT FIX
    // normalize user object
    req.user = {
      id: decoded.id || decoded._id
    };

    next();

  } catch (err) {
    console.log("AUTH ERROR:", err);

    return res.status(401).json({
      msg: "Invalid token"
    });
  }
};

module.exports = auth;