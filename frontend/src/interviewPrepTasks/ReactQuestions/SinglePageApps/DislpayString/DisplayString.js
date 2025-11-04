import { useEffect, useState } from 'react';

import { useGetURL } from './useGetURL';

const DELAY = 500;

export const DisplayString = () => {
  const { isLoading, urlData, error } = useGetURL();
  const [textToDisplay, setTextToDisplay] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isLoading || !urlData || typeof urlData !== 'string') return;

    setTextToDisplay('');
    setCurrentIndex(0);
  }, [urlData, isLoading]);

  useEffect(() => {
    if (isLoading || !urlData || typeof urlData !== 'string') return;

    const cleanText = urlData.trim();

    if (currentIndex >= cleanText.length) return;

    const timer = setTimeout(() => {
      setTextToDisplay((prev) => prev + cleanText[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, DELAY);

    return () => clearTimeout(timer);
  }, [urlData, isLoading, currentIndex]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error... {String(error)}</div>;

  return <div>{textToDisplay}</div>;
};
