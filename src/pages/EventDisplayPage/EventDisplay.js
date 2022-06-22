/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  collection, query, where, getDocs,
} from 'firebase/firestore';
import db from '../../utils/firebaseInit';
import Map from '../../components/Map';

function EventDisplay() {
  const [events, setEvents] = useState([]);
  console.log(events);
  const [filteredShowInfo, setFilteredShowInfo] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState();
  const [isGeolocation, setIsGeolocation] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [latitude, setLatitude] = useState(25.09108);
  const [longitude, setLongitude] = useState(121.5598);
  const distance = 10;
  const eventData = [];
  let weatherDesc = [];

  async function getIdQuery(UID) {
    const artsEventsRef = collection(db, 'artsEvents');
    const q = query(artsEventsRef, where('UID', '==', `${UID}`));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      eventData.push(doc.data());
    });
    // console.log({ eventData });
    setEvents(eventData);
  }

  const getMaxMinLatLon = (lat, lng) => {
    const r = 6371.393; // 地球半徑公里
    let dlng = 2 * Math.asin(Math.sin(distance / (2 * r)) / Math.cos((lat * Math.PI) / 180));
    dlng = (dlng * 180) / Math.PI; // 角度轉為弧度
    let dlat = distance / r;
    dlat = (dlat * 180) / Math.PI;
    const minLat = lat - dlat;
    const maxLat = lat + dlat;
    const minLng = lng - dlng;
    const maxLng = lng + dlng;
    return {
      minLat, maxLat, minLng, maxLng,
    };
  };

  const success = (position) => {
    setIsGeolocation(true);
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    // latitude = 25.03867955570004;
    // longitude = 121.53237109734974;
    console.log(`Latitude is ${latitude}° Longitude is ${longitude}°`);
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_MAPS_API_KEY}`)
      .then((response) => response.json())
      .then((json) => {
        setLocation(json.plus_code.compound_code.split(' ')[1].slice(2, 5));
      });
  };

  const error = () => {
    console.log('Unable to retrieve your location');
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      console.log('Locating…');
      navigator.geolocation.getCurrentPosition(success, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateHandeler = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const locationHandeler = (e) => {
    setLocation(e.target.value);
    switch (e.target.value) {
      case '基隆市':
        setLatitude(25.13279);
        setLongitude(121.74457);
        break;
      case '新北市':
        setLatitude(25.01137);
        setLongitude(121.46173);
        break;
      case '宜蘭縣':
        setLatitude(24.75424);
        setLongitude(121.75285);
        break;
      case '新竹市':
        setLatitude(24.81524);
        setLongitude(120.96813);
        break;
      case '新竹縣':
        setLatitude(24.84209);
        setLongitude(121.01148);
        break;
      case '桃園市':
        setLatitude(25.02587);
        setLongitude(121.29689);
        break;
      case '苗栗縣':
        setLatitude(24.59214);
        setLongitude(120.82017);
        break;
      case '台中市':
        setLatitude(24.16116);
        setLongitude(120.73587);
        break;
      case '彰化縣':
        setLatitude(24.07949);
        setLongitude(120.54598);
        break;
      case '南投縣':
        setLatitude(23.92108);
        setLongitude(120.67898);
        break;
      case '嘉義市':
        setLatitude(23.48995);
        setLongitude(120.45141);
        break;
      case '嘉義縣':
        setLatitude(23.54765);
        setLongitude(120.43205);
        break;
      case '雲林縣':
        setLatitude(23.69586);
        setLongitude(120.52444);
        break;
      case '台南市':
        setLatitude(22.98854);
        setLongitude(120.19731);
        break;
      case '高雄市':
        setLatitude(22.62516);
        setLongitude(120.34277);
        break;
      case '屏東縣':
        setLatitude(22.66586);
        setLongitude(120.50559);
        break;
      case '台東縣':
        setLatitude(22.75670);
        setLongitude(121.15113);
        break;
      case '花蓮縣':
        setLatitude(23.99118);
        setLongitude(121.62969);
        break;
      default:
        setLatitude(25.03696);
        setLongitude(121.51898);
    }
  };

  const getRecentWeather = () => {
    switch (location) {
      case '台北市':
        fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=臺北市&elementName=WeatherDescription`)
          .then((response) => response.json())
          .then((json) => {
            weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
            console.log('一週內天氣', weatherDesc);
          });
        break;
      case '台中市':
        fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=臺中市&elementName=WeatherDescription`)
          .then((response) => response.json())
          .then((json) => {
            weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
            console.log('一週內天氣', weatherDesc);
          });
        break;
      case '台南市':
        fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=臺南市&elementName=WeatherDescription`)
          .then((response) => response.json())
          .then((json) => {
            weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
            console.log('一週內天氣', weatherDesc);
          });
        break;
      case '台東縣':
        fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=臺東縣&elementName=WeatherDescription`)
          .then((response) => response.json())
          .then((json) => {
            weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
            console.log('一週內天氣', weatherDesc);
          });
        break;
      default:
        fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${process.env.REACT_APP_WEATHER_API_KEY}&format=JSON&locationName=${location}&elementName=WeatherDescription`)
          .then((response) => response.json())
          .then((json) => {
            weatherDesc = json.records.locations[0].location[0].weatherElement[0].time;
            console.log('一週內天氣', weatherDesc);
          });
    }
  };

  const getRecentEvents = () => {
    setFilteredShowInfo([]);
    setStartDate(new Date());
    setEndDate(null);
    fetch(`https://cloud.culture.tw/frontsite/opendata/activityOpenDataJsonAction.do?method=doFindActivitiesNearBy&lat=${latitude}&lon=${longitude}&range=${distance}`)
      .then((response) => response.json())
      .then((json) => {
        const {
          minLat, maxLat, minLng, maxLng,
        } = getMaxMinLatLon(latitude, longitude);
        json.forEach((data) => {
          data.showInfo.forEach((info) => {
            if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
              && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
              const todayTimeStamp = new Date(new Date().toLocaleDateString('en-US'));
              const afterSevenDays = new Date(todayTimeStamp.setDate(todayTimeStamp.getDate() + 7));
              const infoStartTimeStamp = new Date(info.time.slice(0, 10));
              const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
              // if ((todayTimeStamp >= infoStartTimeStamp
              //   && todayTimeStamp <= infoEndTimeStamp)
              //   || (afterSevenDays >= infoStartTimeStamp
              //     && afterSevenDays <= infoEndTimeStamp)) {
              if ((infoStartTimeStamp >= todayTimeStamp
                && infoStartTimeStamp <= afterSevenDays)
                && (infoEndTimeStamp >= todayTimeStamp
                  && infoEndTimeStamp <= afterSevenDays)) {
                filteredShowInfo.push({
                  info,
                  title: data.title,
                  UID: data.UID,
                });
                setFilteredShowInfo(filteredShowInfo);
                getIdQuery(data.UID);
              }
            }
          });
        });
      });
    getRecentWeather();
  };

  const getFilteredEvents = () => {
    setFilteredShowInfo([]);
    fetch(`https://cloud.culture.tw/frontsite/opendata/activityOpenDataJsonAction.do?method=doFindActivitiesNearBy&lat=${latitude}&lon=${longitude}&range=${distance}`)
      .then((response) => response.json())
      .then((json) => {
        const {
          minLat, maxLat, minLng, maxLng,
        } = getMaxMinLatLon(latitude, longitude);
        json.forEach((data) => {
          data.showInfo.forEach((info) => {
            if ((Number(info.latitude) >= minLat && Number(info.latitude) <= maxLat)
              && (Number(info.longitude) >= minLng && Number(info.longitude) <= maxLng)) {
              const startDateTimeStamp = new Date(new Date(startDate).toLocaleDateString('en-US')).getTime();
              const endDateTimeStamp = new Date(new Date(endDate).toLocaleDateString('en-US')).getTime();
              const infoStartTimeStamp = new Date(info.time.slice(0, 10));
              const infoEndTimeStamp = new Date(info.endTime.slice(0, 10));
              // if ((startDateTimeStamp >= infoStartTimeStamp
              //   && startDateTimeStamp <= infoEndTimeStamp)
              //   || (endDateTimeStamp >= infoStartTimeStamp
              //     && endDateTimeStamp <= infoEndTimeStamp)) {
              if ((infoStartTimeStamp >= startDateTimeStamp
                && infoStartTimeStamp <= endDateTimeStamp)
                && (infoEndTimeStamp >= startDateTimeStamp
                  && infoEndTimeStamp <= endDateTimeStamp)) {
                filteredShowInfo.push({
                  info,
                  title: data.title,
                  UID: data.UID,
                });
                setFilteredShowInfo(filteredShowInfo);
                getIdQuery(data.UID);
              }
            }
          });
        });
      });
  };

  const searchHandeler = (e) => {
    setSearchText(e.target.value);
  };

  async function getKeywordQuery() {
    const searchWords = searchText.split('');
    const artsEventsRef = collection(db, 'artsEvents');
    const q = query(artsEventsRef, where('keywords', 'array-contains', searchWords[0]));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().title.includes(searchText)) {
        console.log(doc.data());
      }
    });
  }

  return (
    <>
      <br />
      <div>
        {isGeolocation ? <p>您的位置在...</p> : <p>自動定位中...</p>}
        <select value={location} onChange={(e) => locationHandeler(e)}>
          <option value="台北市">台北市</option>
          <option value="基隆市">基隆市</option>
          <option value="新北市">新北市</option>
          <option value="宜蘭縣">宜蘭縣</option>
          <option value="新竹市">新竹市</option>
          <option value="新竹縣">新竹縣</option>
          <option value="桃園市">桃園市</option>
          <option value="苗栗縣">苗栗縣</option>
          <option value="台中市">台中市</option>
          <option value="彰化縣">彰化縣</option>
          <option value="南投縣">南投縣</option>
          <option value="嘉義市">嘉義市</option>
          <option value="嘉義縣">嘉義縣</option>
          <option value="雲林縣">雲林縣</option>
          <option value="台南市">台南市</option>
          <option value="高雄市">高雄市</option>
          <option value="屏東縣">屏東縣</option>
          <option value="台東縣">台東縣</option>
          <option value="花蓮縣">花蓮縣</option>
        </select>
      </div>
      <br />
      <br />
      <button type="button" onClick={getRecentEvents}>一周內附近的展演資料</button>
      <Map
        latitude={latitude}
        longitude={longitude}
        filteredShowInfo={filteredShowInfo}
      />
      <br />
      <br />
      <hr />
      <br />
      <DatePicker
        selected={startDate}
        onChange={dateHandeler}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
      />
      <button type="button" onClick={getFilteredEvents}>自行設定地點、時間後的展演資料</button>
      <br />
      <br />
      <hr />
      <br />
      <input onChange={(e) => searchHandeler(e)} />
      <button type="button" onClick={getKeywordQuery}>keyword搜尋</button>
    </>
  );
}

export default EventDisplay;
