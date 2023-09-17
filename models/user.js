import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 30},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6, maxlength: 1024},


}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema)
