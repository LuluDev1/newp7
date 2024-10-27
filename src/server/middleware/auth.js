import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Invalid access");
    const decodedToken = jwt.verify(token, "Random");
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send("Authentication failed");
  }
};
