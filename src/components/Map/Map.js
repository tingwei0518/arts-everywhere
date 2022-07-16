/* eslint-disable no-console */
import { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import PropTypes from 'prop-types';

function Map({
  latitude, longitude, setLatitude, setLongitude, showInfo, setShowUid,
}) {
  const center = {
    lat: latitude,
    lng: longitude,
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const [map, setMap] = useState(null);

  // eslint-disable-next-line no-shadow
  const onLoad = useCallback((map) => {
    setMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = () => {
    setLatitude(map.getCenter().toJSON().lat);
    setLongitude(map.getCenter().toJSON().lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const onClickMarker = (uid) => {
    setShowUid(uid);
    console.log(uid);
  };

  return (
    isLoaded && (
      <GoogleMap
        id="map"
        center={center}
        zoom={11}
        options={{ mapId: '5c9ec1165b4386f6' }}
        mapContainerStyle={{ height: '55%', width: '60%' }}
        onLoad={onLoad}
        onDragEnd={onDragEnd}
        clickableIcons={false}
      >
        {
          showInfo.map((item, index) => (
            <Marker
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              position={{
                lat: Number(item.info.latitude),
                lng: Number(item.info.longitude),
              }}
              map={map}
              onClick={() => { onClickMarker(item.UID); }}
              aria-hidden="true"
            />
          ))
        }
      </GoogleMap>
    )
  );
}

Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  setLatitude: PropTypes.func.isRequired,
  setLongitude: PropTypes.func.isRequired,
  showInfo: PropTypes.arrayOf(PropTypes.shape({
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
  setShowUid: PropTypes.func.isRequired,
};

export default Map;
