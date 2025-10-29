import { useCallback, useState } from 'react';

const POST_URL = 'https://jsonplaceholder.typicode.com/users';
export const usePost = () => {
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const usePostUser = useCallback(async (body) => {
    try {
      setIsLoadingPost(true);
      await fetch(POST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new Error(e);
    } finally {
      setIsLoadingPost(false);
    }
  });
  return { usePostUser, isLoadingPost };
};
