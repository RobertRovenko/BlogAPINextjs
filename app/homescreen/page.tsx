"use client";
import React, { useEffect, useState } from "react";
import { getBlogPosts, createBlogPost } from "../../api/api";
import Link from "next/link";

// Define the type for a blog post
interface BlogPost {
  id: number;
  title: string;
  content: string;
}
const BlogPostCard: React.FC<BlogPost> = ({ id, title, content }) => (
  <div
    key={id}
    className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
  >
    <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-600">{content}</p>
  </div>
);

const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");

  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const fetchAndUpdateBlogPosts = async () => {
    try {
      // Fetch and update the list of blog posts
      const posts = await getBlogPosts();
      setBlogPosts(posts);

      // Clear the form fields after successful submission
      setNewPostTitle("");
      setNewPostContent("");
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleCreatePost = async () => {
    try {
      // Make API request to create new post
      await createBlogPost({ title: newPostTitle, content: newPostContent });

      // Call the function to fetch and update blog posts
      fetchAndUpdateBlogPosts();
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  useEffect(() => {
    // Call the function to fetch and update blog posts on initial render
    fetchAndUpdateBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Notes</h1>
        </div>
      </header>

      {/* Main Content - Blog Posts */}
      <main className="container mx-auto mt-8 p-4">
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading notes...</p>
        )}
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <button
            onClick={toggleForm}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {showForm ? "Remove New Note" : "Create New Note"}
          </button>
        </div>
        {showForm && (
          <div className="flex items-center justify-center fixed inset-0">
            <div
              onClick={toggleForm}
              className="absolute inset-0 bg-gray-800 opacity-50 cursor-pointer"
            ></div>
            <form
              className="bg-white p-4 rounded-lg shadow-md max-w-sm mx-auto z-10"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreatePost();
                toggleForm(); // Close the form after submission
              }}
              style={{ margin: "20px" }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Create New Note
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="postTitle"
                  className="block text-sm font-medium text-gray-600"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="postTitle"
                  name="postTitle"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full text-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postContent"
                  className="block text-sm font-medium text-gray-600"
                >
                  Content
                </label>
                <textarea
                  id="postContent"
                  name="postContent"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full text-gray-800"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Create Note
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto">
          <p className="text-center">© 2023 Made by Robert Falkbäck Rovenko</p>
          <Link href="/signup">
            <button>Logout</button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
