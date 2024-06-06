import { Request, Response } from "express"
import bcrypt from 'bcryptjs'
import prisma from "../db/prisma"
import generateToken from "../utils/generateToken"

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all fields" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" })
        }

        const user = await prisma.user.findUnique({ where: { username } })

        if (user) {
            return res.status(400).json({ error: "Username already exists" })
        }

        const salt = await bcrypt.genSalt(10);

        const hashPassword = await bcrypt.hash(password, salt)

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = await prisma.user.create({
            data: {
                fullname,
                username,
                password: hashPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProilePic
            }
        })

        if (newUser) {

            generateToken(newUser.id, res)

            res.status(201).json({
                id: newUser.id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }

    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        const isCorrectPassword = await bcrypt.compare(password, user.password)

        if (!isCorrectPassword) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        generateToken(user.id, res)

        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        })
    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}
export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        })
        
    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}