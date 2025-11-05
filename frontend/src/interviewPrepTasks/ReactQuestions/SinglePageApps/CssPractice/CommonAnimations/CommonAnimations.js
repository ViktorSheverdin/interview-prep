import './CommonAnimations.css';

import React from 'react';

export const CommonAnimations = () => {
  const cards = [
    { id: 1, title: 'Lift Shadow', type: 'lift' },
    { id: 2, title: 'Scale Up', type: 'scale' },
    { id: 3, title: 'Rotate', type: 'rotate' },
    { id: 4, title: 'Fade + Slide', type: 'fade' },
  ];

  return (
    <div className='cards-container'>
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card card-${card.type}`}
        >
          <img
            src={`https://picsum.photos/id/${100 + card.id}/200/140`}
            alt={card.title}
          />
          <h3>{card.title}</h3>
        </div>
      ))}
    </div>
  );
};
