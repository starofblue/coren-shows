import React from 'react';
import PropTypes from 'prop-types';
import './SearchBox.css';

export default class SearchBox extends React.Component {
  userTextChange = (event) => {
    this.props.onUpdate(event.target.value);
  }

  clearSearchBox = () => {
    this.props.onUpdate('');
  }

  render() {
    const magnifyingGlassUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1594348945/magnifying_glass.png';
    const clearIconUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1594349400/x_icon.png';

    return (
      <div className='searchBox'>
        <input
          className='searchInput'
          placeholder='Search'
          value={this.props.content}
          type='text'
          onChange={this.userTextChange}
        />
        <img
          className={this.props.content ? 'clearIcon' : 'searchIcon'}
          alt='magnifying glass'
          src={this.props.content ? clearIconUrl : magnifyingGlassUrl}
          onClick={this.clearSearchBox}
        />
      </div>
    )
  }
}

SearchBox.propTypes = {
  content: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired
}
