import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { db } from "../config/database.js";

export async function signUp(req, res) {
    const user = req.body;

    try {
        const userExisting = await db.collection("users").findOne({
            email: user.email
        });
        if (userExisting) {
            return res.status(409).send("Email ja cadastrado!");
        }
        const passwordHash = bcrypt.hashSync(user.password, 10);
        await db.collection("users").insertOne({
            ...user,
            password: passwordHash
        });
    } catch (error) {
        console.log("Erro no cadastro: ", error);
        return res.status(500).send({ erro: "Erro interno no servidor" });
    };

    
};

export async function signIn(req, res) {
    const user = req.boby;

    try {
        const userRegistered = await db.collection("users").findOne({ email: user.email });
        if (!userRegistered) {
            return res.status(401).send("Email ou senha incorretos");
        }

        const passwordCorrect = bcrypt.compareSync(usuario.senha, userRegistered.senha);
        if (!passwordCorrect) {
            return res.status(401).send("Email ou senha incorretos");
        }

        const token = jwt.sign({ userId: userRegistered._id }, process.env.JWT_SECRET, { expiresIn: 86400 });
          

        return res.status(200).send({ token });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).send({ erro: "Erro interno no servidor" });
    }
    
}