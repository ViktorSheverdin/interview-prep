import { useEffect } from 'react';

import observable from './Observable';

const logger = (data) => {
  console.log(`Logged data ${data}`);
};

export const ComponentWithObserver = () => {
  useEffect(() => {
    // Subscribe when component mounts
    observable.subscribe(logger);

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      observable.unsubscribe(logger);
    };
  }, []); // Empty dependency array means this runs only once

  const handleClick = () => {
    observable.notify('Button clicked');
  };

  return (
    <div>
      <p>Observer will be called on button click</p>
      <button onClick={handleClick}>Click to call observer</button>
    </div>
  );
};
