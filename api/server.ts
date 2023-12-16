import express from 'express';
import mongoose from 'mongoose';
import connectToDatabase from '../db';

const app = express();
import cors from 'cors';




app.use(cors());
app.use(express.json());
const port = 3001;

// Connect to MongoDB
connectToDatabase();
// Define a Mongoose schema for blog posts
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create a Mongoose model for the 'BlogPost' collection
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.use(express.json());

// Endpoint to get all blog posts
app.get('/api/posts', async (req, res) => {
  try {
    // Retrieve all blog posts from the MongoDB collection
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to create a new blog post
app.post('/api/posts', async (req, res) => {
  try {
    // Create a new blog post using the data from the request body
    const newPost = new BlogPost(req.body);

    // Save the new blog post to the MongoDB collection
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
