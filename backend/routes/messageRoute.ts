import express from 'express'
import protectRoute from '../middleware/protectRoute'
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/messageController'

const router = express.Router()

router.get("/conversations", protectRoute, getUsersForSidebar)
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)

export default router