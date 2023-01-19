const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT

app.use('/user',userRoutes)
app.use("/chat",chatRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT,async()=>{
    await connectDB()
    console.log(`Server Started ${PORT}`)
})