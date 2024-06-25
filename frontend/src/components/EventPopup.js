import React from 'react';
import { Popup } from 'react-map-gl';
import './EventPopup.css';

function EventPopup({ event, onClose }) {
    // Store parsed latitude and longitutdes in event properties explicitly */
    const latitude = parseFloat(event.latitude);
    const longitude = parseFloat(event.longitude);

    // Handle missing/invalid data
    if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid latitude or longitude:", event);
        return null;
    }

    return (
        <Popup
            latitude= {latitude}
            longitude= {longitude}
            onClose= {onClose}
            closeButton={true}
            closeOnClick={false}
            offsetTop={-10}
            className='event-popup'
        >
            <div className="event-popup-content">
                <h3 className="event-type">{event.type || 'Unknown Event Type'}</h3>
                <div className="event-details">
                    <p><strong>Date:</strong> {event.date || 'Unknown Date'}</p>
                    <p><strong>Location:</strong> {event.location || 'Unknown Location'}</p>
                    {<p><strong>Fatalities:</strong> {event.fatalities || 'none confirmed'}</p>}
                    {<p><strong>Source:</strong> {event.source}</p>}
                </div>
                {event.notes && (
                <div className="event-notes">
                    <h4>Additional Notes:</h4>
                    <p>{event.notes}</p>
                </div>
                )}
            </div>
        </Popup>
    );
}

export default EventPopup;