import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

export async function signUp(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(422).send("As senhas não coincidem");
    }

    try {
        const userExists = await db.collection("users").findOne({ email });
        if (userExists) return res.status(409).send("E-mail já cadastrado");

        const hash = bcrypt.hashSync(password, 10);
        
        await db.collection("users").insertOne({ 
            name, 
            email, 
            password: hash 
        });
        
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await db.collection("users").findOne({ email });
        if (!user) return res.status(404).send("E-mail não cadastrado");

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(401).send("Senha incorreta");

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        
        res.status(200).send({ token });
    } catch (err) {
        res.status(500).send(err.message);
    }
} 