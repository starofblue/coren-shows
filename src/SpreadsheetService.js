
/**
 * The service responsible for getting data from the Google Sheets spreadsheet that constitutes the backend of this
 * application.
 */
class SpreadsheetService {
  // These are links to the various sheets of the spreadsheet
  // First, the sheet which has the information about the tv shows themselves
  showSheetURL = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/1/public/full?alt=json';
  // The sheet which lists the tags and their colours
  tagSheetURL = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/3/public/full?alt=json';
  // The sheet with any other information (like the main site description, which Coren wanted to be able to change)
  miscSheetURL = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/2/public/full?alt=json';

  constructor() {
    this.showList = [];
  }

  /**
   * Loads the list of tv shows from the spreadsheet.
   * Each show is represented by an object, where the keys of the object match the headers in the spreadsheet.
   */
  loadShows() {
    // The spreadsheet has these columns: Name, Genre, Description, Streaming, Status, Tags, IMDB, Poster
    // The order of the cells returned is like reading English, left-to-right and then top-to-bottom. So we pass over
    // the top row first, adding all of the headers to an array, and then reference those headers when processing the
    // data rows.
    return fetch(this.showSheetURL)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
        const showList = [];
        const headers = [];
        const entries = spreadsheetJSON.feed.entry;
        entries.forEach(entry => {
          let entryContents = entry.gs$cell;
          if (entryContents.row === '1') {
            headers.push(entryContents.inputValue.toLowerCase());
          }
          else {
            if (entryContents.col === '1') {
              showList.push({ genre: [], tags: [], streaming: [] });
            }
            let row = showList[showList.length - 1];
            let header = headers[Number(entryContents.col) - 1];
            if (['genre', 'tags', 'streaming'].includes(header)) {
              // These three columns store comma-separated lists, so we save them as arrays
              row[header] = entryContents.inputValue.split(',').map(val => val.trim());
            } else {
              row[header] = entryContents.inputValue;
            }
          }
        });
        this.showList = showList;
        return showList;
      });
  }

  /**
   * Loads the main page description from the spreadsheet.
   * I know, it's weird that this description isn't hardcoded, but Coren wanted to be able to change it on the fly.
   */
  loadDescription() {
    return fetch(this.miscSheetURL)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
        const entries = spreadsheetJSON.feed.entry;
        const description = entries[1].gs$cell.inputValue;
        return description;
      });
  }

  /**
   * Loads the tag colors from the spreadsheet.
   * Return value is a simple dictionary from tag name to hex color.
   */
  loadTagColors() {
    return fetch(this.tagSheetURL)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
        let tagColors = [];
        let currTag = '';
        const entries = spreadsheetJSON.feed.entry;
        entries.forEach(entry => {
          let entryContents = entry.gs$cell;
          if (entryContents.row !== '1') {
            if (entryContents.col === '1') {
              currTag = entryContents.inputValue;
            } else {
              tagColors[currTag] = entryContents.inputValue;
            }
          }
        });
        return tagColors;
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
}

export default new SpreadsheetService();
