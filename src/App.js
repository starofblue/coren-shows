import React from 'react';
import Filter from './filter.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedGenre: null,
      selectedTag: null,
      selectedStreaming: null
    };
  }

  componentDidMount() {
    let url = 'https://spreadsheets.google.com/feeds/cells/18PQLpof18w3cdDLeGKfBrQy7eDfvE15_BJVglDyZiug/1/public/full?alt=json';
    let data = [];
    let headers = [];

    fetch(url)
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
              data.push(Object());
            }
            let row = data[data.length - 1];
            let header = headers[Number(entryContents.col) - 1];
            row[header] = entryContents.inputValue;
          }
        })
        this.setState({ data: data });
      })
      .catch(err => { throw err });  // TODO show a nice error message
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

  render() {
    const genreSet = new Set();
    this.state.data.forEach(show => {
      show.genre.split(',').forEach(genre => {
        genreSet.add(genre.trim());
      })
    });
    const genres = Array.from(genreSet).sort();

    const tagSet = new Set();
    this.state.data.forEach(show => {
      show.tags.split(',').forEach(tag => {
        tagSet.add(tag.trim());
      })
    });
    const tags = Array.from(tagSet).sort();

    const streamingServiceSet = new Set();
    this.state.data.forEach(show => {
      show.streaming.split(',').forEach(streaming => {
        streamingServiceSet.add(streaming.trim());
      })
    });
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

    return (
      <div className='mainFrame'>
        <div className='title'>
          <img className='titlePic' src='https://res.cloudinary.com/dyoiajatd/image/upload/v1593892976/coren_s_shows_hlak3u.svg' alt="Coren's shows" />
          A website where I list TV shows I like
        </div>
        <div className='body'>
          <div className='subtitle'>I have personally watched every show listed, so you can rest assured that the quality of this content has been properly vetted.</div>
          <div className='subtitle'>Filter by genre, tags, or availability on streaming services to find your next show.</div>
          <div className='subtitle'>Happy watching!</div>
          <div className='filterBox'>
            <div className='filterLabel'>Filter by:</div>
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
          <div className='tvShowList'>
            {filteredData.map((show, index) =>
              <div className='tvShow' key={index}>
                <div className='mainRow'>
                  <img className='thumbnail' src={show.imageurl} alt='Show thumbnail' />
                  <div className='mainDetails'>
                    <div className='showTitle'>{show.name}</div>
                    <div className='genre'>Genre: {show.genre}</div>
                    <div className='tags'>Tags: {show.tags}</div>
                  </div>
                </div>
                <div className='description'>{show.description}</div>
                <div className='status'><span className='bold'>Status: </span>{show.status}</div>
                <div className='streaming'><span className='bold'>Where to watch: </span>{show.streaming}</div>
                <hr className='hr' />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
