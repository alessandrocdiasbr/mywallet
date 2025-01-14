import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

export async function signUp(req, res) {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = await db.collection('users').insertOne({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).send('Usuário criado com sucesso');
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(500).send('Erro ao criar usuário');
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await db.collection('users').findOne({ email });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).send('Credenciais inválidas');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({ token });
    } catch (err) {
        console.error('Erro ao autenticar usuário:', err);
        res.status(500).send('Erro ao autenticar usuário');
    }
}
