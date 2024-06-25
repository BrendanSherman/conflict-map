import React, { useState, useEffect, useRef } from 'react';
import Map, { NavigationControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import EventLayer from './components/EventLayer';
import EventPopup from './components/EventPopup'
import Header from './components/Header';
import './App.css';


// Define React component returning map
function App() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2.5,
    pitch: 0, 
    bearing: 0
  });
  const [currEvent, setCurrEvent] = useState(null);
  const mapRef = useRef();

  const handleClick = (event) => {
    const { features } = event;
    const clickedEvent = features && features[0];
    console.log("Selected Event:", clickedEvent);
    
    if(clickedEvent) {
      setCurrEvent(clickedEvent.properties);
    } else {
      setCurrEvent(null);
    }
  };

  // ReactMapGL component renders map using viewport state, updating on user interaction
  return (
    <div style={{width: '100vw', height: '100vh', position: 'relative' }}>
      <Header />
      <div className="map-container edited-map-container">
        <Map
          {...viewport}
          ref={mapRef}
          onMove={evt => setViewport(evt.viewport)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken="pk.eyJ1Ijoic2hlcm1hYmsiLCJhIjoiY2x4czdteHZqMHViMTJxcTN4amd4OXR1NSJ9.yU9UNt0qu-KdcSfRNOtikw"
          onClick={handleClick} // Refresh 'event info' popup on map click
          interactiveLayerIds={['event-layer']}
          projection='globe'
        >
          <EventLayer /> 
          {currEvent && (
            <EventPopup
              event={currEvent}
              onClose={() => setCurrEvent(null)}
            />
          )}
          <NavigationControl position="top-right" />
        </Map>
      </div>
    </div>
  );
}

export default App;
