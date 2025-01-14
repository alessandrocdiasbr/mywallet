import { db } from '../config/database.js';
import { ObjectId } from 'mongodb';



export async function createTransaction(req, res) {
    try {
        const { value, description, type } = req.body;
        const userId = new ObjectId(req.user.id);

        if (!value || !description || !type) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!['deposit', 'withdraw'].includes(type)) {
            return res.status(400).json({ message: 'Tipo de transação inválido' });
        }

        const newTransaction = {
            value: Number(value),
            description: description.trim(),
            type,
            userId,
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await db.collection('transactions').insertOne(newTransaction);
        res.sendStatus(201);
    } catch (err) {
        console.error('Erro ao criar transação:', err);
        res.status(500).json({ message: 'Erro ao criar transação' });
    }
}

export async function getTransactions(req, res) {
    try {
        const userId = new ObjectId(req.user.id);
        const { page = 1, limit = 10, sort = 'date' } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);


        const transactions = await db.collection('transactions')
            .find({ userId })
            .sort({ [sort]: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();


        const total = await db.collection('transactions').countDocuments({ userId });

        res.status(200).json({
            transactions,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Erro ao listar transações:', error);
        res.status(500).json({ message: "Erro ao listar transações" });
    }
}

export async function updateTransaction(req, res) {
    try {
        const { id } = req.params;
        const userId = new ObjectId(req.user.id); 
        const { value, description, type } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        if (!value || !description || !type) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (!['deposit', 'withdraw'].includes(type)) {
            return res.status(400).json({ message: 'Tipo de transação inválido' });
        }

        const transaction = await db.collection('transactions').findOne({ 
            _id: new ObjectId(id) 
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        
        const transactionUserId = new ObjectId(transaction.userId);

        if (!transactionUserId.equals(userId)) {
            return res.status(403).json({ message: 'Não autorizado' });
        }

        await db.collection('transactions').updateOne(
            { _id: new ObjectId(id) },
            { 
                $set: { 
                    value: Number(value),
                    description: description.trim(),
                    type,
                    updatedAt: new Date()
                } 
            }
        );

        res.status(204).send('Transação atualizada com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar transação:', err);
        res.status(500).json({ message: 'Erro ao atualizar transação' });
    }
}


export async function deleteTransaction(req, res) {
    try {
        const { id } = req.params;
        const userId = new ObjectId(req.user.id); 

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const transaction = await db.collection('transactions').findOne({ 
            _id: new ObjectId(id) 
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        
        const transactionUserId = new ObjectId(transaction.userId);

        if (!transactionUserId.equals(userId)) {
            return res.status(403).json({ message: 'Não autorizado' });
        }

        await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
        res.status(204).send('Transação deletada com sucesso!');
    } catch (err) {
        console.error('Erro ao deletar transação:', err);
        res.status(500).json({ message: 'Erro ao deletar transação' });
    }
}

export async function getTransactionById(req, res) {
    try {
        const { id } = req.params;
        const userId = new ObjectId(req.user.id);

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const transaction = await db.collection('transactions').findOne({ 
            _id: new ObjectId(id),
            userId
        });
        

        if (!transaction) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        res.status(200).json(transaction);
    } catch (err) {
        console.error('Erro ao obter transação:', err);
        res.status(500).json({ message: 'Erro ao obter transação' });
    }
}