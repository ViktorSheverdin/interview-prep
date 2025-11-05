import './ProductShowcase.css';

import React from 'react';

const products = [
  {
    id: 101,
    title: 'Wireless Headphones Pro X200Wireless Headphones Pro X200',
    price: '$199',
  },
  { id: 102, title: 'Smartwatch S3 Ultra', price: '$149' },
  { id: 103, title: 'Mechanical Keyboard Vortex', price: '$129' },
  { id: 104, title: 'Gaming Mouse Phantom 8', price: '$79' },
  { id: 106, title: 'USB-C Hub 9-in-1', price: '$59' },
  { id: 107, title: '4K Monitor UltraVision', price: '$499' },
  { id: 108, title: 'Wireless Headphones Pro X200', price: '$199' },
  { id: 109, title: 'Smartwatch S3 Ultra', price: '$149' },
  { id: 110, title: 'Mechanical Keyboard Vortex', price: '$129' },
  { id: 111, title: 'Gaming Mouse Phantom 8', price: '$79' },
  { id: 112, title: 'USB-C Hub 9-in-1', price: '$59' },
  { id: 113, title: '4K Monitor UltraVision', price: '$499' },
];

export const ProductShowcase = () => {
  return (
    <div className='product-showcase'>
      {products.map((product) => (
        <div
          key={product.id}
          className='product-card'
        >
          <div className='image-wrapper'>
            <img
              src={`https://picsum.photos/id/${product.id}/200`}
              alt={product.title}
            />
          </div>
          <h3 className='product-title'>{product.title}</h3>
          <p className='product-price'>{product.price}</p>
          <button className='buy-btn'>Buy Now</button>
        </div>
      ))}
    </div>
  );
};
