import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import authRouter
// import gastos

dotenv.config();

const app = express

app.use(cors())
app.use(express.json());

// roteadores


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

