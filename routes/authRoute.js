const express = require('express')
const { registerController, loginController, testController, userAuth, forgotPassword, adminAuth, updateProfile, getOrderControllers, getOrderAllControllers, orderStatusControllers } = require('../controllers/authController')
const { authMiddleware,  isAdmin } = require('../middlewares/authMiddleware')

const router = express.Router()

//routing

router.post('/register',registerController)
router.post('/login',loginController)
//user Auth for Dashboard
router.get('/user-Auth',authMiddleware,userAuth)
router.get('/admin-Auth',authMiddleware,isAdmin,adminAuth)
router.post('/forgot-password',forgotPassword)

//update profile
router.put('/profile',authMiddleware,updateProfile)

//order
router.get('/orders',authMiddleware,getOrderControllers)

//get All orders
router.get('/all-orders',authMiddleware,getOrderAllControllers)

//status update
router.put('/order-status/:orderId',authMiddleware,isAdmin,orderStatusControllers)

router.get('/test',authMiddleware,isAdmin,testController)


module.exports = router