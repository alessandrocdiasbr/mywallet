import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "").trim();
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.collection("users").findOne({
            _id: new ObjectId(decoded.userId)
        });
        if (!user) return res.sendStatus(401);

        res.locals.user = user;
        next();
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}
