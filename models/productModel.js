const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    slug:{
        type:String,
        required:true
       
    },
    description:{
        type:String,
        required:true
       
    },
    price:{
        type:Number,
        required:true
       
    },
    category:{
        type:mongoose.ObjectId,
       
        required:true,
        ref:'Category',
    },
    quantity:{
        type:Number,
        required:true
    },
    // photo:{
    //     data:Buffer,
    //     contentType:String
    // },
    imagePath:{
      type:String,
      required:true
    },
    shipping:{
        type:Boolean,
    },
},{timestamps:true})


const Product = mongoose.model('Product',productSchema)

module.exports = Product