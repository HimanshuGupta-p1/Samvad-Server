import user from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import {validate} from 'deep-email-validator'

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3days" });
}

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let User = await user.findOne({ email });

        if (User)
            return res.status(400).json("User already exists");

        if (!name || !email || !password)
            return res.status(400).json("All fields are required");
        
        const emailValid = await validate(email)
            if(! emailValid.valid) {
                // console.log(false);
                return res.status(400).json("Invalid Email")
            }
            

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password must be strong with min length of 6");


        User = new user({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(User.password, salt);

        await User.save();
        const token = createToken(User._id);
        res.status(200).json({_id: User._id, name, email, token})
    } catch (error) {
        res.status(500).json(error);
    }
}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        let User = await user.findOne({ email });

        if (!User) return res.status(400).json("Invalid email or password");
        const isValidPassword = await bcrypt.compare(password, User.password);
        
        if(!isValidPassword) return res.status(400).json("Invaild email or password");
        const token = createToken(User._id);
        res.status(200).json({_id: User._id, name: User.name, email, token})
    } catch (error) {
        res.status(500).json(error);
    }
}

export const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const User = await user.findById(userId);
        res.status(200).json(User); 
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getUsers = async (req, res) => {
    try {
        const Users = await user.find();
        res.status(200).json(Users); 
    } catch (error) {
        res.status(500).json(error);
    }
}