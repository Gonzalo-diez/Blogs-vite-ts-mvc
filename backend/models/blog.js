import mongoose from "mongoose";

// Define modelo de blogs
const blogSchema = new mongoose.Schema({
    title: String,
    category: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    text: String,
    image: String
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;