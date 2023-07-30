const Category = require("../models/categoryModel");
const slugify = require('slugify')
const createCategoryController = async(req,res) => {
   try {
    const {name} = req.body;
    if(!name){
        res.status(401).send({message:"name is required"})
    }
    const existingCategory = await Category.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            message:"Category exist"
        })
    }
    const categories =  new Category({name,slug:slugify(name)}).save();
    res.status(201).send({
        message:"new category formed",
        categories
    })
   } catch (error) {
      console.log(error);
      res.status(500).send({
        message:"Error Occured",
        success:false,
        error
      })
   }
}

const updateCategoryController =async(req,res)=>{
    try {
        const {name} = req.body;
          const {id} = req.params
        const categoryUpdated = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
     
     
        res.status(201).send({
            success:true,
            message:"new category formed",
            categoryUpdated
        })
       } catch (error) {
          console.log(error);
          res.status(500).send({
            message:"Error Occured",
            success:false,
            error
          })
       }
} 

const categoryController = async(req,res) => {
 try {
  const categories = await Category.find({})
  res.status(200).send({
    success:true,
    categories
  })
 } catch (error) {
    res.status(500).send({
      error,
      success:false
    })
 }
}

const singleCategoryController = async(req,res)=>{
   try {
    
    const category = await Category.findOne({slug:req.params.slug})
  res.status(200).send({
    success:true,
    category
  })
   } catch (error) {
     console.log(error);
   }
}
const deleteCategoryController = async(req,res)=>{
   try {
    const {id} = req.params;
    const category = await Category.findByIdAndDelete(id)
  res.status(200).send({
    success:true,
    category
  })
   } catch (error) {
     console.log(error);
   }
}


module.exports ={createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController}