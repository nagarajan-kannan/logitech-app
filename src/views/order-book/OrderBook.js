import React, { useEffect, useState } from 'react';
import { Toaster } from 'library';
import { default as BooksTable } from './BooksTable';
import './order-book.scss';

export function OrderBook() {

    // States for the component
    const [bookData, setBookData] = useState({ green: [], red: [] });
    const [toastConfig, setToastConfig] = useState();
    const setBackupData = useState([])[1];

    /* Hook to handle function on component did mount */
    useEffect(() => {

        function startStreaming() {
            // Create socket instance
            const socket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

            // Establish socket connection
            socket.onopen = () => {

                socket.send(JSON.stringify({
                    event: 'subscribe', channel: 'book', symbol: 'tBTCUSD'
                })); // Subscribe book event from socket

                showToast('Websocket connection is now online', 'success');
            };

            // Throw error in toast, if any
            socket.onerror = () => {
                showToast('Websocket encountered error', 'error', false);
            };

            socket.onclose = () => {
                showToast('Websocket connection is now offline', 'error', false);
            };

            // Message event to get the stream
            socket.onmessage = ({ data }) => {
                data = JSON.parse(data);

                if (Array.isArray(data)) {
                    prepareData(data?.[1]);
                }
            };

            // Event to handle the online and offline streaming
            const handleOnline = () => startStreaming();
            const handleOffline = () => socket.onclose();

            window.addEventListener('online', handleOnline);
            window.addEventListener('offline', handleOffline);
        }

        startStreaming(); // Initiate socket streaming

    }, []);

    /* Handler to prepare the order book data */
    const prepareData = (data) => {

        setBackupData(backupData => {

            if (backupData.length) {
                // Keep the data as 50 by removing the old and add the new one
                backupData.pop();
                backupData.unshift(formatData(data));
            } else {
                // Assign the first 50 rows directly
                backupData = data.map(t => formatData(t));
            }

            // Since, there is no clarity about the green and red block data's splitting the rows and pushing it as 2 segments
            setBookData(
                { green: backupData.slice(0, 25), red: backupData.slice(25, 50) }
            );

            return backupData;
        });
    };

    /* Handler for format the data */
    const formatData = (data) => {
        const dataObject = {};

        data.forEach((item, i) => {
            if (i === 0) {
                dataObject.price = item;
            } else if (i === 1) {
                dataObject.count = item;
            } else {
                dataObject.amount = dataObject.total = Number(item).toPrecision(5);
            }
        });

        return dataObject;
    };

    /* Handle to show and destroy the toast */
    const showToast = (message, type, autoClose = true) => {
        setToastConfig({ message: message, type: type });

        if (autoClose) {
            setTimeout(() => setToastConfig(null), 5 * 1000);
        }
    }

    /* Render the JSX elements */
    return (
        <>
            <div className='orderbook-wrapper'>
                <div className='header-block'>
                    <h5>Order Book <span>Btc/Usd</span></h5>
                </div>
                <div className='content-block'>
                    <BooksTable rows={bookData.green} />
                    <BooksTable rows={bookData.red} isReversed={true} />
                </div>
                <div className='footer-block'>
                    <h6 className='full-book-button'>Full Book</h6>
                    <h6 className='real-time-button'>Real-Time</h6>
                </div>
            </div>

            {toastConfig && <Toaster message={toastConfig.message} type={toastConfig.type} />}
        </>
    );
}
