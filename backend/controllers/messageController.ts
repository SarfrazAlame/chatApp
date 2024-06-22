import { Request, Response } from "express";
import prisma from "../db/prisma";
import { getReceiverSocketId, io } from "../socket/socket";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user.id

        let conversation = await prisma.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, recieverId]
                }
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantsIds: {
                        set: [senderId, recieverId]
                    }
                }
            })
        };

        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id
            }
        })

        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id
                        }
                    }
                }
            })
        }

        const recieverSockerId = getReceiverSocketId(recieverId)

        if (recieverSockerId) {
            io.to(recieverSockerId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req.user.id

        const conversation = await prisma.conversation.findFirst({
            where: {
                participantsIds: {
                    hasEvery: [senderId, userToChatId]
                }
            },
            include: {
                messages: {
                    orderBy: {
                        createAt: "desc"
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(200).json([])
        }

        res.status(200).json(conversation.messages)
    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getUsersForSidebar = async (req: Request, res: Response) => {
    try {
        const authUserId = req.user.id

        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId
                }
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true
            }
        })

        res.status(200).json(users)
    } catch (error: any) {
        console.log("Error in signup", error.message)
        res.status(500).json({ error: "Internal Server Error" })
    }
}