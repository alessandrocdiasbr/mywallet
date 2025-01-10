import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();

import { db } from "../config/database.js";

export async function signUp(req, res) {
    const user = req.body;

    try {
        const userExisting = await db.collection("users").findOne({ email: user.email });
        if (userExisting) {
            return res.status(409).send({ error: "Email já cadastrado" });
        }

        if (user.password !== user.confirmPassword) {
            return res.status(400).send({ error: "As senhas não coincidem" });
        }

        const passwordHash = bcrypt.hashSync(user.password, 10);
        await db.collection("users").insertOne({
            name: user.name, 
            email: user.email,
            password: passwordHash
        });

        return res.status(201).send({ message: "Usuário cadastrado com sucesso" });
    } catch (error) {
        console.error("Erro no cadastro:", error);
        return res.status(500).send({ error: "Erro interno no servidor" });
    }
}

export async function signIn(req, res) {
    const user = req.body;

    try {
        const userRegistered = await db.collection("users").findOne({ email: user.email });
        if (!userRegistered) {
            return res.status(401).send({ error: "Credenciais inválidas" });
        }

        const passwordCorrect = bcrypt.compareSync(user.password, userRegistered.password);
        if (!passwordCorrect) {
            return res.status(401).send({ error: "Credenciais inválidas" });
        }

        const token = jwt.sign({ userId: userRegistered._id }, process.env.JWT_SECRET, { expiresIn: 86400 });

        return res.status(200).send({ token });
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).send({ error: "Erro interno no servidor" });
    }
}
