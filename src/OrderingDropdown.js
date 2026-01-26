import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import PropTypes from 'prop-types';
import './OrderingDropdown.css';

export default class OrderingDropdown extends React.Component {
  render() {
    return (
      <DropdownButton className={'orderingDropdownMain'} variant='default' title={this.props.selectedItem}>
        <Dropdown.Item key={1} eventKey={'Newest First'} onSelect={this.props.onSelectItem}>Newest First</Dropdown.Item>
        <Dropdown.Item key={2} eventKey={'Randomized'} onSelect={this.props.onSelectItem}>Randomized</Dropdown.Item>
      </DropdownButton>
    )
  }
}

OrderingDropdown.propTypes = {
  selectedItem: PropTypes.string,
  onSelectItem: PropTypes.func.isRequired
}
