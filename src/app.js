import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import transactionRouter from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(transactionRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
