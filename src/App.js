import React from 'react';
import Collection from './Collection.js';
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
      collections: null,
      description: '',
      tagColors: [],
      genreOptions: [],
      tagOptions: [],
      streamingOptions: [],

      activeTab: 'list',
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

  selectListTab = () => {
    this.setState({ activeTab: 'list' });
  }

  selectCollectionsTab = () => {
    if (this.state.collections === null) {
      SpreadsheetService.loadCollections()
        .then(collections => {
          this.setState({ collections: collections });
        });
    }
    this.setState({ activeTab: 'collections' });
  }

  selectReviewsTab = () => {
    this.setState({ activeTab: 'reviews' });
  }

  render() {
    return (
      <div className='wideFrame'>
        <div className='articleFrame'>
          <div className='title'>
            <img className='titlePic' src='https://res.cloudinary.com/dyoiajatd/image/upload/v1602829694/CorenTV_logo.png' alt="Coren's shows" />
            <span className='titleText'>A website where I list tv shows I like</span>
            <a className='mainBlogLink' href='https://corensreviews.blogspot.com'>TV Show Reviews</a>
          </div>
          <div className='body'>
            <div className='subtitle'>{this.state.description}</div>
            <div className='tabs'>
              <div
                className={this.state.activeTab === 'list' ? 'tab activeTab' : 'tab inactiveTab'}
                onClick={this.selectListTab}
              >
                List
              </div>
              <div
                className={this.state.activeTab === 'collections' ? 'tab activeTab' : 'tab inactiveTab'}
                onClick={this.selectCollectionsTab}
              >
                Collections
              </div>
              <div
                className={this.state.activeTab === 'reviews' ? 'tab activeTab reviewsTab' : 'tab inactiveTab reviewsTab'}
                onClick={this.selectReviewsTab}
              >
                Reviews
              </div>
              {this.state.activeTab === 'list' && this.state.shows != null &&
                <div className='showCount'>Total Shows: {this.state.shows.length}</div>
              }
            </div>
            {this.state.activeTab === 'list' &&
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
            }
            {this.state.activeTab === 'list' &&
              <div className='tvShowList'>
                {this.state.shows && this.state.shows.map((show) =>
                  <TVShow show={show} tagColors={this.state.tagColors} />
                )}
              </div>
            }
            {this.state.activeTab === 'collections' &&
              <div className='collectionList'>
                {this.state.collections && this.state.collections.map((collection) =>
                  <Collection collection={collection} tagColors={this.state.tagColors} />
                )}
              </div>
            }
            {this.state.activeTab === 'reviews' &&
              <div className='iframeWrapper'>
                <iframe
                  className='iframe'
                  src='https://corensreviews.blogspot.com/'
                />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
