"use client";
import React, { useEffect, useState } from "react";
import { getBlogPosts } from "../api/api";

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

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const posts = await getBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-500 text-white py-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Blog</h1>
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
          <p className="text-center text-gray-600">Loading blog posts...</p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-500 text-white py-4 mt-8">
        <div className="container mx-auto">
          <p className="text-center">© 2023 My Awesome Blog</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
