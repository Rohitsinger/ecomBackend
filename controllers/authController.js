const bcrypt = require('bcryptjs');
const User = require ("../models/userModel");
const jwt = require('jsonwebtoken');

const Order = require('../models/orderModel');


const registerController = async(req,res) => {
 try {
   const {name,email,password,address,phone,role,question} = req.body;
   console.log(req.body);
   if(!name && !email && !password && !address && !phone && !role && !question){
    return res.send({
      message:"Please Fille all the details",
      success:false
     })
    }
    const existingUser = await User.findOne({email})
    if(existingUser){
     return res.status(200).json({message:"User already exist"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await new User({name,email,password:hashedPassword,address,role,phone,question});
    await user.save();
    
    return res.status(201).json({success:true,
      message:"User Registered succcesfully",
      user
   })
 } catch (error) {
   console.log(error);
   res.status(500).send({
      message:"Auth failed",
      success:false
   })
 }

}
const loginController = async(req,res) => {
 try {
   const {email,password} = req.body;
   console.log(req.body);
   if( !email && !password ){
     res.json({
      message:"Please Fill all the details",
      success:false
     })
    }
    const user = await User.findOne({email})

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
     return res.json({message:"User not Authorized"})
    }
   
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{
      expiresIn:"5d",
    },{sameSite:'none',secure:'true'})
    return res.status(200).json({success:true,
      message:"User signed in Successfully",
      user:{
        name:user.name,
        email:user.email,
        address:user.address,
       
        phone:user.phone,
        question:user.question,
        role:user.role
      }
      ,token
   })
 } catch (error) {
   console.log(error);
   res.status(500).send({
      message:"Auth failed",
      success:false
   })
 }

}


//authentication for user in dashboard
const userAuth = async(req,res)=>{
  
   res.status(200).send({
    ok:true
    
   })
}

//for Admin
const adminAuth = async(req,res)=>{
  
   res.status(200).send({
    ok:true
    
   })
}

//forgot password functionality
const forgotPassword = async(req,res)=>{
   try {
     const {email,question,newPassword} = req.body;
     if(!email){
      res.status(400).send({message:'Email is require'})
     }
     if(!question){
      res.status(400).send({message:'question is require'})
     }
     if(!newPassword){
      res.status(400).send({message:'newPassword is require'})
     }

     //check
     const user = await User.findOne({email,question})
     console.log(user);
     if(!user){
      res.status(404).
      send({
        message:"Something went wrong with Email and password",
        success:false
      })
     }
     const hashed = await bcrypt.hash(newPassword,10)
      await User.findByIdAndUpdate(user._id,{password:hashed})
      res.status(200).send({
        success:true,
        message:"password reset successfully"
      })
   } catch (error) {
     res.status(500).send({
       message:"Something went wrong",
       error
     })
     console.log(error);
   }
}

const testController = (req,res) => {
   res.send("test");
}

const updateProfile =async(req,res)=>{
  try {
     const {name,email,password,address,phone} = req.body;
     const user = await User.findById(req.user._id)
     //password
     if(!password && password.length<5){
      return res.json({error:"Password is require"})
     }
     let hashed = await bcrypt.hash(password,10)
     const hashpassword = password ?  hashed :undefined
     const updatedUser = await User.findByIdAndUpdate(req.user._id,{
      name:name || user.name,
      password:hashpassword || user.password,
      phone:phone || user.phone,
      address:address || user.address,
     },{new:true})
     res.status(200).send({
      success:true,
      message:"profile updated successfully",
      updatedUser
     })
  } catch (error) {
    res.status(500).send({message:"cannot update"})
    console.log(error);
    error
  }
}

const getOrderControllers = async(req,res) => {
   try {
    const orders = await Order.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
    res.json(orders)
   } catch (error) {
    console.log(error);
   }
}

const getOrderAllControllers = async(req,res) => {
  try {
   const orders = await Order.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt:"-1"});
   res.json(orders)
  } catch (error) {
   console.log(error);
  }
}

const orderStatusControllers =async(req,res)=>{
   try {
    const {orderId} = req.params
    const {status} = req.body;
    const orders = await Order.findByIdAndUpdate(orderId,{status},{new:true})
   await res.json(orders)
   } catch (error) {
     res.status(500).send({
     
      success:false,
      message:"Error",
      error
  })

   }
}
module.exports = {registerController,loginController,testController,userAuth,forgotPassword,adminAuth,updateProfile,getOrderControllers,getOrderAllControllers,orderStatusControllers}