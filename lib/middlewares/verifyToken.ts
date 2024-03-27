import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

module.exports = verifyToken;

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded: any = jwt.verify(token, process.env.ENCRYPTION_KEY!);

    req.body.email = decoded.email;
    console.log("🚀 ~ Verified token - ", req.body.email);

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyToken;
