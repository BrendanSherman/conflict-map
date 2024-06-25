import React, { useEffect, useState } from 'react';
import { Source, Layer } from 'react-map-gl';
import axios from 'axios';

function EventLayer({ onClick }) {
    const [events, setEvents] = useState(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                // Fetch raw API data and log for debugging
                const response = await axios.get('http://localhost:8000/events');
                console.log("API raw data:", response.data)

                // Convert data into geoJSON format
                const geojson = {
                    type: 'FeatureCollection',
                    features: response.data.map(event => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(event.longitude), parseFloat(event.latitude)]
                        },
                        properties: {
                            ...event,
                            longitude: parseFloat(event.longitude),
                            latitude: parseFloat(event.latitude)
                        }
                    }))
                };
                console.log("Processed GeoJSON data: ", geojson)
                setEvents(geojson);
            } catch (error) {
                console.error("Failed to fetch events from backend:", error);
            }
        }
        fetchEvents();
    }, []);

    if (!events) return null 

    return (
        <Source id="events" type="geojson" data={events}>
            <Layer
                id="event-layer"
                type="circle"
                paint={{
                    'circle-radius': 10,
                    'circle-color': [
                        'match',
                        ['get', 'type'],
                        'Violence against civilians', '#FF4136',  // Bright Red
                        'Explosions/Remote violence', '#FF851B',  // Dark Orange
                        'Strategic developments', '#2ECC40',      // Lime Green
                        'Battles', '#B10DC9',                     // Purple
                        'Protests', '#FFDC00',                    // Gold
                        'Riots', '#0074D9',                       // Blue
                        '#85144b'         
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'black'
                }}
            />
        </Source>
    );
}

export default EventLayer;