import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PropTypes from 'prop-types';
import './filter.css';

export default class Filter extends React.Component {
  render() {
    return (
      <DropdownButton id={this.props.title} variant='default' title={this.props.selectedItem || this.props.placeholder}>
        <Dropdown.Item key={-1} eventKey={null} onSelect={this.props.onSelectItem}>--</Dropdown.Item>
        {this.props.items.map((item, index) =>
          <Dropdown.Item key={index} eventKey={item} onSelect={this.props.onSelectItem}>{item}</Dropdown.Item>
        )}
      </DropdownButton>
    )
  }
}

Filter.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItem: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  onSelectItem: PropTypes.func.isRequired
}
