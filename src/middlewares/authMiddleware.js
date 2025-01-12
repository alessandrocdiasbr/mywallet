import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';
import { ObjectId } from 'mongodb';

export async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) return res.status(401).send('Token não informado');

    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        
      
        if (!ObjectId.isValid(userId)) return res.status(401).send('Token inválido');
        
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) return res.status(401).send('Usuário não encontrado');

        delete user.password; 
        res.locals.user = user;
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError") return res.status(401).send('Token inválido');
        res.status(500).send('Erro interno do servidor');
    }
}