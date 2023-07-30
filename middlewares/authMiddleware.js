const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async(req,res,next) => {
  
       

          try {
            const decoded = jwt.verify(req.headers.authorization,process.env.JWT_SECRET)
            req.user = decoded
            next()
          } catch (error) {
            console.log(error);
            res.json({error})
          }



          try {
           
        //    const authorization = req.headers.authorization;
        //    if(!authorization){
        //     res.json({message:"unauthorized" , success:false})
        //    }
        //    const token =  authorization.replace("Bearer ", "")
        //     jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        //         if(err){
        //             res.json({message:"unauthorized" , success:false})
        //         }
        //         const {_id} = payload
        //         User.findById(_id).then(userData=>{
        //             req.user = userData
        //         })
                
    //    })
      
          
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error "
        })
    }

    } 

    const isAdmin = async(req,res,next) => {
  try {
    const user = await User.findById(req.user._id)
    if(user.role!==1){
       return res.status(500).json({
         message:"Error "
         
     })
    }
    else{
     next()
    }
  } catch (error) {
    res.json({
        message:"Unauthorized",
        error
    })
  }
    }

module.exports = {authMiddleware,isAdmin}