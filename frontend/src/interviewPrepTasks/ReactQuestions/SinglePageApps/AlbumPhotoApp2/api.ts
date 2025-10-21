const LIST_OF_ALBUMS = 'https://jsonplaceholder.typicode.com/albums';

export type Album = {
  userId: number;
  id: number;
  title: string;
};

type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export const getAlbums = async (): Promise<Album[]> => {
  const res = await fetch(LIST_OF_ALBUMS);
  if (!res.ok) throw new Error('Error fetching albums');
  return res.json();
};

export const getPhotos = async (id: number): Promise<Photo[]> => {
  const res = await fetch(`${LIST_OF_ALBUMS}/${id}/photos`);
  if (!res.ok) throw new Error(`Error fetching photoes for id: ${id}`);
  return res.json();
};
