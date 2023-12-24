import express from 'express';
import mongoose from 'mongoose';
import connectToDatabase from '../db';
import cors from 'cors';

const app = express();

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

// Endpoint to get all blog posts
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

// Endpoint to update a blog post
app.put('/api/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    // Find the blog post by ID
    const existingPost = await BlogPost.findById(postId);

    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // Update the blog post with new data
    existingPost.set(req.body);
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
