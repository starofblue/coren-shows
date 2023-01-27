import React from 'react';
import NavBar from './NavBar.js';
import Collection from './Collection.js';
import Filter from './Filter.js';
import SearchBox from './SearchBox.js';
import DatabaseService from './DatabaseService.js';
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
      selectedStatus: null,
      searchText: ''
    };
  }

  componentDidMount() {
    // The description for the page is in a separate text file so that Coren can update it at will
    fetch('/description.txt')
     .then(response => response.text())
     .then(text => this.setState({ description: text }));

    DatabaseService.loadShows()
      .then(shows => {
        this.setState({
          shows: shows,
          // Once the shows are loaded, we can aggregate from them the genres, tags, and streaming services
          genreOptions: DatabaseService.getAllGenres(),
          tagOptions: DatabaseService.getAllTags(),
          streamingOptions: DatabaseService.getAllStreaming()
        });
      });

    DatabaseService.loadTagColors()
      .then(tagColors => this.setState({ tagColors: tagColors }));
  }

  selectGenre = (newGenre) => {
    const shows = DatabaseService.getShows(newGenre, this.state.selectedTag, this.state.selectedStreaming, this.state.selectedStatus, this.state.searchText);
    this.setState({ shows: shows, selectedGenre: newGenre });
  }

  selectTag = (newTag) => {
    const shows = DatabaseService.getShows(this.state.selectedGenre, newTag, this.state.selectedStreaming, this.state.selectedStatus, this.state.searchText)
    this.setState({ shows: shows, selectedTag: newTag });
  }

  selectStatus = (newStatus) => {
    const shows = DatabaseService.getShows(this.state.selectedGenre, this.state.selectedTag, this.state.selectedStreaming, newStatus, this.state.searchText)
    this.setState({ shows: shows, selectedStatus: newStatus });
  }

  selectStreaming = (newStreaming) => {
    const shows = DatabaseService.getShows(this.state.selectedGenre, this.state.selectedTag, newStreaming, this.state.selectedStatus, this.state.searchText)
    this.setState({ shows: shows, selectedStreaming: newStreaming });
  }

  updateSearch = (newText) => {
    const shows = DatabaseService.getShows(this.state.selectedGenre, this.state.selectedTag, this.state.selectedStreaming, this.state.selectedStatus, newText)
    this.setState({ shows: shows, searchText: newText });
  }

  clearFilters = () => {
    const shows = DatabaseService.getShows(null, null, null, null, '');
    this.setState({ shows: shows, selectedGenre: null, selectedTag: null, selectedStreaming: null, selectedStatus: null, searchText: '' });
  }

  selectListTab = () => {
    this.setState({ activeTab: 'list' });
  }

  selectCollectionsTab = () => {
    if (this.state.collections === null) {
      DatabaseService.loadCollections()
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
          <NavBar currentPage='about' />
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

                  <Filter
                    placeholder='Status'
                    items={['Concluded']}
                    selectedItem={this.state.selectedStatus}
                    onSelectItem={this.selectStatus}
                  />
                  {(this.state.selectedGenre || this.state.selectedTag || this.state.selectedStreaming || this.state.searchText|| this.state.selectedStatus) &&
                    <div className='clearFilters' title='Clear Filters' onClick={this.clearFilters}>
                      <img
                        className='clearFiltersImg'
                        src='https://res.cloudinary.com/dyoiajatd/image/upload/v1641244552/clear_filters_u7xfel.png'
                        alt='Clear filters'
                      />
                    </div>
                  }
                </div>
              </div>
            }
            {(this.state.activeTab === 'list' || this.state.activeTab === 'collections') && !this.state.shows &&
              <img className='spinner' src='https://res.cloudinary.com/dyoiajatd/image/upload/v1630901013/spinner_small_bleq9v.gif' alt='Spinner' />
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
                  title='blog'
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
