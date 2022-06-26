const express = require('express')
const router = express.Router()
const {verify} = require('../middleware/authentication')
const {
    validateRegister,
    validateLogin,
    validateInputProduct,
    validatePurchaseProduct,
    validateTopUp
} = require('../validation/user.validation')
const {
    signUp,
    login,
    inputProduct,
    getAllProduct,
    topUp,
    purchaseProduct,
    getHistory,
    getProductByName,
    getBalance
} = require('../controllers/user.controller')

router.post('/Register', validateRegister ,signUp);
router.post('/login', validateLogin ,login);
router.post('/purchase', verify,validatePurchaseProduct,purchaseProduct);
router.post('/inputProduct',verify,validateInputProduct,inputProduct);
router.post('/topUp',verify,validateTopUp,topUp);
router.get('/allProduct',getAllProduct)
router.get('/product',getProductByName)
router.get('/getHistory',verify,getHistory)
router.get('/getBalance',verify,getBalance)

module.exports = router ;