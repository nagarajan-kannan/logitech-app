import React, { memo } from 'react';
import PropTypes from 'prop-types';

function BooksTable(props) {

    // Props from the parent component
    const { rows, isReversed } = props;

    /* Render the JSX elements */
    return (
        <div className='books-wrapper'>
            <div className={`book-header ${isReversed ? 'row-reversed' : ''}`}>
                <span className='text-center'>Count</span>
                <span>Amount</span>
                <span>Total</span>
                <span>Price</span>
            </div>
            <div className='books-rows'>
                {rows.map((row, index) => (
                    <div className={`book-row ${isReversed ? 'row-reversed' : ''}`} key={`book-row${index}`}>
                        <span className='text-center'>{row.count}</span>
                        <span>{row.amount}</span>
                        <span>{row.total}</span>
                        <span>{row.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default memo(BooksTable);

BooksTable.propTypes = {
    rows: PropTypes.array,
    isReversed: PropTypes.bool
};

BooksTable.defaultProps = {
    rows: [],
    isReversed: false
};
