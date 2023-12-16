import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getBlogPosts = async (): Promise<any[]> => {
  try {
    const response: AxiosResponse<any[]> = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};
