import mongoose from "mongoose";

// Define modelo de usuario
const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    avatar: String,
    createdBlogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog', 
        }
    ]
});

const User = mongoose.model('User', userSchema);

export default User;