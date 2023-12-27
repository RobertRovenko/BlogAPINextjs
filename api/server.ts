// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import connectToDatabase from '../db';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Create an Express app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());

/* const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, // limit each IP to 50 requests per windowMs
});
app.use(limiter); */

// Set the port
const port = 3001;

// Connect to MongoDB
connectToDatabase();

// Define the Mongoose schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  user: {
    uid: String,
    email: String,
  },
});

// Create a Mongoose model for the 'BlogPost' collection
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// server.js
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to create a new blog post
// Endpoint to create a new blog post
app.post('/api/posts', async (req, res) => {
  try {
    const newPost = new BlogPost(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    // Find the blog post by ID
    const existingPost = await BlogPost.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Update the blog post with new data from the request body
    existingPost.title = req.body.title || existingPost.title;
    existingPost.content = req.body.content || existingPost.content;

    // Check if user property exists before updating its fields
    if (existingPost.user) {
      existingPost.user.uid = req.body.user?.uid || existingPost.user.uid;
      existingPost.user.email = req.body.user?.email || existingPost.user.email;
    }

    const updatedPost = await existingPost.save();

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to delete a blog post
app.delete('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    // Find the blog post by ID
    const deletedPost = await BlogPost.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(deletedPost);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
