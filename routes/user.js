import express from "express";
import { findUser, getUsers, loginUser, registerUser } from "../controllers/user.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:userId', findUser);
router.get('/', getUsers);

export default router