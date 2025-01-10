import { Router } from "express";
import { signIn, signUp } from "../controllers/userController.js";
import { userLoginSchema, userSchema } from "../schemas/userSchema.js";
import { validateSchema } from "../schemas/validateSchema.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSchema(userSchema), signUp);
authRouter.post("/sign-in", validateSchema(userLoginSchema), signIn);

export default authRouter;