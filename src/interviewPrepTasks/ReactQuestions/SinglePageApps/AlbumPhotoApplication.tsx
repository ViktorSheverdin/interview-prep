/**
 * We want to create a album photos application:
 * here is the mockup 👉 https://iili.io/gFL3TQ.png
 *
 * INSTRUCTIONS
 *
 * 1- Fetch a list of albums and render for each album its title
 * // create a method to fetch
 * 2- When clicking on an album title, render the photos for that album
 * 3- Display a loading message beside the header when we are fetching albums or photos
 * 4- (Bonus) Add a delete button underneath the photos to be able to delete the current album locally
 * 5- (Bonus) Add a text field underneath the header to filter albums per title
 *
 * ENDPOINTS
 *
 * List of albums: https://jsonplaceholder.typicode.com/albums
 *
 * type Album = {
 *  userId: number;
 *  id: number;
 *  title: string;
 * }
 *
 * List of photos for an album: https://jsonplaceholder.typicode.com/albums/{albumId}/photos
 *
 * type Photo = {
 *  albumId: number;
 *  id: number;
 *  title: string;
 *  url: string;
 *  thumbnailUrl: string;
 * }
 *
 *
 */

import { useEffect, useState } from 'react';

type IAlbum = {
  userId: number;
  id: number;
  title: string;
};

type IPhoto = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

type IListOfAlbums = {
  albums: IAlbum[];
  handleSelectAlbum: (albumId: number) => void;
  handleDeleteAlbum: (albumId: number) => void;
};

type IGridOfPhotos = {
  photos: IPhoto[];
};

const ALBUMS_URL = 'https://jsonplaceholder.typicode.com/albums';

const ListOfAlbums: React.FC<IListOfAlbums> = (props) => {
  const { albums, handleSelectAlbum, handleDeleteAlbum } = props;
  return (
    <div style={{ height: '600px', overflow: 'auto' }}>
      <div>
        {albums.map((album) => {
          return (
            <div
              key={album.id}
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => {
                handleSelectAlbum(album.id);
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                {album.title}
                <button
                  onClick={() => {
                    handleDeleteAlbum(album.id);
                  }}
                >
                  Delete Ablum
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GridOfPhotos: React.FC<IGridOfPhotos> = (props) => {
  const { photos } = props;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '1rem',
        height: '600px',
        overflow: 'auto',
      }}
    >
      {photos.map((photo) => {
        return (
          <div
            key={photo.id}
            style={{ border: '1px solid #000', borderRadius: '4px' }}
          >
            <img
              src={photo.url}
              alt={photo.title}
            />
          </div>
        );
      })}
    </div>
  );
};

export const AlbumPhotoApplication = () => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<IAlbum[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setIsPending(true);
        const albumsResponse = await fetch(ALBUMS_URL);
        if (!albumsResponse.ok) throw new Error('Error fetching albums');
        const albumsData: IAlbum[] = await albumsResponse.json();
        setAlbums(albumsData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsPending(false);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    const filteredAlbums = albums.filter((album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAlbums(filteredAlbums);
  }, [albums, searchTerm]);

  const handleSelectAlbum = async (albumId: number) => {
    try {
      setIsPending(true);
      setSelectedAlbum(albumId);
      const photosResponse = await fetch(`${ALBUMS_URL}/${albumId}/photos`);
      if (!photosResponse.ok) throw new Error('Error fetching photos');
      const photosData: IPhoto[] = await photosResponse.json();
      setPhotos(photosData);
    } catch (err) {
      console.log(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteAlbum = (albumId: number) => {
    setAlbums((prev) => prev.filter((album) => album.id !== albumId));
  };

  return (
    <div style={{ display: 'flex' }}>
      <nav style={{ margin: '20px' }}>
        <input
          placeholder='Filter...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <ListOfAlbums
          albums={filteredAlbums}
          handleSelectAlbum={handleSelectAlbum}
          handleDeleteAlbum={handleDeleteAlbum}
        />
      </nav>
      <main style={{ width: '80%' }}>
        <h2>
          {selectedAlbum} {isPending ? <span>Loading...</span> : null}
        </h2>
        <GridOfPhotos photos={photos} />
      </main>
    </div>
  );
};
