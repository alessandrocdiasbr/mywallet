import { db } from '../config/database.js';
import { ObjectId } from 'mongodb';

export async function createTransaction(req, res) {
    const { value, description, type } = req.body;
    const user = res.locals.user;

    try {
        await db.collection('transactions').insertOne({
            value,
            description,
            type,
            userId: user._id,
            date: new Date()
        });
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getTransactions(req, res) {
    const user = res.locals.user;
    const page = parseInt(req.query.page) || 1;

    if (page < 1) return res.status(400).send('Página inválida');

    try {
        const transactions = await db.collection('transactions')
            .find({ userId: user._id })
            .sort({ date: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .toArray();

        res.send(transactions);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateTransaction(req, res) {
    const { id } = req.params;
    const user = res.locals.user;
    const { value, description, type } = req.body;

    try {
        const transaction = await db.collection('transactions').findOne({ 
            _id: new ObjectId(id) 
        });

        if (!transaction) return res.status(404).send('Transação não encontrada');
        if (!transaction.userId.equals(user._id)) {
            return res.status(401).send('Não autorizado');
        }

        await db.collection('transactions').updateOne(
            { _id: new ObjectId(id) },
            { $set: { value, description, type } }
        );

        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteTransaction(req, res) {
    const { id } = req.params;
    const user = res.locals.user;

    try {
        const transaction = await db.collection('transactions').findOne({ 
            _id: new ObjectId(id) 
        });

        if (!transaction) return res.status(404).send('Transação não encontrada');
        if (!transaction.userId.equals(user._id)) {
            return res.status(401).send('Não autorizado');
        }

        await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err.message);
    }
} 