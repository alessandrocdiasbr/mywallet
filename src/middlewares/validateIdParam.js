export function validateIdParam(req, res, next) {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
    }
    
    next();
} 