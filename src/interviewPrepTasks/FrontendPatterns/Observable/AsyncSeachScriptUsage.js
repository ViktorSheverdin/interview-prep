const Search = require('./AsyncSearchScript');

const mySearch = new Search();

mySearch.on('SEARCH_STARTED', (term) => {
  console.log(`Search started for term: "${term}"`);
});

mySearch.on('SEARCH_SUCCESS', (result) => {
  console.log(`Search successful for "${result.term}". Count: ${result.count}`);
});

mySearch.on('SEARCH_ERROR', (error) => {
  console.error(`Search error for "${error.term}": ${error.message}`);
});

console.log('--- Testing Valid Search ---');
mySearch.searchCount('javascript');

console.log('\n--- Testing API Error ---');
mySearch.searchCount('error');

console.log('\n--- Testing Invalid Term ---');
mySearch.searchCount(undefined);
