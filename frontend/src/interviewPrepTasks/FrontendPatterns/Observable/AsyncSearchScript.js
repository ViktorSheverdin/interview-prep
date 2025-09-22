const EventEmitter = require('events');
const { countMatches } = require('./mock-api');

class Search extends EventEmitter {
  constructor() {
    super();
  }
  async searchCount(searchTerm) {
    if (searchTerm === undefined) {
      this.emit('SEARCH_ERROR', {
        message: 'INVALID_TERM',
      });
      return;
    }
    this.emit('SEARCH_STARTED', searchTerm);

    try {
      const res = await countMatches(searchTerm);
      this.emit('SEARCH_SUCCESS', {
        term: searchTerm,
        count: res,
      });
    } catch (err) {
      this.emit('SEARCH_ERROR', {
        message: err.message,
        term: searchTerm,
      });
    }
  }
}

module.exports = Search;
