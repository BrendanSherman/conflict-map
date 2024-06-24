import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import axios from 'axios';

function EventLayer() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await axios.get('http://localhost:8000/events');
                const geojson = {
                    type: 'FeatureCollection',
                    features: response.data.map(event => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [event.longitude, event.latitude]
                        },
                        properties: {
                            id: event.id,
                            type: event.type
                        }
                    }))
                };
                setEvents(geojson)
            } catch (error) {
                console.error("Failed to fetch events from backend:", error)
            }
        }
        fetchEvents();
    }, []);

    return (
        <Source id="events" type="geojson" data={events}>
            <Layer
                id="event-layer"
                type="circle"
                paint={{
                    'circle-radius': 4,
                    'circle-color': '#007cbf'
                }}
            />
        </Source>
    );
}

export default EventLayer;