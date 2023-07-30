const mongoose = require('mongoose')

const connectDb = async()=>{
    try {
     const con = await mongoose.connect(process.env.MONGO_URI)
      console.log("connected")
    } catch (error) {
      console.log('not',error)
    }
  }

  module.exports = connectDb