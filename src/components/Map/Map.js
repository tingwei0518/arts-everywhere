import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';

function Map({
  latitude, longitude, filteredShowInfo,
}) {
  const center = {
    lat: latitude,
    lng: longitude,
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  // eslint-disable-next-line no-shadow
  const onLoad = useCallback((map) => {
    setMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickMarker = (uid) => {
    console.log(uid);
  };

  return (
    isLoaded ? (
      <GoogleMap
        center={center}
        zoom={15}
        options={{ mapId: '5c9ec1165b4386f6' }}
        mapContainerStyle={{ height: '500px', width: '500px' }}
        onLoad={onLoad}
      >
        {
          filteredShowInfo.map((item) => (
            <Marker
              position={{
                lat: Number(item.info.latitude),
                lng: Number(item.info.longitude),
              }}
              map={map}
              onClick={() => { clickMarker(item.UID); }}
              aria-hidden="true"
            />
          ))
        }
      </GoogleMap>
    ) : ''
  );
}

Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  filteredShowInfo: PropTypes.arrayOf(PropTypes.shape({
    UID: PropTypes.string,
    title: PropTypes.string,
    info: PropTypes.shape({
      endTime: PropTypes.string,
      latitude: PropTypes.string,
      location: PropTypes.string,
      locationName: PropTypes.string,
      longitude: PropTypes.string,
      onSales: PropTypes.string,
      price: PropTypes.string,
      time: PropTypes.string,
    }).isRequired,
  })).isRequired,
};

export default Map;
