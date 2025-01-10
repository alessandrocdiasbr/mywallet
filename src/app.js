import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Roteadores
app.use(authRouter); 

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
