import './ColorPicker.css';

import { useState } from 'react';

export const ColorPicker = ({ colors }) => {
  const [displayColors, setDisplayColors] = useState(colors);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (key) => {
    setSelectedColors((prev) => (prev.includes(key) ? prev : [...prev, key]));

    setDisplayColors(() => {
      const filtered = {};
      const idsToDisplay = [...selectedColors, key];

      idsToDisplay.forEach((id) => (filtered[id] = colors[id]));
      return filtered;
    });
  };

  const clearAll = () => {
    setSelectedColors([]);
    setDisplayColors(colors);
  };
  return (
    <div>
      <h3>Color Picker</h3>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        Open Color Picker
      </button>
      <button onClick={clearAll}>Clear All</button>
      {isOpen ? (
        <div className='modal'>
          {Object.keys(colors).map((key) => {
            return (
              <div
                className='color-box'
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: colors[key].hex,
                }}
                key={key}
                onClick={() => {
                  handleClick(key);
                }}
              >
                {selectedColors.some((color) => color === key) ? 'X' : null}
              </div>
            );
          })}
        </div>
      ) : null}
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Hex</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(displayColors).map((key) => {
            return (
              <tr key={key}>
                <td>{colors[key].name}</td>
                <td>{colors[key].hex}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
