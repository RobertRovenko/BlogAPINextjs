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

export const createBlogPost = async (data: { title: string; content: string }): Promise<void> => {
    try {
      await api.post('/posts', data);
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  };