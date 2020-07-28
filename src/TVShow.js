import React from 'react';
import PropTypes from 'prop-types';
import './TVShow.css';

export default class TVShow extends React.Component {

  render() {
    return (
      <div className='tvShow' key={this.props.show.name}>
        <div className='mainRow'>
          <img className='poster' src={this.props.show.poster} alt='Poster' />
          <div className='upperProperties'>
            <a className='showTitle' href={this.props.show.imdb}>{this.props.show.name}</a>
            <div className='genre'>Genre: {this.props.show.genre.join(', ')}</div>
            {this.props.show.tags.length > 0 &&
              <div className='tags'>
                Tags:
                <div className='tagBox'>
                  {this.props.show.tags.map((tag, tagIndex) =>
                    <div
                      className={ tag.includes('LGBT') ? 'rainbow tag' : 'tag' }
                      key={tagIndex}
                      style={ tag.includes('LGBT') ? {} : { backgroundColor: this.props.tagColors[tag] }}
                    >
                      {tag}
                    </div>
                  )}
                </div>
              </div>
            }
          </div>
          <div className='lowerProperties'>
            <div className='description'>
              {this.props.show.description}
            </div>
            <div className='status'>
              <span className='bold'>Status: </span>{this.props.show.status}
            </div>
            <div className='streaming'>
              <span className='bold'>Where to watch: </span>{this.props.show.streaming.join(', ')}
            </div>
          </div>
        </div>
        <hr className='hr' />
      </div>
    )
  }
}

TVShow.propTypes = {
  show: PropTypes.shape({
    description: PropTypes.string.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    imdb: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    streaming: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  tagColors: PropTypes.object.isRequired
}
