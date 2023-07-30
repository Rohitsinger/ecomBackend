const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require('../controllers/categoryController');


const router = express.Router();

//post routes
router.post('/create-category',authMiddleware,isAdmin,createCategoryController)

//update routes
router.put('/update-category/:id',authMiddleware,isAdmin,updateCategoryController)

//get all 
router.get('/get-category',categoryController)

router.get('/single-category/:slug',singleCategoryController)

router.delete('/delete-category/:id',authMiddleware,isAdmin,deleteCategoryController)

module.exports = router