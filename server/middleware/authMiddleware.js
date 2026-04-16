const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Authentication invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 THIS IS THE FIX
    req.user = { userId: payload.id };

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Authentication invalid" });
  }
};

module.exports = authMiddleware;