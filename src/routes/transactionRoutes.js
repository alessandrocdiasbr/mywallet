import { Router } from "express";

import { authValidation } from "../middlewares/authMiddleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateIdParam } from "../middlewares/validateIdParam.js";

import { transactionSchema } from "../schemas/transactionsSchema.js";

import { 
    createTransaction, 
    getTransactions, 
    updateTransaction, 
    deleteTransaction,
    getTransactionById
} from "../controllers/transactionController.js";

const transactionRouter = Router();

transactionRouter.use(authValidation);

transactionRouter.post("/transactions", validateSchema(transactionSchema), createTransaction);
transactionRouter.get("/transactions", getTransactions);
transactionRouter.get("/transactions/:id", validateIdParam, getTransactionById);
transactionRouter.put("/transactions/:id", validateIdParam, validateSchema(transactionSchema), updateTransaction);
transactionRouter.delete("/transactions/:id", validateIdParam, deleteTransaction);

export default transactionRouter; 