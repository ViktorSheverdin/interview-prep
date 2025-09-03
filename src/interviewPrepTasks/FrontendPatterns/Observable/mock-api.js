const countMatches = (searchTerm) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (searchTerm === 'error') {
        return reject(new Error('API Error: Something went wrong'));
      }
      const count = Math.floor(Math.random() * 100);
      return resolve(count);
    }, 500);
  });
};

module.exports = { countMatches };
