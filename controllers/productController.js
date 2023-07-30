const Product = require("../models/productModel");
const slugify = require('slugify')

const cloudinary = require('cloudinary').v2
const braintree = require('braintree');
const Order = require("../models/orderModel");
const dotenv= require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: "dljovfltn",
    api_key: "445635312369187",
    api_secret: "y9ID39OuoE8wclw-lWNWuUOH5fo"
  });


//payment Gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});



    const createProductController = async(req,res) => {
        try {
         const {name,description,price,category,quantity,shipping,imagePath} = req.body;
         const file = req.files.photo;
         cloudinary.uploader.upload(file.tempFilePath,(error,result)=>{
            console.log(result);
        
         const products = new Product({
            name:req.body.name,
            
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            quantity:req.body.quantity,
            shipping:req.body.shipping,
            imagePath:result.url,
            slug:slugify(name)})
   
         products.save()
       
             return res.status(201).send({
                 message:"Products Created",
                 products
             })
         })
        //  const {photo} = req.files;
        
         
     
        } catch (error) {
           
           res.status(500).send({
             message:"Error Occured",
             success:false,
             error
           })
        }
     }

     const updateProductController = async(req,res) => {
        try {
         const {name,slug,description,price,category,quantity,shipping} = req.body;
         const file = req.files.photo;
        //  const inputValue = req.body.imagePath;
     
         const result = await cloudinary.uploader.upload(file.tempFilePath, {
        //    public_id: req.params.photoId,
         
         });
        
         const products = await Product.findByIdAndUpdate(req.params.pid,{...req.body},{new:true})
      
       
             return res.status(200).send({
                 message:"Products Updated",
                 products,
                 result,
                 success:true
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

     const getProductController =async(req,res)=>{
       
       
        try {
           
            const products = await Product.find({})
            .populate('category')
         
            .limit(12).sort({createdAt:-1})
            return res.status(200).send({
                total:products.length,
                message:"Products Created",
                products,
              
                
            })
        
        } catch (error) {
            console.log(error);
        }
     }
     const getSingleProductController =async(req,res)=>{
        try {
            const product = await Product.findOne({slug:req.params.slug})
            // .select("-photo")
            .populate('category')
            return res.status(200).send({
                // total:product.length,
                success:true,
                message:" Single Products fetched",
                product,
              
                
            })
        
        } catch (error) {
            
            return res.status(500).send({
                success:false,
                message:"Error while getting single product"
            })
        }
     }
//search
const getSearch =async(req,res)=>{

    try {
   const products = await Product.find({}).populate("category")
      
        return res.status(200).send({
            total:products.length,
            message:"Products Created",
            products,
          
            
        })
    
    } catch (error) {
        console.log(error);
    }
 }
     const deleteProductController =async(req,res)=>{
        try {
            const product = await Product.findByIdAndDelete(req.params.id)
            // .select("-photo");
            return res.status(200).send({
                // total:product.length,
                success:true,
                message:" Deleted fetched",
                product,
              
                
            })
        
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success:false,
                message:"Error while getting single product"
            })
        }
     }

     //filters

     const filterProductControllers = async(req,res)=>{
         try {
            const {checked,radio} = req.body;
            let args = {}
           
            if(checked.length>0) args.category = checked
            if(radio.length) args.price = {$gte: radio[0], $lte:radio[1]}
            const products = await Product.find(args)
            res.status(200).send({
                success:true,
                products
            })
         } catch (error) {
            console.log(error);
            res.send({
                message:"Error white adding filters"
            })
         }
     }

     const productCountControllers =async(req,res)=>{
           try {
            const total = await Product.find({}).estimatedDocumentCount()
            res.status(200).send({
                success:true,
                total
            })
           } catch (error) {
            console.log(error);
           }
     }
     const productListControllers =async(req,res)=>{
           try {
            const perpage = 3
            const page = req.params.page ? req.params.page:1
           const products =  await Product.find({}).select("-photo").skip((page-1)*perpage).limit(perpage).sort({createdAt:-1})
            res.status(200).send({
                success:true,
                products
            })
           } catch (error) {
            console.log(error);
           }
     }

     //search

     const productSearchControllers =async(req,res)=>{
       try {
        const {keyword} = req.params;
        const result = await Product.find({
            $or:[
                {name:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        }).select("-photo")
        res.json(result)
       } catch (error) {
        console.log(error);
       }
     }

     const braintreeTokenController = async(req,res) => {
       try {
        gateway.clientToken.generate({},function (err,response) {
            if(err){
                res.status(500).send(err)
            }else{
                res.status(200).send(response)
            }
        })
       } catch (error) {
         console.log(error);
       }
     }

     const braintreePaymentController = async(req,res) => {
          try {
            const {cart,nonce} = req.body;
            let total = 0
            cart.map((i)=>{total += i.price });
            let newTransaction = gateway.transaction.sale({
                amount:total,
                paymentMethodNonce:nonce,
                options:{
                    submitForSettlement:true
                },
            },
            function (err,result) {
                if(result){
                   const order = new Order({
                    products:cart,
                    payment : result,
                    buyer:req.user._id
                   }).save();
                   res.json({ok:true})
                }else{
                    res.status(500).send(err)
                }
            })
            
          } catch (error) {
            console.log(error);
          }
     }

     

module.exports = {createProductController,getProductController,getSingleProductController,
    getSearch,
    deleteProductController,updateProductController,filterProductControllers,productCountControllers,productListControllers,productSearchControllers,braintreeTokenController,braintreePaymentController}


   