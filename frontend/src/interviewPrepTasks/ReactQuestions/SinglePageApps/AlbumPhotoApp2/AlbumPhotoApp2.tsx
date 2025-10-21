import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { type Album, getAlbums, getPhotos } from './api';

export const AlbumPhotoApp2 = () => {
  const {
    data: albums,
    isLoading: isLoadingAlbums,
    isError: isErrorAlbums,
  } = useQuery({
    queryKey: ['albums'],
    queryFn: getAlbums,
  });

  const [displayAlbums, setDisplayAlbums] = useState<Album[]>(albums ?? []);
  const [seachKey, setSeachKey] = useState('');
  const [selectedAlbumId, setSelectedAlbumId] = useState<number>(0);

  const { data: photos, isLoading: isLoadingPhotos } = useQuery({
    queryKey: ['photos', selectedAlbumId],
    queryFn: () => getPhotos(selectedAlbumId),
    enabled: !!selectedAlbumId,
  });

  useEffect(() => {
    const filteredAlbums = (albums ?? []).filter((album) =>
      album.title.toLowerCase().includes(seachKey.toLowerCase())
    );
    setDisplayAlbums(filteredAlbums);
  }, [albums, seachKey]);

  const handleDelete = (id: number) => {
    setDisplayAlbums((prev) => prev.filter((album) => album.id !== id));
  };

  if (isLoadingAlbums) return <div>Loading Albums</div>;
  if (isErrorAlbums) return <div>Error loading Albums</div>;

  return (
    <div>
      <div>Interview prep</div>
      <input
        placeholder='Seach ablums'
        value={seachKey}
        onChange={(e) => {
          setSeachKey(e.target.value);
        }}
      />
      <div style={{ display: 'flex' }}>
        <nav style={{ maxHeight: '600px', overflow: 'auto' }}>
          {displayAlbums.map((album) => {
            return (
              <div
                key={album.id}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedAlbumId(album.id);
                }}
              >
                {album.title}{' '}
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
        <main style={{ width: '100%' }}>
          <h3>
            Album number {selectedAlbumId}{' '}
            {isLoadingPhotos ? 'Loading...' : null}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '1rem',
              height: '600px',
              overflow: 'auto',
            }}
          >
            {photos?.map((photo) => {
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
