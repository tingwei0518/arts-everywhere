import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import { db } from './firebaseInit';

const api = {
  keywordQuery(words) {
    const artsEventsRef = collection(db, 'artsEvents');
    const q = query(artsEventsRef, where('keywords', 'array-contains', words[0]));
    return getDocs(q);
  },
  idQuery(id) {
    const artsEventsRef = collection(db, 'artsEvents');
    const q = query(artsEventsRef, where('UID', '==', `${id}`));
    return getDocs(q);
  },
  getNearbyEvents(lat, lon, distance) {
    return fetch(`https://cloud.culture.tw/frontsite/opendata/activityOpenDataJsonAction.do?method=doFindActivitiesNearBy&lat=${lat}&lon=${lon}&range=${distance}`)
      .then((response) => response.json());
  },
  getReverseGeocoding(lat, lon) {
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.REACT_APP_MAPS_API_KEY}`)
      .then((response) => response.json());
  },
  getOneDayWeatherDesc(location, timeFrom, timeTo) {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=${location}&elementName=WeatherDescription&timeFrom=${timeFrom}&timeTo=${timeTo}`)
      .then((response) => response.json());
  },
  getWeatherDesc(location) {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=${location}&elementName=WeatherDescription`)
      .then((response) => response.json());
  },
};

export default api;
