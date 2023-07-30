const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const connectDb = require('./db')




const authRoute = require('./routes/authRoute')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoute = require('./routes/productRoute')
//fileupload
const fileUpload = require('express-fileupload')
const PORT = process.env.PORT || 8000
dotenv.config()



app.use(express.json())
app.use(cors({credentials:true},process.env.CLIENT_URL))
app.use(fileUpload({
    useTempFiles:true
}))
connectDb();
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoute)

app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})