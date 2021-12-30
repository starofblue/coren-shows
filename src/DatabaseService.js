import initSqlJs from 'sql.js';

/**
 * The service responsible for getting data from the sqlite database that constitutes the backend of this application.
 */
class DatabaseService {
  dbURL = '/corenshows.db'

  constructor() {
    this.showList = [];
    this.showByName = {};  // convenient lookup table
    this.collectionList = [];

    this.databasePromise = this.loadDatabase();
  }

  async loadDatabase() {
    const SQL = await initSqlJs({ locateFile: file => `https://unpkg.com/sql.js@1.6.1/dist/${file}` });
    const cacheBreaker = Math.round(Math.random() * 100000);
    const dbfile = await fetch(`${this.dbURL}?x=${cacheBreaker}`);
    const buf = await dbfile.arrayBuffer();
    return new SQL.Database(new Uint8Array(buf));
  }

  /**
   * Loads the list of tv shows from the database.
   */
  loadShows() {
    return this.databasePromise
      .then(db => {
        const showList = [];
        const featuredShowList = [];
        const showByName = {};

        const statement = db.prepare(
          'SELECT Name, Genre, Description, Streaming, Status, Tags, IMDB, Poster, Blog, BlogTitle, Featured from Shows'
        );
        while (statement.step()) {
          const row = statement.get();
          var [name, genre, description, streaming, status, tags, imdb, poster, blog, blogtitle, featured] = row;
          const show = {name, description, status, imdb, poster, blog, blogtitle};
          show.genre = genre ? genre.split(',').map(val => val.trim()) : [];
          show.tags = tags ? tags.split(',').map(val => val.trim()) : [];
          show.streamingUrls = streaming ? streaming.split(',').map(val => val.trim()) : [];
          show.streaming = show.streamingUrls.map(url => this.mapStreamingUrlToService(url));
          show.isFeatured = (featured === 'Yes');
          if (show.isFeatured) {
            featuredShowList.push(show);
          }
          else {
            showList.push(show);
          }
          showByName[name.toLowerCase()] = show;
        }
        statement.free();

        this.shuffleArray(showList, 0);
        this.showList = featuredShowList.concat(showList);
        this.showByName = showByName;
        return this.showList;
      });
  }

  shuffleArray(array, startIndex) {
    for (let i = array.length - 1; i > startIndex; i--) {
        const j = Math.floor(Math.random() * (i + 1 - startIndex)) + startIndex;
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Loads the tag colors from the database.
   * Return value is a simple dictionary from tag name to hex color.
   */
  loadTagColors() {
    return this.databasePromise
      .then(db => {
        let tagColors = {};

        const statement = db.prepare('SELECT Name, HexColor from Tags');
        while (statement.step()) {
          const row = statement.get();
          var [tag, hexColor] = row;
          tagColors[tag] = hexColor;
        }
        statement.free();

        return tagColors;
      });
  }

  /**
   * Loads the collections from the database.
   * Assumes the TV shows have already been loaded.
   */
  loadCollections() {
    return this.databasePromise
      .then(db => {
        const collectionList = [];

        const statement = db.prepare('SELECT Name, Description, ShowList from Collections');
        while (statement.step()) {
          const row = statement.get();
          var [name, description, showList] = row;
          let collection = {name, description};
          const showNames = showList.split(',');
          collection.showList = showNames
            .map(showName => this.showByName[showName.trim().toLowerCase()])
            .filter(show => !!show);
          collectionList.push(collection);
        }
        statement.free();

        this.collectionList = collectionList;
        return collectionList;
      });
  }

  /**
   * Gets the TV shows matching the requested genre, tag, streaming service and search text.
   */
  getShows(genre, tag, streaming, searchText) {
    let filteredData = this.showList;
    if (genre) {
      filteredData = filteredData.filter(show => show.genre.includes(genre));
    }
    if (tag) {
      filteredData = filteredData.filter(show => show.tags.includes(tag));
    }
    if (streaming) {
      filteredData = filteredData.filter(show => show.streaming.includes(streaming));
    }
    if (searchText) {
      let lowerText = searchText.toLowerCase()
      filteredData = filteredData.filter(show =>
        show.name.toLowerCase().includes(lowerText) || show.description.toLowerCase().includes(lowerText)
      );
    }
    return filteredData;
  }

  getAllGenres() {
    return this._getAllOptions('genre');
  }

  getAllTags() {
    return this._getAllOptions('tags');
  }

  getAllStreaming() {
    return this._getAllOptions('streaming');
  }

  _getAllOptions(header) {
    const optionSet = new Set();
    this.showList.forEach(show => {
      show[header].forEach(option => {
        optionSet.add(option);
      });
    });
    return Array.from(optionSet).sort();
  }

  mapStreamingUrlToService(url) {
    if (url.includes('netflix.com')) {
      return 'Netflix';
    }
    if (url.includes('hulu.com')) {
      return 'Hulu';
    }
    if (url.includes('amazon.com')) {
      return 'Amazon Prime';
    }
    if (url.includes('hbo.com')) {
      return 'HBO';
    }
    if (url.includes('hbomax.com')) {
      return 'HBO';
    }
    if (url.includes('adultswim.com')) {
      return 'Adult Swim';
    }
    if (url.includes('tv.apple.com')) {
      return 'Apple TV';
    }
    if (url.includes('cartoonnetwork.com')) {
      return 'Cartoon Network';
    }
    if (url.includes('www.cc.com')) {
      return 'Comedy Central';
    }
    if (url.includes('disneyplus.com')) {
      return 'Disney+';
    }
    if (url.includes('peacocktv.com')) {
      return 'Peacock';
    }
    if (url.includes('vrv.co')) {
      return 'VRV';
    }
    if (url.includes('youtube.com')) {
      return 'Youtube';
    }
    if (url.includes('paramountplus.com')) {
      return 'Paramount+';
    }
    if (url.includes('amc.com')) {
      return 'AMC';
    }
    if (url.includes('amcplus.com')) {
      return 'AMC';
    }
    if (url.includes('vimeo.com')) {
      return 'Vimeo';
    }
    if (url.includes('cwtv.com')) {
      return 'CW';
    }
    if (url.includes('nbc.com')) {
      return 'NBC';
    }
    return url;  // if we don't recognize it, it's probably a name and not a url
  }
}

export default new DatabaseService();
