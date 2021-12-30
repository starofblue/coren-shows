import React from 'react';
import PropTypes from 'prop-types';
import DatabaseService from './DatabaseService.js';
import './WatchSection.css';

export default class WatchSection extends React.Component {

  renderWatchButton = (source) => {
    const serviceName = DatabaseService.mapStreamingUrlToService(source);
    const imageUrl = this.getImageUrl(serviceName);
    if (imageUrl == null) {
      return (<div />);
    }

    var text = 'Watch On';
    if (serviceName === 'Vimeo') {
      text = 'Buy On';
    }

    return (
      <a className='watchOnButton' href={source}>
        <span className='watchOnText'>{text}</span>
        <img className='watchOnImg' alt={serviceName} src={imageUrl} />
      </a>
    )
  }

  getImageUrl = (serviceName) => {
    if (serviceName === 'Netflix') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640570310/netflix_bxchkc.png';
    }
    if (serviceName === 'Hulu') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640567688/hulu_njslwv.png';
    }
    if (serviceName === 'Amazon Prime') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640565426/primevideo_qtlyik.png';
    }
    if (serviceName === 'HBO') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640570182/hbo_lvrmsn.png';
    }
    if (serviceName === 'Adult Swim') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640566364/adultswim_j8bepb.png';
    }
    if (serviceName === 'Apple TV') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640567140/appletv_n0eafp.png';
    }
    if (serviceName === 'Cartoon Network') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640569795/cartoonnetwork_noqcoh.png'
    }
    if (serviceName === 'Comedy Central') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640568036/comedycentral_jdju35.png'
    }
    if (serviceName === 'Disney+') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640568286/disneyplus_za5lsn.png';
    }
    if (serviceName === 'Peacock') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640568765/peacock_qei36t.png';
    }
    if (serviceName === 'VRV') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640569232/vrv_pym89s.png';
    }
    if (serviceName === 'Youtube') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640569704/youtube_kl7eoj.png';
    }
    if (serviceName === 'Paramount+') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640634152/paramount_lqxi73.png';
    }
    if (serviceName === 'AMC') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640634546/amc_x6lsof.png';
    }
    if (serviceName === 'Vimeo') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640833937/vimeo_qnh8vb.png';
    }
    if (serviceName === 'CW') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640834104/thecw_rdaq2p.png';
    }
    if (serviceName === 'NBC') {
      return 'https://res.cloudinary.com/dyoiajatd/image/upload/v1640834380/nbc_zemqc5.png';
    }
    return null;
  }

  render() {
    if (this.props.sources.some(source => source.startsWith('http'))) {
      return (
        <div className='watchOnBox'>
          {this.props.sources.map((source) => this.renderWatchButton(source))}
        </div>
      )
    }

    else return (
      <div>
        <span className='bold'>Where to watch: </span>{this.props.sources.join(', ')}
      </div>
    )
  }
}

WatchSection.propTypes = {
  sources: PropTypes.array.isRequired
}
