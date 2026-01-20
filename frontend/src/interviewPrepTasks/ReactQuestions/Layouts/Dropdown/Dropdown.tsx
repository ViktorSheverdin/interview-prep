import './Dropdown.css';

import { useEffect, useRef, useState } from 'react';
const defaultItems = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

export const Dropdown = ({ items = defaultItems, callback = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState('Select an option');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <h1>Dropdown Component</h1>
      <div
        className='dropdown'
        data-open={isOpen}
        ref={dropdownRef}
      >
        <button
          className='dropdown-button'
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
        >
          {selectedOption} <div className='chevron'>{'▲'}</div>
        </button>
        <div className={'dropdown-menu'}>
          {items.map((item) => (
            <div
              key={item.value}
              className='dropdown-option'
              data-selected={selectedOption === item.label}
              onClick={() => {
                setSelectedOption(item.label);
                callback();
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
