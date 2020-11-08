import React from 'react';
import PropTypes from 'prop-types';
import TVShow from './TVShow.js';
import './Collection.css';

export default class Collection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCollapsed: true };
  }

  toggleCollapse = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const showCount = this.props.collection.showList.length;
    const useSmallTiles = (showCount >= 9);
    const tileClass = useSmallTiles ? 'smallPosterTile' : 'largePosterTile';
    const hiddenTilesCount = useSmallTiles ? showCount - 8 : showCount - 3;
    const tilesToShow = this.props.collection.showList.slice(0, showCount - hiddenTilesCount);

    return (
      <div className={this.state.isCollapsed ? 'collection' : 'collection selectedCollection'} key={this.props.collection.name}>
        <div className='collectionBody'>
          <div className='posterMontage'>
            {tilesToShow.map((show) =>
              <img className={tileClass} src={show.poster} alt='Poster' />
            )}
            {hiddenTilesCount > 0 &&
              <div className={tileClass + ' moreTile'}>
                <div className='moreText'>{'+' + hiddenTilesCount + ' more'}</div>
              </div>
            }
          </div>
          <div className='collectionTitle'>{this.props.collection.name}</div>
          <div className='collectionDescription'>
            {this.props.collection.description}
          </div>
          <div className='collapseButton' onClick={this.toggleCollapse}>
            {this.state.isCollapsed ? 'Show ' + showCount + ' shows' : 'Collapse shows'}
            <div className={this.state.isCollapsed ? 'downCaret' : 'upCaret'}></div>
          </div>
        </div>
        {!this.state.isCollapsed &&
          <div className='collectionShowBox'>
            {this.props.collection.showList.map((show) =>
              <TVShow show={show} tagColors={this.props.tagColors} />
            )}
          </div>
        }
      </div>
    )
  }
}

Collection.propTypes = {
  collection: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    showList: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  tagColors: PropTypes.object.isRequired
}
