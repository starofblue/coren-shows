import React from 'react';
import PropTypes from 'prop-types';
import './NavBar.css';

export default class NavBar extends React.Component {
  render() {
    const titlePicUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674792523/logo_hndsk9.png';
    const questionMarkUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674792523/questionMark_eqx6hr.png';
    const questionMarkSelectedUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674796636/questionMarkSelected_r8fshi.png';
    const instagramUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674792523/instagram_zuaubj.png';
    const playUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674792523/play_orhuci.png';
    const playSelectedUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674796636/playSelected_ypgfho.png';
    const personUrl = 'https://res.cloudinary.com/dyoiajatd/image/upload/v1674792523/person_f6eitm.png';

    console.log(this.props.currentPage);

    return (
      <div className='navBar'>
        <img className='titlePic' src={titlePicUrl} alt="Coren's shows" />
        <a
          className={this.props.currentPage === 'about' ? 'currentNav' : 'navButton'}
          href={this.props.currentPage === 'about' ? null : 'https://instagram.com/coren.tv?utm_medium=copy_link'}
        >
          <img
            className='navButtonPic'
            src={this.props.currentPage === 'about' ? questionMarkSelectedUrl : questionMarkUrl}
            alt='question mark'
          />
          <span className='navButtonText'>About</span>
        </a>

        <a className='navButton' href='https://instagram.com/coren.tv?utm_medium=copy_link'>
          <img className='navButtonPic' src={instagramUrl} alt='instagram logo' />
          <span className='navButtonText'>Follow</span>
        </a>

        <a
          className={this.props.currentPage === 'watchlist' ? 'currentNav' : 'navButton'}
          href={this.props.currentPage === 'watchlist' ? null : 'https://instagram.com/coren.tv?utm_medium=copy_link'}
        >
          <img
            className='navButtonPic'
            src={this.props.currentPage === 'watchlist' ? playSelectedUrl : playUrl}
            alt='play button'
          />
          <span className='navButtonText'>My Watchlist</span>
        </a>

        <a className='navButton' href='https://instagram.com/coren.tv?utm_medium=copy_link'>
          <img className='navButtonPic' src={personUrl} alt='person icon' />
          <span className='navButtonText'>Log In</span>
        </a>
      </div>
    )
  }
}

NavBar.propTypes = {
  currentPage: PropTypes.string
}
