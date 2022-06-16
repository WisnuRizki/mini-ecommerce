const express = require('express')
const router = express.Router()
const {verify} = require('../middleware/authentication')
const {
    signUp,
    login,
    inputProduct,
    getAllProduct,
    topUp,
    purchaseProduct,
    getHistory
} = require('../controllers/user.controller')

router.post('/Register', signUp);
router.post('/login', login);
router.post('/purchase', verify,purchaseProduct);
router.post('/inputProduct',verify,inputProduct);
router.post('/topUp',verify,topUp);
router.get('/allProduct',getAllProduct)
router.get('/getHistory',verify,getHistory)

module.exports = router ;