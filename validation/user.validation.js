const Joi = require('joi');
const {validateRequest} = require('../middleware/validate.request')

const RegisterValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
})

const loginValidation = Joi.object({
    password: Joi.string()
        .min(8)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
})

const purchaseProductValidation = Joi.object({
    name: Joi.string()
        .min(2)
        .required(),

    quantity: Joi.number()
        .min(1)
        .required()
})

const topUpValidation = Joi.object({
    user_id: Joi.number()
        .min(1)
        .required(),

    amount: Joi.number()
        .min(1)
        .required()
})

const inputProductValidation = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    category: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

    price: Joi.number()
    .min(1)
    .required(),

    quantity: Joi.number()
    .min(1)
    .required(),
})

function validateRegister(req,res,next){
    validateRequest(req,res,next,RegisterValidation)
}

function validateLogin(req,res,next){
    validateRequest(req,res,next,loginValidation)
}

function validateInputProduct(req,res,next){
    validateRequest(req,res,next,inputProductValidation)
}

function validatePurchaseProduct(req,res,next){
    validateRequest(req,res,next,purchaseProductValidation)
}

function validateTopUp(req,res,next){
    validateRequest(req,res,next,topUpValidation)
}

module.exports = {
    validateRegister,
    validateLogin,
    validateInputProduct,
    validatePurchaseProduct,
    validateTopUp
}
    