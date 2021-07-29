const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if(result.error) return res.status(400).json(result.error);

            if(!req.value) req.value = {};
            req.value['body'] = result.value;
            next();
        }
    },
    schemas: {
        signinSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
        signupSchema: Joi.object().keys({
            name: Joi.string().min(1).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
        }),
        forgetPasswordSchema: Joi.object().keys({
            email: Joi.string().email().required(),
        }),
        resetPasswordSchema: Joi.object().keys({
            token: Joi.string().required(),
            password: Joi.string().min(3).required()
        })
    }
}