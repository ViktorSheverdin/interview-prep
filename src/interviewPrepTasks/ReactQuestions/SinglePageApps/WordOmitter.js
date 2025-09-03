import React, { useEffect, useState } from 'react';

const OMITTED_WORDS = ['a', 'the', 'and', 'or', 'but'];

function WordOmitter() {
  const [inputText, setInputText] = useState('');
  const [isOmitWords, setIsOmitWords] = useState(true);
  const [displayString, setDisplayString] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const toggleOmitWords = () => {
    setIsOmitWords(!isOmitWords);
  };

  const clearFields = () => {
    setInputText('');
  };

  useEffect(() => {
    if (!isOmitWords) {
      setDisplayString(inputText);
    } else {
      const listOfWords = inputText.split(' ');
      const filteredWords = listOfWords.filter(
        (word) => !OMITTED_WORDS.includes(word)
      );
      setDisplayString(filteredWords.join(' '));
    }
  }, [inputText, isOmitWords]);

  return (
    <div className='omitter-wrapper'>
      <textarea
        placeholder='Type here...'
        value={inputText}
        onChange={handleInputChange}
        data-testid='input-area'
      />
      <div>
        <button
          onClick={toggleOmitWords}
          data-testid='action-btn'
        >
          {isOmitWords ? 'Show All Words' : 'Omit Words'}
        </button>
        <button
          onClick={clearFields}
          data-testid='clear-btn'
        >
          Clear
        </button>
      </div>
      <div>
        <h2>Output:</h2>
        <p data-testid='output-text'>{displayString}</p>
      </div>
    </div>
  );
}

export { WordOmitter };
