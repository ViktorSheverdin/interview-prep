import { useEffect, useState } from 'react';
const POSTS_API = 'https://jsonplaceholder.typicode.com/posts?_limit=10';
export const useGetPosts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await fetch(POSTS_API);
        const res = await data.json();
        setPosts(res);
      } catch {
        throw new Error('Failed fetching posts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);
  return { isLoading, posts, setPosts };
};
