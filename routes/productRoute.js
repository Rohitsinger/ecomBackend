const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createProductController, getProductController, getSingleProductController,
    //  productphotoController, 
     deleteProductController, updateProductController, filterProductControllers, productCountControllers, productListControllers, productSearchControllers, braintreetokenController, braintreePaymentController, braintreeTokenController, getSearch } = require('../controllers/productController');


const router = express.Router();

//post routes
router.post('/create-product',authMiddleware,isAdmin,createProductController)

// //update routes
router.put('/update-product/:pid',authMiddleware,isAdmin,updateProductController)

// //get all 
router.get('/get-product',getProductController)

//search
router.get('/get-search',getSearch)

router.get('/single-product/:slug',getSingleProductController)

// router.get('/product-photo/:pid',productphotoController)

router.delete('/delete-product/:id',deleteProductController)

//filter Products
router.post('/product-filters',filterProductControllers)

//product pagination

router.get('/product-count',productCountControllers)

//product per page
router.get('/product-list/:page',productListControllers)

// router.get('/search/:keyword',productSearchControllers)

//payments Route

router.get('/braintree/token',braintreeTokenController)

router.post('/braintree/payment',authMiddleware,braintreePaymentController)

module.exports = router