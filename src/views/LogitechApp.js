import React from 'react';
import { OrderBook } from './order-book/OrderBook';

export function LogitechApp() {

    /* Render the JSX elements */
    return (
        <div className='container'>
            <div className='order-book-reponsive'>
                <OrderBook />
            </div>
        </div>
    );
}
