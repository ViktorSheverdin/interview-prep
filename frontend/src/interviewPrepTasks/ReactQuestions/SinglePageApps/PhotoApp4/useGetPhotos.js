import { useEffect, useState } from 'react';
const LIST_OF_ALBUMS = 'https://jsonplaceholder.typicode.com/albums';

export const useGetPhotos = (albumId) => {
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    if (!albumId) return;

    const fetchAlbums = async () => {
      try {
        setIsPhotoLoading(true);
        const res = await fetch(`${LIST_OF_ALBUMS}/${albumId}/photos`);
        const data = await res.json();
        setPhotos(data);
      } catch (e) {
        throw new Error(e);
      } finally {
        setIsPhotoLoading(false);
      }
    };
    fetchAlbums();
  }, [albumId]);
  return { isPhotoLoading, photos };
};
