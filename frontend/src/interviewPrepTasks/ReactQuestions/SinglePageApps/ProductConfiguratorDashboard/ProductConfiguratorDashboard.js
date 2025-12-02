import './style.css';

import { useEffect, useState } from 'react';
export const ProductConfiguratorDashboard = ({ items }) => {
  const [displayItems, setDisplayItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterKey, setFilterKey] = useState('');
  const [isGrid, setIsGrid] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);

  const priorityMap = {
    high: 'red',
    medium: 'yellow',
    low: 'green',
  };

  useEffect(() => {
    const newDisplay = items
      .filter((item) => item.title.includes(filterKey))
      .filter((item) => item.tags.includes(selectedTags));
    setDisplayItems(newDisplay);
  }, [filterKey, items, selectedTags]);

  return (
    <div>
      <h3>Product Configurator Dashboard</h3>
      <div className='toolbar'>
        <div>
          <input
            value={filterKey}
            onChange={(e) => setFilterKey(e.target.value)}
            placeholder='Filter tasks'
          />
        </div>
        <div>
          <button onClick={() => setIsGrid((prev) => !prev)}>
            {isGrid ? 'Grid' : 'List'}
          </button>
        </div>
        <div>
          <select>
            <option>A-Z / Z-A</option>
            <option>Priority Hight/Low</option>
          </select>
        </div>
      </div>
      <div className={`product-${isGrid ? 'grid' : 'list'}`}>
        {displayItems.map((item) => {
          const isOpen = selectedItem === item.id;
          return (
            <div
              className={`card ${isOpen ? 'card--open' : ''}`}
              key={item.id}
              onClick={() => {
                setSelectedItem(item.id);
              }}
            >
              <div className='header'>
                <div>{item.title}</div>
                {isOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(null);
                    }}
                    className='close-button'
                  >
                    X
                  </button>
                )}
              </div>

              <div className='description'></div>
              {isOpen
                ? item.description
                : `${item.description.slice(0, 30)}...`}
              <div className='tags'>
                {item.tags.map((tag, i) => {
                  return (
                    <div
                      style={{
                        border: `1px solid ${priorityMap[item.priority]}`,
                        borderRadius: '6px',
                        padding: '5px',
                      }}
                      key={i}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag) ? prev : [...prev, tag]
                        )
                      }
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
