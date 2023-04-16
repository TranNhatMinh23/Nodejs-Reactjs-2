import React, { Component } from 'react';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input
} from 'reactstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class SearchInput extends Component {
    render() {
        return (
            <InputGroup id="search-content" style={{'--width': this.props.width}}>
                <Input 
                    placeholder={this.props.placeholder} 
                    style={{
                        borderColor: this.props.color, 
                        color: this.props.color, 
                        fontWeight: this.props.fontWeight,
                        '--placeholderColor': this.props.color,
                    }} 
                />
                <InputGroupAddon addonType="append">
                    <InputGroupText style={{border: `1px solid ${this.props.color}`}}>
                        <div style={{background: this.props.color}}><FontAwesomeIcon color="#fff" icon={faSearch} /></div>
                    </InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        );
    }
}

SearchInput.propTypes = {
    color: PropTypes.string,
    placeholder: PropTypes.string,
    fontWeight: PropTypes.string,
    width: PropTypes.string,
};

SearchInput.defaultProps = {
    color: '#47495f',
    placeholder: '',
    fontWeight: '600',
    width: '400px'
}

export default SearchInput;
