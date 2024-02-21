import mongoose from "mongoose";

// Define modelo comentarios
const commentSchema = new mongoose.Schema({
    text: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    },
    name: String,
    date: {
        type: Date,
        default: Date.now,
    },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;