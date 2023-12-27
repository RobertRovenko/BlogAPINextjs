"use client";
import React, { useEffect, useState } from "react";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../../api/api";
import { auth } from "../../firebase";
import { useRouter } from "next/navigation";

interface BlogPost {
  id: number;
  _id: string; // Add this line
  title: string;
  content: string;
  uid: string;
  email: string;
}

interface BlogPostCardProps extends BlogPost {
  onEdit: () => void;
  onDelete: (postId: number) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({
  id,
  title,
  content,
  uid,
  email,
  onEdit,
  onDelete,
}) => (
  <div
    key={id}
    className="bg-white p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
  >
    <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
    <p className="text-gray-600">{content}</p>
    <p className="text-gray-600">{uid}</p>
    <p className="text-gray-600">{email}</p>
    <button
      onClick={onEdit}
      className="text-blue-500 underline mt-2 cursor-pointer"
    >
      Edit
    </button>
    <button
      onClick={() => onDelete(id)}
      className="text-red-500 underline mt-2 cursor-pointer"
    >
      Delete
    </button>
  </div>
);

const Home: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditPost = (postId: number) => {
    setSelectedNoteId(postId);
    const postToEdit = blogPosts.find((post) => post.id === postId);

    if (postToEdit) {
      setEditPostId(postId);
      setEditPostTitle(postToEdit.title);
      setEditPostContent(postToEdit.content);
    }
  };

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  const handleCancelEdit = () => {
    setEditPostId(null);
    setSelectedNoteId(null); // Reset selected note
    setEditPostTitle("");
    setEditPostContent("");
  };
  const handleUpdatePost = async () => {
    try {
      const user = auth.currentUser;

      if (user && editPostId !== null) {
        const uid = user.uid;
        const email = user.email;

        // Make the API call to update the blog post
        await updateBlogPost({
          id: editPostId, // Ensure editPostId is of type string or number based on your API
          title: editPostTitle,
          content: editPostContent,
          user: {
            uid: uid,
            email: email,
          },
        });

        // Reset state and fetch updated blog posts
        handleCancelEdit();
        fetchAndUpdateBlogPosts();
      } else {
        console.error("User is not logged in or editPostId is null");
      }
    } catch (error) {
      console.error("Error updating blog post:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // After signing out, redirect to the signup page
      router.push("/signup");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const fetchAndUpdateBlogPosts = async () => {
    try {
      // Fetch and update the list of all blog posts
      const posts = await getBlogPosts();

      setBlogPosts(posts);

      // Clear the form fields after successful submission
      setNewPostTitle("");
      setNewPostContent("");
      router.refresh();
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;
        const email = user.email;

        // Check if the newPostTitle and newPostContent are not empty
        if (!newPostTitle || !newPostContent) {
          console.error(
            "Title and content are required for creating a blog post"
          );
          return;
        }

        await createBlogPost({
          title: newPostTitle,
          content: newPostContent,
          user: {
            uid: uid,
            email: email,
          },
        });

        // Reset form fields after successful submission
        setNewPostTitle("");
        setNewPostContent("");

        // Fetch and update blog posts
        fetchAndUpdateBlogPosts();
      } else {
        console.error("User is not logged in");
      }
    } catch (error) {
      console.error("Error creating blog post:", error);
    }
  };

  const handleDeletePost = async (postId: string | undefined) => {
    try {
      if (postId === undefined) {
        console.error("Invalid postId for deletion");
        return;
      }

      // Make the API call to delete the blog post
      await deleteBlogPost(postId);

      // Fetch and update blog posts after deletion
      fetchAndUpdateBlogPosts();
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        // Get the current user's UID
        const currentUser = auth.currentUser;

        // Log the value of currentUser to check if it's correct
        console.log("currentUser:", currentUser);

        if (currentUser) {
          const currentUserUid = currentUser.uid;

          // Log the value of currentUserUid to check if it's correct
          console.log("currentUserUid:", currentUserUid);

          // Fetch and update blog posts based on the current user's UID
          const response = await fetch(
            `http://localhost:3001/api/posts?uid=${currentUserUid}`
          );
          const data = await response.json();
          setBlogPosts(data);
        } else {
          console.error("User is not logged in");
          // Handle the case where the user is not logged in, for example, redirect to the login page
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    // Subscribe to changes in the current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If the user is logged in, fetch and update blog posts
        fetchBlogPosts();
      } else {
        // If the user is not logged in, handle accordingly
        console.error("User is not logged in");
        // Handle the case where the user is not logged in, for example, redirect to the login page
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">Notes</h1>
          <p className="text-white">Welcome, {auth.currentUser?.email}</p>
          <p>UID: {auth.currentUser?.uid}</p>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                {...post}
                onEdit={() => {
                  handleEditPost(post.id);
                  toggleEditForm(); // Show the edit form when the "Edit" button is clicked
                }}
                onDelete={() => handleDeletePost(post._id)}
              />
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
        {showEditForm && (
          <div className="flex items-center justify-center fixed inset-0">
            <div
              onClick={toggleEditForm}
              className="absolute inset-0 bg-gray-800 opacity-50 cursor-pointer"
            ></div>
            <form
              className="bg-white p-4 rounded-lg shadow-md max-w-sm mx-auto z-10"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePost();
                toggleEditForm(); // Close the edit form after submission
                fetchAndUpdateBlogPosts();
              }}
              style={{ margin: "20px" }}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Edit Note
              </h2>
              <input
                type="hidden"
                id="editPostUid"
                name="editPostUid"
                value={auth.currentUser?.uid || ""} // Set the UID as the initial value
              />
              <input
                type="hidden"
                id="editPostEmail"
                name="editPostEmail"
                value={auth.currentUser?.email || ""}
              />

              <div className="mb-4">
                <label
                  htmlFor="editPostTitle"
                  className="block text-sm font-medium text-gray-600"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editPostTitle"
                  name="editPostTitle"
                  value={editPostTitle}
                  onChange={(e) => setEditPostTitle(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full text-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="editPostContent"
                  className="block text-sm font-medium text-gray-600"
                >
                  Content
                </label>
                <textarea
                  id="editPostContent"
                  name="editPostContent"
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  className="mt-1 p-2 border rounded-md w-full text-gray-800"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Update Note
              </button>
            </form>
          </div>
        )}

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
                fetchAndUpdateBlogPosts();
                router.refresh();
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
          <button onClick={handleLogout}>Logout</button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
