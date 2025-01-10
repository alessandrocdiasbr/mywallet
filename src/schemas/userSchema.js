import Joi from 'joi';


export const userLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'O email deve ter um formato válido',
        'any.required': 'O email é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'A senha deve ter no mínimo 6 caracteres',
        'any.required': 'A senha é obrigatória'
    })
});


export const userSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        'string.min': 'O nome deve ter no mínimo 3 caracteres',
        'any.required': 'O nome é obrigatório'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'O email deve ter um formato válido',
        'any.required': 'O email é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'A senha deve ter no mínimo 6 caracteres',
        'any.required': 'A senha é obrigatória'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'As senhas devem coincidir',
        'any.required': 'A confirmação de senha é obrigatória'
    })
});