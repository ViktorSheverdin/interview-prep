import './PhotoGallery.css';

import React, { useEffect, useState } from 'react';

interface PhotoI {
  id: number;
  src: string;
  alt: string;
}

const MIN_NUMBER_OF_PHOTOS = 10;
const MAX_NUMBER_OF_PHOTOS = 40;
const IMG_BASE_URL = 'https://picsum.photos/id';
const IMG_WIDTH = '200';
const IMG_HEIGHT = '300';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState<PhotoI[]>([]);

  useEffect(() => {
    const numberOfPhotos =
      Math.floor(
        Math.random() * (MAX_NUMBER_OF_PHOTOS - MIN_NUMBER_OF_PHOTOS + 1)
      ) + MIN_NUMBER_OF_PHOTOS;
    const randomId = Math.floor(Math.random() * 1000) + 1;

    const newPhotos: PhotoI[] = [];
    for (let i = 0; i < numberOfPhotos; i++) {
      newPhotos.push({
        id: i + 1,
        src: `${IMG_BASE_URL}/${i + randomId}/${IMG_WIDTH}/${IMG_HEIGHT}`,
        alt: `Photo ${i + 1}`,
      });
    }
    setPhotos(newPhotos);
  }, []);

  return (
    <div>
      <h1>Photos Gallery</h1>
      <div className='photo-gallery'>
        {photos.map((photo) => (
          <div
            key={photo.id}
            className='photo-item'
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className='photo-image'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
