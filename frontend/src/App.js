import React, { useState } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import EventLayer from './components/EventLayer';
import Header from './components/Header';

// Define React component returning map
function App() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 2
  });

  // ReactMapGL component renders map using viewport state, updating on user interaction
  return (
    <div style={{width: '100vw', height: '100vh' }}>
      <Header />
      <div className="map-container">
        <Map
          {...viewport}
          onMove={evt => setViewport(evt.viewport)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken="pk.eyJ1Ijoic2hlcm1hYmsiLCJhIjoiY2x4czdteHZqMHViMTJxcTN4amd4OXR1NSJ9.yU9UNt0qu-KdcSfRNOtikw"
        >
          <EventLayer />
        </Map>
      </div>
    </div>
  );
}

export default App;
