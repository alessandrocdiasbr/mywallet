import { ObjectId } from 'mongodb';

export function validateIdParam(req, res, next) {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }
    
    next();
}