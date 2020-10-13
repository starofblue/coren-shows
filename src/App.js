import React from 'react';
import Filter from './Filter.js';
import SearchBox from './SearchBox.js';
import SpreadsheetService from './SpreadsheetService.js';
import TVShow from './TVShow.js';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shows: null,
      description: '',
      tagColors: [],
      genreOptions: [],
      tagOptions: [],
      streamingOptions: [],

      selectedGenre: null,
      selectedTag: null,
      selectedStreaming: null,
      searchText: ''
    };
  }

  componentDidMount() {
    SpreadsheetService.loadShows()
      .then(shows => {
        this.setState({
          shows: shows,
          // Once the shows are loaded, we can aggregate from them the genres, tags, and streaming services
          genreOptions: SpreadsheetService.getAllGenres(),
          tagOptions: SpreadsheetService.getAllTags(),
          streamingOptions: SpreadsheetService.getAllStreaming()
        });
      });

    SpreadsheetService.loadDescription()
      .then(description => this.setState({ description: description }));

    SpreadsheetService.loadTagColors()
      .then(tagColors => this.setState({ tagColors: tagColors }));
  }

  selectGenre = (newGenre) => {
    const shows = SpreadsheetService.getShows(newGenre, this.state.selectedTag, this.state.selectedStreaming, this.state.searchText);
    this.setState({ shows: shows, selectedGenre: newGenre });
  }

  selectTag = (newTag) => {
    const shows = SpreadsheetService.getShows(this.state.selectedGenre, newTag, this.state.selectedStreaming, this.state.searchText)
    this.setState({ shows: shows, selectedTag: newTag });
  }

  selectStreaming = (newStreaming) => {
    const shows = SpreadsheetService.getShows(this.state.selectedGenre, this.state.selectedTag, newStreaming, this.state.searchText)
    this.setState({ shows: shows, selectedStreaming: newStreaming });
  }

  updateSearch = (newText) => {
    const shows = SpreadsheetService.getShows(this.state.selectedGenre, this.state.selectedTag, this.state.selectedStreaming, newText)
    this.setState({ shows: shows, searchText: newText });
  }

  render() {
    return (
      <div className='wideFrame'>
        <div className='articleFrame'>
          <div className='title'>
            <img className='titlePic' src='https://res.cloudinary.com/dyoiajatd/image/upload/v1593892976/coren_s_shows_hlak3u.svg' alt="Coren's shows" />
            <span className='titleText'>A website where I list tv shows I like</span>
          </div>
          <div className='body'>
            <div className='subtitle'>{this.state.description}</div>
            <div className='countRow'>
              {this.state.shows != null &&
                <div className='showCount'>Total Shows: {this.state.shows.length}</div>
              }
            </div>
            <div className='filterBox'>
              <div className='filterLabel'>Filter by:</div>
              <div className='outerSearchBox'>
                <SearchBox content={this.state.searchText} onUpdate={this.updateSearch} />
              </div>
              <div className='dropdowns'>
                <Filter
                  placeholder='Genre'
                  items={this.state.genreOptions}
                  selectedItem={this.state.selectedGenre}
                  onSelectItem={this.selectGenre}
                />
                <Filter
                  placeholder='Tags'
                  items={this.state.tagOptions}
                  selectedItem={this.state.selectedTag}
                  onSelectItem={this.selectTag}
                />
                <Filter
                  placeholder='Streaming'
                  items={this.state.streamingOptions}
                  selectedItem={this.state.selectedStreaming}
                  onSelectItem={this.selectStreaming}
                />
              </div>
            </div>
            <div className='tvShowList'>
              {this.state.shows && this.state.shows.map((show) =>
                <TVShow show={show} tagColors={this.state.tagColors} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
