import { useEffect, useState } from 'react';

const LIST_OF_ALBUMS = 'https://jsonplaceholder.typicode.com/albums';

export const useGetAlbums = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listOfAlbums, setListOfAlbums] = useState([]);
  useEffect(() => {
    const getAlbums = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(LIST_OF_ALBUMS);
        const data = await res.json();
        setListOfAlbums(data);
      } catch (e) {
        throw new Error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getAlbums();
  }, []);
  return { isLoading, listOfAlbums, setListOfAlbums };
};
