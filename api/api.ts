import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getBlogPosts = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await api.get('/posts');
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching blog posts:', error);

    // Return an empty array or handle the error gracefully based on your requirements
    return [];
  }
};

export const createBlogPost = async (data: { title: string; content: string; user: { uid: string; email: string | null } }): Promise<void> => {
  try {
    await api.post('/posts', data);
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

export const updateBlogPost = async (postData: {
  id: number;
  title: string;
  content: string;
  user: {
    uid: string;
    email: string | null;
  };
}): Promise<void> => {
  try {
    const response = await api.put(`/posts/${postData.id}`, {
      title: postData.title,
      content: postData.content,
      user: postData.user,
    });

    if (response.status !== 200) {
      throw new Error('Failed to update blog post');
    }

    // The response data can be accessed directly
    const responseData = response.data;

    console.log('Updated blog post:', responseData);
  } catch (error) {
    console.error('Error updating blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId: string): Promise<void> => {
  try {
    await api.delete(`/posts/${postId}`);
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

