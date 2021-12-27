import React from 'react';
import PropTypes from 'prop-types';
import './TVShow.css';
import WatchSection from './WatchSection.js';

export default class TVShow extends React.Component {

  render() {
    return (
      <div>
        { (this.props.show.isFeatured && !this.props.ignoreFeaturedShow) &&
          <div className='featuredShowBox'>FEATURED SHOW</div>
        }
        <div
          className={ this.props.show.isFeatured && !this.props.ignoreFeaturedShow ? 'highlighted tvShow' : 'tvShow'}
          key={this.props.show.name}
        >
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
              {this.props.show.blog &&
                <a className='blogLink' href={this.props.show.blog}>
                  <img className='blogPic' src='https://res.cloudinary.com/dyoiajatd/image/upload/v1602568075/blogger_icon.png' alt='Blogger' />
                  <div className='blogStaticText'>Read blog post:</div>
                  <div className='blogDynamicText'>{this.props.show.blogtitle}</div>
                </a>
              }
              <div className='description'>
                {this.props.show.description}
              </div>
              <div className='status'>
                <span className='bold'>Status: </span>{this.props.show.status}
              </div>
              <div className='streaming'>
                <WatchSection sources={this.props.show.streamingUrls} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

TVShow.propTypes = {
  show: PropTypes.shape({
    blog: PropTypes.string,
    blogtitle: PropTypes.string,
    description: PropTypes.string.isRequired,
    genre: PropTypes.arrayOf(PropTypes.string).isRequired,
    imdb: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    streaming: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    isFeatured: PropTypes.bool.isRequired
  }).isRequired,
  tagColors: PropTypes.object.isRequired,
  ignoreFeaturedShow: PropTypes.bool
}
