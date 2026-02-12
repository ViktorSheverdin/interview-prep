import { useEffect, useState } from 'react';

import { useGetAlbums } from './useGetAlbums';
import { useGetPhotos } from './useGetPhotos';

export const PhotoApp4 = () => {
  const { isLoading, listOfAlbums, setListOfAlbums } = useGetAlbums();
  const [displayAlbums, setDisplayAlbums] = useState(listOfAlbums || []);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const { isPhotoLoading, photos } = useGetPhotos(selectedAlbum);
  const [searchKey, setSearchKey] = useState('');
  const handleDelete = (id) => {
    setListOfAlbums((prev) => prev.filter((album) => album.id !== id));
  };

  useEffect(() => {
    const filteredAlbums = listOfAlbums.filter((album) =>
      album.title.toLowerCase().includes(searchKey.toLowerCase()),
    );
    setDisplayAlbums(filteredAlbums);
  }, [searchKey, listOfAlbums]);

  return (
    <div>
      <label htmlFor='search'>Search Album: </label>
      <input
        id='search'
        placeholder='Search...'
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {selectedAlbum} {isPhotoLoading ? 'Loading...' : null}
      </div>

      <div style={{ display: 'flex' }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <nav style={{ maxHeight: '600px', overflow: 'auto' }}>
            {displayAlbums.map((album) => {
              return (
                <div
                  key={album.id}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <div
                    onClick={() => {
                      setSelectedAlbum(album.id);
                    }}
                  >
                    {album.title}
                  </div>
                  <button
                    onClick={() => {
                      handleDelete(album.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </nav>
        )}

        <main style={{ width: '100%' }}>
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
                <div key={photo.id}>
                  <img src={`https://picsum.photos/id/${photo.id}/200`} />
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};
