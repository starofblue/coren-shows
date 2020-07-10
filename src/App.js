import React from 'react';
import Filter from './Filter.js';
import SearchBox from './SearchBox.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      description: '',
      tagColors: [],
      selectedGenre: null,
      selectedTag: null,
      selectedStreaming: null,
      searchText: ''
    };
  }

  componentDidMount() {
    let showSheet = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/1/public/full?alt=json';
    let miscSheet = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/2/public/full?alt=json';
    let tagSheet = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/3/public/full?alt=json';
    let data = [];
    let headers = [];
    let tagColors = [];
    let currTag = '';

    fetch(miscSheet)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
        const entries = spreadsheetJSON.feed.entry;
        const description = entries[1].gs$cell.inputValue;
        this.setState({ description: description });
      });

    fetch(showSheet)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
        const entries = spreadsheetJSON.feed.entry;
        entries.forEach(entry => {
          let entryContents = entry.gs$cell;
          if (entryContents.row === '1') {
            headers.push(entryContents.inputValue.toLowerCase());
          }
          else {
            if (entryContents.col === '1') {
              data.push({ genre: [], tags: [], streaming: [] });
            }
            let row = data[data.length - 1];
            let header = headers[Number(entryContents.col) - 1];
            if (['genre', 'tags', 'streaming'].includes(header)) {
              row[header] = entryContents.inputValue.split(',').map(val => val.trim());
            } else {
              row[header] = entryContents.inputValue;
            }
          }
        })
        this.setState({ data: data });
      })
      .catch(err => { throw err });  // TODO show a nice error message

    fetch(tagSheet)
      .then(res => res.json())
      .then((spreadsheetJSON) => {
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
        this.setState({ tagColors: tagColors });
      });
  }

  selectGenre = (newGenre) => {
    this.setState({ selectedGenre: newGenre });
  }

  selectTag = (newTag) => {
    this.setState({ selectedTag: newTag });
  }

  selectStreaming = (newStreaming) => {
    this.setState({ selectedStreaming: newStreaming });
  }

  updateSearch = (newText) => {
    this.setState({ searchText: newText });
  }

  render() {
    const genreSet = new Set();
    const tagSet = new Set();
    const streamingServiceSet = new Set();
    this.state.data.forEach(show => {
      show.genre.forEach(genre => {
        genreSet.add(genre);
      });
      show.tags.forEach(tag => {
        tagSet.add(tag);
      });
      show.streaming.forEach(streaming => {
        streamingServiceSet.add(streaming);
      });
    });
    const genres = Array.from(genreSet).sort();
    const tags = Array.from(tagSet).sort();
    const streamingServices = Array.from(streamingServiceSet).sort();

    let filteredData = this.state.data;
    if (this.state.selectedGenre) {
      filteredData = filteredData.filter(show => show.genre.includes(this.state.selectedGenre));
    }
    if (this.state.selectedTag) {
      filteredData = filteredData.filter(show => show.tags.includes(this.state.selectedTag));
    }
    if (this.state.selectedStreaming) {
      filteredData = filteredData.filter(show => show.streaming.includes(this.state.selectedStreaming));
    }
    if (this.state.searchText) {
      let lowerText = this.state.searchText.toLowerCase()
      filteredData = filteredData.filter(show => show.name.toLowerCase().includes(lowerText) || show.description.toLowerCase().includes(lowerText));
    }

    return (
      <div className='wideFrame'>
      <div className='articleFrame'>
        <div className='title'>
          <img className='titlePic' src='https://res.cloudinary.com/dyoiajatd/image/upload/v1593892976/coren_s_shows_hlak3u.svg' alt="Coren's shows" />
          <span className='titleText'>A website where I list tv shows I like</span>
        </div>
        <div className='body'>
          <div className='subtitle'>{this.state.description}</div>
          <div className='filterBox'>
            <div className='filterLabel'>Filter by:</div>
            <div className='outerSearchBox'>
              <SearchBox content={this.state.searchText} onUpdate={this.updateSearch} />
            </div>
            <div className='dropdowns'>
              <Filter
                placeholder='Genre'
                items={genres}
                selectedItem={this.state.selectedGenre}
                onSelectItem={this.selectGenre}
              />
              <Filter
                placeholder='Tags'
                items={tags}
                selectedItem={this.state.selectedTag}
                onSelectItem={this.selectTag}
              />
              <Filter
                placeholder='Streaming'
                items={streamingServices}
                selectedItem={this.state.selectedStreaming}
                onSelectItem={this.selectStreaming}
              />
            </div>
          </div>
          <div className='tvShowList'>
            {filteredData.map((show, index) =>
              <div className='tvShow' key={index}>
                <div className='mainRow'>
                  <img className='poster' src={show.poster} alt='Poster' />
                  <div className='upperProperties'>
                    <a className='showTitle' href={show.imdb}>{show.name}</a>
                    <div className='genre'>Genre: {show.genre.join(', ')}</div>
                    {show.tags.length > 0 &&
                      <div className='tags'>
                        Tags:
                        <div className='tagBox'>
                          {show.tags.map((tag, tagIndex) =>
                            <div
                              className={ tag.includes('LGBT') ? 'tag rainbow' : 'tag' }
                              key={tagIndex}
                              style={ tag.includes('LGBT') ? {} : { backgroundColor: this.state.tagColors[tag] }}
                            >
                              {tag}
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  </div>
                  <div className='lowerProperties'>
                    <div className='description'>{show.description}</div>
                    <div className='status'><span className='bold'>Status: </span>{show.status}</div>
                    <div className='streaming'><span className='bold'>Where to watch: </span>{show.streaming.join(', ')}</div>
                  </div>
                </div>
                <hr className='hr' />
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default App;
