import { useCallback } from 'react';
const POST_API = 'https://jsonplaceholder.typicode.com/posts';
export const useAddPost = () => {
  const addPost = useCallback(async (title, body) => {
    try {
      await fetch(POST_API, {
        method: 'POST',
        body: JSON.stringify({ title, body }),
      });
    } catch {
      throw new Error('Failed to post');
    }
  }, []);
  return { addPost };
};
