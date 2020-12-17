import React from 'react';
import PropTypes from 'prop-types';
import './toast.scss';

export function Toaster(props) {

    // Props from the parent component
    const { message, type } = props;

    /* Render the JSX elements */
    return (
        <div className={`toast-message ${type}`}>
            {message || 'No Content'}
        </div>
    );
};

Toaster.propTypes = {
    message: PropTypes.string,
    type: PropTypes.string
};
