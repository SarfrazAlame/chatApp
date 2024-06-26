import express from "express"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/authRoute"
import messageRoutes from "./routes/messageRoute"
import dotenv from 'dotenv'
import path from "path"
import { app, server } from "./socket/socket"

dotenv.config()

const PORT = process.env.PORT || 5001

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

if(process.env.NODE_ENV !== "development"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log("server is running")
})
